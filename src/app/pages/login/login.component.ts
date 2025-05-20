import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from '../../models/login';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loading = false;
  hidePassword = true; // Para controlar a visibilidade da senha
  errorMessage: string = ''; // Para exibir mensagens de erro no template
  rememberMe = false; // Para o checkbox de lembrar-me

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Verifica se existe credencial salva
    this.checkSavedCredentials();
    
    // Se já tiver token válido, redireciona
    if (this.isUserLoggedIn()) {
      this.redirectBasedOnRole();
    }
    
    // Verificar se os ícones do material estão carregados corretamente
    this.ensureMaterialIconsLoaded();
  }

  // Garante que os ícones do Material Design estão carregados
  ensureMaterialIconsLoaded(): void {
    const iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(iconLink);
  }

  // Toggle para mostrar/esconder senha
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  // Verifica se há credenciais salvas
  checkSavedCredentials(): void {
    const savedUsername = localStorage.getItem('rememberedUser');
    if (savedUsername) {
      this.username = savedUsername;
      this.rememberMe = true;
    }
  }

  // Verifica se o usuário já está logado
  isUserLoggedIn(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      // Verifica se o token não expirou
      const decodedToken = this.decodeToken(token);
      const expirationDate = new Date(0);
      
      if (decodedToken.exp) {
        expirationDate.setUTCSeconds(decodedToken.exp);
        return expirationDate > new Date();
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }

  // Redirecionamento baseado no papel do usuário
  redirectBasedOnRole(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const role = this.getUserRole(token);
      if (role === 'BasicSchedule') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/inventory']);
      }
    }
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const login = new LoginModel();
    login.Email = this.username.trim();
    login.Password = this.password;

    this.authService.login(login).subscribe({
      next: (response) => {
        // Salva o token
        localStorage.setItem('accessToken', response.token);
        
        // Se "Lembrar-me" estiver marcado, salva o usuário
        if (this.rememberMe) {
          localStorage.setItem('rememberedUser', this.username);
        } else {
          localStorage.removeItem('rememberedUser');
        }
        
        this.loading = false;
        
        // Redireciona baseado no papel
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro de login:', error);
        
        // Trata diferentes tipos de erros
        if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else if (error.status === 401) {
          this.errorMessage = 'Email ou senha incorretos.';
        } else if (error.error && error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Ocorreu um erro ao fazer login. Tente novamente mais tarde.';
        }
      },
    });
  }

  decodeToken(token: string): JwtPayload {
    return jwtDecode(token);
  }

  getUserRole(token: string): string {
    try {
      const decodedToken = this.decodeToken(token);
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return '';
    }
  }
}
