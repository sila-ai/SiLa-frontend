import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class CustomerGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem('token')
    if (token !== null && token !== undefined) {
      try {
        const user: any = jwt_decode(token);
        return user.role === 'USER' ? true : false;
      } catch (error) {
        return false
      }
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
