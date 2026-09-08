import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';

const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })));
const Shop = lazy(() => import('../pages/Shop').then((m) => ({ default: m.Shop })));
const ProductDetails = lazy(() => import('../pages/ProductDetails').then((m) => ({ default: m.ProductDetails })));
const Cart = lazy(() => import('../pages/Cart').then((m) => ({ default: m.Cart })));
const Checkout = lazy(() => import('../pages/Checkout').then((m) => ({ default: m.Checkout })));
const OrderConfirmation = lazy(() => import('../pages/OrderConfirmation').then((m) => ({ default: m.OrderConfirmation })));
const About = lazy(() => import('../pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('../pages/Contact').then((m) => ({ default: m.Contact })));
const FAQ = lazy(() => import('../pages/FAQ').then((m) => ({ default: m.FAQ })));
const Wishlist = lazy(() => import('../pages/Wishlist').then((m) => ({ default: m.Wishlist })));
const Account = lazy(() => import('../pages/Account').then((m) => ({ default: m.Account })));
const ShippingReturns = lazy(() => import('../pages/ShippingReturns').then((m) => ({ default: m.ShippingReturns })));
const Privacy = lazy(() => import('../pages/Privacy').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('../pages/Terms').then((m) => ({ default: m.Terms })));
const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFound })));

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('../pages/admin/Products').then((m) => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import('../pages/admin/Orders').then((m) => ({ default: m.AdminOrders })));
const AdminPayments = lazy(() => import('../pages/admin/Payments').then((m) => ({ default: m.AdminPayments })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-900" />
    </div>
  );
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
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
      { path: 'about', element: withSuspense(<About />) },
      { path: 'contact', element: withSuspense(<Contact />) },
      { path: 'faq', element: withSuspense(<FAQ />) },
      { path: 'wishlist', element: withSuspense(<Wishlist />) },
      { path: 'account', element: withSuspense(<Account />) },
      { path: 'shipping-returns', element: withSuspense(<ShippingReturns />) },
      { path: 'privacy', element: withSuspense(<Privacy />) },
      { path: 'terms', element: withSuspense(<Terms />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: withSuspense(<AdminDashboard />) },
      { path: 'products', element: withSuspense(<AdminProducts />) },
      { path: 'orders', element: withSuspense(<AdminOrders />) },
      { path: 'payments', element: withSuspense(<AdminPayments />) },
    ],
  },
]);
