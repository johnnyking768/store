import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { site } from '../config/site';
export default function SEO({ title, description, product, price }) {
 const { pathname } = useLocation();
 const origin = site.publicUrl || window.location.origin;
 const url = origin + pathname;
 const image = new URL(product?.image || '/images/products/phone-accessories.jpg',origin).href;
 const structured = product && {
  '@context':'https://schema.org', '@type':'Product', name:product.name,
  description:product.description, image:product.images.map(i=>new URL(i,origin).href), sku:product.id,
  brand:{'@type':'Brand',name:product.brand},
  ...(!product.isSample && site.contentApproved ? {offers:{'@type':'Offer',url,priceCurrency:'NGN',price:price ?? product.price,availability:'https://schema.org/'+(product.inStock?'InStock':'OutOfStock'),itemCondition:'https://schema.org/'+(product.condition==='UK Used'?'UsedCondition':'NewCondition')}} : {})
 };
 return <Helmet><title>{title} | {site.name}</title><meta name="description" content={description} />
  <meta property="og:title" content={title+' | '+site.name} /><meta property="og:description" content={description} /><meta property="og:type" content="website" /><meta property="og:url" content={url} /><meta property="og:image" content={image} /><meta property="og:site_name" content={site.name} />
  <meta name="twitter:card" content="summary_large_image" /><link rel="canonical" href={url} />
  {structured && <script type="application/ld+json">{JSON.stringify(structured).replace(/</g,'\\u003c')}</script>}
 </Helmet>;
}

