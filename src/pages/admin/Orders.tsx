import { useAdminStore, type OrderStatus } from '../../store/adminStore';
import { useToastStore } from '../../store/toastStore';
import { formatPrice } from '../../utils/format';

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

const FLOW: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
];

const statusColor: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-brand-100 text-brand-700',
};

function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled' || status === 'refunded') {
    return (
      <p className="text-xs text-red-600 font-medium capitalize">{status}</p>
    );
  }
  const idx = FLOW.indexOf(status);
  return (
    <ol className="flex flex-wrap gap-1.5" aria-label={`Status: ${status}`}>
      {FLOW.map((step, i) => {
        const done = i <= idx;
        return (
          <li
            key={step}
            className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
              done
                ? 'bg-brand-900 text-white'
                : 'bg-brand-100 text-brand-400'
            }`}
          >
            {step}
          </li>
        );
      })}
    </ol>
  );
}

export function AdminOrders() {
  const orders = useAdminStore((s) => s.orders);
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus);
  const addToast = useToastStore((s) => s.addToast);

  const sorted = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    addToast(`Order status → ${status}`, 'success');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-950">Orders</h1>
        <p className="mt-1 text-sm text-brand-500">
          View and update order fulfilment status
        </p>
      </div>

      <div className="space-y-4">
        {sorted.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border border-brand-200 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-100">
              <div>
                <p className="font-semibold text-brand-950">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-brand-500">
                  {order.email} ·{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <StatusTimeline status={order.status} />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    statusColor[order.status]
                  }`}
                >
                  {order.status}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.paymentStatus}
                </span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatus(order.id, e.target.value as OrderStatus)
                  }
                  className="h-9 px-2 border border-brand-300 rounded-md text-sm"
                  aria-label={`Update status for ${order.orderNumber}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-5 py-4 grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-brand-900 mb-2">Items</p>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={`${item.productId}-${item.size}-${item.colour}`}
                      className="flex justify-between text-brand-600"
                    >
                      <span>
                        {item.name} ({item.colour}/{item.size}) ×{' '}
                        {item.quantity}
                      </span>
                      <span>
                        {formatPrice(
                          (item.salePrice ?? item.price) * item.quantity
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-brand-900 mb-2">Shipping</p>
                <p className="text-brand-600">
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                  <br />
                  {order.shippingAddress.address1}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="mt-3 font-semibold text-brand-950">
                  Total: {formatPrice(order.total)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
