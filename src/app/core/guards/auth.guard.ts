import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('AuthGuard: Usuário não autenticado. Redirecionando para login.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Verificar se a rota requer um tenant selecionado
    const requiresTenant = route.data['requiresTenant'] !== false; // true por padrão
    
    // Se a rota requer tenant, verificar se há um tenant selecionado
    if (requiresTenant && !this.authService.getCurrentTenant()) {
      console.log('AuthGuard: Tenant necessário mas não selecionado. Redirecionando para seleção de tenant.');
      this.router.navigate(['/select-tenant'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    return true;
  }
} 