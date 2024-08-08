import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { MenuService } from '../../service/menu.service';
import { Menu } from '../../models/menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  routes: Menu[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.loadUserPermissions();
  }

  toggle() {
    document.querySelector('#sidebar').classList.toggle('expand');
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  loadUserPermissions(): void {
    this.menuService.getAllPermissions().subscribe(
      (permissions) => {
        this.routes = permissions;
      },
      (error) => {
        console.error('Erro ao carregar permissões', error);
      }
    );
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
    });
  }
}
