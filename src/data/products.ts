import type { Product } from '../types';

/**
 * Realistic mock product catalogue.
 * In production this would come from a backend API / CMS.
 * Prices are in USD. Images use Unsplash (replace with your CDN later).
 */
export const products: Product[] = [
  // ==================== T-SHIRTS ====================
  {
    id: 'ts-001',
    name: 'Essential Black Tee',
    slug: 'essential-black-tee',
    category: 'tshirt',
    description:
      'Our signature heavyweight cotton tee. Soft hand-feel, reinforced seams, and a relaxed streetwear fit. Perfect everyday essential that only gets better with wear.',
    price: 38,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    ],
    colours: ['Black', 'White', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 120,
    rating: 4.8,
    reviewCount: 214,
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    id: 'ts-002',
    name: 'Classic White Tee',
    slug: 'classic-white-tee',
    category: 'tshirt',
    description:
      'Crisp white organic cotton tee with a clean crew neck and slightly boxy cut. Minimal branding, maximum quality. The foundation of every wardrobe.',
    price: 36,
    salePrice: 28,
    images: [
      'https://images.unsplash.com/photo-1523381210783-3a18c4f1d2a3?w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    ],
    colours: ['White', 'Off-White'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 85,
    rating: 4.7,
    reviewCount: 189,
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    id: 'ts-003',
    name: 'Oversized Graphic Tee – Night City',
    slug: 'oversized-graphic-tee-night-city',
    category: 'tshirt',
    description:
      'Heavy 240gsm cotton with a large back print inspired by neon nights. Drop shoulders and extended length for that true oversized silhouette.',
    price: 48,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    ],
    colours: ['Black', 'Navy'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 64,
    rating: 4.9,
    reviewCount: 97,
    featured: true,
    bestseller: false,
    newArrival: true,
  },
  {
    id: 'ts-004',
    name: 'Vintage Wash Tee – Stone',
    slug: 'vintage-wash-tee-stone',
    category: 'tshirt',
    description:
      'Enzyme-washed for a lived-in feel from day one. Soft faded colour and subtle texture. A modern take on the classic vintage tee.',
    price: 42,
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80',
    ],
    colours: ['Stone', 'Sage', 'Washed Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 48,
    rating: 4.6,
    reviewCount: 73,
    featured: false,
    bestseller: false,
    newArrival: true,
  },
  {
    id: 'ts-005',
    name: 'Longline Pocket Tee',
    slug: 'longline-pocket-tee',
    category: 'tshirt',
    description:
      'Extended length with a single chest pocket. Clean lines, premium cotton, and a slightly structured fit that works under jackets or alone.',
    price: 44,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
    ],
    colours: ['Black', 'Olive', 'Cream'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 56,
    rating: 4.5,
    reviewCount: 41,
    featured: false,
    bestseller: false,
    newArrival: false,
  },
  {
    id: 'ts-006',
    name: 'Striped Essential Tee',
    slug: 'striped-essential-tee',
    category: 'tshirt',
    description:
      'Horizontal stripe pattern on mid-weight cotton. Breathable, versatile, and built for everyday rotation.',
    price: 40,
    salePrice: 32,
    images: [
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
    ],
    colours: ['Navy/White', 'Black/White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 72,
    rating: 4.4,
    reviewCount: 58,
    featured: false,
    bestseller: false,
    newArrival: false,
  },
  {
    id: 'ts-007',
    name: 'Heavyweight Logo Tee',
    slug: 'heavyweight-logo-tee',
    category: 'tshirt',
    description:
      'Our bold logo printed on ultra-heavy 280gsm cotton. Structured shoulders and a boxy cut that holds its shape wash after wash.',
    price: 52,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    ],
    colours: ['Black', 'White', 'Forest'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 39,
    rating: 4.8,
    reviewCount: 112,
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    id: 'ts-008',
    name: 'Relaxed Fit Tee – Sand',
    slug: 'relaxed-fit-tee-sand',
    category: 'tshirt',
    description:
      'Soft garment-dyed cotton in a warm sand tone. Relaxed through the body with a slightly curved hem. Effortless summer staple.',
    price: 39,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    ],
    colours: ['Sand', 'Clay', 'Dust'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 67,
    rating: 4.7,
    reviewCount: 86,
    featured: false,
    bestseller: false,
    newArrival: true,
  },

  // ==================== HOODIES ====================
  {
    id: 'hd-001',
    name: 'Premium Black Hoodie',
    slug: 'premium-black-hoodie',
    category: 'hoodie',
    description:
      'Our flagship heavyweight hoodie. 400gsm French terry, brushed interior, double-layered hood, and metal aglets. Built for cold days and late nights.',
    price: 98,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      'https://images.unsplash.com/photo-1578768079052-aa76e52b5d8d?w=800&q=80',
    ],
    colours: ['Black', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 94,
    rating: 4.9,
    reviewCount: 312,
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    id: 'hd-002',
    name: 'Oversized Essential Hoodie',
    slug: 'oversized-essential-hoodie',
    category: 'hoodie',
    description:
      'True oversized fit with dropped shoulders and an extended body. Soft brushed fleece, kangaroo pocket, and clean minimal branding.',
    price: 88,
    salePrice: 72,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    ],
    colours: ['Heather Grey', 'Black', 'Navy'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 78,
    rating: 4.8,
    reviewCount: 201,
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    id: 'hd-003',
    name: 'Zip-Up Tech Hoodie',
    slug: 'zip-up-tech-hoodie',
    category: 'hoodie',
    description:
      'Full-zip design with technical stretch fabric. Water-resistant finish, hidden zip pockets, and a modern athletic silhouette.',
    price: 110,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    ],
    colours: ['Black', 'Olive', 'Slate'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 45,
    rating: 4.7,
    reviewCount: 67,
    featured: false,
    bestseller: false,
    newArrival: true,
  },
  {
    id: 'hd-004',
    name: 'Vintage Wash Hoodie – Faded Black',
    slug: 'vintage-wash-hoodie-faded-black',
    category: 'hoodie',
    description:
      'Garment-dyed and washed for a soft, lived-in look. Slightly cropped body and wide sleeves. The kind of hoodie that feels like an old favourite from day one.',
    price: 92,
    images: [
      'https://images.unsplash.com/photo-1578768079052-aa76e52b5d8d?w=800&q=80',
    ],
    colours: ['Faded Black', 'Washed Navy', 'Stone'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 53,
    rating: 4.6,
    reviewCount: 89,
    featured: true,
    bestseller: false,
    newArrival: true,
  },
  {
    id: 'hd-005',
    name: 'Heavyweight Logo Hoodie',
    slug: 'heavyweight-logo-hoodie',
    category: 'hoodie',
    description:
      'Bold embroidered logo on our densest French terry. Structured hood, ribbed cuffs and hem, and a fit that stays true after countless washes.',
    price: 105,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    ],
    colours: ['Black', 'White', 'Forest Green'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 61,
    rating: 4.9,
    reviewCount: 154,
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    id: 'hd-006',
    name: 'Cropped Boxy Hoodie',
    slug: 'cropped-boxy-hoodie',
    category: 'hoodie',
    description:
      'Modern cropped length with a wide, boxy cut. Perfect for layering or wearing alone with high-waisted bottoms. Soft brushed interior.',
    price: 86,
    salePrice: 69,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    ],
    colours: ['Black', 'Cream', 'Sage'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 42,
    rating: 4.5,
    reviewCount: 38,
    featured: false,
    bestseller: false,
    newArrival: true,
  },
  {
    id: 'hd-007',
    name: 'Sherpa-Lined Hoodie',
    slug: 'sherpa-lined-hoodie',
    category: 'hoodie',
    description:
      'Ultimate cold-weather piece. Thick outer shell with full sherpa lining, oversized hood, and reinforced stitching throughout.',
    price: 128,
    images: [
      'https://images.unsplash.com/photo-1578768079052-aa76e52b5d8d?w=800&q=80',
    ],
    colours: ['Black', 'Brown', 'Olive'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 29,
    rating: 4.8,
    reviewCount: 47,
    featured: false,
    bestseller: false,
    newArrival: false,
  },
  {
    id: 'hd-008',
    name: 'Lightweight Summer Hoodie',
    slug: 'lightweight-summer-hoodie',
    category: 'hoodie',
    description:
      'Breathable mid-weight French terry designed for milder days. Clean lines, minimal branding, and a versatile everyday fit.',
    price: 78,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    ],
    colours: ['Heather Grey', 'White', 'Sky'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 81,
    rating: 4.6,
    reviewCount: 93,
    featured: false,
    bestseller: false,
    newArrival: false,
  },

  // ==================== 3D PRINT ====================
  {
    id: '3d-001',
    name: 'Geometric Desk Sculpture',
    slug: 'geometric-desk-sculpture',
    category: 'print3d',
    description:
      'Precision FDM print in matte PLA. Angular form designed as a desk statement piece. Smooth layer lines, solid fill base for stability.',
    price: 42,
    images: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    ],
    colours: ['Matte Black', 'White', 'Graphite'],
    sizes: ['Standard', 'Large'],
    stock: 35,
    rating: 4.8,
    reviewCount: 42,
    featured: true,
    bestseller: true,
    newArrival: true,
    tags: ['PLA', 'desk', 'sculpture'],
  },
  {
    id: '3d-002',
    name: 'Modular Cable Hub',
    slug: 'modular-cable-hub',
    category: 'print3d',
    description:
      'Snap-together cable management hub. Organise desk power and USB lines with a clean architectural look. Printed in durable PETG.',
    price: 28,
    salePrice: 22,
    images: [
      'https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&q=80',
    ],
    colours: ['Black', 'White', 'Orange Accent'],
    sizes: ['3-port', '5-port'],
    stock: 58,
    rating: 4.6,
    reviewCount: 31,
    featured: true,
    bestseller: false,
    newArrival: true,
    tags: ['PETG', 'desk', 'utility'],
  },
  {
    id: '3d-003',
    name: 'Hex Planter Mini',
    slug: 'hex-planter-mini',
    category: 'print3d',
    description:
      'Honeycomb mini planter with drainage insert. Ideal for succulents. Lightweight PLA, sealed interior option available.',
    price: 24,
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    ],
    colours: ['Sand', 'Sage', 'Charcoal'],
    sizes: ['Mini', 'Standard'],
    stock: 70,
    rating: 4.7,
    reviewCount: 55,
    featured: false,
    bestseller: true,
    newArrival: false,
    tags: ['PLA', 'home'],
  },
  {
    id: '3d-004',
    name: 'Cyber Keycap Set',
    slug: 'cyber-keycap-set',
    category: 'print3d',
    description:
      'Custom artisan-style keycap pair for mechanical boards. High-detail resin-look FDM finish. MX stem compatible.',
    price: 18,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33cab9ef?w=800&q=80',
    ],
    colours: ['Neon Cyan', 'Void Black', 'Bone'],
    sizes: ['MX Standard'],
    stock: 90,
    rating: 4.5,
    reviewCount: 28,
    featured: false,
    bestseller: false,
    newArrival: true,
    tags: ['PLA', 'tech'],
  },
  {
    id: '3d-005',
    name: 'Wall Mask — Low Poly',
    slug: 'wall-mask-low-poly',
    category: 'print3d',
    description:
      'Low-poly face mask wall art. Gallery-scale presence with minimal material. Hang-ready with recessed mount.',
    price: 65,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    ],
    colours: ['White', 'Black', 'Terracotta'],
    sizes: ['30cm', '45cm'],
    stock: 22,
    rating: 4.9,
    reviewCount: 19,
    featured: true,
    bestseller: false,
    newArrival: true,
    tags: ['PLA', 'art'],
  },
  {
    id: '3d-006',
    name: 'Phone Stand — Orbit',
    slug: 'phone-stand-orbit',
    category: 'print3d',
    description:
      'Sculptural phone stand with cable pass-through. Stable weighted base, fits most phones in landscape or portrait.',
    price: 32,
    salePrice: 26,
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58b7e9c?w=800&q=80',
    ],
    colours: ['Black', 'Ice Grey', 'Lime'],
    sizes: ['Universal'],
    stock: 64,
    rating: 4.6,
    reviewCount: 47,
    featured: false,
    bestseller: true,
    newArrival: false,
    tags: ['PETG', 'tech'],
  },

];

/** Helper lookups */
export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getFeaturedProducts = (): Product[] =>
  products.filter((p) => p.featured);

export const getBestsellers = (): Product[] =>
  products.filter((p) => p.bestseller);

export const getNewArrivals = (): Product[] =>
  products.filter((p) => p.newArrival);

export const getProductsByCategory = (category: Product['category']): Product[] =>
  products.filter((p) => p.category === category);
