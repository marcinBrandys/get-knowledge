import { Component, OnInit } from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  translations = Translations;
  userRole: string = 'student';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.getUserRole();
  }

  getUserRole(): string {
    return this.authService.getUserRole();
  }

  teacherRequirementFulfilled() {
    return this.userRole === 'teacher' || this.userRole === 'admin';
  }

  logout() {
    this.authService.logout();
  }
}
