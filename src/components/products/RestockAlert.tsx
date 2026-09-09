import { useState } from 'react';
import { useWaitlistStore } from '../../store/waitlistStore';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../common/Button';

interface RestockAlertProps {
  productId: string;
  productName: string;
  colour: string;
  size: string;
  inStock: boolean;
}

export function RestockAlert({
  productId,
  productName,
  colour,
  size,
  inStock,
}: RestockAlertProps) {
  const [email, setEmail] = useState('');
  const addEntry = useWaitlistStore((s) => s.addEntry);
  const addToast = useToastStore((s) => s.addToast);

  if (inStock || !colour || !size) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const result = addEntry({
      productId,
      productName,
      colour,
      size,
      email: email.trim(),
    });
    addToast(result.message, result.success ? 'success' : 'error');
    if (result.success) setEmail('');
  };

  return (
    <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-medium text-brand-900">
        {colour} / {size} is currently out of stock
      </p>
      <p className="mt-1 text-xs text-brand-600">
        Join the waitlist and we will email you when it is back.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="flex-1 h-10 px-3 border border-brand-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
          aria-label="Email for restock alert"
        />
        <Button type="submit" size="sm">
          Notify me
        </Button>
      </form>
    </div>
  );
}
