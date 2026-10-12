# Inventory guide

The active inventory is `src/data/catalog.json`, a JSON array of product objects. Start from `docs/catalog.example.json` or export the current catalogue. The example is intentionally marked as a sample.

## Fields

| Field | Requirement |
| --- | --- |
| `id` | Required stable lowercase hyphenated identifier; unique across the inventory. Saved shopping lists use this value. Do not reuse an ID for a different product. |
| `slug` | Required unique lowercase hyphenated URL identifier. May differ from `id`. |
| `name`, `brand` | Required non-empty strings, up to 160 characters each. |
| `category` | `smartphones`, `earbuds`, `smartwatches`, `accessories` or `tablets`. |
| `price` | Required positive whole-naira integer, maximum 1,000,000,000. |
| `inStock` | Required boolean, `true` or `false`. |
| `isSample` | Required boolean. Keep `true` until the product information is verified. |
| `image` | Required primary image: a local `/images/...` file or an HTTPS URL. |
| `images` | Optional array of up to eight additional image paths. Duplicates are removed when displayed. |
| `description` | Optional non-empty text, up to 3,000 characters; required for release. |
| `specifications` | Optional object of up to 30 text labels/values; required for release. Use consistent labels, such as `Storage`, for comparison. |
| `featured`, `deal` | Optional booleans controlling homepage and featured-offer collections. These do not invent a discount price. |

Use variants for storage/RAM configurations of one model. Each variant needs a stable id, storage, ram and price; the first price must equal the top-level price. Use separate product IDs for different conditions or models. Colours are a unique list of strings shared by all variants. Cart lines distinguish variant and colour. Copy local images into `public/images/` before importing. Local paths must use supported image extensions and cannot traverse directories. Do not put customer information, credentials or private data into the inventory: it is public website content.

## Validate and preview

```sh
npm run catalog:validate -- path/to/inventory.json
npm run catalog:import -- path/to/inventory.json
```

Validation rejects missing or duplicate identifiers, invalid types, unsupported categories, unsafe image paths and unknown fields. Local image existence is checked; remote images are not downloaded or verified. The import command defaults to preview: it lists added, updated and removed IDs without changing a file. An import replaces the entire catalogue, rather than merging selected rows.

## Apply and restore

```sh
npm run catalog:import -- path/to/inventory.json --apply
```

The old catalogue is copied to `.catalog-backups/catalog-<unique-suffix>.json` before the replacement is written. Validation failures leave the catalogue untouched. To restore, preview and import the desired backup using the same commands. Backup contents are not included in the browser bundle.

After importing, run the normal build and review changed product pages, prices, images and comparison values. Removed products are ignored in previously saved shopping lists. Existing IDs use the newly imported price and stock values.

## Release checks

`npm run check:launch` lists missing configuration and rejects sample inventory, placeholder images, missing descriptions/specifications, missing contact details and unapproved policies. Configure `src/config/site.js` and `src/data/support.js` and review all storefront copy before marking content approved. `npm run build:release` requires this check to pass. It does not publish or deploy the website.

## Additional product fields

Optional fields: variants (1-30 configuration objects), colors (1-20 unique names), condition (New or UK Used), oldPrice (whole-naira amount greater than price), rating (0-5), reviewCount (non-negative integer), badge (NEW/HOT/SALE), and released (ISO date). Keep rating and reviewCount at zero until genuine reviews are available. oldPrice displays a discount; it is a demonstration when isSample is true.
