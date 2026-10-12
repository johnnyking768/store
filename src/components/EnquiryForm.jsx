import { useRef, useState } from "react";
import { Button } from "./ui";
import { whatsappLink } from "../lib/whatsapp";

export default function EnquiryForm({ tradeIn = false }) {
  const [draft, setDraft] = useState("");
  const preview = useRef(null);
  function prepare(event) {
    event.preventDefault();
    const form = event.currentTarget;
    for (const field of form.querySelectorAll("input[required],textarea[required]")) {
      if (!field.value.trim()) {
        field.setCustomValidity("Please enter a value, not just spaces.");
        field.reportValidity();
        return;
      }
    }
    const values = new FormData(form);
    const message = [
      tradeIn ? "Hello, I would like to ask whether a trade-in is available." : `Hello, I have a ${values.get("topic")} enquiry.`,
      values.get("name")?.trim() ? `Name: ${values.get("name").trim()}` : "",
      ...(tradeIn ? [`Device: ${values.get("device").trim()}`, `Storage: ${values.get("storage").trim()}`, `Condition: ${values.get("condition")}`, `Location: ${values.get("location").trim()}`] : []),
      `Details: ${values.get("details").trim()}`,
      tradeIn ? "Please confirm eligibility and the assessment process. I understand no value has been agreed." : "",
    ].filter(Boolean).join("\n");
    setDraft(message);
    requestAnimationFrame(() => preview.current?.focus());
  }
  const link = draft ? whatsappLink(draft) : null;
  return <div className="enquiry-card">
    <h2>{tradeIn ? "Tell us about your device" : "Prepare an enquiry"}</h2>
    <p className="muted">Review your message first. Nothing is sent by this form.</p>
    <form className="service-form" onSubmit={prepare} onChange={event => { event.target.setCustomValidity?.(""); setDraft(""); }}>
      <label htmlFor="enquiry-name">Your name (optional)<input id="enquiry-name" name="name" autoComplete="given-name" maxLength={80} /></label>
      {tradeIn ? <>
        <label htmlFor="enquiry-device">Device model<input id="enquiry-device" name="device" placeholder="Brand, model and storage" required maxLength={120} /></label>
        <label htmlFor="enquiry-storage">Device storage<input id="enquiry-storage" name="storage" placeholder="e.g. 128GB" required maxLength={40} /></label>
        <label htmlFor="enquiry-condition">Device condition<select id="enquiry-condition" name="condition" required defaultValue=""><option value="" disabled>Select condition</option><option>Working, no known damage</option><option>Working, visible wear or damage</option><option>Not working</option><option>Unsure — needs assessment</option></select></label>
        <label htmlFor="enquiry-location">Town or city<input id="enquiry-location" name="location" required maxLength={100} /></label>
      </> : <label htmlFor="enquiry-topic">Topic<select id="enquiry-topic" name="topic"><option>product</option><option>delivery</option><option>returns</option><option>warranty</option><option>general</option></select></label>}
      <label htmlFor="enquiry-details">{tradeIn ? "Device details and known issues" : "Your message"}<textarea id="enquiry-details" name="details" rows={5} required maxLength={1500} /></label>
      <Button type="submit">Review enquiry</Button>
    </form>
    {draft && <section className="enquiry-preview" tabIndex={-1} ref={preview} aria-label="Enquiry preview">
      <h3>Your message is ready to review</h3><p className="muted">Not sent. Edits to the form will clear this preview.</p><pre>{draft}</pre>
      {link ? <a className="button button-primary" href={link} target="_blank" rel="noreferrer">Open in WhatsApp</a> : <p className="catalog-notice">WhatsApp is unavailable until the store contact is configured. You can select and copy the message above.</p>}
    </section>}
  </div>;
}
