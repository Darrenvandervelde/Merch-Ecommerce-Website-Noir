import type { PhotoReview } from '../types';

/** Demo photo reviews for 3D Lab + apparel */
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
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80',
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
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
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
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
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
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80',
  },
];

export function getReviewsForProduct(productId: string): PhotoReview[] {
  return photoReviews.filter((r) => r.productId === productId);
}
