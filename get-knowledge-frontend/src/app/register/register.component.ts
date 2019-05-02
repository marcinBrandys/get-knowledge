import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RestService} from "../services/rest.service";
import {NotificationService} from "../services/notification.service";
import {Router} from "@angular/router";
import {MatVerticalStepper} from "@angular/material";
import * as _ from 'lodash';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  translations = Translations;
  form: FormGroup;
  password = new FormControl('', [Validators.required]);
  nick = new FormControl('', [Validators.required]);
  age = new FormControl('', [Validators.required, Validators.min(1), Validators.max(150)]);
  gender = new FormControl('', [Validators.required]);
  role = new FormControl('', [Validators.required]);
  accessCode = new FormControl('');
  genders = [
    {value: 'female', viewValue: this.translations.ATTRIBUTE_GENDER_FEMALE},
    {value: 'male', viewValue: this.translations.ATTRIBUTE_GENDER_MALE}
  ];
  roles = [
    {value: 'teacher', viewValue: this.translations.ATTRIBUTE_ROLE_TEACHER},
    {value: 'student', viewValue: this.translations.ATTRIBUTE_ROLE_STUDENT}
  ];
  passwordInvisibilityState = true;
  accessCodeInvisibilityState = true;
  @ViewChild(MatVerticalStepper) stepper: MatVerticalStepper;

  constructor(private restService: RestService, private notificationService: NotificationService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: this.password,
      nick: this.nick,
      age: this.age,
      gender: this.gender,
      role: this.role,
      accessCode: this.accessCode
    });
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  onSubmit() {
    if (this.form.valid) {
      this.register(
        this.password.value, this.nick.value,
        this.age.value, this.gender.value,
        this.role.value, this.accessCode.value
      );
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  register(password: string, nick: string, age: number, gender: string, role: string, accessCode: string) {
    this.restService.register(nick, password, gender, age, role, accessCode).subscribe(
      data => {
        this.notificationService.showNotification(this.translations.REGISTER_SUCCESS);
        this.goToLogin();
      },
      error => {
        console.log(error);
        if (_.get(error, 'error.error.code') === 11000) {
          this.notificationService.showNotification(this.translations.REGISTER_FAIL_DUPLICATE_KEY);
        } else {
          this.notificationService.showNotification(this.translations.REGISTER_FAIL);
        }
      }
    );
  }

}
