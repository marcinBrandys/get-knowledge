import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'get-knowledge-frontend';
  headerHiddenRoutes: string[] = [
    '/login',
    '/register'
  ];

  constructor(private authService: AuthService, private router: Router) {}

  isHeaderVisible(): boolean {
    return this.authService.isAuthenticated() && (!_.includes(this.headerHiddenRoutes, this.router.url));
  }
}
