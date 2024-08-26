import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
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

  getInventory(
    param: any,
    search?: string,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    let params = new HttpParams();

    if (param) {
      params = params
        .set('page', `${param.offset + 1}`)
        .set('pageSize', `${param.limit}`);
    }

    if (search !== undefined) {
      params = params.set('search', `${search}`);
    }

    if (startDate !== undefined) {
      params = params.set('startDate', `${startDate}`);
    }

    if (endDate !== undefined) {
      params = params.set('endDate', `${endDate}`);
    }

    return this.http.get<any>(`${this.apiUrl}/inventory`, { params });
  }

  getNoPageInventory(
    search?: string,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    let params = new HttpParams();

    if (search !== undefined) {
      params = params.set('search', `${search}`);
    }

    if (startDate !== undefined) {
      params = params.set('startDate', `${startDate}`);
    }

    if (endDate !== undefined) {
      params = params.set('endDate', `${endDate}`);
    }

    return this.http.get<any>(`${this.apiUrl}/inventory/generate`, { params });
  }

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
