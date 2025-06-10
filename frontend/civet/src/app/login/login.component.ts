import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private readonly API_URL = environment.API_URL;

  username = '';
  password = '';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authService.areTokensExpired()
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.onErrorSnackbar('Username and password are required.');
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: res => {
        this.router.navigate(['/']);
      },
      error: error => {
        console.log("submit error: ", error)
        const message = error.message || 'Login failed!';
        this.onErrorSnackbar(message);
        this.password = '';
      }
    });
  }

  logout(): void {
    sessionStorage.removeItem('AUTH_TOKEN');
    sessionStorage.removeItem('REFRESH_TOKEN');
    this.router.navigate(['/login']);
  }

  onErrorSnackbar(message): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }
}
