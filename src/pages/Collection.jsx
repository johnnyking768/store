import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { site } from "../config/site";
import { servicePages, policies, faqs } from "../data/support";
import { Breadcrumbs, Button } from "../components/ui";
import EnquiryForm from "../components/EnquiryForm";
import SEO from "../components/SEO";
import { whatsappLink } from "../lib/whatsapp";
import { useStore } from "../context/StoreContext";

const specialTitles = { "/contact": "Contact us", "/faq": "Frequently asked questions", "/trade-in": "Trade-in enquiries", "/privacy": "Privacy & saved data" };

function FAQ() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All questions");
  const results = faqs.filter(item => (category === "All questions" || item.category === category) && `${item.question} ${item.answer}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <p className="service-intro">A little clarity before your next upgrade.</p>
    <div className="faq-controls">
      <label htmlFor="faq-search">Search questions<input id="faq-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try delivery, cart or warranty" /></label>
      <label htmlFor="faq-category">Question category<select id="faq-category" value={category} onChange={e => setCategory(e.target.value)}>{["All questions", ...new Set(faqs.map(item => item.category))].map(value => <option key={value}>{value}</option>)}</select></label>
    </div>
    <p className="result-count" role="status">{results.length} questions found</p>
    <div className="faq-list">{results.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
    {!results.length && <div className="service-empty"><h2>No matching questions.</h2><p>Try a broader search or choose a different category.</p><Button onClick={() => { setQuery(""); setCategory("All questions"); }}>Reset questions</Button></div>}
  </>;
}

function Contact() {
  return <>
    <p className="service-intro">Product questions, delivery details or help with your shortlist — start here.</p>
    <div className="contact-grid"><div className="service-copy">
      <section><h2>Reach the store</h2>{whatsappLink("Hi, I have a question for the store.") && <a className="text-action" href={whatsappLink("Hi, I have a question for the store.")} target="_blank" rel="noreferrer">Contact on WhatsApp</a>}<dl className="contact-details">
        <dt>Phone</dt><dd>{site.phone ? <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a> : "Phone number awaiting confirmation"}</dd>
        <dt>Email</dt><dd>{site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : "Email address awaiting confirmation"}</dd>
        <dt>Address</dt><dd>{site.address || "Store address awaiting confirmation"}</dd>
        <dt>Opening hours</dt><dd>{site.openingHours || "Support hours awaiting confirmation"}</dd>
      </dl></section>
      <section><h2>Useful before you get in touch</h2><p>Include the product name and your question. For delivery enquiries, include your town or city. Keep passwords, card details and device unlock codes out of your message.</p><Link className="text-action" to="/faq">Read common questions →</Link></section>
    </div><EnquiryForm /></div>{site.mapEmbedUrl && <iframe className="store-map" title="Store location" src={site.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />} 
  </>;
}

function TradeIn() {
  return <>
    <p className="service-intro">Thinking about an upgrade? Prepare a device enquiry for the store.</p>
    <p className="catalog-notice">Trade-in availability, eligibility and valuation require store confirmation. This is an enquiry, not an offer.</p>
    <div className="contact-grid"><div className="service-copy">
      <section><span className="step-number">01</span><h2>Describe your device</h2><p>Share the model, storage and known issues so the store can understand what you want to trade in.</p></section>
      <section><span className="step-number">02</span><h2>Ask about eligibility</h2><p>The store must confirm whether it accepts your device and explain any assessment or ownership-document requirements.</p></section>
      <section><span className="step-number">03</span><h2>Review the next steps</h2><p>No trade-in value or appointment is booked here. Confirm the process with the store before handing over a device.</p></section>
    </div><EnquiryForm tradeIn /></div>
  </>;
}

function Privacy() {
  const { clearSavedData } = useStore();
  const [status, setStatus] = useState("");
  const approvedPrivacy = policies.privacy.approved && policies.privacy.sections.length > 0;
  return <>
    <p className="service-intro">How this preview uses browser storage and enquiry messages.</p>
    {approvedPrivacy ? <div className="service-copy">{policies.privacy.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</div> : <p className="catalog-notice">This describes the current preview. The store's full privacy policy and contact details are awaiting approval.</p>}
    <div className="service-copy">
      <section><h2>Saved on this device</h2><p>Your cart, wishlist, recently viewed products and comparison shortlist use this browser's local storage. The newsletter form stores your entered email and submission date here too; it is not connected to a mailing service. Saved data does not sync between devices.</p></section>
      <section><h2>Enquiry forms</h2><p>Contact and trade-in entries stay in the current page's memory and are not submitted to a store server. Opening a configured WhatsApp enquiry passes the message in a link to WhatsApp, where you decide whether to send it. The website does not collect payment details or create an account.</p></section>
      <section><h2>External services</h2><p>The site loads fonts from Google Fonts. Your browser connects to that service to request the font files. If a store map is displayed, your browser also connects to its map provider. WhatsApp and other external links operate under their own policies once opened.</p></section>
      <section className="data-controls"><h2>Clear saved store data</h2><p>This removes this site's cart, wishlist, comparison list, recently viewed products and locally saved newsletter entry from this browser. Messages already opened or sent in external apps are unaffected.</p><Button variant="outline" onClick={() => setStatus(clearSavedData() ? "Saved store data cleared from this browser." : "Some saved data could not be cleared. Check your browser storage settings.")}>Clear saved store data</Button><p role="status">{status}</p></section>
    </div>
  </>;
}

export default function Collection() {
  const { pathname } = useLocation();
  const info = servicePages[pathname];
  const title = info?.title || specialTitles[pathname];
  const policy = info?.policy ? policies[info.policy] : null;
  const approved = policy?.approved && policy.sections.length > 0;
  const sections = approved ? policy.sections : info?.sections;
  return <div className="container service-page">
    <Helmet><title>{title} | {site.name}</title><meta name="description" content={info?.intro || `${title} at ${site.name}`} /><meta name="robots" content="noindex" /></Helmet>
    <SEO title={title} description={info?.intro || title + " at " + site.name} /><Breadcrumbs items={[{ label: title }]} />
    <p className="eyebrow">{info?.eyebrow || "HERE TO HELP"}</p><h1>{title}</h1>
    {info && <><p className="service-intro">{approved ? "Store-approved information for your purchase." : info.intro}</p>{policy && !approved && <p className="catalog-notice">Approved store policy awaiting confirmation. The guidance below describes what to check before purchasing.</p>}<div className="service-copy">{sections.map(([heading, text]) => <section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</div></>}
    {pathname === "/contact" && <Contact />}
    {pathname === "/faq" && <FAQ />}
    {pathname === "/trade-in" && <TradeIn />}
    {pathname === "/privacy" && <Privacy />}
    <nav className="service-links" aria-label="Customer service"><Link to="/shop">Browse products</Link><Link to="/contact">Contact the store</Link><Link to="/faq">Common questions</Link><Link to="/delivery">Delivery & returns</Link></nav>
  </div>;
}
