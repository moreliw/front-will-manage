import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, User, Tenant } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44328/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentTenantSubject = new BehaviorSubject<Tenant | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public currentTenant$ = this.currentTenantSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
    this.loadTenantFromStorage();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Account/login`, { request: { email: username, password } })
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
          return response;
        })
      );
  }

  register(user: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Account/register`, user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
    this.currentUserSubject.next(null);
    this.currentTenantSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentTenant(): Tenant | null {
    return this.currentTenantSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getAuthToken(): string | null {
    return this.getToken();
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('auth_token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    
    if (authResult.tenant) {
      localStorage.setItem('tenant', JSON.stringify(authResult.tenant));
      this.currentTenantSubject.next(authResult.tenant);
    }
    
    this.currentUserSubject.next(authResult.user);
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
        this.logout();
      }
    }
  }

  private loadTenantFromStorage(): void {
    const tenantJson = localStorage.getItem('tenant');
    if (tenantJson) {
      try {
        const tenant = JSON.parse(tenantJson);
        this.currentTenantSubject.next(tenant);
      } catch (e) {
        console.error('Error parsing tenant from localStorage', e);
        localStorage.removeItem('tenant');
      }
    }
  }
} 