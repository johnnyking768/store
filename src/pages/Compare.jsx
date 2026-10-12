import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useStore } from "../context/StoreContext";
import { products, findProduct, catalogNotice } from "../data/products";
import { categories } from "../data/content";
import { formatNaira } from "../lib/format";
import { Breadcrumbs, Button } from "../components/ui";
import ProductImage from "../components/ProductImage";
import SEO from "../components/SEO";

export default function Compare() {
  const { compare, toggleCompare, clearCompare, addToCart } = useStore();
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const selected = compare.map(findProduct);
  const sampleSelection = selected.some(product => product.isSample);
  const specKeys = [...new Set(selected.flatMap(product => Object.keys(product.specifications)))];
  const rows = [
    ["Brand", p => p.brand],
    ["Category", p => categories.find(c => c.slug === p.category)?.name || p.category],
    [sampleSelection ? "Sample price" : "Price", p => formatNaira(p.price)],
    [sampleSelection ? "Sample availability" : "Availability", p => p.inStock ? "Available" : "Unavailable"],
    ...(specKeys.length ? specKeys.map(key => [`Specification: ${key}`, p => p.specifications[key] || "Not supplied"]) : [["Model & specifications", () => "Awaiting verified product details"]]),
  ];
  const visibleRows = rows.filter(([, value]) => !differencesOnly || selected.length < 2 || new Set(selected.map(value)).size > 1);
  return <div className="container service-page">
    <Helmet><title>Compare products | MobiStore</title></Helmet>
    <SEO title="Compare products" description="Compare up to three phones side by side, including price, storage, display and camera specifications." /><Breadcrumbs items={[{ label: "Compare products" }]} />
    <p className="eyebrow">MAKE ROOM FOR THE RIGHT CHOICE</p>
    <h1>Compare products</h1>
    <p className="service-intro">Bring up to three favourites together and see how they compare.</p>
    <p className="catalog-notice">{catalogNotice}</p>
    <div className="compare-toolbar">
      <label htmlFor="compare-add">Add a product
        <select id="compare-add" value="" disabled={compare.length >= 3} onChange={e => toggleCompare(e.target.value)}>
          <option value="">{compare.length >= 3 ? "Three products selected" : "Choose a product"}</option>
          {products.filter(p => !compare.includes(p.id)).map(p => <option value={p.id} key={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="difference-toggle"><input type="checkbox" checked={differencesOnly} disabled={selected.length < 2} onChange={e => setDifferencesOnly(e.target.checked)} /> Show differences only</label>
      {selected.length > 0 && <button className="text-action" onClick={clearCompare}>Clear comparison</button>}
    </div>
    <p className="result-count" role="status">{selected.length} of 3 products selected{selected.length === 1 ? " — add another to compare." : "."}</p>
    {!selected.length ? <div className="service-empty"><h2>Your shortlist starts here.</h2><p>Select a product above, or use Compare while browsing the shop.</p><Button to="/shop">Explore the collection</Button></div> :
      <div className="comparison-scroll" role="region" aria-label="Product comparison table" tabIndex={0}>
        <table className="comparison-table">
          <caption className="sr-only">{sampleSelection ? "Sample product comparison" : "Product comparison"}</caption>
          <thead><tr><th scope="col">At a glance</th>{selected.map(p => <th scope="col" key={p.id}><ProductImage src={p.image} alt="" /><Link to={`/product/${p.slug}`}>{p.name}</Link><button className="text-action" onClick={() => toggleCompare(p.id)} aria-label={`Remove ${p.name} from comparison`}>Remove</button></th>)}</tr></thead>
          <tbody>{visibleRows.map(([label, value]) => <tr key={label}><th scope="row">{label}</th>{selected.map(p => <td key={p.id}>{value(p)}</td>)}</tr>)}</tbody>
          <tfoot><tr><th scope="row">Next step</th>{selected.map(p => <td key={p.id}><Button disabled={!p.inStock} onClick={() => addToCart(p)} aria-label={`Add ${p.name} to cart`}>{p.inStock ? "Add to cart" : "Unavailable"}</Button></td>)}</tr></tfoot>
        </table>
      </div>}
  </div>;
}
