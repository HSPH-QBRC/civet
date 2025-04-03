import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  constructor(private router: Router) {}

  // canActivate(): boolean {
  //   // Check if there is an auth token in localStorage (simulated authentication)
  //   if (localStorage.getItem('authToken')) {
  //     return true;  // Allow route access if authenticated
  //   } else {
  //     // Redirect to login if not authenticated
  //     this.router.navigate(['/']);
  //     return false;
  //   }
  // }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Change to sessionStorage if needed

    if (isAuthenticated) {
      if (route.routeConfig?.path === '') {
        // If user tries to access '/', redirect to '/dashboard'
        this.router.navigate(['/dashboard']);
        return false; // Prevent navigation to login page
      }
      return true; // Allow access to protected routes
    } else {
      if (route.routeConfig?.path === 'dashboard') {
        // If trying to access dashboard while unauthenticated, redirect to login
        this.router.navigate(['/']);
        return false;
      }
      return true; // Allow navigation to login if not authenticated
    }
  }
}
