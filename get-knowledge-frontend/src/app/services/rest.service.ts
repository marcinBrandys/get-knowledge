import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private REST_API_URL: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'x-access-token': this.auth.getToken()
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

  register(firstName: string, lastName: string, email: string, nick: string, password: string, gender: string, age: number, role: string) {
    const requestPayload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      nick: nick,
      password: password,
      gender: gender,
      age: age,
      role: role
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

    return this.http.post(this.REST_API_URL + 'group-management/create', requestPayload, this.httpOptions)
  }

  getGroups() {
    return this.http.get(this.REST_API_URL + 'group-management/groups', this.httpOptions);
  }

  addStudentToGroup(groupId: string, studentId: string) {
    const requestPayload = {
      studentId: studentId
    };

    return this.http.post(this.REST_API_URL + 'group-management/group/by_id/' + groupId, requestPayload, this.httpOptions)
  }

  getStudents() {
    return this.http.get(this.REST_API_URL + 'user-management/students', this.httpOptions);
  }

  getStudentsOfGroup(groupId: string) {
    return this.http.get(this.REST_API_URL + 'group-management/studentsOfGroup/' + groupId, this.httpOptions)
  }
}
