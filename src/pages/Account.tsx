import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useWaitlistStore } from '../store/waitlistStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { fetchOrders } from '../api/orders';
import { Button } from '../components/common/Button';
import { formatPrice } from '../utils/format';

export function Account() {
  useDocumentTitle('Account');
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const addToast = useToastStore((s) => s.addToast);
  const waitlist = useWaitlistStore((s) => s.entries);
  const removeWaitlist = useWaitlistStore((s) => s.removeEntry);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) return;
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, isLoggedIn]);

  if (!isLoggedIn() || !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-950">Account</h1>
        <p className="mt-3 text-brand-500">Log in to view your orders.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => navigate('/login')}>Log in</Button>
          <Button variant="outline" onClick={() => navigate('/register')}>
            Register
          </Button>
        </div>
        {waitlist.length > 0 && (
          <div className="mt-10 text-left border border-brand-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold">Restock alerts (guest)</h2>
            <ul className="mt-2 space-y-2 text-sm text-brand-600">
              {waitlist.map((e) => (
                <li key={e.id} className="flex justify-between gap-2">
                  <span>
                    {e.productName} · {e.colour}/{e.size}
                  </span>
                  <button
                    type="button"
                    className="text-xs underline"
                    onClick={() => removeWaitlist(e.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-950">
            Hi, {user.firstName}
          </h1>
          <p className="mt-1 text-brand-500">{user.email}</p>
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="mt-2 inline-block text-sm font-medium text-brand-900 underline"
            >
              Open admin dashboard →
            </Link>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout();
            addToast('Logged out', 'info');
            navigate('/');
          }}
        >
          Log out
        </Button>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-brand-950">Order history</h2>
        {loading && (
          <p className="mt-4 text-sm text-brand-500">Loading orders…</p>
        )}
        {!loading && orders.length === 0 && (
          <p className="mt-4 text-sm text-brand-500">No orders yet.</p>
        )}
        <ul className="mt-4 space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-brand-200 rounded-lg p-4 flex justify-between text-sm"
            >
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-brand-500 capitalize">
                  {order.status} · {order.paymentStatus}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(order.total)}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-brand-950">
          Restock notifications
        </h2>
        {waitlist.length === 0 ? (
          <p className="mt-3 text-sm text-brand-500">
            No active alerts. Join a waitlist on out-of-stock variants.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {waitlist.map((e) => (
              <li
                key={e.id}
                className="border border-brand-200 rounded-lg p-4 flex justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium">{e.productName}</p>
                  <p className="text-brand-500">
                    {e.colour} / {e.size} · {e.email}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs text-brand-500 underline shrink-0"
                  onClick={() => {
                    removeWaitlist(e.id);
                    addToast('Alert removed', 'info');
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
