import { useEffect } from 'react';

export interface OpenGraphData {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

/**
 * Sets Open Graph + Twitter Card meta tags for the current route.
 * Cleans up product-specific tags on unmount.
 */
export function useOpenGraph(data: OpenGraphData) {
  useEffect(() => {
    const {
      title,
      description,
      image,
      url,
      type = 'website',
      price,
      currency = 'USD',
      availability,
    } = data;

    const fullTitle = title.includes('NOIR') ? title : `${title} | NOIR`;
    const pageUrl =
      url ?? (typeof window !== 'undefined' ? window.location.href : '');

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:type', type);
    if (description) setMeta('property', 'og:description', description);
    if (image) setMeta('property', 'og:image', image);
    if (pageUrl) setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:site_name', 'NOIR');

    // Product extras (Facebook / some crawlers)
    if (type === 'product' && price != null) {
      setMeta('property', 'product:price:amount', price.toFixed(2));
      setMeta('property', 'product:price:currency', currency);
    }
    if (availability) {
      setMeta('property', 'product:availability', availability);
    }

    // Twitter Card
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    if (description) setMeta('name', 'twitter:description', description);
    if (image) setMeta('name', 'twitter:image', image);

    return () => {
      // Only strip product-specific tags; keep generic ones for next page
      removeMeta('property', 'product:price:amount');
      removeMeta('property', 'product:price:currency');
      removeMeta('property', 'product:availability');
    };
  }, [
    data.title,
    data.description,
    data.image,
    data.url,
    data.type,
    data.price,
    data.currency,
    data.availability,
  ]);
}
