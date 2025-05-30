import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TenantService, TenantInfo } from '../../service/tenant.service';

// Interface ideal para a resposta de autenticação
export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  tenant?: TenantInfo;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private tenantService: TenantService
  ) {
    console.log('AuthService inicializado');
    console.log('Token existente:', this.hasToken());
  }

  login(email: string, password: string, tenantIdentifier?: string): Observable<AuthResponse> {
    console.log('Tentando login para:', email);
    
    const loginData: any = { 
      Email: email, 
      Password: password
    };
    
    if (tenantIdentifier) {
      loginData.TenantIdentifier = tenantIdentifier;
    }
    
    console.log('Enviando dados de login:', loginData);
    
    // ALTERADO: endpoint correto para login
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Account/login`, loginData)
      .pipe(
        tap(response => {
          console.log('Resposta do login:', response);
          
          if (!response || !response.token) {
            console.error('Resposta inválida do servidor - token ausente');
            throw new Error('Resposta inválida do servidor');
          }
          
          console.log('Login bem-sucedido');
          this.setSession(response);
          this.isAuthenticatedSubject.next(true);
          
          // Se a API retornar informações do tenant, salvar automaticamente
          if (response.tenant) {
            console.log('Tenant recebido do backend:', response.tenant);
            this.tenantService.selectTenant(response.tenant);
          }
        }),
        switchMap(response => {
          // Se não tiver tenant na resposta, tentar buscar o tenant default do usuário
          if (!response.tenant) {
            console.log('Buscando tenant default do usuário');
            return this.tenantService.getDefaultTenant().pipe(
              tap(tenant => {
                if (tenant) {
                  console.log('Tenant default encontrado:', tenant);
                  this.tenantService.selectTenant(tenant);
                }
              }),
              map(() => response)
            );
          }
          return of(response);
        }),
        catchError(error => {
          console.error('Erro no login:', error);
          throw error;
        })
      );
  }

  logout(): void {
    console.log('Fazendo logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    this.tenantService.clearCurrentTenant();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setSession(authResult: any): void {
    // Garantir que salva o token independente do formato da resposta
    if (typeof authResult === 'object') {
      // Se for objeto com token
      if (authResult.token) {
        localStorage.setItem('auth_token', authResult.token);
      } 
      // Se a resposta for apenas o token string
      else if (typeof authResult === 'string') {
        localStorage.setItem('auth_token', authResult);
      }
      
      // Salvar user_id apenas se vier no payload
      if (authResult.user && authResult.user.id) {
        localStorage.setItem('user_id', authResult.user.id);
      }
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
