import { validateCatalog, PLACEHOLDER_IMAGE } from "./catalog.js";

export function launchIssues({ site, catalog, policies }) {
  const issues = validateCatalog(catalog);
  if (issues.length) return issues;
  if (!/^[1-9]\d{7,14}$/.test(site.WHATSAPP_NUMBER || "")) issues.push("Configure the verified WhatsApp number in src/config/site.js.");
  if (!site.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) issues.push("Supply the store contact email.");
  if (!site.address?.trim()) issues.push("Supply the store address.");
  if (!site.openingHours?.trim()) issues.push("Supply the store opening/support hours.");
  try {
    const url = new URL(site.publicUrl);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash || ["localhost", "127.0.0.1", "example.com"].includes(url.hostname)) throw new Error();
  } catch { issues.push("Set publicUrl to the store's HTTPS origin, without a path or query."); }
  if (site.contentApproved !== true) issues.push("Review store copy, trade-in availability and contact details, then mark contentApproved true.");
  for (const key of ["delivery", "warranty", "terms", "privacy"]) {
    const policy = policies[key];
    if (policy?.approved !== true || !Array.isArray(policy.sections) || !policy.sections.length || policy.sections.some(section => !Array.isArray(section) || section.length !== 2 || section.some(value => typeof value !== "string" || !value.trim()))) issues.push(`Supply approved ${key} policy sections in src/data/support.js.`);
  }
  for (const product of catalog) {
    if (product.isSample) issues.push(`${product.id}: replace sample inventory with a verified product.`);
    if ([product.image, ...(product.images || [])].some(image => [PLACEHOLDER_IMAGE, ...["smartphones","earbuds","smartwatches","accessories","tablets"].map(name => "/images/phones/" + name + ".svg")].includes(image))) issues.push(`${product.id}: replace the placeholder with product photos.`);
    if (!product.description?.trim()) issues.push(`${product.id}: provide a product description.`);
    if (!product.specifications || !Object.keys(product.specifications).length) issues.push(`${product.id}: provide verified specifications.`);
  }
  return issues;
}
