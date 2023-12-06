import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  constructor(private http: HttpClient, private router: Router) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getConnectGoogle() {
    return this.http.get(`${environment.apiUrl}/ads/auth`);
  }
  getAdwordToken(code) {
    return this.http.get(`${environment.apiUrl}/ads/token/auth?code=${code}`);
  }
  postSendAccount(obj) {
    return this.http.post(
      `${environment.apiUrl}/ads/select`,
      obj,
      this.httpOptions
    );
  }
  getCampaign() {
    return this.http.get(`${environment.apiUrl}/ads/campaigns`);
  }

  updateAccount(obj) {
    return this.http.post(
      `${environment.apiUrl}/ads/account`,
      obj,
      this.httpOptions
    );
  }
  getAccount() {
    return this.http.get(`${environment.apiUrl}/ads/account`);
  }
}
