import { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
  Send,
  MessageCircle,
  ArrowRight,
  Smartphone,
  BadgeCheck,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
} from "lucide-react";
import { site } from "../config/site";
import {
  navigation,
  categories,
  topTrust,
  trust,
  footerGroups,
  copy,
} from "../data/content";
import { useStore } from "../context/StoreContext";
import { Button, Drawer, Modal } from "./ui";
import { whatsappLink } from "../lib/whatsapp";
import Basket from "./Basket";
import ProductImage from "./ProductImage";
import CompareTray from "./CompareTray";
import { products, matchesQuery, hasSampleProducts } from "../data/products";
import { formatNaira } from "../lib/format";
export const icons = { BadgeCheck, ShieldCheck, Truck, RotateCcw, Headset };
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${site.name} home`}>
      <strong>
        {site.logoText}
        <span>{site.logoAccent}</span>
      </strong>
      <small>{site.tagline}</small>
    </Link>
  );
}
export function TopBar() {
  return (
    <div className="top-bar">
      <div className="container">
        {topTrust.map((item) => {
          const Icon = icons[item.icon];
          return (
            <span key={item.title}>
              <Icon size={15} />
              {item.title}
            </span>
          );
        })}
      </div>
    </div>
  );
}
export function Navbar() {
  const { cart, wishlist, setPanel } = useStore();
  const [menu, setMenu] = useState(false);
  const [shop, setShop] = useState(false);
  const close = useCallback(() => setMenu(false), []);
  return (
    <header className="header">
      <div className="container navbar">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, to]) =>
            label === "Shop" ? (
              <div
                className="shop-nav"
                key={label}
                onMouseEnter={() => setShop(true)}
                onMouseLeave={() => setShop(false)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget))
                    setShop(false);
                }}
              >
                <NavLink to={to}>{label}</NavLink>
                <button
                  aria-label="Shop categories"
                  aria-expanded={shop}
                  onClick={() => setShop(!shop)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setShop(false);
                  }}
                >
                  <ChevronDown size={12} />
                </button>
                {shop && (
                  <div className="shop-dropdown">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/shop?category=${cat.slug}`}
                        onClick={() => setShop(false)}
                      >
                        {cat.name}
                        <ArrowRight size={13} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={to} to={to}>
                {label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="nav-actions">
          {[
            [Search, "search", "Search"],
            [UserRound, "account", "Account"],
            [Heart, "wishlist", "Wishlist", wishlist.length],
            [
              ShoppingBag,
              "cart",
              "Cart",
              cart.reduce((n, x) => n + (x.quantity || 1), 0),
            ],
          ].map(([Icon, panel, label, count]) => (
            <button
              key={label}
              className={`icon-button action-${panel}`}
              aria-label={`${label}${count !== undefined ? ` (${count})` : ""}`}
              onClick={() => setPanel(panel)}
            >
              <Icon size={21} />
              {count !== undefined && <span className="count">{count}</span>}
            </button>
          ))}
          <button
            className="icon-button mobile-toggle"
            aria-label="Open navigation"
            onClick={() => setMenu(true)}
          >
            <Menu />
          </button>
        </div>
      </div>
      <Drawer open={menu} onClose={close} title="Explore">
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map(([label, to]) => (
            <NavLink key={to} to={to} onClick={close}>
              {label}
              <ArrowRight size={17} />
            </NavLink>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}
export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Why shop with us">
      <div className="container">
        {trust.map((item) => {
          const Icon = icons[item.icon];
          return (
            <div className="trust-item" key={item.title}>
              <Icon />
              <div>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  function subscribe(e) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    try {
      localStorage.setItem(
        "mobistore.newsletter",
        JSON.stringify({ email, date: new Date().toISOString() }),
      );
      setSubscribed(true);
    } catch {
      setSubscribed("error");
    }
  }
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>{copy.footerDescription}</p>
          <div className="socials">
            {Object.entries(site.socials).map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer">
                {name}
              </a>
            ))}
          </div>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="newsletter">
          <h3>{copy.newsletterTitle}</h3>
          <p>{copy.newsletterDescription}</p>
          <form onSubmit={subscribe}>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
            <button aria-label="Subscribe to newsletter">
              <Send size={17} />
            </button>
          </form>
          <p role="status">
            {subscribed === true
              ? copy.newsletterSuccess
              : subscribed === "error"
                ? "Unable to save. Please enable browser storage."
                : ""}
          </p>
          <div className="payment-badges">
            {site.paymentMethods.map((method) => (
              <span key={method}>{method}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </span>
        <div>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
function Panels() {
  const { panel, setPanel } = useStore();
  const close = useCallback(() => setPanel(null), [setPanel]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const results = query.trim() ? products.filter(p => matchesQuery(p, query)) : [];
  const chat = whatsappLink(copy.chat);
  return (
    <>
      <Drawer
        open={panel === "cart" || panel === "wishlist"}
        onClose={close}
        title={panel === "cart" ? copy.cartTitle : copy.wishlistTitle}
      >
        <Basket kind={panel} onClose={close} />
      </Drawer>
      <Modal open={panel === "search"} onClose={close} title={copy.searchTitle}>
        <form onSubmit={e => { e.preventDefault(); close(); navigate(`/shop?q=${encodeURIComponent(query.trim())}`); }}>
          <label htmlFor="site-search" className="field-label">
            {copy.searchLabel}
          </label>
          <div className="search-field">
            <Search size={19} />
            <input
              id="site-search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
            />
            <button aria-label="Search shop">
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
        <p className="muted mt-6" role="status">{query.trim() ? `${results.length} products found` : hasSampleProducts ? "Search our sample catalogue by product or brand." : "Search products and brands."}</p>
        <div className="live-results">{results.slice(0,5).map(p => <Link key={p.id} to={`/product/${p.slug}`} onClick={close}><ProductImage src={p.image} alt="" /><span>{p.name}<small>{p.brand}</small></span><strong>{formatNaira(p.price)}</strong></Link>)}</div>
        <div className="search-categories">
          {categories.map((cat) => (
            <Link
              to={`/shop?category=${cat.slug}`}
              key={cat.slug}
              onClick={close}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </Modal>
      <Modal
        open={panel === "account" || panel === "whatsapp"}
        onClose={close}
        title={panel === "account" ? copy.accountTitle : copy.chatTitle}
      >
        <p className="muted">
          {panel === "account" ? copy.accountDescription : chat ? "Tell us what you are looking for and review your message in WhatsApp." : copy.chatMissing}
        </p>
        {chat ? (
          <a
            className="button button-primary mt-6"
            href={chat}
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp
            <MessageCircle size={17} />
          </a>
        ) : panel === "account" ? (
          <p className="muted mt-6">{copy.chatMissing}</p>
        ) : null}
      </Modal>
    </>
  );
}
export default function Layout() {
  const { setPanel } = useStore();
  const chat = whatsappLink(copy.chat);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {(!site.contentApproved || hasSampleProducts) && <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>}
      <TopBar />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <TrustStrip />
      <Footer />
      {chat ? (
        <a
          className="floating-chat"
          aria-label="Chat on WhatsApp"
          href={chat}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle />
        </a>
      ) : (
        <button
          className="floating-chat"
          aria-label="Chat on WhatsApp"
          onClick={() => setPanel("whatsapp")}
        >
          <MessageCircle />
        </button>
      )}
      <CompareTray />
      <Panels />
    </>
  );
}
