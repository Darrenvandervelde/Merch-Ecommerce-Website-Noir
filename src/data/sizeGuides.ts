import type { ProductCategory } from '../types';

export interface SizeRow {
  size: string;
  chest: string;
  length: string;
  sleeve?: string;
}

export interface SizeGuide {
  category: ProductCategory;
  fitNote: string;
  /** How-to-measure steps shown in the modal */
  measureTips: string[];
  /** Optional illustration URL */
  mediaUrl?: string;
  rows: SizeRow[];
}

export const sizeGuides: Record<ProductCategory, SizeGuide> = {
  tshirt: {
    category: 'tshirt',
    fitNote:
      'Relaxed streetwear fit. True to size for a regular look; size up for oversized.',
    measureTips: [
      'Chest: measure under the arms around the fullest part of the chest.',
      'Length: from the highest point of the shoulder to the bottom hem.',
      'Sleeve: from the shoulder seam to the cuff edge.',
      'Compare to a tee you already love — lay it flat and measure across.',
    ],
    mediaUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    rows: [
      { size: 'S', chest: '36–38"', length: '27"', sleeve: '8"' },
      { size: 'M', chest: '38–40"', length: '28"', sleeve: '8.5"' },
      { size: 'L', chest: '40–42"', length: '29"', sleeve: '9"' },
      { size: 'XL', chest: '42–44"', length: '30"', sleeve: '9.5"' },
      { size: 'XXL', chest: '44–46"', length: '31"', sleeve: '10"' },
    ],
  },
  hoodie: {
    category: 'hoodie',
    fitNote:
      'Heavyweight, slightly oversized. Most customers stick to their usual size. Size down for a closer fit.',
    measureTips: [
      'Chest: around the fullest part, under the arms.',
      'Length: high point of shoulder to hem.',
      'Sleeve: shoulder seam to cuff (include rib).',
      'Hoodies run roomy — if between sizes, size down for a cleaner silhouette.',
    ],
    mediaUrl:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    rows: [
      { size: 'S', chest: '40–42"', length: '26"', sleeve: '24"' },
      { size: 'M', chest: '42–44"', length: '27"', sleeve: '24.5"' },
      { size: 'L', chest: '44–46"', length: '28"', sleeve: '25"' },
      { size: 'XL', chest: '46–48"', length: '29"', sleeve: '25.5"' },
      { size: 'XXL', chest: '48–50"', length: '30"', sleeve: '26"' },
    ],
  },
  print3d: {
    category: 'print3d',
    fitNote: 'Dimensions vary by 3D model design — see product print specs.',
    measureTips: [
      'Check product dimensions (mm) on the product page.',
      'Scale options change overall size, not material.',
    ],
    rows: [{ size: 'Standard', chest: 'N/A', length: 'N/A', sleeve: 'N/A' }],
  },
};

export type FitVote = 'small' | 'true' | 'large';

export interface FitStats {
  small: number;
  true: number;
  large: number;
}
