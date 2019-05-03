import {Component, OnInit} from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Group} from "../classes/group";
import {User} from "../classes/user";
import {AuthService} from "../services/auth.service";
import {RestService} from "../services/rest.service";
import * as _ from "lodash";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  translations = Translations;
  groupCreationForm: FormGroup;
  groupName = new FormControl('', [Validators.required]);
  groupStudentAddForm: FormGroup;
  selectGroup = new FormControl('', [Validators.required]);
  selectStudent = new FormControl('', [Validators.required]);
  groups: Group[] = [];
  students: User[] = [];
  displayedColumns: string[] = ['nick', 'age', 'action'];

  constructor(private auth: AuthService, private restService: RestService, private fb: FormBuilder, private notificationService: NotificationService) { }

  ngOnInit() {
    this.groupCreationForm = this.fb.group({
      groupName: this.groupName
    });
    this.groupStudentAddForm = this.fb.group({
      selectGroup: this.selectGroup,
      selectStudent: this.selectStudent
    });
    this.getGroups();
    this.getStudents();
  }

  createGroup() {
    if (this.groupCreationForm.valid) {
      this.restService.createGroup(this.groupName.value).subscribe(
        data => {
          console.log(data);
          this.getGroups();
          this.notificationService.showNotification(this.translations.TITLE_GROUP_ADDED);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  addStudentToGroup() {
    if (this.groupStudentAddForm.valid) {
      this.restService.addStudentToGroup(this.selectGroup.value, this.selectStudent.value).subscribe(
        data => {
          this.getGroups();
          this.notificationService.showNotification(this.translations.TITLE_STUDENT_ADDED);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  getGroups() {
    this.restService.getGroups().subscribe(
      data => {
        this.bindGroups(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  getStudents() {
    this.students = [];
    this.restService.getStudents().subscribe(
      data => {
        for (let student of data['students']) {
          const id = _.get(student, '_id', null);
          const role = _.get(student, 'role', null);
          const nick = _.get(student, 'nick', null);
          const gender = _.get(student, 'gender', null);
          const age = _.get(student, 'age', null);
          this.students.push(new User(id, role, nick, gender, age));
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  bindGroups(data: any) {
    this.groups = [];
    for (let group of data['groups']) {
      const groupId = _.get(group, '_id', null);
      const groupName = _.get(group, 'groupName', null);
      const owner = _.get(group, 'owner', null);
      const students = _.get(group, 'students', null);
      let studentsList: User[] = [];
      for (let student of students) {
        const id = _.get(student, '_id', null);
        const role = _.get(student, 'role', null);
        const nick = _.get(student, 'nick', null);
        const gender = _.get(student, 'gender', null);
        const age = _.get(student, 'age', null);
        studentsList.push(new User(id, role, nick, gender, age));
      }
      this.groups.push(new Group(groupId, groupName, owner, studentsList));
    }
  };

  removeStudentFromGroup(groupId: string, studentId: string) {
    this.restService.removeStudentFromGroup(groupId, studentId).subscribe(
      data => {
        this.getGroups();
      },
      error => {
        console.log(error);
      }
    )
  }
}
