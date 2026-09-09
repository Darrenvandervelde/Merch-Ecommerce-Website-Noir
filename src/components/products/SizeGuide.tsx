import { useState } from 'react';
import { X } from 'lucide-react';
import { sizeGuides } from '../../data/sizeGuides';
import type { ProductCategory } from '../../types';
import { useFitVoteStore } from '../../store/fitVoteStore';
import { cn } from '../../utils/cn';

interface SizeGuideProps {
  category: ProductCategory;
  productId: string;
}

export function SizeGuidePanel({ category, productId }: SizeGuideProps) {
  const [open, setOpen] = useState(false);
  const guide = sizeGuides[category];
  const vote = useFitVoteStore((s) => s.vote);
  const stats = useFitVoteStore((s) => s.votes[productId] ?? { small: 0, true: 0, large: 0 });
  const userVote = useFitVoteStore((s) => s.userVotes[productId] ?? null);

  const total = stats.small + stats.true + stats.large;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-brand-900 underline underline-offset-2 hover:text-brand-600"
      >
        Size guide & fit
      </button>

      <div className="mt-4 rounded-lg border border-brand-200 p-4">
        <p className="text-sm font-medium text-brand-900">How does this fit?</p>
        <p className="mt-1 text-xs text-brand-500">{guide.fitNote}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              { key: 'small' as const, label: 'Runs small' },
              { key: 'true' as const, label: 'True to size' },
              { key: 'large' as const, label: 'Runs large' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => vote(productId, opt.key)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full border transition-colors',
                userVote === opt.key
                  ? 'border-brand-900 bg-brand-900 text-white'
                  : 'border-brand-300 text-brand-700 hover:border-brand-500'
              )}
            >
              {opt.label}
              {total > 0 && (
                <span className="ml-1 opacity-70">({pct(stats[opt.key])}%)</span>
              )}
            </button>
          ))}
        </div>
        {total > 0 && (
          <p className="mt-2 text-xs text-brand-400">{total} customer vote{total !== 1 ? 's' : ''}</p>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            role="dialog"
            aria-labelledby="size-guide-title"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="size-guide-title" className="text-lg font-semibold text-brand-950">
                Size guide — {category === 'tshirt' ? 'T-Shirts' : 'Hoodies'}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-brand-500 hover:text-brand-900"
                aria-label="Close size guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-brand-600 mb-4">{guide.fitNote}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-brand-200 text-brand-500">
                    <th className="py-2 pr-4 font-medium">Size</th>
                    <th className="py-2 pr-4 font-medium">Chest</th>
                    <th className="py-2 pr-4 font-medium">Length</th>
                    <th className="py-2 font-medium">Sleeve</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.rows.map((row) => (
                    <tr key={row.size} className="border-b border-brand-100">
                      <td className="py-2.5 pr-4 font-medium text-brand-900">{row.size}</td>
                      <td className="py-2.5 pr-4 text-brand-600">{row.chest}</td>
                      <td className="py-2.5 pr-4 text-brand-600">{row.length}</td>
                      <td className="py-2.5 text-brand-600">{row.sleeve ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-brand-400">
              Measurements are approximate. For the best fit, compare to a garment you already own.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
