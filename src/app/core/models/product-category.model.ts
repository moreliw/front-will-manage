import { Product } from './product.model';

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
  
  // Relations
  products?: Product[];
}

export interface ProductCategoryCreate {
  name: string;
  description?: string;
}

export interface ProductCategoryUpdate extends ProductCategoryCreate {
  id: string;
} 