// import { Injectable } from '@angular/core';
// // import { environment } from '@environments/environment';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { map, tap } from 'rxjs/operators';
// import { User } from './_models/user';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthenticationService {
//   private readonly API_URL = 'https://dev-civet-api.tm4.org/api';
//   private readonly API_NAME = 'CIVET';

//   private readonly JWT_TOKEN = this.API_NAME + 'JWT_TOKEN';
//   private readonly REFRESH_TOKEN = this.API_NAME + 'REFRESH_TOKEN';

//   constructor(private httpClient: HttpClient) {
//     // this.currentUserSubject = new BehaviorSubject<User>(
//     //   JSON.parse(sessionStorage.getItem('CIVETJWT_TOKEN'))
//     // );
//     // this.currentUserSubject = new BehaviorSubject<User>(
//     //   this.JWT_TOKEN ? JSON.parse(this.JWT_TOKEN) : 'test_string'
//     // );
//     // this.currentUser = this.currentUserSubject.asObservable();
//   }


//   /**
//    * User login
//    *
//    */
//   login(username: string, password: string) {
//     return this.httpClient
//       .post(`${this.API_URL}/token/`, {
//         'username': username,
//         'password': password
//       })
//       // .pipe(
//       //   map(user => {
//       //     // login successful if there's a token in the response: {'refresh': '<REFRESH TOKEN>', 'access': '<ACCESS_TOKEN>'}
//       //     // if (user && user.access) {
//       //     //   this.storeJwtToken(JSON.stringify(user.access));
//       //     //   this.storeRefreshToken(JSON.stringify(user.refresh));
//       //     //   this.currentUserSubject.next(user);
//       //     // }
//       //     return user;
//       //   })
//       // );
//   }

//   // store user details and token in local storage to keep user logged in between page refreshes
//   private storeJwtToken(jwt: string) {
//     sessionStorage.setItem(this.JWT_TOKEN, jwt);
//   }

//   /**
//    * Update refresh token in storage
//    *
//    */
//   private storeRefreshToken(token: string) {
//     sessionStorage.setItem(this.REFRESH_TOKEN, token);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { User } from './_models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { json } from 'd3';

@Injectable(
  {providedIn: 'root'}
)
export class AuthenticationService {
  private readonly API_URL = 'https://dev-civet-api.tm4.org/api';
  private readonly API_NAME = 'CIVET';
  private readonly JWT_TOKEN = this.API_NAME + 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = this.API_NAME + 'REFRESH_TOKEN';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem(this.API_NAME + 'JWT_TOKEN');
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
    sessionStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeRefreshToken(token: string) {
    sessionStorage.setItem(this.REFRESH_TOKEN, token);
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem(this.JWT_TOKEN);
    this.currentUserSubject.next(null);
  }

  getJwtToken(): string {
    const token = sessionStorage.getItem(this.JWT_TOKEN);
    return token ? JSON.parse(token) : null
  }

  private getRefreshToken() {
    const token = sessionStorage.getItem(this.REFRESH_TOKEN);
    return token ? JSON.parse(token) : null
  }

  private refreshToken() {
    const token = sessionStorage.getItem(this.REFRESH_TOKEN);
    console.log("token: ", token)
    return token ? JSON.parse(token) : null
  }

  isLoggedIn() {
    return this.getJwtToken() !== null;
  }
}
