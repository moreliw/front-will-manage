import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Customer } from '../models/customer';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Partner } from '../models/partner';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPartners(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/partner`);
  }

  getPartnerById(id: string): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/partner/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  addPartner(partner: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/partner`, partner);
  }

  updatePartner(id: string, partner: Partner): Observable<any> {
    return this.http.put(`${this.apiUrl}/partner/${id}`, partner).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  updateBalance(idPartner: string, balance: number): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/partner/update-balance/${idPartner}`, balance)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  deletePartner(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/partner/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
