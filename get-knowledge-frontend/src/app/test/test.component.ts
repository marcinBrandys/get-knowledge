import { Component, OnInit } from '@angular/core';
import {RestService} from "../services/rest.service";
import {TaskGroup} from "../classes/task-group";
import * as _ from "lodash";
import {Translations} from "../translations/translations.enum";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  translations = Translations;
  tests: TaskGroup[] = [];
  availableTestsDisplayedColumns: string[] = ['taskGroupName', 'startTs', 'endTs', 'action'];

  constructor(private restService: RestService) { }

  ngOnInit() {
    this.getStudentTests();
  }

  getStudentTests() {
    this.restService.getStudentTests().subscribe(
      data => {
        this.bindStudentTests(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  bindStudentTests(data: any) {
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

  getDate(ts: number): string {
    return formatDate(new Date(ts), 'medium', 'pl-PL');
  }

  goToTest(selectedTest: TaskGroup) {
    console.log(selectedTest);
  }

}
