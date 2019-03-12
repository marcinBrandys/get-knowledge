import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {FormControl, Validators} from "@angular/forms";
import {Translations} from "../translations/translations.enum";
import {NotificationService} from "../services/notification.service";
import {RestService} from "../services/rest.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  translations = Translations;
  form: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  passwordVisibilityState = true;

  constructor(private restService: RestService, private notificationService: NotificationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: this.email,
      password: this.password
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.login(this.email.value, this.password.value);
    }
  }

  login(email, password) {
    this.restService.login(email, password).subscribe(
      data => {
        console.log(data);
        this.notificationService.showNotification(this.translations.LOGIN_SUCCESS);
      },
      error => {
        console.log(error);
        this.notificationService.showNotification(this.translations.LOGIN_ERROR_WRONG_CREDENTIALS);
      }
    );
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? this.translations.EMAIL_REQUIRED :
      this.email.hasError('email') ? this.translations.EMAIL_INVALID : '';
  }
}
