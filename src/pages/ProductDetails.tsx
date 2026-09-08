import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useToastStore } from '../store/toastStore';
import { formatPrice, getDiscountPercent } from '../utils/format';
import { Button } from '../components/common/Button';
import { ProductGrid } from '../components/products/ProductGrid';
import { Heart, Minus, Plus } from 'lucide-react';

export function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const products = useAdminStore((s) => s.products);
  const product = products.find((p) => p.slug === slug);

  const [colour, setColour] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const isInWishlist = useWishlistStore((s) =>
    product ? s.isInWishlist(product.id) : false
  );
  const addToast = useToastStore((s) => s.addToast);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-brand-600 underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const discount = product.salePrice
    ? getDiscountPercent(product.price, product.salePrice)
    : 0;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    const result = addItem(product, colour, size, qty);
    addToast(result.message, result.success ? 'success' : 'error');
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      addToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      addToast('Added to wishlist', 'success');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-brand-100 overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square bg-brand-100 overflow-hidden">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-950">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-semibold">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-lg text-brand-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm font-medium text-red-600">
                  -{discount}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1 text-sm text-brand-500">
            <span className="text-amber-500">★</span>
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </div>

          <p className="mt-6 text-brand-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="text-sm font-medium text-brand-900 mb-3">
              Colour: <span className="font-normal">{colour || 'Select'}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colours.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColour(c)}
                  className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                    colour === c
                      ? 'border-brand-900 bg-brand-900 text-white'
                      : 'border-brand-300 hover:border-brand-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-brand-900 mb-3">
              Size: <span className="font-normal">{size || 'Select'}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 text-sm border rounded-md transition-colors ${
                    size === s
                      ? 'border-brand-900 bg-brand-900 text-white'
                      : 'border-brand-300 hover:border-brand-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-brand-900 mb-3">Quantity</p>
            <div className="inline-flex items-center border border-brand-300 rounded-md">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-brand-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="p-3 hover:bg-brand-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-brand-500">{product.stock} in stock</p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={!colour || !size}
            >
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlist}>
              <Heart
                className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current text-red-500' : ''}`}
              />
              {isInWishlist ? 'In Wishlist' : 'Wishlist'}
            </Button>
          </div>

          {(!colour || !size) && (
            <p className="mt-3 text-sm text-brand-500">
              Please select colour and size to add to cart.
            </p>
          )}

          <div className="mt-10 pt-8 border-t border-brand-200 space-y-3 text-sm text-brand-600">
            <p>
              <strong className="text-brand-900">Shipping:</strong> Free on
              orders over $100. 3–7 business days.
            </p>
            <p>
              <strong className="text-brand-900">Returns:</strong> 30-day easy
              returns. Free return shipping.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            You may also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
