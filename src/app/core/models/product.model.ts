import { ProductCategory } from './product-category.model';

// Interface simplificada para evitar importação circular
interface InventoryReference {
  id: string;
  productId: string;
  quantity: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  categoryId?: string;
  price: number;
  cost?: number;
  barCode?: string;
  sku?: string;
  minimumStock?: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  
  // Relations
  category?: ProductCategory;
  inventory?: InventoryReference;
}

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
}

export interface ProductCreate {
  code: string;
  name: string;
  description?: string;
  categoryId?: string;
  price: number;
  cost?: number;
  barCode?: string;
  sku?: string;
  minimumStock?: number;
  imageUrl?: string;
}

export interface ProductUpdate extends ProductCreate {
  id: string;
  isActive?: boolean;
} 