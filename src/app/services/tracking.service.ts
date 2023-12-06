import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  redirect 
  constructor(
      private http: HttpClient
  ) { }
 
  getTracking( ) {
    return this.http.get(`${environment.apiUrl}/analytics/script`) 
  }
}
