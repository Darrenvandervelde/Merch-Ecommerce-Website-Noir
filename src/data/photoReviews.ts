import type { PhotoReview } from '../types';

/** Curated photo reviews for 3D Lab + apparel (aligned with catalogue imagery). */
export const photoReviews: PhotoReview[] = [
  {
    id: 'r1',
    productId: '3d-001',
    author: 'Alex M.',
    rating: 5,
    title: 'Looks insane on my desk',
    body: 'Silk gold filament catches the light perfectly. Solid base, no wobble.',
    date: '2026-08-12',
    verified: true,
    photoUrl:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'r2',
    productId: '3d-003',
    author: 'Sam K.',
    rating: 5,
    title: 'Perfect for my succulent',
    body: 'Drainage works. Sand colour matches our shelves.',
    date: '2026-07-28',
    verified: true,
    photoUrl:
      'https://images.unsplash.com/photo-1485955900006-10f4d32477dc?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'r3',
    productId: '3d-002',
    author: 'Jordan L.',
    rating: 4,
    title: 'Finally tamed the cable mess',
    body: 'PETG feels tough. Wish it came in a wider pack.',
    date: '2026-09-01',
    verified: true,
    photoUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'r4',
    productId: '3d-005',
    author: 'Riley P.',
    rating: 5,
    title: 'Orbit stand is clean',
    body: 'Holds my phone in portrait for video calls. Cable pass-through is clutch.',
    date: '2026-08-20',
    verified: true,
    photoUrl:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'r5',
    productId: 'ts-001',
    author: 'Chris D.',
    rating: 5,
    title: 'Heavyweight as promised',
    body: 'True to size. Black doesn’t fade after a few washes.',
    date: '2026-09-05',
    verified: true,
    photoUrl:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'r6',
    productId: 'hd-001',
    author: 'Morgan T.',
    rating: 5,
    title: 'Daily driver hoodie',
    body: 'Soft inside, holds shape. Wearing this every other day.',
    date: '2026-08-30',
    verified: true,
    photoUrl:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=85',
  },
];

export function getReviewsForProduct(productId: string): PhotoReview[] {
  return photoReviews.filter((r) => r.productId === productId);
}

/** All reviews with photos — for a global UGC strip if needed */
export function getAllPhotoReviews(): PhotoReview[] {
  return photoReviews.filter((r) => Boolean(r.photoUrl));
}
