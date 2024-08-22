import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // getProducts(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/product`);
  // }

  getProducts(
    typeOrderProduct: number,
    param: any,
    search?: string,
    categoryId?: string
  ): Observable<any> {
    let params = new HttpParams();
    if (typeOrderProduct !== undefined) {
      params = params.set('typeOrderProduct', `${typeOrderProduct}`);
    }

    if (param) {
      params = params
        .set('page', `${param.offset + 1}`)
        .set('pageSize', `${param.limit}`);
    }

    if (search !== undefined || search !== '') {
      params = params.set('search', `${search}`);
    }

    if (categoryId !== undefined || categoryId !== null) {
      params = params.set('categoryId', `${categoryId}`);
    }

    return this.http.get<any>(`${this.apiUrl}/product`, {
      params,
    });
  }

  getProductsOnSearch(searchTerm: string): Observable<any> {
    const params = new HttpParams().set('query', searchTerm);
    return this.http.get<any>(`${this.apiUrl}/product/search`, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/product`, product);
  }

  updateProduct(id: string, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/product/${id}`, product).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
