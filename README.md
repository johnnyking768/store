# MobiStore

A React 18 storefront based on the supplied MobiStore design. Ordering uses WhatsApp; there is no payment checkout or backend.

## Run and verify

```sh
npm install
npm run dev
npm run build
npm test
npm run test:browser
```

The browser suites expect Vite at http://127.0.0.1:5173. Set CHROMIUM_PATH to your Chrome/Chromium executable if it is not in the existing Windows Playwright installation. TEST_BASE_URL is supported by the main browser suite. Screenshots are saved under artifacts/.

## Implemented

- Responsive navigation, mobile menu, category cards, six featured products, three promotional banners, dark footer and floating WhatsApp contact.
- Three-slide carousel with autoplay, manual controls, pause/play, hover pause, tab-visibility pause and reduced-motion support.
- 32 sample products across Apple, Samsung, Tecno, Infinix, Itel, Xiaomi, Oppo, Google, JBL and Anker, including phones, earbuds, watches, accessories and tablets.
- Catalogue search, category/brand/budget/storage/RAM/condition/stock filters, sorting, load more, brand collection links, deals and wishlist.
- Product galleries with zoom, image fallback, storage/RAM and colour options, live prices, specifications, review summaries, related and recently viewed products.
- Direct WhatsApp order links on cards, product pages and hero. The selected configuration, price and product link appear in the message.
- Cart lines retain separate storage/colour choices, quantities and current catalogue prices. Combined orders include the total and delivery location. Unavailable items block ordering until removed.
- Local cart, wishlist, comparison and recently viewed storage; toast notifications; up to three comparison products and a differences-only view.
- Stock-notification enquiries, contact/trade-in forms with message previews, FAQ, about, delivery/returns, warranty, terms and privacy pages.
- Per-page SEO descriptions and Open Graph tags, canonical links and Product JSON-LD. Verified live products include NGN offers; sample products intentionally omit commercial offers and remain noindex.
- Build-generated robots.txt and sitemap.xml, lazy routes and images, accessible dialogs, Vercel SPA routing and catalogue validation/import backups.

## Store configuration

Edit **src/config/site.js** for the name, tagline, logo text, currency, WhatsApp number, phone, email, address, hours, social links, delivery information and payment badges.

- WHATSAPP_NUMBER: international digits only, e.g. 2348012345678. It is deliberately blank until you supply your number. Buttons show a prepared message while unset; no customer is sent to the example number.
- publicUrl: your actual HTTPS domain, without a path.
- mapEmbedUrl: optional Google Maps embed URL for your store. Leaving it empty omits the map.
- saleEndsAt: optional ISO timestamp including timezone, e.g. 2026-12-01T23:59:59+01:00. No countdown is fabricated when unset; expired campaigns display an ended state.
- contentApproved: set true after reviewing your storefront copy and business details.

Edit src/data/content.js for navigation and marketing copy, and src/data/support.js for FAQs and approved policies. Delivery, warranty, terms and privacy policies accept sections as [heading, text] pairs plus approved: true. Store promises and policy durations should match your actual business.

## Products and images

**Update these prices to match your current stock.** All 32 initial products use approximate Nigerian sample prices, demonstration stock/discounts and local illustrations. These are not supplier quotations or verified inventory. Ratings start at zero because no customer reviews were supplied. Model configurations and regional specifications need your stock review.

Edit **src/data/catalog.json**. src/data/products.js is the data entry module that validates and exposes these records. See [the inventory guide](docs/catalog-import.md) for the schema and imports. The previous nine-entry sample catalogue is backed up in .catalog-backups/before-original-brief-completion.json.

Place product photos in public/images/phones/ and set image and images to their /images/phones/... paths. Built-in SVG illustrations are deliberate placeholders; replace them for launch. The original reference can only be matched photographically after real product images are supplied.

Each variant has a stable id, storage, ram and price. The first variant's price must equal the product price. Cart prices always come from current inventory, never saved browser prices. Removed variants or colours are removed from saved carts. Keep stable product IDs when editing; product URLs use slug.

## Privacy and integrations

The app saves only its own cart, wishlist, comparison, recent views and newsletter interest in browser localStorage. The Privacy page clears these entries while preserving unrelated storage. Forms and delivery-location drafts remain in memory. Newsletter interest is saved locally, not emailed. WhatsApp links pass a draft to WhatsApp; the customer chooses whether to send it. Google Fonts supplies the font; an optional map connects to its configured provider.

## Release and Vercel

```sh
npm run catalog:validate
npm run check:launch
npm run build:release
```

Launch checks currently fail intentionally: contact details, domain, approved policies, real inventory and photos are still required. Preview builds work normally. Until release checks pass, generated robots.txt disallows crawling and sitemap.xml contains no publishable URLs. A configured release generates product and catalogue URLs automatically.

In Vercel, import the project, select Vite, use npm run build:release and set the output directory to dist. vercel.json enables route refreshes. Deployment has not been performed.

## Validation and project history

npm test covers catalogue validation/import backups and option-aware order messages. npm run test:browser runs the main shopping suite, support suite and gallery fixture suite. They cover the actual catalogue, isolated configured WhatsApp links, option persistence, unavailable products, filters, comparison, form validation, storage clearing, galleries, SEO and 360/768/1024/1440px layouts. The old phase-numbered browser scripts describe the retired nine-product catalogue; use the current scripts instead.

See [the work record](docs/work-status.md) for the recovered original task and remaining configuration. The existing Tailwind 3 development dependency tree has npm audit findings; no forced Tailwind major-version migration was bundled into this storefront completion.

