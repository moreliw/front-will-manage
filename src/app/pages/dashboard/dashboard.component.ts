import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TenantService, TenantInfo } from '../../service/tenant.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = false;
  error = '';
  currentTenant: TenantInfo | null = null;
  environment = environment;
  isAuthenticated = false;

  constructor(
    private router: Router,
    public tenantService: TenantService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Inicializando Dashboard');
    
    // Verificar se está autenticado
    this.isAuthenticated = this.authService.isLoggedIn();
    console.log('Usuário autenticado:', this.isAuthenticated);
    
    if (!this.isAuthenticated) {
      console.log('Usuário não autenticado, redirecionando para login');
      this.router.navigate(['/login']);
      return;
    }

    // Buscar tenant atual
    this.currentTenant = this.tenantService.getCurrentTenant();
    console.log('Tenant atual:', this.currentTenant);
    
    if (!this.currentTenant) {
      console.log('Sem tenant selecionado, redirecionando para seleção de tenant');
      this.router.navigate(['/select-tenant']);
      return;
    }
    
    console.log('Dashboard inicializado com sucesso');
  }

  logout(): void {
    console.log('Fazendo logout');
    this.authService.logout();
  }

  mudarTenant(): void {
    console.log('Navegando para seleção de tenant');
    this.router.navigate(['/select-tenant']);
  }
} 