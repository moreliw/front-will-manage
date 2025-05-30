import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductCategory, ProductCategoryCreate, ProductCategoryUpdate } from '../models/product-category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private readonly API_URL = `${environment.apiUrl}/api/ProductCategories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.API_URL);
  }

  getCategoriesWithProducts(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.API_URL}/with-products`);
  }

  getCategoryById(id: string): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(`${this.API_URL}/${id}`);
  }

  createCategory(category: ProductCategoryCreate): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(this.API_URL, category);
  }

  updateCategory(category: ProductCategoryUpdate): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${category.id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
} 