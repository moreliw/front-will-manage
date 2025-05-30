import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductCreate, ProductListResponse, ProductUpdate } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/api/Products`;

  constructor(private http: HttpClient) {}

  getProducts(
    page: number = 1, 
    pageSize: number = 10, 
    orderBy: string = 'Name',
    orderDirection: string = 'ASC',
    search: string = '',
    categoryId?: string
  ): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('orderBy', orderBy)
      .set('orderDirection', orderDirection);
      
    if (search) {
      params = params.set('search', search);
    }
    
    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    
    return this.http.get<ProductListResponse>(this.API_URL, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  createProduct(product: ProductCreate): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  updateProduct(product: ProductUpdate): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${product.id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getLowStockProducts(threshold?: number): Observable<Product[]> {
    let params = new HttpParams();
    
    if (threshold !== undefined) {
      params = params.set('threshold', threshold.toString());
    }
    
    return this.http.get<Product[]>(`${this.API_URL}/low-stock`, { params });
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/category/${categoryId}`);
  }

  searchProducts(term: string): Observable<Product[]> {
    const params = new HttpParams().set('term', term);
    return this.http.get<Product[]>(`${this.API_URL}/search`, { params });
  }
} 