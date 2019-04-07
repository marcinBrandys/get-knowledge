import { Component, OnInit } from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {AuthService} from "../services/auth.service";
import {RestService} from "../services/rest.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  translations = Translations;

  constructor(private auth: AuthService, private restService: RestService) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.restService.getUserInfo().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  logout() {
    this.auth.logout();
  }

}
