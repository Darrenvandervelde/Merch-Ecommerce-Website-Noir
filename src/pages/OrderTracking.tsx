import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/common/Button';
import { Check, Package, Truck, MapPin, Circle } from 'lucide-react';
import { cn } from '../utils/cn';

type TrackStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

const STEPS: { key: TrackStatus; label: string; description: string }[] = [
  { key: 'pending', label: 'Order placed', description: 'We received your order' },
  { key: 'processing', label: 'Processing', description: 'Picked and packed in the warehouse' },
  { key: 'shipped', label: 'Shipped', description: 'On the way to you' },
  { key: 'delivered', label: 'Delivered', description: 'Left at your address' },
];

/** Deterministic mock status from order id so demos feel consistent */
function mockStatusFromId(orderId: string): TrackStatus {
  const n = orderId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const idx = n % STEPS.length;
  return STEPS[idx].key;
}

function stepIndex(status: TrackStatus): number {
  return STEPS.findIndex((s) => s.key === status);
}

export function OrderTracking() {
  useDocumentTitle('Track order');
  const { orderId: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(paramId ?? searchParams.get('order') ?? '');
  const [lookup, setLookup] = useState(paramId ?? searchParams.get('order') ?? '');

  const orderId = lookup.trim();
  const status = useMemo(
    () => (orderId ? mockStatusFromId(orderId) : null),
    [orderId]
  );
  const currentIdx = status ? stepIndex(status) : -1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLookup(query.trim());
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">
        Track your order
      </h1>
      <p className="mt-2 text-brand-500">
        Enter the order number from your confirmation email.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. ORD-8K2M9X"
          className="flex-1 h-12 px-4 border border-brand-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
          aria-label="Order number"
        />
        <Button type="submit" size="lg">
          Track
        </Button>
      </form>

      {orderId && status && (
        <div className="mt-12">
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 flex items-center gap-3">
            <Package className="h-5 w-5 text-brand-700 shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-950">
                Order <span className="font-mono">{orderId}</span>
              </p>
              <p className="text-xs text-brand-500 capitalize">
                Status: {status.replace('-', ' ')}
              </p>
            </div>
          </div>

          <ol className="mt-10 space-y-0">
            {STEPS.map((step, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              const Icon =
                step.key === 'shipped'
                  ? Truck
                  : step.key === 'delivered'
                    ? MapPin
                    : step.key === 'processing'
                      ? Package
                      : Check;

              return (
                <li key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2',
                        done
                          ? 'border-brand-900 bg-brand-900 text-white'
                          : 'border-brand-300 bg-white text-brand-400'
                      )}
                    >
                      {done ? (
                        <Icon className="h-4 w-4" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span
                        className={cn(
                          'w-0.5 flex-1 min-h-[2rem]',
                          i < currentIdx ? 'bg-brand-900' : 'bg-brand-200'
                        )}
                      />
                    )}
                  </div>
                  <div className={cn('pb-8', active && 'pt-1')}>
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        done ? 'text-brand-950' : 'text-brand-400'
                      )}
                    >
                      {step.label}
                      {active && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-emerald-600">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-500">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="mt-4 text-xs text-brand-400">
            Demo tracking uses a mocked timeline derived from the order number.
            Connect a carrier API later for live updates.
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link to="/account" className="text-sm text-brand-600 hover:underline">
          View account orders
        </Link>
      </div>
    </div>
  );
}
