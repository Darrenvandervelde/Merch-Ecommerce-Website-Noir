import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useToastStore } from '../store/toastStore';
import { createOrder } from '../api/orders';
import {
  fetchPaymentConfig,
  initializePaystackPayment,
  getStoreCurrency,
} from '../api/payments';
import { formatPrice } from '../utils/format';
import { Button } from '../components/common/Button';
import { checkApiHealth } from '../api/client';

const schema = z.object({
  email: z.string().email('Valid email required'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  address1: z.string().min(1, 'Required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  postalCode: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  phone: z.string().optional(),
  delivery: z.enum(['standard', 'express']),
  giftWrap: z.boolean().optional(),
  giftNote: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function Checkout() {
  useDocumentTitle('Checkout');
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, item) => {
      const unit = item.salePrice ?? item.price;
      return sum + unit * item.quantity;
    }, 0)
  );
  const shipping = subtotal >= 100 ? 0 : 8;
  const currency = getStoreCurrency();
  const taxRate = currency === 'ZAR' ? 0.15 : 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      delivery: 'standard',
      country: 'South Africa',
    },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Button className="mt-6" onClick={() => navigate('/shop')}>
          Go to Shop
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    try {
      const health = await checkApiHealth();
      const payConfig = health.online ? await fetchPaymentConfig() : null;
      const usePaystack = Boolean(health.online && payConfig?.configured);

      const order = await createOrder({
        email: data.email,
        items: items.map((item) => ({
          productId: item.productId,
          colour: item.colour,
          size: item.size,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.phone,
        },
        deliveryMethod: data.delivery,
        currency,
        // Without Paystack keys, complete as demo paid order
        simulatePaid: !usePaystack,
      });

      if (usePaystack) {
        const callbackUrl = `${window.location.origin}/order-confirmation/${order.orderNumber}`;
        const payment = await initializePaystackPayment(order.id, callbackUrl);
        clearCart();
        addToast('Redirecting to Paystack…', 'info');
        window.location.href = payment.authorizationUrl;
        return;
      }

      clearCart();
      addToast(
        health.online
          ? 'Order placed (demo payment — configure Paystack for live cards)'
          : 'Order placed in demo mode (API offline)',
        'success'
      );
      navigate(`/order-confirmation/${order.orderNumber || order.id}`, {
        state: {
          ...data,
          total: order.total,
          items: order.items,
          email: data.email,
          paymentStatus: order.paymentStatus,
        },
      });
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Checkout failed', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Checkout</h1>
      <p className="text-sm text-brand-500 mb-8">
        Guest checkout — no account required. Payments via Paystack when
        configured (ZAR).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-lg font-semibold mb-1">Contact information</h2>
            <p className="text-xs text-brand-500 mb-4">
              We will use this email for order and payment updates.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First name</label>
                <input
                  {...register('firstName')}
                  className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last name</label>
                <input
                  {...register('lastName')}
                  className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  {...register('address1')}
                  className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
                />
                {errors.address1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.address1.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  {...register('address2')}
                  className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  {...register('city')}
                  className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Province / State
                </label>
                <input
                  {...register('state')}
                  placeholder="e.g. Gauteng"
                  className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal code</label>
                <input
                  {...register('postalCode')}
                  className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  {...register('country')}
                  className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Phone (optional)
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+27 …"
                  className="w-full h-11 px-3 border border-brand-300 rounded-md text-sm focus:ring-2 focus:ring-brand-900 focus:outline-none"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Delivery method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-brand-300 rounded-md cursor-pointer has-[:checked]:border-brand-900 has-[:checked]:bg-brand-50">
                <input type="radio" value="standard" {...register('delivery')} />
                <div>
                  <p className="font-medium">Standard (3–7 days)</p>
                  <p className="text-sm text-brand-500">
                    {shipping === 0 ? 'Free' : formatPrice(8)}
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-brand-300 rounded-md cursor-pointer has-[:checked]:border-brand-900 has-[:checked]:bg-brand-50">
                <input type="radio" value="express" {...register('delivery')} />
                <div>
                  <p className="font-medium">Express (1–2 days)</p>
                  <p className="text-sm text-brand-500">{formatPrice(18)}</p>
                </div>
              </label>
            </div>
          </section>

          <section className="p-4 bg-brand-50 rounded-md text-sm text-brand-600">
            <p className="font-medium text-brand-900">Payment</p>
            <p className="mt-1">
              Live card payments use <strong>Paystack</strong> (recommended for
              South Africa). Set{' '}
              <code className="text-xs bg-brand-200 px-1 rounded">
                PAYSTACK_SECRET_KEY
              </code>{' '}
              on the API and{' '}
              <code className="text-xs bg-brand-200 px-1 rounded">
                VITE_PAYSTACK_PUBLIC_KEY
              </code>{' '}
              on the frontend. Without keys, checkout completes in demo mode.
            </p>
          </section>
        </div>

        <div>
          <div className="bg-brand-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.colour}-${item.size}`}
                  className="flex justify-between"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 text-sm border-t border-brand-200 pt-4">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{currency === 'ZAR' ? 'VAT (15%)' : 'Tax'}</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('giftWrap')}
                  className="rounded border-brand-300"
                />
                Eco gift packaging
              </label>
              <input
                type="text"
                placeholder="Gift note (optional)"
                {...register('giftNote')}
                className="w-full h-10 px-3 border border-brand-300 rounded-md text-sm"
              />
            </div>
            <Button
              type="submit"
              fullWidth
              size="lg"
              className="mt-6"
              isLoading={isSubmitting}
            >
              Pay & place order
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
