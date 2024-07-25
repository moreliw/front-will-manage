import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationData } from '../../models/authorization-data';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  login(login: LoginModel) {
    return this.http.post<any>(
      `${this.apiUrl}/account/login`,
      login,
      httpOptions
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('accessToken') !== null;
  }

  public SaveLocalAuthorizationData(token: AuthorizationData) {
    localStorage.setItem('authorizationData', JSON.stringify(token));
  }

  refreshToken(
    login: string,
    refreshToken: string
  ): Observable<AuthorizationData> {
    const auth = {
      login: login,
      refreshToken: refreshToken,
    };
    return this.http.post<AuthorizationData>(
      this.apiUrl + '/auth/RefreshToken',
      auth,
      httpOptions
    );
  }

  public clearLocalStorage() {
    localStorage.removeItem('authorizationData');
    localStorage.removeItem('accessToken');
  }

  public GetLocalAuthorizationData(): AuthorizationData {
    const authorizationDataString = localStorage.getItem('authorizationData');
    const authorizationData = JSON.parse(
      authorizationDataString
    ) as AuthorizationData;

    return authorizationData;
  }

  logout() {
    this.clearLocalStorage();
    this.router.navigate(['/login']);
  }
}
