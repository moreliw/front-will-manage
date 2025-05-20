import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface RouteItem {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isExpanded = false;
  isMobile = false;
  routes: RouteItem[] = [];
  currentRoute = '';
  userName = '';
  userRole = '';
  
  constructor(private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.currentRoute = this.router.url;
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      const userRole = this.getUserRole(token);
      if (userRole === 'BasicSchedule') {
        this.routes = [
          {
            name: 'Dashboard',
            icon: 'dashboard',
            description: '/dashboard',
          },
          {
            name: 'Agenda',
            icon: 'today',
            description: '/schedule',
          },
          {
            name: 'Clientes',
            icon: 'people',
            description: '/customer',
          },
          {
            name: 'Responsáveis',
            icon: 'person',
            description: '/responsible',
          },
        ];
      } else {
        this.routes = [
          {
            name: 'Inventário',
            icon: 'inventory_2',
            description: '/inventory',
          },
          {
            name: 'Produtos',
            icon: 'category',
            description: '/product',
          },
          {
            name: 'Categorias',
            icon: 'label',
            description: '/category',
          },
          {
            name: 'Financeiro',
            icon: 'payments',
            description: '/finance',
          },
          {
            name: 'Parceiros',
            icon: 'handshake',
            description: '/partner',
          },
        ];
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 992;
    // Se for mobile, colapsa a sidebar automaticamente
    if (this.isMobile) {
      this.isExpanded = false;
    }
  }

  getUserInfo() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userName = decodedToken['name'] || decodedToken['email'] || 'Usuário';
        this.userRole = this.formatUserRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
  }

  formatUserRole(role: string): string {
    if (!role) return 'Usuário';
    
    switch(role) {
      case 'BasicSchedule':
        return 'Agenda Básica';
      case 'CompleteSchedule':
        return 'Agenda Completa';
      case 'Administrator':
        return 'Administrador';
      default:
        return role;
    }
  }

  getUserInitials(): string {
    if (!this.userName) return 'U';
    
    const names = this.userName.split(' ').filter(name => name.length > 0);
    if (names.length === 0) return 'U';
    
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  toggle(event: Event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

  closeOnMobile(event: Event) {
    if (this.isMobile) {
      event.stopPropagation();
      this.isExpanded = false;
    }
  }

  goTo(route: string, event: Event) {
    event.stopPropagation();
    this.router.navigateByUrl(route);
    this.currentRoute = route;
    
    // Fecha o menu no mobile após clicar
    if (this.isMobile) {
      this.isExpanded = false;
    }
  }

  logout(event: Event) {
    event.stopPropagation();
    localStorage.removeItem('accessToken');
    this.router.navigateByUrl('/login');
  }

  getUserRole(token: string): string {
    try {
      const decodedToken = jwtDecode(token) as JwtPayload & {
        [key: string]: any;
      };
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    } catch {
      return '';
    }
  }
}
