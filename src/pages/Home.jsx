import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Headphones,
  Watch,
  Cable,
  Tablet,
  ArrowRight,
} from "lucide-react";
import { site } from "../config/site";
import { categories, copy } from "../data/content";
import { SectionTitle, ProductCard, Button } from "../components/ui";
import { products, catalogNotice } from "../data/products";
import Hero from "../sections/Hero";
import RecentlyViewed from "../components/RecentlyViewed";
import SEO from "../components/SEO";
import ProductImage from "../components/ProductImage";
import { promotions } from "../data/content";
const categoryIcons = { Smartphone, Headphones, Watch, Cable, Tablet };
const categoryPhotos = {
  smartphones: "/images/products/galaxy-s24-ultra.jpg",
  earbuds: "/images/products/phone-accessories.jpg",
  smartwatches: "/images/products/galaxy-watch6.jpg",
  accessories: "/images/products/phone-accessories.jpg",
  tablets: "/images/products/ipad-10th-gen.jpg",
};
export default function Home() {
  return (
    <>
      <Helmet>
        <title>
          {site.name} | {site.tagline}
        </title>
        <meta name="description" content={copy.hero.description} />
      </Helmet>
      <SEO title={site.tagline} description={copy.hero.description} /><Hero />
      <section className="container category-section">
        <SectionTitle>{copy.categoryTitle}</SectionTitle>
        <div className="category-grid">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon];
            return (
              <Link
                className="category-card"
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
              >
                <div className="category-art">
                  <ProductImage src={categoryPhotos[cat.slug]} alt={cat.name + " product photo"} />
                </div>
                <div>
                  <h3>{cat.name}</h3>
                  <p>{cat.subtitle}</p>
                  <span>
                    {copy.categoryAction}
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="container featured-section"><SectionTitle link={{to:"/shop",label:"View all"}}>Featured products</SectionTitle><p className="catalog-notice">{catalogNotice}</p><div className="product-grid">{products.filter(p => p.featured).slice(0,6).map(product => <ProductCard key={product.id} product={product} />)}</div></section>
      <section className="container promo-grid">{promotions.map(p=><div key={p.title} className={p.tone}><div><h2>{p.title}</h2><p>{p.description}</p><Button to={p.to} variant="outline">{p.action}</Button></div><ProductImage src={p.image} alt="" /></div>)}</section><div className="container"><RecentlyViewed /></div>
    </>
  );
}
