import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { User } from './_models/user';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable(
  { providedIn: 'root' }
)
export class AuthenticationService {
  private readonly API_URL = environment.API_URL;
  // private readonly API_URL = 'https://dev-civet-api.tm4.org/api';
  // private readonly API_NAME = 'CIVET ';
  // private readonly JWT_TOKEN = this.API_NAME + 'JWT_TOKEN';
  // private readonly REFRESH_TOKEN = this.API_NAME + 'REFRESH_TOKEN';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    // const token = localStorage.getItem(this.API_NAME + 'JWT_TOKEN');
    const token = localStorage.getItem('AUTH_TOKEN');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      token ? JSON.parse(token) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {

    return this.http.post<User>(`${this.API_URL}/token/`, {
      'username': username,
      'password': password
    }).pipe(
      map(user => {
        // login successful if there's a token in the response: {'refresh': '<REFRESH TOKEN>', 'access': '<ACCESS_TOKEN>'}
        console.log("login: ", user)
        if (user && user['access']) {
          this.storeJwtToken(JSON.stringify(user['access']));
          this.storeRefreshToken(JSON.stringify(user['refresh']));
          this.currentUserSubject.next(user);
        }
        return user;
      })
    );
  }

  // store user details and token in local storage to keep user logged in between page refreshes
  private storeJwtToken(jwt: string) {
    console.log("jwt: ", jwt)
    // localStorage.setItem(this.JWT_TOKEN, jwt);
    localStorage.setItem('AUTH_TOKEN', jwt);
  }

  private storeRefreshToken(token: string) {
    console.log("refresh token ", token)
    // localStorage.setItem(this.REFRESH_TOKEN, token);
    sessionStorage.setItem("REFRESH_TOKEN", token);
  }

  logout() {
    // remove user from local storage to log user out
    // localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem('AUTH_TOKEN');
    this.currentUserSubject.next(null);
  }

  getJwtToken(): string {
    // const token = localStorage.getItem(this.JWT_TOKEN);
    const token = localStorage.getItem('AUTH_TOKEN');
    return token ? JSON.parse(token) : null
  }

  private getRefreshToken() {
    // const token = localStorage.getItem(this.REFRESH_TOKEN);
    const token = sessionStorage.getItem("REFRESH_TOKEN");
    return token ? JSON.parse(token) : null
  }

  // private refreshToken() {
  //   console.log("calling refreshtoken()")
  //   // const token = sessionStorage.getItem(this.REFRESH_TOKEN);
  //   const refresh = sessionStorage.getItem("REFRESH_TOKEN");
  //   return refresh ? JSON.parse(refresh) : null
  //   // return this.http.post(`${this.API_URL}/token/refresh/`, { refresh });
  // }
  // refreshToken(): Observable<any> {
  //   const refreshToken = sessionStorage.getItem('REFRESH_TOKEN');
  //   if (!refreshToken) {
  //     console.log('No refresh token')
  //     // return throwError(() => new Error('No refresh token'));
  //   }
  //   console.log("refresh token: ", refreshToken)

  //   return this.http.post(`${this.API_URL}/token/refresh/`, {
  //     refresh: refreshToken
  //   });
  // }
  // refreshToken(): Observable<any> {
  //   const refreshToken = sessionStorage.getItem('REFRESH_TOKEN').replace(/^"(.*)"$/, '$1');

  //   if (!refreshToken) {
  //     console.log('No refresh token found');
  //     return throwError(() => new Error('No refresh token found'));
  //   }

  //   console.log("Sending refresh token:", refreshToken, `${this.API_URL}/token/refresh/`);

  //   return this.http.post(`${this.API_URL}/token/refresh/`, {
  //     refresh: refreshToken
  //   }).pipe(
  //     tap((res) => {
  //       console.log("Refresh token successful. New access token:", res);
  //     }),
  //     catchError(err => {
  //       console.error("Refresh token request failed:", err);
  //       return throwError(err);
  //     })
  //   );
  // }

  // refreshToken(): Observable<any> {
  //   const refreshToken = sessionStorage.getItem('REFRESH_TOKEN').replace(/^"(.*)"$/, '$1');
  //   if (!refreshToken) {
  //     console.log('No refresh token');
  //     return throwError(() => new Error('No refresh token'));
  //   }
  //   console.log("refresh token: ", refreshToken);

  //   return this.http.post(`${this.API_URL}/token/refresh/`, {
  //     refresh: refreshToken
  //   }, { responseType: 'text' }) // Still get raw text response
  //     .pipe(
  //       map(response => {
  //         const parsed = JSON.parse(response);  // parse the string into an object
  //         console.log('Parsed refresh token response:', parsed);
  //         return { access: parsed.access };     // unwrap cleanly
  //       })
  //     );
  // }
  refreshToken(): Observable<any> {
    const refreshToken = sessionStorage.getItem('REFRESH_TOKEN');
    if (!refreshToken) {
      console.log('No refresh token');
      return throwError(() => new Error('No refresh token'));
    }

    console.log("refresh token: ", refreshToken);

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
}
