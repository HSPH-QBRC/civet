import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { User } from './_models/user';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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
      })
    );
  }

  // store user details and token in local storage to keep user logged in between page refreshes
  private storeJwtToken(jwt: string) {
    sessionStorage.setItem('AUTH_TOKEN', jwt);
  }

  private storeRefreshToken(token: string) {
    sessionStorage.setItem("REFRESH_TOKEN", token);
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('AUTH_TOKEN');
    sessionStorage.removeItem("REFRESH_TOKEN");
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
      console.log('No refresh token');
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post(`${this.API_URL}/token/refresh/`, {
      refresh: refreshToken
    })  // ← REMOVE `responseType: 'text'`
      .pipe(
        map((response: any) => {
          console.log('Refresh token response: ', response);
          return { access: response.access };  // assuming backend returns { access: "..." }
        })
      );
  }

  isLoggedIn() {
    return this.getJwtToken() !== null;
  }

  // ✅ STEP 1: Fetch CSRF token from backend and store cookie
  fetchCsrfToken() {
    const newAPI_URL = 'https://dev-civet-api.tm4.org/api';
    // return this.http.get(`${newAPI_URL}/csrf/`, { withCredentials: true });
    return this.http.get(`${newAPI_URL}/csrf/`, { withCredentials: true }).pipe(
      tap((response) => {
        console.log("Full response from backend: ", response); 
        this.csrfToken = this.getCookie('csrftoken');  // Store CSRF token in memory
        console.log("csrfToken: ", this.csrfToken)
      })
    );
  }

  // ✅ STEP 2: Request password reset with CSRF token in header
  requestPasswordReset(email: string) {
    // const csrfToken = this.getCookie('csrftoken');
    // const newAPI_URL = 'https://dev-civet-api.tm4.org/api';

    // const headers = new HttpHeaders({
    //   'X-CSRFToken': csrfToken,
    //   'Content-Type': 'application/json',
    // });

    // return this.http.post(
    //   `${newAPI_URL}/password_reset/`,
    //   { email },
    //   {
    //     headers: headers,
    //     withCredentials: true, // ensures cookie is sent
    //   }
    // );
    if (!this.csrfToken) {
      throw new Error('CSRF token is not available');
    }

    const headers = new HttpHeaders({
      'X-CSRFToken': this.csrfToken,
      'Content-Type': 'application/json',
    });

    const newAPI_URL = 'https://dev-civet-api.tm4.org/api';

    return this.http.post(
      `${newAPI_URL}/password_reset/`,
      { email },
      {
        headers: headers,
        withCredentials: true, // ensures cookie is sent
      }
    );
  }

  // ✅ STEP 3: Utility to read a cookie by name
  private getCookie(name: string): string {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return '';
  }
}
