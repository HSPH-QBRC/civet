import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    // this.http.post('http://127.0.0.1:8000/api/token/', {
    //   username: this.username,
    //   password: this.password
    // }).subscribe((res: any) => {
    //   localStorage.setItem('token', res.access);
    //   this.router.navigate(['/dashboard']);  // Redirect after login
    // }, error => {
    //   console.error('Login failed', error);
    // });
    if (this.email === 'saronnhong@gmail.com' && this.password === 'password123') {
    // Simulating a successful login
    localStorage.setItem('authToken', 'fake-jwt-token'); // Store a fake token
    this.router.navigate(['/dashboard']); // Redirect to dashboard
    }else{
      let message = 'Invalid email or password!'
      this.onErrorSnackbar(message)
      // this.email = '';
      this.password = '';
    }
  }

  logout() {
    localStorage.removeItem('authToken');  // Remove auth token
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
