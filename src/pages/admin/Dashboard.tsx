import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ShoppingCart, DollarSign, AlertTriangle, Bell } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useWaitlistStore } from '../../store/waitlistStore';
import { formatPrice } from '../../utils/format';

export function AdminDashboard() {
  const orders = useAdminStore((s) => s.orders);
  const products = useAdminStore((s) => s.products);
  const threshold = useAdminStore((s) => s.lowStockThreshold);
  const setLowStockThreshold = useAdminStore((s) => s.setLowStockThreshold);
  const waitlistEntries = useWaitlistStore((s) => s.entries);

  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      revenue: paidOrders.reduce((sum, o) => sum + o.total, 0),
      pendingOrders: orders.filter(
        (o) => o.status === 'pending' || o.status === 'processing'
      ).length,
      lowStock: products.filter((p) => p.stock < threshold).length,
      waitlist: waitlistEntries.length,
    };
  }, [orders, products, threshold, waitlistEntries]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [orders]
  );

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((p) => p.stock < threshold)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6),
    [products, threshold]
  );

  const cards = [
    {
      label: 'Revenue (paid)',
      value: formatPrice(stats.revenue),
      icon: DollarSign,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Total orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Low stock',
      value: stats.lowStock,
      icon: AlertTriangle,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Restock waitlist',
      value: stats.waitlist,
      icon: Bell,
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Dashboard</h1>
          <p className="mt-1 text-sm text-brand-500">
            Overview of store performance and activity
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="threshold" className="text-brand-600">
            Low-stock threshold
          </label>
          <input
            id="threshold"
            type="number"
            min={1}
            value={threshold}
            onChange={(e) => setLowStockThreshold(Number(e.target.value) || 1)}
            className="w-20 h-9 px-2 border border-brand-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg border border-brand-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-brand-500">{card.label}</p>
              <div className={`p-2 rounded-md ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-brand-950">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-brand-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100">
            <h2 className="font-semibold text-brand-950">Recent orders</h2>
            <Link
              to="/admin/orders"
              className="text-sm text-brand-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-brand-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="px-5 py-3 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-brand-900">{order.orderNumber}</p>
                  <p className="text-brand-500">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.total)}</p>
                  <p className="text-xs capitalize text-brand-500">
                    {order.status} · {order.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-brand-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100">
            <h2 className="font-semibold text-brand-950">
              Low stock (under {threshold})
            </h2>
            <Link
              to="/admin/products"
              className="text-sm text-brand-600 hover:underline"
            >
              Manage products
            </Link>
          </div>
          <div className="divide-y divide-brand-100">
            {lowStockProducts.length === 0 ? (
              <p className="px-5 py-6 text-sm text-brand-500">
                No low-stock products
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="px-5 py-3 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-10 h-12 object-cover rounded bg-brand-100"
                    />
                    <div>
                      <p className="font-medium text-brand-900">{p.name}</p>
                      <p className="text-brand-500 capitalize">{p.category}</p>
                    </div>
                  </div>
                  <span
                    className={`font-medium ${
                      p.stock < 20 ? 'text-red-600' : 'text-amber-600'
                    }`}
                  >
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>

          {waitlistEntries.length > 0 && (
            <div className="px-5 py-4 border-t border-brand-100">
              <p className="text-xs font-medium text-brand-500 uppercase tracking-wider mb-2">
                Waitlist demand
              </p>
              <ul className="space-y-1 text-sm text-brand-600">
                {waitlistEntries.slice(0, 5).map((e) => (
                  <li key={e.id}>
                    {e.productName} — {e.colour}/{e.size} ({e.email})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
