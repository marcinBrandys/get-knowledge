import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {AuthService} from "./auth.service";
import * as _ from 'lodash';

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

  login(email: string, password: string) {
    const requestPayload = {
      email: email,
      password: password
    };

    return this.http.post(this.REST_API_URL + 'user-management/login', requestPayload, this.httpOptions);
  }

  register(firstName: string, lastName: string, email: string, nick: string, password: string, gender: string, age: number, role: string, accessCode: string) {
    const requestPayload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
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
    return this.http.get(this.REST_API_URL + 'user-management/user/me', this.httpOptions);
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

  createTaskGroup(taskGroupName: string, isTestTaskGroup: boolean = false) {
    const requestPayload = {
      taskGroupName: taskGroupName,
      isTestTaskGroup: isTestTaskGroup
    };

    return this.http.post(this.REST_API_URL + 'task-group-management/create', requestPayload, this.httpOptions);
  }

  getTaskGroups() {
    return this.http.get(this.REST_API_URL + 'task-group-management/task-groups', this.httpOptions);
  }
}
