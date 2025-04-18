import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  email = '';
  submit() {
    console.log("email to reset: ", this.email)
    // this.authService.requestPasswordReset(this.email).subscribe({
    //   next: () => alert('Password reset email sent!'),
    //   error: err => alert('Something went wrong.')
    // });
    this.authService.fetchCsrfToken().subscribe({
      next: () => {
        this.authService.requestPasswordReset(this.email).subscribe({
          next: () => console.log('Reset email sent!'),
          error: err => console.error('Error sending reset email', err),
        });
      },
      error: err => console.error('Error fetching CSRF token', err),
    });
  }
}
