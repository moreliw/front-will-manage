import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSummaryInventory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/inventory/summary`);
  }

  // addInventory(inventory: any[]): Observable<any> {
  //   return this.http
  //     .post<any>(`${this.apiUrl}/inventory`, inventory)
  //     .pipe(catchError(this.handleError));
  // }

  addInventory(inventory: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/inventory`, inventory).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${
        error.error?.message || error.message
      }`;
    }
    return throwError(errorMessage);
  }
}
