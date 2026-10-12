import { site } from "../src/config/site.js";
import { policies } from "../src/data/support.js";
import { launchIssues } from "../src/lib/launch.js";
import { readCatalog, checkImages } from "./catalog.mjs";

try {
  const catalog = await readCatalog(new URL("../src/data/catalog.json", import.meta.url));
  const issues = launchIssues({ site, catalog, policies });
  // Validate structure before traversing image fields.
  const { validateCatalog } = await import("../src/lib/catalog.js");
  if (!validateCatalog(catalog).length) issues.push(...await checkImages(catalog));
  if (issues.length) {
    console.error(`Launch check: ${issues.length} items need attention:\n${issues.map(issue => `- ${issue}`).join("\n")}`);
    process.exitCode = 1;
  } else console.log("PASS: release configuration and local image checks. Verify current inventory and external services before deployment. No deployment was performed.");
} catch (error) { console.error(error.message); process.exitCode = 1; }
