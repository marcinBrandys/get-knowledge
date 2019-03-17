import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelper: JwtHelperService, private router: Router) { }

  public isAuthenticated(): boolean {
    const token = this.getToken();

    return token && !this.jwtHelper.isTokenExpired(token);
  }

  public getToken() {
    return localStorage.getItem('auth_token');
  }

  public saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  public removeToken() {
    localStorage.removeItem('auth_token');
  }

  public logout() {
    this.removeToken();
    this.router.navigate(['/login']);
  }
}
