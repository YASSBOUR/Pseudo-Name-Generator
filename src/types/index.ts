export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  subcategories: Category[];
  isSubcategory: boolean;
}

export interface GeneratedName {
  id: string;
  name: string;
  timestamp: number;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export interface AdminSettings {
  siteTitle: string;
  logoUrl: string;
  menuItems: MenuItem[];
  homeSeoTitle: string;
  homeSeoDescription: string;
  homeSeoKeywords: string;
  categories: Category[];
  nameGenerationRules: {
    minLength: number;
    maxLength: number;
    customPrefixes: string[];
    customSuffixes: string[];
  };
}

export interface NameList {
  id: string;
  categoryId: string;
  name: string;
  names: string[];
}

export interface SeoText {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  position: 'before-footer' | 'after-header';
}