import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { validateCatalog, normalizeCatalog, validImagePath } from "../src/lib/catalog.js";
import { launchIssues } from "../src/lib/launch.js";
import { applyImport, prepareImport, readCatalog, summarizeImport } from "./catalog.mjs";

const product = {
  id: "inventory-001", slug: "example-phone", name: "Test phone", brand: "Test brand",
  category: "smartphones", price: 100000, inStock: true, isSample: false,
  image: "/images/test.webp", images: ["/images/test.webp"],
  description: "A fixture used only for automated checks.", specifications: { Storage: "Test specification" },
};

test("valid inventory retains independent IDs and slugs and deduplicates gallery images", () => {
  assert.deepEqual(validateCatalog([product]), []);
  const [normalized] = normalizeCatalog([product]);
  assert.equal(normalized.id, "inventory-001");
  assert.equal(normalized.slug, "example-phone");
  assert.deepEqual(normalized.images, ["/images/test.webp"]);
  assert.equal(normalized.badge, undefined);
});

test("rejects malformed products, duplicate routes, unsafe images and ambiguous prices", () => {
  for (const input of [null, {}, [], [null], [product, product], [{ ...product, price: -1 }], [{ ...product, price: 1.5 }], [{ ...product, price: "100" }], [{ ...product, isSample: undefined }], [{ ...product, inStock: "yes" }], [{ ...product, slug: "../outside" }], [{ ...product, category: "unknown" }], [{ ...product, image: "/images/../../secret.png" }], [{ ...product, images: ["javascript:alert(1)"] }], [{ ...product, specifications: { Memory: 128 } }], [{ ...product, unexpected: true }]]) {
    assert(validateCatalog(input).length > 0, JSON.stringify(input));
    assert.throws(() => normalizeCatalog(input));
  }
  for (const image of ["/images/a.webp", "https://images.example.test/phone.jpg"]) assert(validImagePath(image));
  for (const image of ["//evil.test/a.png", "http://evil.test/a.png", "https://user:pass@evil.test/a.png", "/images//a.png", "/images/%2e%2e/a.png", "/images/../a.png", "data:image/svg+xml,test"]) assert.equal(validImagePath(image), false);
});

test("launch checks identify incomplete setup and accept a fully populated fixture", () => {
  const site = { WHATSAPP_NUMBER: "2348000000000", email: "store@example.test", address: "Test address", openingHours: "Test hours", publicUrl: "https://store.example.test", contentApproved: true };
  const policies = Object.fromEntries(["delivery", "warranty", "terms", "privacy"].map(key => [key, { approved: true, sections: [["Test heading", "Test policy copy"]] }]));
  assert.deepEqual(launchIssues({ site, catalog: [product], policies }), []);
  const issues = launchIssues({ site: { ...site, contentApproved: false, WHATSAPP_NUMBER: "", publicUrl: "http://localhost:5173" }, catalog: [{ ...product, isSample: true, image: "/images/phones/placeholder.svg", specifications: {} }], policies: {} });
  for (const word of ["WhatsApp", "HTTPS", "contentApproved", "privacy", "sample", "photos", "specifications"]) assert(issues.some(issue => issue.includes(word)), word);
});

test("import previews do not mutate, applied imports back up, invalid imports leave data untouched", async () => {
  const tempRoot = path.resolve(os.tmpdir());
  const directory = await fs.mkdtemp(path.join(tempRoot, "mobistore-catalog-"));
  try {
    const destination = path.join(directory, "catalog.json");
    const input = path.join(directory, "incoming.json");
    const publicDirectory = path.join(directory, "public");
    const options = { destination, publicDirectory, backups: path.join(directory, "backups") };
    await fs.mkdir(path.join(publicDirectory, "images"), { recursive: true });
    await fs.writeFile(path.join(publicDirectory, "images/test.webp"), "fixture");
    const original = JSON.stringify([product]);
    await fs.writeFile(destination, original);
    await fs.writeFile(input, JSON.stringify([{ ...product, price: 120000 }]));
    const preview = await prepareImport(input, options);
    assert.deepEqual(preview.summary.updated, [product.id]);
    assert.equal(await fs.readFile(destination, "utf8"), original);
    const applied = await applyImport(input, options);
    assert.equal(await fs.readFile(applied.backup, "utf8"), original);
    assert.equal((await readCatalog(destination))[0].price, 120000);
    const imported = await fs.readFile(destination, "utf8");
    await fs.writeFile(input, JSON.stringify([{ ...product, image: "/images/missing.png" }]));
    await assert.rejects(() => applyImport(input, options), /Missing local image/);
    await fs.writeFile(input, JSON.stringify([{ ...product, price: -10 }]));
    await assert.rejects(() => applyImport(input, options), /price/);
    assert.equal(await fs.readFile(destination, "utf8"), imported);
    assert.equal((await fs.readdir(options.backups)).length, 1);
    assert.deepEqual(summarizeImport([product], [{ ...product, id: "replacement" }]), { added: ["replacement"], updated: [], removed: [product.id] });
  } finally {
    // Only remove the unique test directory directly beneath the expected temp root.
    if (path.dirname(path.resolve(directory)) !== tempRoot || !path.basename(directory).startsWith("mobistore-catalog-")) throw new Error("Unexpected cleanup path");
    await fs.rm(directory, { recursive: true, force: true });
  }
});
