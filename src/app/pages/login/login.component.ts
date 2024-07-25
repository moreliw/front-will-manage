import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login';

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

    this.authService.login(login).subscribe((response) => {
      localStorage.setItem('accessToken', response.token);
      this.loading = false;

      this.router.navigate(['/customers']);
    });
  }
}
