import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TenantService, TenantInfo } from '../../service/tenant.service';
import { AuthService } from '../../pages/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tenant-selector',
  templateUrl: './tenant-selector.component.html',
  styleUrls: ['./tenant-selector.component.scss']
})
export class TenantSelectorComponent implements OnInit {
  tenants: TenantInfo[] = [];
  loading = false;
  error = '';
  returnUrl: string;
  environment = environment;
  currentTenant: TenantInfo | null = null;

  constructor(
    public tenantService: TenantService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {
    this.returnUrl = '/dashboard'; // Default
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Verificar se já tem um tenant atual
    this.tenantService.currentTenant$.subscribe(tenant => {
      this.currentTenant = tenant;
      
      // Se já tiver um tenant selecionado, vá direto para o dashboard
      if (tenant) {
        console.log('Tenant já selecionado, redirecionando para:', this.returnUrl);
        this.router.navigate([this.returnUrl]);
        return;
      }
    });
    
    // Carregar a lista de tenants
    this.loadTenants();
  }

  loadTenants(): void {
    this.loading = true;
    this.error = '';

    this.tenantService.getAllTenants()
      .subscribe({
        next: (tenants) => {
          console.log('Tenants recebidos no componente:', tenants);
          
          // Mapear os dados para o formato esperado, caso necessário
          this.tenants = this.mapTenants(tenants);
          this.loading = false;
          
          // Se houver apenas um tenant, selecioná-lo automaticamente
          if (this.tenants.length === 1) {
            console.log('Apenas um tenant disponível, selecionando automaticamente:', this.tenants[0]);
            this.selectTenant(this.tenants[0]);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar tenants:', error);
          this.error = 'Não foi possível carregar a lista de empresas. Por favor, tente novamente.';
          this.loading = false;
        }
      });
  }

  // Adapta os dados do backend para o formato esperado pelo frontend, se necessário
  private mapTenants(data: any[]): TenantInfo[] {
    if (!data || !Array.isArray(data)) {
      console.warn('Dados de tenant inválidos:', data);
      return [];
    }
    
    return data.map(item => {
      // Adapte os campos conforme necessário
      const tenant: TenantInfo = {
        id: item.tenantId || item.id || '',
        name: item.name || '',
        active: item.active !== undefined ? item.active : true
      };
      
      return tenant;
    });
  }

  tryAgain(): void {
    this.loadTenants();
  }

  selectTenant(tenant: TenantInfo): void {
    console.log('Selecionando tenant:', tenant);
    this.tenantService.selectTenant(tenant);
    this.router.navigate([this.returnUrl]);
  }

  logout(): void {
    this.authService.logout();
  }
}
