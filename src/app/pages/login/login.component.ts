import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
        this.router.navigate(['/customers']);
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
}
