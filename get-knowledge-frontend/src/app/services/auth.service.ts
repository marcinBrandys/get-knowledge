import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt_decode from "jwt-decode";
import {Router} from "@angular/router";
import {User} from "../classes/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelper: JwtHelperService, private router: Router) { }

  public isAuthenticated(): boolean {
    const token = this.getToken();

    return token && !this.jwtHelper.isTokenExpired(token);
  }

  public getUserRole(): string {
    try {
      return jwt_decode(this.getToken()).user.role;
    }
    catch (Error) {
      return null;
    }
  }

  public getUser(): User {
    try {
      const user = jwt_decode(this.getToken()).user;

      return new User(user.id, user.role, user.firstName, user.lastName, user.nick, user.email, user.gender, user.age);
    }
    catch (Error) {
      return null;
    }
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
