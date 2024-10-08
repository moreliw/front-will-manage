import { Category } from './category';

export class Product {
  id: string;
  code: number;
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  unity: number;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: Category;
}
