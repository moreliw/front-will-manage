import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantService } from 'src/app/service/tenant.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tenantService: TenantService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get authentication token
    const token = localStorage.getItem('accessToken');
    
    // Get current tenant
    const currentTenant = this.tenantService.getCurrentTenant();
    
    // Clone the request to add the new headers
    let clonedRequest = req;
    
    // Add token if available
    if (token) {
      clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }
    
    // Add tenant header if available and not already in request
    if (currentTenant && currentTenant.subdomain && !req.headers.has('X-Tenant')) {
      clonedRequest = clonedRequest.clone({
        headers: clonedRequest.headers.set('X-Tenant', currentTenant.subdomain),
      });
    }
    
    // Pass the cloned request with headers to the next handler
    return next.handle(clonedRequest);
  }
}
