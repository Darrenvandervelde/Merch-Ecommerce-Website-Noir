import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { lazyWithRetry } from '../utils/lazyRetry';

const Home = lazyWithRetry(() => import('../pages/Home').then((m) => ({ default: m.Home })));
const Shop = lazyWithRetry(() => import('../pages/Shop').then((m) => ({ default: m.Shop })));
const ProductDetails = lazyWithRetry(() =>
  import('../pages/ProductDetails').then((m) => ({ default: m.ProductDetails }))
);
const Cart = lazyWithRetry(() => import('../pages/Cart').then((m) => ({ default: m.Cart })));
const Checkout = lazyWithRetry(() =>
  import('../pages/Checkout').then((m) => ({ default: m.Checkout }))
);
const OrderConfirmation = lazyWithRetry(() =>
  import('../pages/OrderConfirmation').then((m) => ({ default: m.OrderConfirmation }))
);
const OrderTracking = lazyWithRetry(() =>
  import('../pages/OrderTracking').then((m) => ({ default: m.OrderTracking }))
);
const About = lazyWithRetry(() => import('../pages/About').then((m) => ({ default: m.About })));
const Contact = lazyWithRetry(() =>
  import('../pages/Contact').then((m) => ({ default: m.Contact }))
);
const FAQ = lazyWithRetry(() => import('../pages/FAQ').then((m) => ({ default: m.FAQ })));
const Wishlist = lazyWithRetry(() =>
  import('../pages/Wishlist').then((m) => ({ default: m.Wishlist }))
);
const Account = lazyWithRetry(() =>
  import('../pages/Account').then((m) => ({ default: m.Account }))
);
const Login = lazyWithRetry(() => import('../pages/Login').then((m) => ({ default: m.Login })));
const Register = lazyWithRetry(() =>
  import('../pages/Register').then((m) => ({ default: m.Register }))
);
const ShippingReturns = lazyWithRetry(() =>
  import('../pages/ShippingReturns').then((m) => ({ default: m.ShippingReturns }))
);
const Privacy = lazyWithRetry(() =>
  import('../pages/Privacy').then((m) => ({ default: m.Privacy }))
);
const Terms = lazyWithRetry(() => import('../pages/Terms').then((m) => ({ default: m.Terms })));
const NotFound = lazyWithRetry(() =>
  import('../pages/NotFound').then((m) => ({ default: m.NotFound }))
);
const Compare = lazyWithRetry(() =>
  import('../pages/Compare').then((m) => ({ default: m.Compare }))
);

const AdminDashboard = lazyWithRetry(() =>
  import('../pages/admin/Dashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminProducts = lazyWithRetry(() =>
  import('../pages/admin/Products').then((m) => ({ default: m.AdminProducts }))
);
const AdminOrders = lazyWithRetry(() =>
  import('../pages/admin/Orders').then((m) => ({ default: m.AdminOrders }))
);
const AdminPayments = lazyWithRetry(() =>
  import('../pages/admin/Payments').then((m) => ({ default: m.AdminPayments }))
);
const AdminStockSync = lazyWithRetry(() =>
  import('../pages/admin/StockSync').then((m) => ({ default: m.AdminStockSync }))
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-900" />
    </div>
  );
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

function withAdmin(element: React.ReactNode) {
  return withSuspense(<ProtectedRoute adminOnly>{element}</ProtectedRoute>);
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: 'shop', element: withSuspense(<Shop />) },
      { path: 'product/:slug', element: withSuspense(<ProductDetails />) },
      { path: 'cart', element: withSuspense(<Cart />) },
      { path: 'checkout', element: withSuspense(<Checkout />) },
      { path: 'order-confirmation/:orderId', element: withSuspense(<OrderConfirmation />) },
      { path: 'track', element: withSuspense(<OrderTracking />) },
      { path: 'track/:orderId', element: withSuspense(<OrderTracking />) },
      { path: 'about', element: withSuspense(<About />) },
      { path: 'contact', element: withSuspense(<Contact />) },
      { path: 'faq', element: withSuspense(<FAQ />) },
      { path: 'wishlist', element: withSuspense(<Wishlist />) },
      { path: 'account', element: withSuspense(<Account />) },
      { path: 'login', element: withSuspense(<Login />) },
      { path: 'register', element: withSuspense(<Register />) },
      { path: 'shipping-returns', element: withSuspense(<ShippingReturns />) },
      { path: 'privacy', element: withSuspense(<Privacy />) },
      { path: 'terms', element: withSuspense(<Terms />) },
      { path: 'compare', element: withSuspense(<Compare />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: withAdmin(<AdminDashboard />) },
      { path: 'products', element: withAdmin(<AdminProducts />) },
      { path: 'orders', element: withAdmin(<AdminOrders />) },
      { path: 'payments', element: withAdmin(<AdminPayments />) },
      { path: 'stock', element: withAdmin(<AdminStockSync />) },
    ],
  },
]);
