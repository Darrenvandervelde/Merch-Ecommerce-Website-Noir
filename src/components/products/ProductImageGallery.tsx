import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const list = images.length > 0 ? images : [''];

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => (i + dir + list.length) % list.length);
    },
    [list.length]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, go]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="relative aspect-[3/4] w-full overflow-hidden bg-brand-100 group cursor-zoom-in"
        onClick={() => setLightbox(true)}
        aria-label="Open image zoom"
      >
        <img
          src={list[active]}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-3.5 w-3.5" />
          Zoom
        </span>
      </button>

      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'aspect-square overflow-hidden bg-brand-100 ring-offset-2 transition-shadow',
                active === i ? 'ring-2 ring-brand-900' : 'hover:opacity-90'
              )}
              aria-label={`View image ${i + 1}`}
              aria-current={active === i}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {list.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 sm:left-6 p-2 text-white/80 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                className="absolute right-2 sm:right-6 p-2 text-white/80 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <img
            src={list[active]}
            alt={alt}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70">
            {active + 1} / {list.length}
          </p>
        </div>
      )}
    </div>
  );
}
