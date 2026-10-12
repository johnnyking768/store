import { useState, useCallback } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { products, matchesQuery, catalogNotice } from '../data/products';
import { categories } from '../data/content';
import { Breadcrumbs, ProductCard, Button, Drawer } from '../components/ui';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../lib/format';
import SEO from '../components/SEO';
import RecentlyViewed from '../components/RecentlyViewed';
import SaleCountdown from '../components/SaleCountdown';
const brands = [...new Set(products.map(p => p.brand))].sort();
const values = key => [...new Set(products.flatMap(p => p.variants.map(v => v[key])))].filter(v => !['Standard','Not specified','Not applicable'].includes(v)).sort((a,b) => parseInt(a)-parseInt(b));
const maximum = Math.ceil(Math.max(...products.map(p => p.price)) / 50000) * 50000;
export default function Shop() {
 const { pathname } = useLocation(), [params, setParams] = useSearchParams(), { wishlist } = useStore();
 const [open, setOpen] = useState(false);
 const close = useCallback(() => setOpen(false), []);
 const title = ({'/brands':'Shop by brand','/accessories':'Accessories','/deals':'Deals & offers','/wishlist':'Your wishlist'})[pathname] || 'Explore the collection';
 const filter = (key,value) => setParams(previous => { const next = new URLSearchParams(previous); value ? next.set(key,value) : next.delete(key); next.delete('limit'); return next; }, { replace:true });
 const budget = Number(params.get('max')) || maximum;
 const items = products.filter(p =>
   (pathname !== '/accessories' || ['accessories','earbuds','smartwatches'].includes(p.category)) &&
   (pathname !== '/deals' || p.oldPrice > p.price) &&
   (pathname !== '/wishlist' || wishlist.includes(p.id)) &&
   (!params.get('category') || p.category === params.get('category')) &&
   (!params.get('brand') || p.brand === params.get('brand')) &&
   (!params.get('condition') || p.condition === params.get('condition')) &&
   (!params.get('stock') || p.inStock) &&
   p.variants.some(v => (!params.get('storage') || v.storage === params.get('storage')) && (!params.get('ram') || v.ram === params.get('ram')) && v.price <= budget) &&
   matchesQuery(p, params.get('q') || '')
 ).sort((a,b) => params.get('sort') === 'price-asc' ? a.price-b.price : params.get('sort') === 'price-desc' ? b.price-a.price : params.get('sort') === 'rating' ? b.rating-a.rating : params.get('sort') === 'newest' ? (b.released || '').localeCompare(a.released || '') : params.get('sort') === 'name' ? a.name.localeCompare(b.name) : Number(b.featured)-Number(a.featured));
 const limit = Math.max(12, Math.min(10000, Number(params.get('limit')) || 12));
 const filters = <div className="catalog-filters">
   <label>Search<input type="search" value={params.get('q') || ''} onChange={e => filter('q',e.target.value)} placeholder="Search products" /></label>
   {[['category','Category',categories.map(c => [c.slug,c.name])],['brand','Brand',brands.map(b=>[b,b])],['storage','Storage',values('storage').map(v=>[v,v])],['ram','RAM',values('ram').map(v=>[v,v])],['condition','Condition',[['New','New'],['UK Used','UK Used']]]].map(([key,label,options]) => <label key={key}>{label}<select aria-label={label} value={params.get(key) || ''} onChange={e=>filter(key,e.target.value)}><option value="">All {label.toLowerCase()}</option>{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>)}
   <label>Maximum price: {formatNaira(budget)}<input aria-label="Maximum price" type="range" min="10000" max={maximum} step="10000" value={budget} onChange={e=>filter('max',e.target.value)} /></label>
   <label className="stock-filter"><input type="checkbox" checked={params.get('stock')==='1'} onChange={e=>filter('stock',e.target.checked?'1':'')} />In stock only</label>
   <button className="text-action" onClick={()=>setParams({})}>Clear filters</button>
 </div>;
 return <div className="container shop-page">
   <SEO title={title} description={`Browse ${title.toLowerCase()}: compare phones, accessories and sample Nigerian prices. Order directly on WhatsApp.`} />
   <Breadcrumbs items={[{label:title}]} /><p className="eyebrow">YOUR NEXT UPGRADE</p><h1>{title}</h1><p className="catalog-notice">{catalogNotice}</p>
   {pathname === '/deals' && <SaleCountdown />}
   {pathname === '/brands' && <div className="brand-links">{brands.map(b=><Link key={b} to={`/shop?brand=${encodeURIComponent(b)}`}><strong>{b}</strong><small>Explore collection →</small></Link>)}</div>}
   <div className="catalog-toolbar"><Button className="mobile-filters" variant="outline" onClick={()=>setOpen(true)}>Filter products</Button><p className="result-count" role="status">{items.length} {items.length === 1 ? 'product' : 'products'}</p>
   <label className="sort-label">Sort by<select aria-label="Sort by" value={params.get('sort') || ''} onChange={e=>filter('sort',e.target.value)}><option value="">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="newest">Newest</option><option value="rating">Top rated</option><option value="name">Name</option></select></label></div>
   <div className="catalog-layout"><aside className="desktop-filters" aria-label="Product filters">{!open && filters}</aside><div>
   {items.length ? <><div className="product-grid">{items.slice(0,limit).map(product=><ProductCard key={product.id} product={product} />)}</div>{limit < items.length && <div className="load-more"><Button onClick={()=>setParams(previous=>{const next=new URLSearchParams(previous);next.set('limit',String(limit+12));return next;},{replace:true})}>Load more</Button><p>Showing {Math.min(limit,items.length)} of {items.length}</p></div>}</>
   : <div className="empty-state"><h2>No products found.</h2><p>Try another search or clear your filters.</p><Button onClick={()=>setParams({})}>Clear filters</Button></div>}
   </div></div><RecentlyViewed /><Drawer open={open} onClose={close} title="Filter products">{open && filters}<Button onClick={close}>Show {items.length} products</Button></Drawer>
 </div>;
}

