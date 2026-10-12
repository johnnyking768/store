import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '../lib/catalog.js';
export default function ProductImage({ src, alt, className = '', loading = 'lazy', ...props }) {
  const [loaded, setLoaded] = useState('');
  const source = src || PLACEHOLDER_IMAGE;
  return <img {...props} className={`${className} product-photo ${loaded === source ? 'is-loaded' : 'is-loading'}`} src={source} alt={alt} loading={loading} decoding="async" onLoad={() => setLoaded(source)} onError={event => {
    setLoaded(source);
    if (event.currentTarget.getAttribute('src') !== PLACEHOLDER_IMAGE) event.currentTarget.src = PLACEHOLDER_IMAGE;
  }} />;
}

