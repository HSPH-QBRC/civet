import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly API_URL = environment.API_URL;

  username = 'saron';
  password = '';

  constructor(
    // private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) { }

  onSubmit() {
    // this.http.post(`${this.API_URL}/token/`, {
    //   username: this.username,
    //   password: this.password
    // }).subscribe((res: any) => {
    //   localStorage.setItem('authToken', res.access);
    //   this.router.navigate(['/dashboard']);  // Redirect after login
    // }, error => {
    //   let message = 'Invalid username or password!'
    //   this.onErrorSnackbar(message)
    //   this.password = '';
    // });
    this.authService.login(this.username, this.password)
    .subscribe(res=>{
      this.router.navigate(['/dashboard']);  // Redirect after login
    }, error => {
      console.log("log error: ", error)
      let message = 'Login failed!';
      if (error.status === 401) {
        message = 'Invalid username or password!';
      } else if (error.status === 0) {
        message = 'Network error. Please check your connection.';
      } else {
        message = `Unexpected error: ${error.message}`;
      }
      this.onErrorSnackbar(message);
      this.password = '';
    }
    );
  }

  logout() {
    localStorage.removeItem('AUTH_TOKEN');  // Remove auth token
    this.router.navigate(['/']);  // Redirect to login page
  }

  onErrorSnackbar(message): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }
}
