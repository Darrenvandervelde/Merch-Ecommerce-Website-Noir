import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

const faqs = [
  {
    category: 'Shipping',
    items: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping is 3-7 business days. Express is 1-2 business days within the continental US.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes - free standard shipping on all orders over $100.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and with original tags.',
      },
      {
        q: 'How do I exchange for a different size?',
        a: 'Start a return for the original item and place a new order for the correct size. We’ll refund the original once received.',
      },
    ],
  },
  {
    category: 'Sizing',
    items: [
      {
        q: 'How do your sizes run?',
        a: 'Our T-shirts and hoodies generally run true to size with a relaxed streetwear fit. Check the size guide on each product page for exact measurements.',
      },
    ],
  },
  {
    category: 'Payments & Orders',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards, Apple Pay, Google Pay, and Shop Pay via Stripe.',
      },
      {
        q: 'How can I track my order?',
        a: 'You’ll receive a tracking link by email once your order ships. You can also view order status in your account.',
      },
    ],
  },
  {
    category: 'Product Care',
    items: [
      {
        q: 'How should I wash my hoodies and tees?',
        a: 'Machine wash cold, inside out. Hang dry or tumble low. Avoid bleach and high heat to preserve colour and fabric quality.',
      },
    ],
  },
];

export function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">
        Frequently Asked Questions
      </h1>

      <div className="mt-12 space-y-10">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-semibold text-brand-900 mb-4">
              {section.category}
            </h2>
            <div className="space-y-2">
              {section.items.map((item) => {
                const id = `${section.category}-${item.q}`;
                const isOpen = open === id;
                return (
                  <div key={id} className="border border-brand-200 rounded-md">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : id)}
                      className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium"
                      aria-expanded={isOpen}
                    >
                      {item.q}
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-brand-600 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
