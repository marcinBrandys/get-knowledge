import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import * as _ from 'lodash';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import {environment} from "../environments/environment";

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

  constructor(private authService: AuthService, private router: Router, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    if (environment.production) {
      angulartics2GoogleAnalytics.startTracking();
    }
  }

  isHeaderVisible(): boolean {
    return !_.includes(this.headerHiddenRoutes, this.router.url);
  }
}
