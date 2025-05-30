import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/auth/auth.service';
import { TenantService } from '../service/tenant.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tenantService: TenantService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Não aplicar token a requisições para outras APIs
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    // Obter token JWT
    const authToken = this.authService.getToken();

    // Se não tiver token, prosseguir sem modificar
    if (!authToken) {
      return next.handle(req);
    }

    // Adicionar header de autenticação
    let clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Não é mais necessário adicionar X-Tenant aqui, já que o TenantInterceptor cuida disso
    // Isso evita duplicação de headers

    return next.handle(clonedRequest);
  }
} 