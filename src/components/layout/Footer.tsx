import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
  Shop: [
    { to: '/shop', label: 'All Products' },
    { to: '/shop?category=tshirt', label: 'T-Shirts' },
    { to: '/shop?category=hoodie', label: 'Hoodies' },
    { to: '/shop?category=print3d', label: '3D Lab' },
    { to: '/compare', label: 'Compare' },
    { to: '/shop?sort=newest', label: 'New Arrivals' },
  ],
  Help: [
    { to: '/faq', label: 'FAQ' },
    { to: '/shipping-returns', label: 'Shipping & Returns' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/sizing', label: 'Size Guide' },
  ],
  Company: [
    { to: '/about', label: 'About NOIR' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms & Conditions' },
    { to: '/admin', label: 'Admin' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-extrabold tracking-tighter text-white">
              NOIR
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              Premium streetwear built for the everyday. Heavyweight fabrics,
              thoughtful details, and designs that last.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-brand-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} NOIR. All rights reserved.</p>
          <p className="text-brand-500">
            Designed for real life. Built to last.
          </p>
        </div>
      </div>
    </footer>
  );
}
