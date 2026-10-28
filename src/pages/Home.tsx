import { Link } from 'react-router-dom';
import { ArrowRight, Box, Layers, Cpu } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/common/Button';

export function Home() {
  useDocumentTitle(
    'Home',
    'Premium streetwear and 3D printed design objects by NOIR.'
  );
  const products = useAdminStore((s) => s.products);

  const apparel = products.filter((p) => p.category !== 'print3d');
  const featured = apparel.filter((p) => p.featured).slice(0, 4);
  const bestsellers = apparel.filter((p) => p.bestseller).slice(0, 4);
  const newArrivals = apparel.filter((p) => p.newArrival).slice(0, 4);
  const printLab = products
    .filter((p) => p.category === 'print3d')
    .slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-950 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh] py-16 lg:py-24">
            <div className="space-y-8">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-brand-400">
                Streetwear + 3D Lab
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Built for the
                <br />
                everyday grind.
              </h1>
              <p className="text-lg text-brand-300 max-w-md leading-relaxed">
                Heavyweight apparel and precision 3D printed objects - one brand,
                two workshops. Same cart. Same checkout.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-brand-950 hover:bg-brand-100"
                  onClick={() => (window.location.href = '/shop?category=tshirt')}
                >
                  Shop Merch
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-400/60 text-emerald-300 hover:bg-emerald-400/10"
                  onClick={() =>
                    (window.location.href = '/shop?category=print3d')
                  }
                >
                  Enter 3D Lab
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] rounded-sm overflow-hidden bg-brand-800">
                <img
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80"
                  alt="NOIR Premium Hoodie"
                  className="h-full w-full object-cover"
                />
              </div>
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
              { title: '3D Lab', desc: 'Printed in-house designs' },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-sm font-semibold text-brand-900">{item.title}</p>
                <p className="mt-1 text-xs text-brand-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured apparel */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-950">
                Featured merch
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

      {/* ========== 3D LAB - dedicated attached section ========== */}
      <section className="relative overflow-hidden bg-[#05070a] text-white">
        {/* Grid / glow background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400">
                NOIR · 3D LAB
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Printed objects.
                <br />
                <span className="text-emerald-400">Designed to last.</span>
              </h2>
              <p className="mt-4 text-brand-400 leading-relaxed">
                Functional and collectible pieces from our print workshop -
                geometric planters, desk tools, and cyber-inspired display art.
                Add them to the same cart as your hoodie.
              </p>
            </div>
            <Link to="/shop?category=print3d">
              <Button
                size="lg"
                className="bg-emerald-500 text-brand-950 hover:bg-emerald-400 border-0"
              >
                Shop all 3D prints
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3 mb-12">
            {[
              { icon: Box, label: 'FDM & precision finishes' },
              { icon: Layers, label: 'Material options per piece' },
              { icon: Cpu, label: 'Ships with apparel orders' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-200"
              >
                <Icon className="h-4 w-4 text-emerald-400" />
                {label}
              </div>
            ))}
          </div>

          {printLab.length > 0 ? (
            <div className="[&_.text-brand-900]:text-white [&_.text-brand-500]:text-brand-400 [&_.text-brand-400]:text-brand-500">
              <ProductGrid products={printLab} />
            </div>
          ) : (
            <p className="text-brand-500">3D products loading…</p>
          )}
        </div>
      </section>

      {/* New apparel */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-950">
                New arrivals
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

      {/* Promo */}
      <section className="bg-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-brand-950">
                Merch + Lab, one order
              </h2>
              <p className="mt-3 text-brand-600 max-w-md">
                Mix hoodies, tees, and 3D prints in a single checkout. Free
                shipping over $100.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => (window.location.href = '/shop')}
              >
                Shop all
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  (window.location.href = '/shop?category=print3d')
                }
              >
                3D Lab only
              </Button>
            </div>
          </div>
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
            Drops, restocks, and new 3D Lab releases.
          </p>
          <form
            className="mt-8 flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
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
