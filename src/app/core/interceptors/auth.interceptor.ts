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
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Não modificar requisições que não vão para nossa API
    if (!request.url.startsWith(environment.apiUrl)) {
      return next.handle(request);
    }

    // Não adicionar token em rotas públicas (login, registro)
    if (
      request.url.includes('/api/Account/login') ||
      request.url.includes('/api/Account/register')
    ) {
      return next.handle(request);
    }

    // Obter token JWT
    const authToken = this.authService.getAuthToken();

    // Se não tiver token, prosseguir sem modificar
    if (!authToken) {
      return next.handle(request);
    }

    // Adicionar header de autenticação
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return next.handle(modifiedRequest);
  }
} 