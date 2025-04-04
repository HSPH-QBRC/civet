import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service'

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  authService;

  constructor(inj: Injector) {
    this.authService = inj.get(AuthenticationService);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let _token = this.authService.getJwtToken();
    if (_token !== null) {
      request = this.addToken(request, _token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        // if we received a 401, we need to refresh the token
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          //if the error was something OTHER than a 401...
          // The calling function (e.g. in a service class) 
          // can catch the thrown error in the subscribe method.
          // If it's not caught, then error tracking (e.g. Sentry) 
          // will handle it
          return throwError(error);
        } 
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access);
          return next.handle(this.addToken(request, token.access));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
