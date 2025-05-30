import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Não modificar requisições que não vão para nossa API
    if (!request.url.startsWith(environment.apiUrl)) {
      return next.handle(request);
    }
    
    // Não adicionar header em rotas de autenticação
    if (
      request.url.includes('/api/Account/login') ||
      request.url.includes('/api/Account/register')
    ) {
      return next.handle(request);
    }

    const currentTenant = this.authService.getCurrentTenant();
    
    // Se não tiver um tenant selecionado, continuar sem modificar
    if (!currentTenant) {
      console.log('TenantInterceptor: Nenhum tenant selecionado');
      return next.handle(request);
    }

    console.log(`TenantInterceptor: Adicionando header de tenant ${currentTenant.id} para ${request.url}`);
    
    // Adicionar o header de tenant - nome do header conforme esperado pelo backend
    const modifiedRequest = request.clone({
      setHeaders: {
        'X-Tenant-ID': currentTenant.id
      }
    });

    return next.handle(modifiedRequest);
  }
} 