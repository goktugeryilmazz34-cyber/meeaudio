export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  image: string;
};

export type ProductVariant = {
  id?: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  attributes: Record<string, string>;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  description: string;
  features: string[];
  gradient: string;
  emoji: string;
  image?: string;
  gallery?: string[];
  seoTitle?: string;
  seoDescription?: string;
  linkedDiscountCode?: string;
  variants?: ProductVariant[];
};

export type DiscountCode = {
  id: string;
  code: string;
  label: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrder: number;
  validUntil?: string;
  isActive: boolean;
};

export type Campaign = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  code?: string;
  discountLabel: string;
  validUntil: string;
  gradient: string;
  image: string;
  categorySlug?: string;
};

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
};

export type Faq = {
  question: string;
  answer: string;
};
