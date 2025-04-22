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
    this.authService.fetchCsrfToken().subscribe({
      next: () => {
        console.log("received csrf token")
        this.authService.requestPasswordReset(this.email).subscribe({
          next: () => console.log('Reset email sent!'),
          error: err => console.error('Error sending reset email', err),
        });
      },
      error: err => console.error('Error fetching CSRF token', err),
    });
  }
}
