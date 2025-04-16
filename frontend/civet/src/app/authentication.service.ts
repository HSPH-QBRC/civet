import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
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
}
