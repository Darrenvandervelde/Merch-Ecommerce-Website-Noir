import { useAdminStore } from '../../store/adminStore';
import { useToastStore } from '../../store/toastStore';
import { formatPrice } from '../../utils/format';

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

const paymentOptions: PaymentStatus[] = [
  'pending',
  'paid',
  'failed',
  'refunded',
];

export function AdminPayments() {
  const orders = useAdminStore((s) => s.orders);
  const updatePaymentStatus = useAdminStore((s) => s.updatePaymentStatus);
  const addToast = useToastStore((s) => s.addToast);

  const sorted = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totals = {
    paid: orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((s, o) => s + o.total, 0),
    pending: orders
      .filter((o) => o.paymentStatus === 'pending')
      .reduce((s, o) => s + o.total, 0),
    refunded: orders
      .filter((o) => o.paymentStatus === 'refunded')
      .reduce((s, o) => s + o.total, 0),
  };

  const handlePayment = (id: string, status: PaymentStatus) => {
    updatePaymentStatus(id, status);
    addToast(`Payment status → ${status}`, 'success');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-950">Payments</h1>
        <p className="mt-1 text-sm text-brand-500">
          Track payment status across orders
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-brand-200 p-5">
          <p className="text-sm text-brand-500">Paid</p>
          <p className="mt-1 text-xl font-bold text-green-700">
            {formatPrice(totals.paid)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-brand-200 p-5">
          <p className="text-sm text-brand-500">Pending</p>
          <p className="mt-1 text-xl font-bold text-amber-700">
            {formatPrice(totals.pending)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-brand-200 p-5">
          <p className="text-sm text-brand-500">Refunded</p>
          <p className="mt-1 text-xl font-bold text-brand-700">
            {formatPrice(totals.refunded)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-brand-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-brand-50 border-b border-brand-200 text-brand-600">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {sorted.map((order) => (
              <tr key={order.id} className="hover:bg-brand-50/50">
                <td className="px-4 py-3 font-medium text-brand-900">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3 text-brand-600">{order.email}</td>
                <td className="px-4 py-3 text-brand-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : order.paymentStatus === 'refunded'
                            ? 'bg-brand-100 text-brand-700'
                            : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      handlePayment(
                        order.id,
                        e.target.value as PaymentStatus
                      )
                    }
                    className="h-9 px-2 border border-brand-300 rounded-md text-sm"
                  >
                    {paymentOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-brand-400">
        In production, payment status would be driven by Stripe webhooks. This
        UI lets you simulate and manage states for development.
      </p>
    </div>
  );
}
