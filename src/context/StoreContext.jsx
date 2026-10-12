import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { findProduct } from '../data/products';
import { selection, lineKey } from '../lib/orders';
const StoreContext = createContext(null);
const cleanIds = ids => [...new Set(ids.filter(id => findProduct(id)))];
function cleanCart(items) {
  const result = [];
  for (const item of items) {
    const p = item && findProduct(item.id);
    if (!p || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) continue;
    if (item.variantId && !p.variants.some(v => v.id === item.variantId)) continue;
    if (item.color && !p.colors.includes(item.color)) continue;
    const chosen = selection(p, item.variantId, item.color);
    const line = { id: p.id, variantId: chosen.variant.id, color: chosen.color, quantity: item.quantity };
    if (!result.some(x => lineKey(x) === lineKey(line))) result.push(line);
  }
  return result;
}
export function StoreProvider({ children }) {
  const [savedCart, setCart] = useLocalStorage('mobistore.cart', []);
  const [savedWishlist, setWishlist] = useLocalStorage('mobistore.wishlist', []);
  const [savedCompare, setCompare] = useLocalStorage('mobistore.compare', []);
  const [savedRecent, setRecent] = useLocalStorage('mobistore.recent', []);
  const [panel, setPanel] = useState(null);
  const [toast, setToast] = useState('');
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); } }, [toast]);
  const cart = cleanCart(savedCart), wishlist = cleanIds(savedWishlist), compare = cleanIds(savedCompare).slice(0, 3), recent = cleanIds(savedRecent).slice(0, 8);
  const recordView = useCallback(id => setRecent(current => [id, ...cleanIds(current).filter(x => x !== id)].slice(0, 8)), [setRecent]);
  function addToCart(product, options = {}) {
    const p = findProduct(product.id);
    if (!p?.inStock) return;
    const chosen = selection(p, options.variantId, options.color);
    const line = { id: p.id, variantId: chosen.variant.id, color: chosen.color, quantity: 1 };
    setCart(current => {
      const items = cleanCart(current), key = lineKey(line);
      return items.some(x => lineKey(x) === key) ? items.map(x => lineKey(x) === key ? { ...x, quantity: Math.min(99, x.quantity + 1) } : x) : [...items, line];
    });
    setToast(`${p.name} added to cart`);
  }
  const updateQuantity = (key, quantity) => {
    if (!Number.isFinite(quantity)) return;
    setCart(current => cleanCart(current).flatMap(x => lineKey(x) === key ? quantity > 0 ? [{ ...x, quantity: Math.min(99, Math.floor(quantity)) }] : [] : [x]));
  };
  const toggleWishlist = id => {
    if (!findProduct(id)) return;
    setWishlist(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
    setToast(wishlist.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist');
  };
  const toggleCompare = id => setCompare(current => {
    const valid = cleanIds(current).slice(0, 3);
    return valid.includes(id) ? valid.filter(x => x !== id) : findProduct(id) && valid.length < 3 ? [...valid, id] : valid;
  });
  const clearSavedData = () => {
    setCart([]); setWishlist([]); setCompare([]); setRecent([]);
    try { for (const key of ['cart', 'wishlist', 'compare', 'recent', 'newsletter']) localStorage.removeItem('mobistore.' + key); return true; } catch { return false; }
  };
  return <StoreContext.Provider value={{ cart, wishlist, compare, recent, recordView, toggleCompare, clearCompare: () => setCompare([]), clearSavedData, panel, setPanel, addToCart, updateQuantity, toggleWishlist }}>
    {children}<div className="toast" role="status" aria-live="polite">{toast && <><span>{toast}</span><button onClick={() => { setPanel('cart'); setToast(''); }}>View cart</button><button aria-label="Dismiss notification" onClick={() => setToast('')}>×</button></>}</div>
  </StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);

