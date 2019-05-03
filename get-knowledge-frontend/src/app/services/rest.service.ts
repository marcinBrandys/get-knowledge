import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";
import * as _ from 'lodash';
import {Solution} from "../classes/solution";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private REST_API_URL: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    this.REST_API_URL = environment.REST_API_URL;
  }

  login(nick: string, password: string) {
    const requestPayload = {
      nick: nick,
      password: password
    };

    return this.http.post(this.REST_API_URL + 'user-management/login', requestPayload, this.httpOptions);
  }

  register(nick: string, password: string, gender: string, age: number, role: string, accessCode: string) {
    const requestPayload = {
      nick: nick,
      password: password,
      gender: gender,
      age: age,
      role: role,
      accessCode: accessCode
    };

    return this.http.post(this.REST_API_URL + 'user-management/users', requestPayload, this.httpOptions);
  }

  getUserInfo() {
    const currentTs: number = +new Date();

    return this.http.get(this.REST_API_URL + 'user-management/user/me/' + currentTs, this.httpOptions);
  }

  createGroup(groupName: string) {
    const requestPayload = {
      groupName: groupName
    };

    return this.http.post(this.REST_API_URL + 'group-management/create', requestPayload, this.httpOptions);
  }

  getGroups() {
    return this.http.get(this.REST_API_URL + 'group-management/groups', this.httpOptions);
  }

  addStudentToGroup(groupId: string, studentId: string) {
    const requestPayload = {
      studentId: studentId
    };

    return this.http.post(this.REST_API_URL + 'group-management/group/by_id/' + groupId, requestPayload, this.httpOptions);
  }

  removeStudentFromGroup(groupId: string, studentId: string) {
    const requestPayload = {
      studentId: studentId
    };
    let httpOptionsCopy = _.clone(this.httpOptions);
    httpOptionsCopy['body'] = requestPayload;

    return this.http.delete(this.REST_API_URL + 'group-management/group/by_id/' + groupId, httpOptionsCopy);
  }

  getStudents() {
    return this.http.get(this.REST_API_URL + 'user-management/students', this.httpOptions);
  }

  createTaskGroup(taskGroupName: string, isTestTaskGroup: boolean, startTs: number, endTs: number) {
    const requestPayload = {
      taskGroupName: taskGroupName,
      isTestTaskGroup: isTestTaskGroup,
      startTs: startTs,
      endTs: endTs
    };

    return this.http.post(this.REST_API_URL + 'task-group-management/create', requestPayload, this.httpOptions);
  }

  getTaskGroups() {
    return this.http.get(this.REST_API_URL + 'task-group-management/task-groups', this.httpOptions);
  }

  getTaskGroup(taskGroupId: string) {
    return this.http.get(this.REST_API_URL + 'task-group-management/task-group/' + taskGroupId, this.httpOptions);
  }

  getTestTasks(testId: string) {
    return this.http.get(this.REST_API_URL + 'task-management/test_tasks/' + testId, this.httpOptions);
  }

  getStudentTaskGroups() {
    return this.http.get(this.REST_API_URL + 'task-group-management/student-task-groups', this.httpOptions);
  }

  getStudentTests() {
    const currentTs: number = +new Date();

    return this.http.get(this.REST_API_URL + 'task-group-management/student-tests/' + currentTs, this.httpOptions);
  }

  createTask(taskTitle: string, taskGroup: string, taskType: string, taskContent: string, taskTip: string, taskPresentedValue: string, taskCorrectSolution: string, taskWeight: number, taskPoints: number) {
    const requestPayload = {
      taskTitle: taskTitle,
      taskGroup: taskGroup,
      taskType: taskType,
      taskContent: taskContent,
      taskTip: taskTip,
      taskPresentedValue: taskPresentedValue,
      taskCorrectSolution: taskCorrectSolution,
      taskWeight: taskWeight,
      taskPoints: taskPoints
    };

    return this.http.post(this.REST_API_URL + 'task-management/create', requestPayload, this.httpOptions);
  }

  getTask(taskGroup: string, taskType: string) {
    return this.http.get(this.REST_API_URL + 'task-management/task/' + taskGroup + '/' + taskType, this.httpOptions);
  }

  submitSolution(solution: Solution) {
    return this.http.post(this.REST_API_URL + 'solution-management/solution', solution, this.httpOptions);
  }

  getRanking() {
    return this.http.get(this.REST_API_URL + 'user-management/ranking', this.httpOptions);
  }

  getPrivateRanking() {
    return this.http.get(this.REST_API_URL + 'user-management/private_ranking', this.httpOptions);
  }
}
