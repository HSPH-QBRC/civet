import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  isSubmitting = false;

  constructor(
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  submit() {
    if (!this.email || !this.validateEmail(this.email)) {
      this.showMessage('Please enter a valid email address.');
      return;
    }

    this.isSubmitting = true;

    this.authService.fetchCsrfToken().subscribe({
      next: () => {
        this.authService.requestPasswordReset(this.email).subscribe({
          next: () => {
            this.showMessage('Reset email sent! Please check your inbox.');
            this.isSubmitting = false;
          },
          error: err => {
            console.error('Error sending reset email', err);
            this.showMessage('Failed to send reset email. Please try again later.');
            this.isSubmitting = false;
          },
        });
      },
      error: err => {
        console.error('Error fetching CSRF token', err);
        this.showMessage('Could not initiate password reset. Please try again later.');
        this.isSubmitting = false;
      },
    });
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
