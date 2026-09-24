import { Gift } from 'lucide-react';

interface GiftOptionsProps {
  giftWrap: boolean;
  giftNote: string;
  onGiftWrapChange: (v: boolean) => void;
  onGiftNoteChange: (v: string) => void;
  /** Extra cost shown in UI (fulfiled at fulfilment) */
  wrapFee?: number;
}

export function GiftOptions({
  giftWrap,
  giftNote,
  onGiftWrapChange,
  onGiftNoteChange,
  wrapFee = 5,
}: GiftOptionsProps) {
  return (
    <div className="rounded-lg border border-brand-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Gift className="h-4 w-4 text-brand-700" />
        <p className="text-sm font-semibold text-brand-900">Gift options</p>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={giftWrap}
          onChange={(e) => onGiftWrapChange(e.target.checked)}
          className="mt-1 rounded border-brand-300"
        />
        <span className="text-sm">
          <span className="font-medium text-brand-900">Eco gift packaging</span>
          <span className="block text-brand-500 text-xs mt-0.5">
            Recycled kraft wrap + tissue · +${wrapFee} at fulfilment
          </span>
        </span>
      </label>
      <div>
        <label htmlFor="gift-note" className="block text-xs font-medium text-brand-600 mb-1">
          Gift message (optional, max 200 characters)
        </label>
        <textarea
          id="gift-note"
          value={giftNote}
          onChange={(e) => onGiftNoteChange(e.target.value.slice(0, 200))}
          rows={3}
          placeholder="Write a short note for the recipient…"
          className="w-full px-3 py-2 border border-brand-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
          maxLength={200}
        />
        <p className="mt-1 text-[11px] text-brand-400 text-right">
          {giftNote.length}/200
        </p>
      </div>
    </div>
  );
}
