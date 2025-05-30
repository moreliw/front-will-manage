import { Component, OnInit } from '@angular/core';
import { AuthService } from './pages/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-will-manage';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Aplicação inicializada');
    console.log('Ambiente:', environment.production ? 'Produção' : 'Desenvolvimento');
    console.log('API URL:', environment.apiUrl);
    
    // Verificar se o usuário está autenticado
    const isAuthenticated = this.authService.isLoggedIn();
    console.log('Usuário autenticado:', isAuthenticated);
    
    // Verificar a rota atual
    console.log('Rota atual:', this.router.url);
  }
}
