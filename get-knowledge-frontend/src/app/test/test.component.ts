import { Component, OnInit } from '@angular/core';
import {RestService} from "../services/rest.service";
import {TaskGroup} from "../classes/task-group";
import * as _ from "lodash";
import {Translations} from "../translations/translations.enum";
import {formatDate} from "@angular/common";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  translations = Translations;
  userRole: string = null;
  tests: TaskGroup[] = [];
  availableTestsDisplayedColumns: string[] = ['taskGroupName', 'startTs', 'endTs', 'action'];
  teacherAvailableTestsDisplayedColumns: string[] = ['taskGroupName', 'startTs', 'endTs'];
  testResultColumn: string[] = [
    'taskGroupName', 'numberOfTasks', 'testCorrectSolutions', 'testPoints', 'maxPoints', 'percent'
  ];
  teacherTestResultColumn: string[] = [
    'index', 'taskGroupName', 'numberOfTasks', 'testCorrectSolutions', 'testPoints', 'maxPoints', 'percent'
  ];
  testsResult = [];
  isTestsResultLoaded: boolean = false;

  constructor(private restService: RestService, private router: Router, private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.getUserRole();
    this.getTests();
    this.getTestsResults();
  }

  getUserRole() {
    this.userRole = this.authService.getUserRole();
  }

  getTests() {
    this.restService.getTests().subscribe(
      data => {
        this.bindTests(data);
      },
      error => {
        this.notificationService.showNotification(this.translations.TITLE_GENERIC_ERROR);
      }
    )
  }

  bindTests(data: any) {
    this.tests = [];
    for (let taskGroup of data['tests']) {
      const taskGroupId = _.get(taskGroup, '_id', null);
      const taskGroupName = _.get(taskGroup, 'taskGroupName', null);
      const owner = _.get(taskGroup, 'owner', null);
      const isTestTaskGroup = _.get(taskGroup, 'isTestTaskGroup', null);
      const startTs = _.get(taskGroup, 'startTs', null);
      const endTs = _.get(taskGroup, 'endTs', null);
      if (taskGroupId) {
        this.tests.push(new TaskGroup(taskGroupId, taskGroupName, owner, isTestTaskGroup, startTs, endTs));
      }
    }
  }

  getTestsResults() {
    this.restService.getTestsResults().subscribe(
      data => {
        this.bindTestResult(data);
      },
      error => {
        this.notificationService.showNotification(this.translations.TITLE_GENERIC_ERROR);
      },
      () => {
        this.isTestsResultLoaded = true;
      }
    )
  }

  bindTestResult(data: any) {
    this.testsResult = _.clone(_.get(data, 'result', []));
  }

  getDate(ts: number): string {
    return formatDate(new Date(ts), 'medium', 'pl-PL');
  }

  goToTest(selectedTest: TaskGroup) {
    this.router.navigate(['/solver', selectedTest.id]);
  }

}
