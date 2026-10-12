import { useStore } from '../context/StoreContext';
import { findProduct } from '../data/products';
import { ProductCard, SectionTitle } from './ui';
export default function RecentlyViewed({ exclude }) {
  const { recent } = useStore();
  const items = recent.filter(id => id !== exclude).map(findProduct).filter(Boolean).slice(0, 6);
  if (!items.length) return null;
  return <section className="recent-products"><SectionTitle>Recently viewed</SectionTitle><div className="product-grid">{items.map(p => <ProductCard key={p.id} product={p} />)}</div></section>;
}

