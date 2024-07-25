import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
const swal = require('sweetalert');
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../app/pages/auth/auth.service';
import { AuthorizationData } from '../app/models/authorization-data';

@Injectable()
export class WillHttpInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  constructor(
    public authorizationService: AuthService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders({});

    const dataAuth = this.authorizationService.GetLocalAuthorizationData();

    if (dataAuth?.token) {
      headers = headers.append('Authorization', 'Bearer ' + dataAuth?.token);
    }

    const cloneReq = req.clone({ headers });
    return next.handle(cloneReq).pipe(
      tap(
        (evt) => {
          if (evt instanceof HttpResponse) {
            switch (evt.status) {
              case 200: {
                if (evt.body.success !== undefined && !evt.body.success) {
                  if (evt.body.statusCode === 403) {
                    this.logout();
                  } else if (evt.body.statusCode === 500) {
                    swal(
                      'Atenção',
                      'Houve uma falha em nosso servidor. Por favor, aguarde alguns instantes e tente novamente. Se o problema persistir, entre em contato com o administrador.',
                      'warning'
                    );
                  } else if (evt.body.statusCode === 401) {
                    if (dataAuth?.refreshTokenHash) {
                      this.logout();
                    } else {
                      if (!this.isRefreshing) {
                        this.isRefreshing = true;
                        this.authorizationService
                          .refreshToken('', dataAuth.refreshTokenHash)
                          .subscribe((result) => {
                            if (result) {
                              this.isRefreshing = false;
                              const authorizationData =
                                result as AuthorizationData;
                              this.authorizationService.SaveLocalAuthorizationData(
                                authorizationData
                              );
                              headers = headers.append(
                                'Authorization',
                                'Bearer ' + result.refreshTokenHash
                              );
                              window.location.reload();
                            } else {
                              this.logout();
                            }
                          });
                      }
                    }
                  } else {
                    if (
                      evt.body.httpStatusCode !== undefined &&
                      evt.body.httpStatusCode === 400
                    ) {
                      if (evt.body.errors['length'] > 0) {
                        swal('Atenção', evt.body.errors[0], 'warning');
                      }
                    } else {
                      swal('Atenção', evt.body.message, 'warning');
                    }
                  }
                }
                break;
              }
              case 403: {
                this.logout();
                break;
              }
              case 401: {
                if (!dataAuth?.refreshTokenHash) {
                  this.logout();
                } else {
                  if (!this.isRefreshing) {
                    this.isRefreshing = true;
                    this.authorizationService
                      .refreshToken('', dataAuth.refreshTokenHash)
                      .subscribe((result) => {
                        if (result) {
                          this.isRefreshing = false;
                          const authorizationData = result as AuthorizationData;
                          this.authorizationService.SaveLocalAuthorizationData(
                            authorizationData
                          );
                          headers = headers.append(
                            'Authorization',
                            'Bearer ' + result.token
                          );
                          window.location.reload();
                        } else {
                          this.logout();
                        }
                      });
                  }
                }
                break;
              }
              case 500: {
                swal(
                  'Atenção',
                  'Houve uma falha em nosso servidor. Por favor, aguarde alguns instantes e tente novamente. Se o problema persistir, entre em contato com o administrador.',
                  'warning'
                );
                break;
              }
              default: {
                if (evt.body.messages?.length > 0) {
                  swal('Atenção', evt.body.messages[0], 'warning');
                }
              }
            }
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 400:
              case 422:
              case 403:
                if (error.error?.messages?.length > 0) {
                  swal('Atenção', error.error?.messages[0], 'warning');
                }
                break;
              case 401:
                if (!dataAuth?.refreshTokenHash) {
                  this.logout();
                } else {
                  if (!this.isRefreshing) {
                    this.isRefreshing = true;
                    this.authorizationService
                      .refreshToken('', dataAuth.refreshTokenHash)
                      .subscribe((result) => {
                        if (result) {
                          this.isRefreshing = false;
                          this.authorizationService.SaveLocalAuthorizationData(
                            result
                          );
                          headers = headers.append(
                            'Authorization',
                            'Bearer ' + result.token
                          );
                          window.location.reload();
                        } else {
                          this.logout();
                        }
                      });
                  }
                }
                break;
              default:
                swal(
                  'Atenção',
                  'Houve uma falha em nosso servidor. Por favor, aguarde alguns instantes e tente novamente. Se o problema persistir, entre em contato com o administrador.',
                  'warning'
                );
                break;
            }
          }
        }
      )
    );
  }

  private logout() {
    swal(
      'Atenção',
      'Sua Sessão Expirou. Sua sessão ficou inativa por muito tempo e foi encerrada. Efetue o Login novamente.',
      'warning'
    );
    setTimeout(() => {
      this.authorizationService.clearLocalStorage();
      this.router.navigate(['/login']);
    }, 2000);
  }
}
