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
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  nick = new FormControl('', [Validators.required]);
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  age = new FormControl('', [Validators.required, Validators.min(1), Validators.max(150)]);
  gender = new FormControl('', [Validators.required]);
  role = new FormControl('', [Validators.required]);
  genders = [
    {value: 'female', viewValue: this.translations.ATTRIBUTE_GENDER_FEMALE},
    {value: 'male', viewValue: this.translations.ATTRIBUTE_GENDER_MALE}
  ];
  roles = [
    {value: 'teacher', viewValue: this.translations.ATTRIBUTE_ROLE_TEACHER},
    {value: 'student', viewValue: this.translations.ATTRIBUTE_ROLE_STUDENT}
  ];
  passwordVisibilityState = true;
  @ViewChild(MatVerticalStepper) stepper: MatVerticalStepper;

  constructor(private restService: RestService, private notificationService: NotificationService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: this.email,
      password: this.password,
      nick: this.nick,
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      gender: this.gender,
      role: this.role
    });
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  onSubmit() {
    console.log(this.form.valid);
    if (this.form.valid) {
      this.register(this.email.value, this.password.value, this.nick.value, this.firstName.value, this.lastName.value,
        this.age.value, this.gender.value, this.role.value
      );
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  register(email: string, password: string, nick: string, firstName: string, lastName: string, age: number, gender: string, role: string) {
    this.restService.register(firstName, lastName, email, nick, password, gender, age, role).subscribe(
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

  getEmailErrorMessage() {
    return this.email.hasError('required') ? this.translations.EMAIL_REQUIRED :
      this.email.hasError('email') ? this.translations.EMAIL_INVALID : '';
  }

}
