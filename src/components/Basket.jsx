import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { findProduct, catalogNotice } from '../data/products';
import { formatNaira } from '../lib/format';
import { whatsappLink } from '../lib/whatsapp';
import { selection, lineKey, cartMessage } from '../lib/orders';
import { Button } from './ui';
import ProductImage from './ProductImage';
export default function Basket({ kind, onClose }) {
  const { cart, wishlist, addToCart, updateQuantity, toggleWishlist } = useStore();
  const [location, setLocation] = useState('');
  const items = kind === 'cart' ? cart : wishlist.map(id => ({ id, quantity: 1 }));
  const unavailable = items.some(item => !findProduct(item.id).inStock);
  const subtotal = items.reduce((sum, item) => sum + selection(findProduct(item.id), item.variantId, item.color).variant.price * item.quantity, 0);
  const message = cartMessage(items, findProduct, location);
  const checkout = whatsappLink(message);
  if (!items.length) return <div className="empty-state"><h3>{kind === 'cart' ? 'Your next upgrade starts here.' : 'Keep your favourites close.'}</h3><p>Explore the collection to add your favourites.</p><Button to="/shop" onClick={onClose}>Explore the shop</Button></div>;
  return <><p className="catalog-notice">{catalogNotice}</p><div className="basket-items">{items.map(item => {
    const p = findProduct(item.id), chosen = selection(p, item.variantId, item.color), key = lineKey(item);
    return <article className="basket-item" key={key}><ProductImage src={p.image} alt="" /><div>
      <Link to={`/product/${p.slug}`} onClick={onClose}>{p.name}</Link>
      <p>{chosen.variant.storage} · {chosen.color} · {p.condition}</p><p>{formatNaira(chosen.variant.price)}</p>
      {!p.inStock && <p>Out of stock — remove this item to order.</p>}
      {kind === 'cart' ? <div className="quantity-control"><button aria-label={`Decrease ${p.name} quantity`} onClick={() => updateQuantity(key, item.quantity - 1)}>−</button><span aria-label="Quantity">{item.quantity}</span><button disabled={item.quantity >= 99 || !p.inStock} aria-label={`Increase ${p.name} quantity`} onClick={() => updateQuantity(key, item.quantity + 1)}>+</button><button aria-label={`Remove ${p.name} from cart`} onClick={() => updateQuantity(key, 0)}>Remove</button></div>
      : <div className="wishlist-actions"><button disabled={!p.inStock} onClick={() => addToCart(p)}>{p.inStock ? 'Add to cart' : 'Out of stock'}</button><button onClick={() => toggleWishlist(p.id)}>Remove</button></div>}
    </div></article>;
  })}</div>{kind === 'cart' && <div className="basket-summary"><div><strong>Subtotal</strong><strong>{formatNaira(subtotal)}</strong></div>
    <label className="field-label">Delivery location<input className="delivery-input" value={location} maxLength={200} onChange={e => setLocation(e.target.value)} placeholder="e.g. Ikorodu, Lagos" /></label>
    <p className="muted">Confirm final prices and delivery fees with the store.</p>
    {checkout && !unavailable ? <a className="button button-primary" href={checkout} target="_blank" rel="noreferrer">Order All on WhatsApp</a> : <Button disabled>{unavailable ? 'Remove unavailable items to order' : 'WhatsApp number not configured'}</Button>}
    <details><summary>Review enquiry text</summary><pre>{message}</pre></details>
  </div>}</>;
}

