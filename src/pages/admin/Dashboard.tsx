import { Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { formatPrice } from '../../utils/format';
import { Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';

export function AdminDashboard() {
  const stats = useAdminStore((s) => s.getStats());
  const orders = useAdminStore((s) => s.orders);
  const products = useAdminStore((s) => s.products);

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const lowStockProducts = products.filter((p) => p.stock < 40).slice(0, 5);

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
      label: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Pending / processing',
      value: stats.pendingOrders,
      icon: AlertTriangle,
      color: 'bg-amber-100 text-amber-700',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-950">Dashboard</h1>
        <p className="mt-1 text-sm text-brand-500">
          Overview of store performance and activity
        </p>
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
        {/* Recent orders */}
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

        {/* Low stock */}
        <div className="bg-white rounded-lg border border-brand-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100">
            <h2 className="font-semibold text-brand-950">Low stock</h2>
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
        </div>
      </div>
    </div>
  );
}
