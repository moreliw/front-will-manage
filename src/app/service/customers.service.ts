import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Customer } from '../models/customer';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customer`);
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customer/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  addCustomer(customer: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/customer`, customer);
  }

  updateCustomer(id: string, customer: Customer): Observable<any> {
    return this.http.put(`${this.apiUrl}/customer/${id}`, customer).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  updateBalance(idCustomer: string, balance: number): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/customer/update-balance/${idCustomer}`, balance)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customer/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
