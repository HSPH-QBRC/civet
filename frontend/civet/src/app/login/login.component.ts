import { Component } from '@angular/core';
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
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) { }

  onSubmit() {
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
    // sessionStorage.removeItem('AUTH_TOKEN');  // Remove auth token
    this.authService.logout();
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
