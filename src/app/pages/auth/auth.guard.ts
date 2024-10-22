import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UtilService } from 'src/app/service/util.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private isNavigating = false; // Flag para controlar navegações repetidas

  constructor(
    private authService: AuthService,
    private router: Router,
    private util: UtilService
  ) {}

  canActivate(): boolean {
    console.log('User logged in:', this.authService.isLoggedIn());

    if (this.authService.isLoggedIn()) {
      if (this.util.token() === 'Cafe') {
        if (this.router.url !== '/partner' && !this.isNavigating) {
          this.isNavigating = true;
          this.router.navigate(['/partner']).then(() => {
            this.isNavigating = false;
          });
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
