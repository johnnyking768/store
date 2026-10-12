import { useState, useCallback } from 'react';
import { whatsappLink } from '../lib/whatsapp';
import { productMessage, productUrl } from '../lib/orders';
import { Modal } from './ui';

export default function OrderButton({ product, variantId, color, notify = false, className = 'button button-primary' }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const message = notify
    ? `Hi, please let me know when ${product.name} is back in stock.\n${productUrl(product, window.location.origin)}`
    : productMessage(product, variantId, color, window.location.origin);
  const href = whatsappLink(message);
  const label = notify ? 'Notify me on WhatsApp' : product.inStock ? 'Order on WhatsApp' : 'Out of Stock';
  return <>{href && (product.inStock || notify)
    ? <a className={className} href={href} target="_blank" rel="noreferrer">{label}</a>
    : <button className={className} disabled={!product.inStock && !notify} onClick={() => setOpen(true)}>{label}</button>}
    <Modal open={open} onClose={close} title={notify ? 'Stock notification enquiry' : 'Your WhatsApp order'}>
      <p className="muted">The store’s WhatsApp number has not been configured yet. Your message is ready below.</p>
      <pre className="order-preview">{message}</pre>
    </Modal>
  </>;
}
