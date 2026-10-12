import { categories } from "../data/content.js";

export const PLACEHOLDER_IMAGE = "/images/products/phone-accessories.jpg";
const identifier = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const fields = new Set(["id", "slug", "name", "brand", "category", "price", "inStock", "isSample", "featured", "deal", "image", "images", "description", "specifications", "oldPrice", "variants", "colors", "condition", "rating", "reviewCount", "badge", "released"]);
const plainObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value, max) => typeof value === "string" && value.trim().length > 0 && value.length <= max;

export function validImagePath(value) {
  if (typeof value !== "string" || value.length > 2048 || /[\\\s?#]/.test(value)) return false;
  if (value.startsWith("/images/")) return /^\/images\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|avif|svg)$/i.test(value) && !value.includes("//");
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}

export function validateCatalog(data) {
  const errors = [];
  if (!Array.isArray(data) || !data.length) return ["Catalogue must be a non-empty JSON array."];
  if (data.length > 10000) return ["Catalogue exceeds the 10,000-product limit."];
  const ids = new Set(), slugs = new Set();
  data.forEach((product, index) => {
    const prefix = `Product ${index + 1}`;
    const error = message => errors.push(`${prefix}: ${message}`);
    if (!plainObject(product)) { error("must be an object."); return; }
    for (const key of Object.keys(product)) if (!fields.has(key)) error(`unknown field '${key}'.`);
    for (const [key, seen] of [["id", ids], ["slug", slugs]]) {
      if (!text(product[key], 100) || !identifier.test(product[key])) error(`${key} must be a lowercase hyphenated identifier.`);
      else if (seen.has(product[key])) error(`duplicate ${key} '${product[key]}'.`);
      else seen.add(product[key]);
    }
    for (const key of ["name", "brand"]) if (!text(product[key], 160)) error(`${key} is required (maximum 160 characters).`);
    if (!categories.some(category => category.slug === product.category)) error("category is not a supported category slug.");
    if (!Number.isSafeInteger(product.price) || product.price <= 0 || product.price > 1000000000) error("price must be a positive whole-naira amount up to 1,000,000,000.");
    for (const key of ["inStock", "isSample"]) if (typeof product[key] !== "boolean") error(`${key} must explicitly be true or false.`);
    for (const key of ["featured", "deal"]) if (product[key] !== undefined && typeof product[key] !== "boolean") error(`${key} must be true or false.`);
    if (!validImagePath(product.image)) error("image must be a local /images/ path or an HTTPS URL.");
    if (product.images !== undefined && (!Array.isArray(product.images) || product.images.length > 8 || product.images.some(image => !validImagePath(image)))) error("images must contain at most eight valid image paths.");
    if (product.description !== undefined && !text(product.description, 3000)) error("description must be non-empty text up to 3,000 characters.");
    if (product.oldPrice !== undefined && (!Number.isSafeInteger(product.oldPrice) || product.oldPrice <= product.price || product.oldPrice > 1000000000)) error("oldPrice must exceed price and be a whole-naira amount.");
    if (product.condition !== undefined && !["New", "UK Used"].includes(product.condition)) error("condition must be New or UK Used.");
    if (product.badge !== undefined && !["NEW", "HOT", "SALE"].includes(product.badge)) error("unsupported badge.");
    if (product.rating !== undefined && (!Number.isFinite(product.rating) || product.rating < 0 || product.rating > 5)) error("rating must be between 0 and 5.");
    if (product.reviewCount !== undefined && (!Number.isSafeInteger(product.reviewCount) || product.reviewCount < 0)) error("reviewCount must be a non-negative integer.");
    if (product.released !== undefined && (!/^\d{4}-\d{2}-\d{2}$/.test(product.released) || !Number.isFinite(Date.parse(product.released)))) error("released must be an ISO date.");
    if (product.colors !== undefined && (!Array.isArray(product.colors) || !product.colors.length || product.colors.length > 20 || product.colors.some(c => !text(c, 60)) || new Set(product.colors).size !== product.colors.length)) error("colors must be unique colour names.");
    if (product.variants !== undefined) {
      if (!Array.isArray(product.variants) || !product.variants.length || product.variants.length > 30) error("variants must contain 1–30 options.");
      else {
        const seen = new Set();
        for (const v of product.variants) {
          if (!plainObject(v) || !text(v.id, 100) || !identifier.test(v.id) || seen.has(v.id) || !text(v.storage, 40) || !text(v.ram, 40) || !Number.isSafeInteger(v.price) || v.price <= 0 || v.price > 1000000000) error("variants require unique IDs, storage, RAM and valid prices.");
          else seen.add(v.id);
        }
        if (product.variants[0]?.price !== product.price) error("the first variant price must match the product price.");
      }
    }
    if (product.specifications !== undefined) {
      if (!plainObject(product.specifications) || Object.keys(product.specifications).length > 30) error("specifications must be an object with at most 30 entries.");
      else for (const [key, value] of Object.entries(product.specifications)) {
        if (!text(key, 80) || ["__proto__", "prototype", "constructor"].includes(key) || !text(value, 300)) error("specifications require labels up to 80 characters and text values up to 300 characters.");
      }
    }
  });
  return errors;
}

export function normalizeCatalog(data) {
  const errors = validateCatalog(data);
  if (errors.length) throw new Error(`Invalid catalogue:\n${errors.join("\n")}`);
  return data.map(product => ({
    ...product,
    featured: product.featured ?? false,
    deal: product.deal ?? false,
    images: [...new Set([product.image, ...(product.images || [])])],
    description: product.description || "Confirm the exact model, condition and included accessories with the store before ordering.",
    specifications: product.specifications || {},
    badge: product.badge || (product.isSample ? "Sample" : undefined),
    variants: product.variants || [{ id: "standard", storage: product.specifications?.Storage || "Standard", ram: product.specifications?.RAM || "Not specified", price: product.price }],
    colors: product.colors || ["As pictured"],
    condition: product.condition || "New",
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
  }));
}
