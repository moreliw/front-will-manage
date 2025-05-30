import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory, InventoryTransaction, UpdateInventoryRequest } from '../models/inventory.model';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly API_URL = `${environment.apiUrl}/api/Inventory`;
  private readonly TRANSACTIONS_URL = `${environment.apiUrl}/api/InventoryTransactions`;

  constructor(private http: HttpClient) {}

  getInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.API_URL);
  }

  getInventoryByProduct(productId: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.API_URL}/product/${productId}`);
  }

  getLowStockProducts(threshold: number = 0): Observable<Product[]> {
    const params = new HttpParams().set('threshold', threshold.toString());
    return this.http.get<Product[]>(`${this.API_URL}/low-stock`, { params });
  }

  updateQuantity(request: UpdateInventoryRequest): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/update-quantity`, request);
  }

  // Inventory Transactions
  getTransactions(): Observable<InventoryTransaction[]> {
    return this.http.get<InventoryTransaction[]>(this.TRANSACTIONS_URL);
  }

  getTransactionById(id: string): Observable<InventoryTransaction> {
    return this.http.get<InventoryTransaction>(`${this.TRANSACTIONS_URL}/${id}`);
  }

  getTransactionsByProduct(productId: string): Observable<InventoryTransaction[]> {
    return this.http.get<InventoryTransaction[]>(`${this.TRANSACTIONS_URL}/product/${productId}`);
  }

  getTransactionsByDateRange(startDate: Date, endDate: Date): Observable<InventoryTransaction[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    return this.http.get<InventoryTransaction[]>(`${this.TRANSACTIONS_URL}/date-range`, { params });
  }

  getTransactionsByType(type: string): Observable<InventoryTransaction[]> {
    return this.http.get<InventoryTransaction[]>(`${this.TRANSACTIONS_URL}/type/${type}`);
  }
} 