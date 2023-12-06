import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrafficService {
  redirect;
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getuserTrafic(start = null, end = null) {
    if (start && end) {
      return this.http.get(
        `${environment.apiUrl}/traffic/user?start=${start}&end=${end}`
      );
    } else {
      return this.http.get(`${environment.apiUrl}/traffic/user`);
    }
  }

  sendTrafficRule(obj) {
    return this.http.post(
      `${environment.apiUrl}/url/rule`,
      obj,
      this.httpOptions
    );
  }
  getAnalytics() {
    return this.http.get(`${environment.apiUrl}/analytics`);
  }
  getLeftClicks() {
    return this.http.get(`${environment.apiUrl}/traffic/clicks`);
  }
}
