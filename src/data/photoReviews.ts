import type { PhotoReview } from '../types';

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

/** Curated photo reviews aligned with catalogue product photos. */
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
    photoUrl: pexels(2582937),
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
    photoUrl: pexels(1005058),
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
    photoUrl: pexels(442150),
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
    photoUrl: pexels(788946),
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
    photoUrl: pexels(955859),
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
    photoUrl: pexels(1183266),
  },
];

export function getReviewsForProduct(productId: string): PhotoReview[] {
  return photoReviews.filter((r) => r.productId === productId);
}

export function getAllPhotoReviews(): PhotoReview[] {
  return photoReviews.filter((r) => Boolean(r.photoUrl));
}
