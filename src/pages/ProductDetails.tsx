import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, Minus, Plus } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useOpenGraph } from '../hooks/useOpenGraph';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useToastStore } from '../store/toastStore';
import { useRecentlyViewedStore } from '../store/recentlyViewedStore';
import { formatPrice, getDiscountPercent } from '../utils/format';
import { Button } from '../components/common/Button';
import { SizeGuidePanel } from '../components/products/SizeGuide';
import { RestockAlert } from '../components/products/RestockAlert';
import { ShopTheLook } from '../components/products/ShopTheLook';
import { ModelViewer } from '../components/products/ModelViewer';
import { FilamentPicker } from '../components/products/FilamentPicker';
import { PrintTimeEstimate } from '../components/products/PrintTimeEstimate';
import { StickyAddToCart } from '../components/products/StickyAddToCart';
import { ProductJsonLd } from '../components/products/ProductJsonLd';

export function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const products = useAdminStore((s) => s.products);
  const product = products.find((p) => p.slug === slug);

  const [colour, setColour] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [filamentHex, setFilamentHex] = useState('#1a1a1a');
  const [actionsVisible, setActionsVisible] = useState(true);

  const actionsRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const isInWishlist = useWishlistStore((s) =>
    product ? s.isInWishlist(product.id) : false
  );
  const addToast = useToastStore((s) => s.addToast);
  const trackView = useRecentlyViewedStore((s) => s.track);

  useDocumentTitle(
    product?.name ?? 'Product',
    product?.description?.slice(0, 155)
  );

  useOpenGraph({
    title: product?.name ?? 'Product',
    description: product?.description?.slice(0, 200),
    image: product?.images[0],
    type: 'product',
    price: product ? (product.salePrice ?? product.price) : undefined,
    currency: 'USD',
    availability: product
      ? product.stock > 0
        ? 'in stock'
        : 'out of stock'
      : undefined,
  });

  const handleActionsIntersect = useCallback((isIntersecting: boolean) => {
    setActionsVisible((prev) => (prev === isIntersecting ? prev : isIntersecting));
  }, []);

  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) handleActionsIntersect(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product?.id, handleActionsIntersect]);

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

  const isPrint = product.category === 'print3d';
  const colourLabel = isPrint ? 'Finish / colour' : 'Colour';
  const sizeLabel = isPrint ? 'Size / scale' : 'Size';
  const discount = product.salePrice
    ? getDiscountPercent(product.price, product.salePrice)
    : 0;
  const variantInStock = product.stock > 0;

  const handleAddToCart = () => {
    const result = addItem(product, colour, size, qty);
    addToast(result.message, result.success ? 'success' : 'error');
  };

  const handleStickyAddToCart = () => {
    if (!colour || !size) {
      optionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addToast('Please select colour and size to add to cart.', 'info');
      return;
    }
    handleAddToCart();
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

  const handleBuyNow = () => {
    const result = addItem(product, colour, size, qty);
    if (result.success) {
      addToast(result.message, 'success');
      navigate('/checkout');
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 pb-28 lg:pb-10">
      <ProductJsonLd product={product} />

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {isPrint ? (
            <>
              <ModelViewer product={product} filamentHex={filamentHex} />
              <ProductImageGallery images={product.images} alt={product.name} />
            </>
          ) : (
            <ProductImageGallery images={product.images} alt={product.name} />
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
                <span className="text-sm font-medium text-red-600">-{discount}%</span>
              </>
            ) : (
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1 text-sm text-brand-500">
            <span className="text-amber-500">★</span>
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </div>

          <p className="mt-6 text-brand-600 leading-relaxed">{product.description}</p>

          <div className="mt-8" ref={optionsRef}>
            <p className="text-sm font-medium text-brand-900 mb-3">
              {colourLabel}: <span className="font-normal">{colour || 'Select'}</span>
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
              {sizeLabel}: <span className="font-normal">{size || 'Select'}</span>
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

          {isPrint && product.filaments && product.filaments.length > 0 && (
            <div className="mt-6">
              <FilamentPicker
                options={product.filaments}
                value={colour}
                onChange={(name, hex) => {
                  setColour(name);
                  setFilamentHex(hex);
                }}
              />
            </div>
          )}

          {!isPrint && (
            <SizeGuidePanel
              category={product.category === 'print3d' ? 'tshirt' : product.category}
              productId={product.id}
            />
          )}

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
                disabled={product.stock < 1}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <RestockAlert
            productId={product.id}
            productName={product.name}
            colour={colour}
            size={size}
            inStock={variantInStock}
          />

          <PrintTimeEstimate
            specs={product.printSpecs}
            isPrint3d={isPrint}
            stock={product.stock}
          />

          <div ref={actionsRef} className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={!colour || !size || !variantInStock}
            >
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="secondary"
              fullWidth
              onClick={handleBuyNow}
              disabled={!colour || !size || !variantInStock}
            >
              Buy now
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlist}>
              <Heart
                className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current text-red-500' : ''}`}
              />
              {isInWishlist ? 'In Wishlist' : 'Wishlist'}
            </Button>
          </div>
        </div>
      </div>

      <ShopTheLook current={product} products={products} />
      <RecentlyViewed excludeId={product.id} />

      <StickyAddToCart
        product={product}
        colour={colour}
        size={size}
        quantity={qty}
        visible={!actionsVisible}
        inStock={variantInStock}
        onAddToCart={handleStickyAddToCart}
      />
    </div>
  );
}
