import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";

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

  constructor(private http: HttpClient) {
    this.REST_API_URL = environment.REST_API_URL;
  }

  login(email: string, password: string) {
    const requestPayload = {
      email: email,
      password: password
    };

    return this.http.post(this.REST_API_URL + 'user-management/login', requestPayload, this.httpOptions);
  }
}
