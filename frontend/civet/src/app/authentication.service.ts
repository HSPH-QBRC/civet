import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from './_models/user';
import { BehaviorSubject, Observable, throwError, EMPTY } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable(
  { providedIn: 'root' }
)
export class AuthenticationService {
  private readonly API_URL = environment.API_URL;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private csrfToken: string | null = null;  // Variable to store CSRF token

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('AUTH_TOKEN');
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {

    return this.http.post<User>(`${this.API_URL}/token/`, {
      'username': username,
      'password': password
    }).pipe(
      map(user => {
        // login successful if there's a token in the response: {'refresh': '<REFRESH TOKEN>', 'access': '<ACCESS_TOKEN>'}
        if (user && user['access']) {
          this.storeJwtToken(user['access']);
          this.storeRefreshToken(user['refresh']);

          this.currentUserSubject.next(user);
        }
        return user;
      }),
      catchError(error => {
        let message = 'An error occurred during login.';
        if (error.status === 401) {
          message = 'Invalid username or password.';
        } else if (error.status === 0) {
          message = 'Cannot connect to server. Please try again later.';
        }
        // Re-throw the full error so that status is available in subscribe
        return throwError(() => ({
          ...error,
          message
        }));
      })
    );
  }

  // store user details and token in local storage to keep user logged in between page refreshes
  private storeJwtToken(jwt: string) {
    sessionStorage.removeItem('AUTH_TOKEN');
    sessionStorage.removeItem('TOKEN_TIMESTAMP');
    sessionStorage.setItem('AUTH_TOKEN', jwt);
    sessionStorage.setItem('TOKEN_TIMESTAMP', Date.now().toString());
  }

  private storeRefreshToken(token: string) {
    sessionStorage.removeItem('REFRESH_TOKEN');
    sessionStorage.setItem("REFRESH_TOKEN", token);
  }

  logout() {
    sessionStorage.removeItem('AUTH_TOKEN');
    sessionStorage.removeItem('REFRESH_TOKEN');
    sessionStorage.removeItem('TOKEN_TIMESTAMP');
    this.currentUserSubject.next(null);
  }

  getJwtToken(): string {
    const token = sessionStorage.getItem('AUTH_TOKEN');
    return token
  }

  private getRefreshToken() {
    const token = sessionStorage.getItem("REFRESH_TOKEN");
    return token
  }

  refreshToken(): Observable<any> {
    const refreshToken = sessionStorage.getItem('REFRESH_TOKEN');
    if (!refreshToken) {
      // return throwError(() => new Error('No refresh token'));
      return EMPTY;
    }

    return this.http.post(`${this.API_URL}/token/refresh/`, {
      refresh: refreshToken
    }) 
      .pipe(
        map((response: any) => {
          return { access: response.access };
        })
      );
  }

  isLoggedIn() {
    return this.getJwtToken() !== null;
  }

  // ✅ STEP 1: Fetch CSRF token from backend and store cookie
  fetchCsrfToken() {
    const newAPI_URL = 'https://dev-civet-jq-api.tm4.org/api';
    return this.http.get(`${newAPI_URL}/csrf/`, { withCredentials: true }).pipe(
      tap((response) => {
        this.csrfToken = response['csrfToken'];
      })
    );
  }

  // ✅ STEP 2: Request password reset with CSRF token in header
  requestPasswordReset(email: string) {
    if (!this.csrfToken) {
      throw new Error('CSRF token is not available');
    }

    const headers = new HttpHeaders({
      'x-csrftoken': this.csrfToken,
      'Content-Type': 'application/json',
    });

    const newAPI_URL = 'https://dev-civet-jq-api.tm4.org/api';

    return this.http.post(
      `${newAPI_URL}/password_reset/`,
      { email },
      {
        headers: headers,
        withCredentials: true, // ensures cookie is sent
      }
    );
  }

  areTokensExpired(){
    const authToken = sessionStorage.getItem('AUTH_TOKEN');
    const refreshToken = sessionStorage.getItem('REFRESH_TOKEN');

    const tokenTime = parseInt(sessionStorage.getItem('TOKEN_TIMESTAMP') || '0');
    const isExpired = Date.now() - tokenTime > 1000 * 60 * 120; // 120mins example

    if (!authToken || !refreshToken || isExpired) {
      sessionStorage.removeItem('AUTH_TOKEN');
      sessionStorage.removeItem('REFRESH_TOKEN');
      sessionStorage.removeItem('TOKEN_TIMESTAMP');
    }
  }
}
