import { formatNaira } from './format.js';
import { site } from '../config/site.js';

export function selection(product, variantId, color) {
  const variant = product.variants.find(v => v.id === variantId) || product.variants[0];
  return { variant, color: product.colors.includes(color) ? color : product.colors[0] };
}
export const lineKey = item => [item.id, item.variantId, item.color].join('|');
export function productUrl(product, origin = '') {
  return `${site.publicUrl || origin}/product/${product.slug}`;
}
export function productMessage(product, variantId, color, origin = '') {
  const chosen = selection(product, variantId, color);
  return `Hi, I want to get this ${product.name} (${chosen.variant.storage}, ${chosen.color}, ${product.condition}). The price on your website is ${formatNaira(chosen.variant.price)}. Is it available?\n${productUrl(product, origin)}${product.isSample ? '\nI understand this is an approximate sample price; please confirm the current price and stock.' : ''}`;
}
export function cartMessage(items, findProduct, location) {
  let total = 0;
  const lines = items.map((item, index) => {
    const p = findProduct(item.id);
    const { variant, color } = selection(p, item.variantId, item.color);
    total += variant.price * item.quantity;
    return `${index + 1}. ${p.name} (${variant.storage}, ${color}, ${p.condition}) x${item.quantity} - ${formatNaira(variant.price * item.quantity)}`;
  });
  return ['Hi, I want to order the following:', ...lines, `Total: ${formatNaira(total)}`, `Delivery location: ${location.trim() || 'To be confirmed'}`, 'Please confirm availability, final prices and delivery fees.'].join('\n');
}
