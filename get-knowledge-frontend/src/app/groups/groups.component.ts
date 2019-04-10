import { Component, OnInit } from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Group} from "../classes/group";
import {User} from "../classes/user";
import {AuthService} from "../services/auth.service";
import {RestService} from "../services/rest.service";
import * as _ from "lodash";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  translations = Translations;
  groupCreationForm: FormGroup;
  groupName = new FormControl('', [Validators.required]);
  groups: Group[] = [];
  students: User[] = [];
  studentsOfGroup: User[] = [];

  constructor(private auth: AuthService, private restService: RestService, private fb: FormBuilder) { }

  ngOnInit() {
    this.groupCreationForm = this.fb.group({
      groupName: this.groupName
    });
    this.getUserInfo();
    this.getGroups();
    this.getStudents();
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
          const owner = _.get(group, 'owner', null);
          const students = _.get(group, 'students', null);
          this.groups.push(new Group(groupId, groupName, owner, students));
        }
        this.getStudentsOfGroup();
        console.log(this.groups);
      },
      error => {
        console.log(error);
      }
    )
  }

  addStudentToGroup(studentId: string) {
    if (this.groups.length > 0) {
      this.restService.addStudentToGroup(this.groups[0].id, studentId).subscribe(
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

  getStudents() {
    this.students = [];
    this.restService.getStudents().subscribe(
      data => {
        for (let student of data['students']) {
          const id = _.get(student, '_id', null);
          const role = _.get(student, 'role', null);
          const firstName = _.get(student, 'firstName', null);
          const lastName = _.get(student, 'lastName', null);
          const nick = _.get(student, 'nick', null);
          const email = _.get(student, 'email', null);
          const gender = _.get(student, 'gender', null);
          const age = _.get(student, 'age', null);
          this.students.push(new User(id, role, firstName, lastName, nick, email, gender, age));
        }
        console.log(this.students);
      },
      error => {
        console.log(error);
      }
    )
  }

  getStudentsOfGroup() {
    this.studentsOfGroup = [];
    this.restService.getStudentsOfGroup(this.groups[0].id).subscribe(
      data => {
        for (let student of data['students']) {
          const id = _.get(student, '_id', null);
          const role = _.get(student, 'role', null);
          const firstName = _.get(student, 'firstName', null);
          const lastName = _.get(student, 'lastName', null);
          const nick = _.get(student, 'nick', null);
          const email = _.get(student, 'email', null);
          const gender = _.get(student, 'gender', null);
          const age = _.get(student, 'age', null);
          this.studentsOfGroup.push(new User(id, role, firstName, lastName, nick, email, gender, age));
        }
        console.log(this.studentsOfGroup);
      },
      error => {
        console.log(error);
      }
    )
  }

}
