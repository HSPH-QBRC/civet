import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  resetError = false;
  private readonly API_URL = environment.API_URL;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit(): void {
    if (!this.token) {
      this.resetError = true;
      this.onErrorSnackbar('Missing reset token.');
      return;
    }

    const { password, confirmPassword } = this.resetForm.value;
    if (password !== confirmPassword) {
      this.onErrorSnackbar('Passwords do not match.');
      return;
    }

    const resetUrl = `${this.API_URL}/password_reset/confirm/`;
    const body = {
      token: this.token,
      password: password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(resetUrl, body, { headers }).subscribe({
      next: () => {
        this.onErrorSnackbar('Password has been reset! Redirecting...');
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (error: HttpErrorResponse) => {
        this.resetError = true;
        let message = 'An error occurred while resetting your password.';
        console.log("error: ", error)
  
        if (error.status === 400) {
          if (error.error && error.error.token) {
            message = 'Invalid or expired token.';
          } else if (error.error && error.error.password) {
            message = `Password error: ${error.error.password.join(', ')}`;
          }
        } else if (error.status === 0) {
          message = 'Cannot connect to server.';
        }
  
        this.onErrorSnackbar(message);
      }
    });
  }

  onErrorSnackbar(message): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }
}
