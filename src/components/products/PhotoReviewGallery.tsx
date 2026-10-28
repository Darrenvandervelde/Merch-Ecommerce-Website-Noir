import { useState } from 'react';
import { getReviewsForProduct } from '../../data/photoReviews';
import { Button } from '../common/Button';
import { useToastStore } from '../../store/toastStore';

interface PhotoReviewGalleryProps {
  productId: string;
}

export function PhotoReviewGallery({ productId }: PhotoReviewGalleryProps) {
  const reviews = getReviewsForProduct(productId);
  const addToast = useToastStore((s) => s.addToast);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(5);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleUploadDemo = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(
      'Photo review submitted for moderation (demo - not saved to server).',
      'success'
    );
    setTitle('');
    setBody('');
    setRating(5);
  };

  return (
    <section className="mt-12 border-t border-brand-200 pt-10">
      <h2 className="text-xl font-bold text-brand-950">Customer photos & reviews</h2>
      <p className="mt-1 text-sm text-brand-500">
        See how this piece looks in real life - verified buyers only below
      </p>

      {reviews.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-lg border border-brand-200 overflow-hidden bg-white"
            >
              {r.photoUrl && (
                <button
                  type="button"
                  className="block w-full cursor-zoom-in"
                  onClick={() => setLightbox(r.photoUrl!)}
                  aria-label="Open review photo"
                >
                  <img
                    src={r.photoUrl}
                    alt=""
                    className="h-40 w-full object-cover bg-brand-100 transition hover:opacity-95"
                  />
                </button>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                  {r.verified && (
                    <span className="text-[10px] uppercase tracking-wide text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-semibold text-brand-900">{r.title}</h3>
                <p className="mt-1 text-sm text-brand-600">{r.body}</p>
                <p className="mt-2 text-xs text-brand-400">
                  {r.author} · {r.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-brand-500">
          No photo reviews yet - be the first to share how it looks on you.
        </p>
      )}

      <form
        onSubmit={handleUploadDemo}
        className="mt-8 max-w-lg space-y-3 rounded-lg border border-brand-200 p-4"
      >
        <p className="text-sm font-medium text-brand-900">Share a photo review</p>
        <div className="flex gap-1" role="group" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-lg ${
                n <= rating ? 'text-amber-500' : 'text-brand-300'
              }`}
              aria-label={`${n} stars`}
            >
              ★
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full h-10 px-3 border border-brand-300 rounded-md text-sm"
        />
        <textarea
          placeholder="How does it look in your space / on you?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 border border-brand-300 rounded-md text-sm"
        />
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-brand-500"
          aria-label="Upload photo"
        />
        <Button type="submit" size="sm">
          Submit review
        </Button>
        <p className="text-[11px] text-brand-400">
          Demo only - submissions are not stored on a server yet.
        </p>
      </form>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Review photo"
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
