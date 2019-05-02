import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {FormControl, Validators} from "@angular/forms";
import {Translations} from "../translations/translations.enum";
import {NotificationService} from "../services/notification.service";
import {RestService} from "../services/rest.service";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  translations = Translations;
  form: FormGroup;
  nick = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  passwordVisibilityState = true;

  constructor(private restService: RestService, private notificationService: NotificationService, private fb: FormBuilder, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nick: this.nick,
      password: this.password
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.login(this.nick.value, this.password.value);
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  login(nick, password) {
    this.restService.login(nick, password).subscribe(
      data => {
        this.notificationService.showNotification(this.translations.LOGIN_SUCCESS);
        this.auth.saveToken(_.get(data, 'token'));
        this.goToDashboard();
      },
      error => {
        this.notificationService.showNotification(this.translations.LOGIN_ERROR_WRONG_CREDENTIALS);
      }
    );
  }
}
