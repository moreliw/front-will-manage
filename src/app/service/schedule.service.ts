import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Customer } from '../models/customer';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Schedule } from '../models/schedule';
import { Procedure } from '../models/procedure';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getScheduleList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schedule`);
  }

  getScheduleById(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.apiUrl}/schedule/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  addSchedule(schedule: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/schedule`, schedule);
  }

  updateSchedule(id: string, schedule: Schedule): Observable<any> {
    return this.http.put(`${this.apiUrl}/schedule/${id}`, schedule).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  updateProcedures(
    scheduleId: string,
    procedures: Procedure[]
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/schedule/procedure/${scheduleId}`,
      procedures
    );
  }

  deleteSchedule(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/schedule/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
