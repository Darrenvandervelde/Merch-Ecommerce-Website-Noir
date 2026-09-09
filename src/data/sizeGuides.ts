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
  rows: SizeRow[];
}

export const sizeGuides: Record<ProductCategory, SizeGuide> = {
  tshirt: {
    category: 'tshirt',
    fitNote:
      'Relaxed streetwear fit. True to size for a regular look; size up for oversized.',
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
    rows: [
      { size: 'S', chest: '40–42"', length: '26"', sleeve: '24"' },
      { size: 'M', chest: '42–44"', length: '27"', sleeve: '24.5"' },
      { size: 'L', chest: '44–46"', length: '28"', sleeve: '25"' },
      { size: 'XL', chest: '46–48"', length: '29"', sleeve: '25.5"' },
      { size: 'XXL', chest: '48–50"', length: '30"', sleeve: '26"' },
    ],
  },
  print3d: {
    category: "print3d",
    fitNote: "Dimensions vary by 3D model design.",
    rows: [
      { size: "Standard", chest: "N/A", length: "N/A", sleeve: "N/A" }
    ]
  }
};

export type FitVote = 'small' | 'true' | 'large';

export interface FitStats {
  small: number;
  true: number;
  large: number;
}
