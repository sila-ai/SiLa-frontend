import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClickLogService {

  constructor(
      private http: HttpClient,
      private router: Router
  ) { }
 
  getClickLog() {
    return this.http.get(`${environment.apiUrl}/clickLog/`).toPromise();
  }
 
}
