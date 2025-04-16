import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // const isAuthenticated = !!localStorage.getItem('authToken');

    // const targetPath = route.routeConfig?.path;

    // if (isAuthenticated) {
    //   if (targetPath === '') {
    //     // Already logged in and trying to access login — redirect to dashboard
    //     this.router.navigate(['/dashboard']);
    //     return false;
    //   }
    //   return true; // Access granted to protected routes
    // } else {
    //   if (targetPath === 'dashboard') {
    //     // Not logged in and trying to access dashboard — redirect to login
    //     this.router.navigate(['/']);
    //     return false;
    //   }
    //   return true; // Allow unauthenticated access to login
    // }
    const token = localStorage.getItem('AUTH_TOKEN');

    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
