import { site } from "../config/site.js";
export function whatsappLink(message) {
  return /^[1-9]\d{7,14}$/.test(site.WHATSAPP_NUMBER)
    ? `https://wa.me/${site.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : null;
}
