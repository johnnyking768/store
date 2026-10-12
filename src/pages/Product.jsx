import { useCallback, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { findProductBySlug, products, catalogNotice } from '../data/products';
import { Breadcrumbs, Button, CompareButton, Modal, ProductCard, SectionTitle, StarRating } from '../components/ui';
import ProductImage from '../components/ProductImage';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../lib/format';
import { site } from '../config/site';
import NotFound from './NotFound';
import OrderButton from '../components/OrderButton';
import RecentlyViewed from '../components/RecentlyViewed';
import SEO from '../components/SEO';

function ProductDetails({ product }) {
  const { addToCart, wishlist, toggleWishlist, recordView } = useStore();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [color, setColor] = useState(product.colors[0]);
  const variant = product.variants.find(v => v.id === variantId);
  useEffect(() => { recordView(product.id); }, [product.id, recordView]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const closeZoom = useCallback(() => setZoom(false), []);
  const image = product.images[selectedImage];
  const specs = Object.entries({ ...product.specifications, Storage: variant.storage, RAM: variant.ram, Condition: product.condition });
  const related = products.filter(item => item.id !== product.id && item.category === product.category).slice(0, 4);
  return <div className="container shop-page">
    <Helmet><title>{product.name} | {site.name}</title><meta name="description" content={product.description} /></Helmet>
    <SEO title={product.name} description={product.description} product={product} price={variant.price} /><Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} />
    <div className="product-detail">
      <div className="product-gallery">
        <button className="detail-image gallery-main" onClick={() => setZoom(true)} aria-label={`Enlarge ${product.name} image`}>
          <ProductImage src={image} alt={`${product.name}, image ${selectedImage + 1}`} />
          <span className="muted">Product photo · Click to enlarge</span>
        </button>
        {product.images.length > 1 && <div className="gallery-thumbnails" aria-label="Product images">
          {product.images.map((src, index) => <button key={src} aria-label={`View image ${index + 1}`} aria-pressed={selectedImage === index} onClick={() => setSelectedImage(index)}><ProductImage src={src} alt="" /></button>)}
        </div>}
      </div>
      <div>
        <p className="eyebrow">{product.brand}</p><h1>{product.name}</h1>
        {product.isSample && <p className="catalog-notice">{catalogNotice}</p>}
        <strong className="detail-price" aria-live="polite">{formatNaira(variant.price)}</strong>
        {product.oldPrice > variant.price && <p className="discount"><del>{formatNaira(product.oldPrice)}</del><span>{Math.round((1 - variant.price / product.oldPrice) * 100)}% off{product.isSample ? ' · demo' : ''}</span></p>}
        <p className="muted">{product.description}</p>
        <div className="product-options"><fieldset><legend>Storage / RAM</legend>{product.variants.map(v => <button key={v.id} aria-pressed={v.id === variantId} onClick={() => setVariantId(v.id)}>{v.storage}{v.ram !== 'Not applicable' && v.ram !== 'Not specified' ? ' / ' + v.ram : ''}</button>)}</fieldset><fieldset><legend>Colour: {color}</legend>{product.colors.map(c => <button key={c} aria-pressed={c === color} onClick={() => setColor(c)}><span className="color-dot" style={{ background: /black|midnight|graphite/i.test(c) ? '#292734' : /blue/i.test(c) ? '#769fc5' : /green/i.test(c) ? '#809d8e' : /purple|violet/i.test(c) ? '#a995c5' : '#ded9d1' }} />{c}</button>)}</fieldset></div>
        <p className="availability">{product.isSample ? product.inStock ? 'Available in sample catalogue' : 'Unavailable in sample catalogue' : product.inStock ? 'Available — confirm stock with the store' : 'Out of stock'}</p>
        <div className="detail-actions">
          <OrderButton product={product} variantId={variantId} color={color} />{!product.inStock && <OrderButton product={product} notify />}<Button variant="outline" disabled={!product.inStock} onClick={() => addToCart(product, { variantId, color })}>Add to cart</Button>
          <Button variant="outline" onClick={() => toggleWishlist(product.id)}>{wishlist.includes(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}</Button>
          <CompareButton product={product} />
        </div>
        <div className="review-summary"><StarRating rating={product.rating} count={product.reviewCount} /><p className="muted">{product.reviewCount ? product.reviewCount + " customer ratings · " + product.rating + "/5" : "No customer reviews yet."}</p></div><div className="product-support-links"><Link to="/delivery">Delivery & returns</Link><Link to="/warranty">Warranty information</Link></div>
      </div>
    </div>
    <section className="product-specifications" aria-labelledby="specifications-title">
      <h2 id="specifications-title">Product specifications</h2>
      {specs.length ? <dl>{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : <p className="muted">Verified specifications have not been supplied for this product. Confirm the exact model, condition and included accessories with the store.</p>}
    </section>
    {related.length > 0 && <section className="related-products"><SectionTitle link={{ to: `/shop?category=${product.category}`, label: 'View collection' }}>More in this category</SectionTitle><div className="product-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}
    <RecentlyViewed exclude={product.id} /><Modal open={zoom} onClose={closeZoom} title={product.name}><ProductImage className="zoom-product-image" src={image} alt={`${product.name}, image ${selectedImage + 1}`} /></Modal>
  </div>;
}

export default function Product() {
  const { slug } = useParams();
  const product = findProductBySlug(slug);
  return product ? <ProductDetails key={product.id} product={product} /> : <NotFound />;
}
