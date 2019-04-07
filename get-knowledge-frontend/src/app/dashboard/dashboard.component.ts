import { Component, OnInit } from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {AuthService} from "../services/auth.service";
import {RestService} from "../services/rest.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Group} from "../classes/group";
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  translations = Translations;
  groupCreationForm: FormGroup;
  groupName = new FormControl('', [Validators.required]);
  groups: Group[] = [];

  constructor(private auth: AuthService, private restService: RestService, private fb: FormBuilder) { }

  ngOnInit() {
    this.groupCreationForm = this.fb.group({
      groupName: this.groupName
    });
    this.getUserInfo();
    this.getGroups();
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

  createGroup() {
    if (this.groupCreationForm.valid) {
      this.restService.createGroup(this.groupName.value).subscribe(
        data => {
          console.log(data);
          this.getGroups();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  getGroups() {
    this.groups = [];
    this.restService.getGroups().subscribe(
      data => {
        for (let group of data['groups']) {
          const groupId = _.get(group, '_id', null);
          const groupName = _.get(group, 'groupName', null);
          this.groups.push(new Group(groupId, groupName));
        }
        console.log(this.groups);
      },
      error => {
        console.log(error);
      }
    )
  }

}
