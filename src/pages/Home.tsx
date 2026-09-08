import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/common/Button';

export function Home() {
  const products = useAdminStore((s) => s.products);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-950 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh] py-16 lg:py-24">
            <div className="space-y-8">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-brand-400">
                Premium Streetwear
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Built for the
                <br />
                everyday grind.
              </h1>
              <p className="text-lg text-brand-300 max-w-md leading-relaxed">
                Heavyweight fabrics. Thoughtful details. Designs that last longer
                than trends. Welcome to NOIR.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-brand-950 hover:bg-brand-100"
                  onClick={() => (window.location.href = '/shop?category=tshirt')}
                >
                  Shop T-Shirts
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => (window.location.href = '/shop?category=hoodie')}
                >
                  Shop Hoodies
                </Button>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] rounded-sm overflow-hidden bg-brand-800">
                <img
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80"
                  alt="NOIR Premium Black Hoodie"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-brand-700 rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand benefits */}
      <section className="border-b border-brand-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { title: 'Free Shipping', desc: 'On orders over $100' },
              { title: 'Easy Returns', desc: '30-day return policy' },
              { title: 'Premium Quality', desc: 'Heavyweight fabrics' },
              { title: 'Secure Checkout', desc: 'Protected payments' },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-sm font-semibold text-brand-900">{item.title}</p>
                <p className="mt-1 text-xs text-brand-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-950">
                Featured
              </h2>
              <p className="mt-2 text-brand-500">Hand-picked essentials</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-900 hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* Promo banner */}
      <section className="bg-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-brand-950">
                New Season Drop
              </h2>
              <p className="mt-3 text-brand-600 max-w-md">
                Fresh heavyweights just landed. Limited quantities of our most
                requested colourways.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => (window.location.href = '/shop?sort=newest')}
            >
              Shop New Arrivals
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-950">
                New Arrivals
              </h2>
              <p className="mt-2 text-brand-500">Just dropped</p>
            </div>
            <Link
              to="/shop?sort=newest"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-900 hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 lg:py-24 bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-950">
                Bestsellers
              </h2>
              <p className="mt-2 text-brand-500">What everyone is wearing</p>
            </div>
            <Link
              to="/shop?sort=best-selling"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-900 hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={bestsellers} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24 border-t border-brand-200">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-brand-950">
            Stay in the loop
          </h2>
          <p className="mt-3 text-brand-500">
            Be the first to know about new drops, restocks, and exclusive offers.
          </p>
          <form
            className="mt-8 flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              // In production: call newsletter API
              alert('Thanks for subscribing! (demo)');
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 border border-brand-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
              aria-label="Email for newsletter"
            />
            <Button type="submit" size="lg">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-brand-400">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
