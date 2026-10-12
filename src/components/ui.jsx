import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowRight, X, Star, ShoppingCart } from "lucide-react";
import { formatNaira } from "../lib/format";
import { useStore } from "../context/StoreContext";
import ProductImage from "./ProductImage";
import OrderButton from "./OrderButton";
export function Button({
  to,
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const Component = to ? Link : "button";
  return (
    <Component
      {...(to ? { to } : { type: "button" })}
      className={`button button-${variant} ${className}`}
      {...props}
    >
      {children}
      <ArrowRight size={14} />
    </Component>
  );
}
export const Badge = ({ children }) => (
  <span className="badge">{children}</span>
);
export const SectionTitle = ({ children, link }) => (
  <div className="section-title">
    <h2>{children}</h2>
    {link && (
      <Link to={link.to}>
        {link.label}
        <ArrowRight size={13} />
      </Link>
    )}
  </div>
);
export function StarRating({ rating = 0, count }) {
  return (
    <span
      className="stars"
      aria-label={`${rating} out of 5 stars${count ? `, ${count} reviews` : ""}`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={11}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
      {count !== undefined && <small>({count})</small>}
    </span>
  );
}
export function Modal({ open, onClose, title, children, drawer = false }) {
  const ref = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const handle = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const els = ref.current?.querySelectorAll(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]',
        );
        if (!els?.length) {
          e.preventDefault();
          return;
        }
        const first = els[0],
          last = els[els.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div
      className={`overlay ${drawer ? "drawer-overlay" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        tabIndex={-1}
        ref={ref}
        className={drawer ? "drawer" : "modal"}
      >
        <div className="dialog-heading">
          <h2 id={id}>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X />
          </button>
        </div>
        {children}
      </section>
    </div>,
    document.body,
  );
}
export const Drawer = (props) => <Modal {...props} drawer />;
export const Skeleton = ({ className = "" }) => (
  <div
    aria-busy="true"
    aria-label="Loading"
    className={`skeleton ${className}`}
  />
);
export const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className="breadcrumbs">
    <Link to="/">Home</Link>
    {items.map((item, i) => (
      <span key={i}>
        {" "}
        /{" "}
        {item.to ? (
          <Link to={item.to}>{item.label}</Link>
        ) : (
          <span aria-current="page">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);
export function ProductCard({ product, onAdd, onOrder }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`}>
        <div className="product-image">
          <ProductImage
            src={product.image || "/images/products/phone-accessories.jpg"}
            alt={product.name}
            loading="lazy"
          />
          {product.badge && <Badge>{product.badge}</Badge>}
        </div>
        <h3>{product.name}</h3>
      </Link>
      <p className="muted">{product.variants[0].storage} · {product.condition}</p><StarRating rating={product.rating} count={product.reviewCount} />{product.isSample && <small className="sample-label">Sample price · Illustration</small>}
      <button className="save-product" aria-pressed={wishlist.includes(product.id)} onClick={() => toggleWishlist(product.id)} aria-label={`Save ${product.name} to wishlist`}>{wishlist.includes(product.id) ? "♥ Saved" : "♡ Save"}</button>
      <CompareButton product={product} />
      <div className="product-price">
        <strong>{formatNaira(product.price)}</strong>
        <button
          disabled={!product.inStock}
          aria-label={`Add ${product.name} to cart`}
          className="cart-circle"
          onClick={() => (onAdd || addToCart)(product)}
        >
          <ShoppingCart size={17} />
        </button>
      </div>
      {product.oldPrice && <div className="discount"><del>{formatNaira(product.oldPrice)}</del><span>{Math.round((1-product.price/product.oldPrice)*100)}% off{product.isSample ? " · demo" : ""}</span></div>}
      <OrderButton product={product} className="product-order" />
    </article>
  );
}
export function CompareButton({ product }) {
  const { compare, toggleCompare } = useStore();
  const selected = compare.includes(product.id);
  const full = compare.length >= 3 && !selected;
  return <button className="compare-product" aria-label={`Compare ${product.name}`} aria-pressed={selected} disabled={full} title={full ? "Remove a product from comparison to add another" : undefined} onClick={() => toggleCompare(product.id)}>{selected ? "✓ Comparing" : full ? "Compare list full" : "+ Compare"}</button>;
}
