import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import axios from 'restyped-axios';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private currentUser: any;

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check if logged in
    if (localStorage.getItem('currentUser')) {
      // updaten authorization header (is sent with every axios http request)
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      axios.defaults.headers.common['Authorization'] = this.currentUser.token_type + ' ' + this.currentUser.access_token;
      axios.defaults.headers.common['_isRetry'] = false;

      return true;
    }

    // redirect to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
