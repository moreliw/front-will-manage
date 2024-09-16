import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login';
import Swal from 'sweetalert2';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  loading = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    this.loading = true;

    const login = new LoginModel();
    login.Email = this.username;
    login.Password = this.password;

    this.authService.login(login).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.token);
        this.loading = false;
        console.log(this.getUserRole(response.token));
        if (this.getUserRole(response.token) === 'BasicSchedule') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/inventory']);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro de login:', error.error);
        const errorMessage = error.error.error || 'Erro ao fazer login.';
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: errorMessage,
        });
      },
    });
  }

  decodeToken(token: string): JwtPayload {
    return jwtDecode(token);
  }

  getUserRole(token: string): string {
    const decodedToken = this.decodeToken(token);
    return decodedToken[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ];
  }
}
