import { Link, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function CompareTray() {
  const { compare, clearCompare } = useStore();
  const { pathname } = useLocation();
  const browsing = ["/", "/shop", "/brands", "/accessories", "/deals", "/wishlist"].includes(pathname) || pathname.startsWith("/product/");
  if (!compare.length || !browsing) return null;
  return <aside className="compare-tray" aria-label="Your comparison shortlist">
    <span role="status">{compare.length} of 3 selected</span>
    <Link to="/compare">Compare products →</Link>
    <button onClick={clearCompare} aria-label="Clear comparison shortlist">Clear</button>
  </aside>;
}
