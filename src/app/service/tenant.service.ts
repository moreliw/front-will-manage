import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TenantInfo {
  id: string;
  name: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly TENANT_KEY = 'current_tenant';
  private currentTenantSubject = new BehaviorSubject<TenantInfo | null>(null);
  public currentTenant$ = this.currentTenantSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('TenantService inicializado');
    this.loadTenantFromStorage();
  }

  private loadTenantFromStorage(): void {
    const storedTenant = localStorage.getItem(this.TENANT_KEY);
    console.log('Tenant carregado do storage:', storedTenant);
    
    if (storedTenant) {
      try {
        const tenantInfo = JSON.parse(storedTenant) as TenantInfo;
        this.currentTenantSubject.next(tenantInfo);
        console.log('Tenant carregado com sucesso:', tenantInfo);
      } catch (error) {
        console.error('Erro ao carregar tenant do storage:', error);
        localStorage.removeItem(this.TENANT_KEY);
      }
    }
  }

  getAllTenants(): Observable<TenantInfo[]> {
    console.log('Buscando todos os tenants disponíveis');
    return this.http.get<TenantInfo[]>(`${environment.apiUrl}/Tenant/list`)
      .pipe(
        tap(tenants => console.log('Tenants recebidos:', tenants)),
        catchError(error => {
          console.error('Erro ao buscar tenants:', error);
          return of([]);
        })
      );
  }
  
  getDefaultTenant(): Observable<TenantInfo | null> {
    console.log('Buscando tenant default no backend');
    return this.http.get<TenantInfo>(`${environment.apiUrl}/Tenant/default`)
      .pipe(
        tap(tenant => console.log('Tenant default recebido:', tenant)),
        catchError(error => {
          console.error('Erro ao buscar tenant default:', error);
          return of(null);
        })
      );
  }

  selectTenant(tenant: TenantInfo): void {
    console.log('Selecionando tenant:', tenant);
    localStorage.setItem(this.TENANT_KEY, JSON.stringify(tenant));
    this.currentTenantSubject.next(tenant);
  }

  getCurrentTenant(): TenantInfo | null {
    return this.currentTenantSubject.value;
  }

  clearCurrentTenant(): void {
    console.log('Limpando tenant atual');
    localStorage.removeItem(this.TENANT_KEY);
    this.currentTenantSubject.next(null);
  }
} 