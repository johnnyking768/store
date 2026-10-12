import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateCatalog } from "../src/lib/catalog.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const defaultDestination = path.join(root, "src/data/catalog.json");
export const readCatalog = async filename => JSON.parse((await fs.readFile(filename, "utf8")).replace(/^\uFEFF/, ""));

export async function checkImages(catalog, publicDirectory = path.join(root, "public")) {
  const issues = [];
  for (const image of new Set(catalog.flatMap(product => [product.image, ...(product.images || [])]))) {
    if (!image.startsWith("/images/")) continue;
    try {
      if (!(await fs.stat(path.join(publicDirectory, image.slice(1)))).isFile()) issues.push(`${image} is not a file.`);
    } catch { issues.push(`Missing local image: ${image}`); }
  }
  return issues;
}

export function summarizeImport(previous, next) {
  const before = new Map(previous.map(product => [product.id, product]));
  const after = new Map(next.map(product => [product.id, product]));
  return {
    added: next.filter(product => !before.has(product.id)).map(product => product.id),
    updated: next.filter(product => before.has(product.id) && JSON.stringify(before.get(product.id)) !== JSON.stringify(product)).map(product => product.id),
    removed: previous.filter(product => !after.has(product.id)).map(product => product.id),
  };
}

export async function prepareImport(input, { destination = defaultDestination, publicDirectory = path.join(root, "public") } = {}) {
  const next = await readCatalog(input);
  const errors = validateCatalog(next);
  if (errors.length) throw new Error(errors.join("\n"));
  const missingImages = await checkImages(next, publicDirectory);
  if (missingImages.length) throw new Error(missingImages.join("\n"));
  const previous = await readCatalog(destination);
  return { next, summary: summarizeImport(previous, next) };
}

export async function applyImport(input, options = {}) {
  const destination = options.destination || defaultDestination;
  const backups = options.backups || path.join(root, ".catalog-backups");
  const prepared = await prepareImport(input, options);
  await fs.mkdir(backups, { recursive: true });
  const suffix = `${Date.now()}-${process.pid}-${Math.random().toString(16).slice(2)}`;
  const backup = path.join(backups, `catalog-${suffix}.json`);
  await fs.copyFile(destination, backup, fs.constants.COPYFILE_EXCL);
  const temporary = `${destination}.${suffix}.tmp`;
  try {
    await fs.writeFile(temporary, JSON.stringify(prepared.next, null, 2) + "\n", { encoding: "utf8", flag: "wx" });
    await fs.rename(temporary, destination);
  } finally { await fs.rm(temporary, { force: true }); }
  return { ...prepared, backup };
}

async function main() {
  const [command = "validate", input = defaultDestination, ...flags] = process.argv.slice(2);
  if (!["validate", "import"].includes(command) || flags.some(flag => flag !== "--apply") || (command === "validate" && flags.length)) {
    throw new Error("Usage: node scripts/catalog.mjs validate [catalog.json] | import <catalog.json> [--apply]");
  }
  if (command === "validate") {
    const catalog = await readCatalog(input);
    const errors = validateCatalog(catalog);
    if (!errors.length) errors.push(...await checkImages(catalog));
    if (errors.length) throw new Error(errors.join("\n"));
    console.log(`PASS: ${catalog.length} valid products. Local image files exist; external URLs are not fetched.`);
    return;
  }
  const result = flags.includes("--apply") ? await applyImport(input) : await prepareImport(input);
  console.log(JSON.stringify(result.summary, null, 2));
  console.log(result.backup ? `Imported ${result.next.length} products. Previous catalogue backed up to ${result.backup}` : "Preview only. No files changed. Add --apply to replace the catalogue after reviewing this summary.");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
