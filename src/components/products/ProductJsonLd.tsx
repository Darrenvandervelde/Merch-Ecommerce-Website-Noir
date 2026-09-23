import { useEffect } from 'react';
import type { Product } from '../../types';

interface ProductJsonLdProps {
  product: Product;
}

/**
 * Injects schema.org Product JSON-LD into <head> for rich results in search.
 * Removes the script on unmount so other pages stay clean.
 */
export function ProductJsonLd({ product }: ProductJsonLdProps) {
  useEffect(() => {
    const price = product.salePrice ?? product.price;
    const availability =
      product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock';

    const data = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: 'NOIR',
      },
      offers: {
        '@type': 'Offer',
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        priceCurrency: 'USD',
        price: price.toFixed(2),
        availability,
        itemCondition: 'https://schema.org/NewCondition',
      },
      aggregateRating:
        product.reviewCount > 0
          ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            }
          : undefined,
    };

    // Strip undefined keys for cleaner output
    const clean = JSON.parse(JSON.stringify(data));

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-json-ld';
    script.text = JSON.stringify(clean);

    // Replace any previous instance
    document.getElementById('product-json-ld')?.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById('product-json-ld')?.remove();
    };
  }, [product]);

  return null;
}
