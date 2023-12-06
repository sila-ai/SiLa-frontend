import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SetupService {
  constructor(private http: HttpClient, private router: Router) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getUrlList() {
    return this.http.get(`${environment.apiUrl}/url/list`);
  }
  getSetup(id, editId, mode) {
    return this.http.get(
      `${environment.apiUrl}/url/get?edit=${editId}&mode=${mode}`
    );
  }
  getRule() {
    return this.http.get(`${environment.apiUrl}/url/rule`);
  }
  createSetup(obj) {
    return this.http.post(
      `${environment.apiUrl}/url/create`,
      obj,
      this.httpOptions
    );
  }
  updateSetup(obj) {
    return this.http.post(
      `${environment.apiUrl}/url/update`,
      obj,
      this.httpOptions
    );
  }
  deleteSetup(obj) {
    return this.http.post(
      `${environment.apiUrl}/url/delete`,
      obj,
      this.httpOptions
    );
  }
}
