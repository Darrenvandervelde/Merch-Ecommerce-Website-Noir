import { useEffect } from 'react';

/**
 * Sets document title + optional meta description for the current page.
 */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | NOIR` : 'NOIR | Premium Streetwear';

    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? '';

    if (description) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = prev;
      if (meta && description) {
        meta.setAttribute('content', prevDesc);
      }
    };
  }, [title, description]);
}
