import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useToastStore } from '../store/toastStore';
import { formatPrice } from '../utils/format';
import { Button } from '../components/common/Button';
import { FreeShippingBar, FREE_SHIPPING_THRESHOLD } from '../components/cart/FreeShippingBar';
import { Minus, Plus, Trash2 } from 'lucide-react';

export function Cart() {
  useDocumentTitle('Cart');
  const addToast = useToastStore((s) => s.addToast);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, item) => {
      const unit = item.salePrice ?? item.price;
      return sum + unit * item.quantity;
    }, 0)
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 8;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Looks like you haven’t added anything yet. Explore streetwear essentials and 3D Lab prints — free shipping over $100."
        actionLabel="Shop the collection"
        actionTo="/shop"
      >
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
          <Link
            to="/shop?category=tshirt"
            className="rounded-full border border-brand-200 px-3 py-1.5 text-brand-600 hover:border-brand-400"
          >
            T-Shirts
          </Link>
          <Link
            to="/shop?category=hoodie"
            className="rounded-full border border-brand-200 px-3 py-1.5 text-brand-600 hover:border-brand-400"
          >
            Hoodies
          </Link>
          <Link
            to="/shop?category=print3d"
            className="rounded-full border border-brand-200 px-3 py-1.5 text-brand-600 hover:border-brand-400"
          >
            3D Lab
          </Link>
        </div>
      </EmptyState>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950 mb-10">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <FreeShippingBar subtotal={subtotal} className="mb-2" />

          {items.map((item) => (
            <div
              key={`${item.productId}-${item.colour}-${item.size}`}
              className="flex gap-4 border-b border-brand-200 pb-6"
            >
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-32 object-cover bg-brand-100"
                />
              </Link>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-medium text-brand-900 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-brand-500">
                      {item.colour} / {item.size}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center border border-brand-300 rounded-md">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.colour,
                          item.size,
                          item.quantity - 1
                        )
                      }
                      className="p-2 hover:bg-brand-50"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.colour,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      className="p-2 hover:bg-brand-50"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.productId, item.colour, item.size);
                      addToast('Item removed from cart', 'info');
                    }}
                    className="text-brand-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-brand-500 hover:text-brand-900 underline"
          >
            Clear cart
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-brand-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-brand-950">Order Summary</h2>

            <FreeShippingBar subtotal={subtotal} className="mt-4" />

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-600">Subtotal</dt>
                <dd className="font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-600">Shipping</dt>
                <dd className="font-medium">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-600">Tax (est.)</dt>
                <dd className="font-medium">{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-brand-200 pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Button
              fullWidth
              size="lg"
              className="mt-6"
              onClick={() => (window.location.href = '/checkout')}
            >
              Checkout
            </Button>

            <Link
              to="/shop"
              className="mt-4 block text-center text-sm text-brand-600 hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
