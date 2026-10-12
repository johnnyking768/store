// Update these prices to match your current stock. All initial prices are approximate samples.
import catalog from './catalog.json';
import { normalizeCatalog } from '../lib/catalog.js';

export const products = normalizeCatalog(catalog);
export const hasSampleProducts = products.some(product => product.isSample);
export const catalogNotice = hasSampleProducts
  ? 'Sample catalogue — prices and availability are for demonstration only.'
  : 'Confirm availability, delivery fees and final pricing with the store before ordering.';
export const findProduct = id => products.find(product => product.id === id);
export const findProductBySlug = slug => products.find(product => product.slug === slug);
export const matchesQuery = (product, query) => query.trim().toLowerCase().split(/\s+/).every(term =>
  `${product.name} ${product.brand} ${product.category} ${Object.values(product.specifications).join(' ')}`.toLowerCase().includes(term)
);
