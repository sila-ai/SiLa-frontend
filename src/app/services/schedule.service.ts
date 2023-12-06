import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Schedule } from '../models/schedule';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private scheduleSubject: BehaviorSubject<Schedule>;
  public schedule: Observable<Schedule>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.scheduleSubject = new BehaviorSubject<Schedule>(JSON.parse(localStorage.getItem('Schedule')));
    this.schedule = this.scheduleSubject.asObservable();
  }

  public get scheduleValue(): Schedule {
    return this.scheduleSubject.value;
  }

  create(Schedule: Schedule) {
    return this.http.post(`${environment.apiUrl}/subscription-schedules`, Schedule).toPromise();
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/subscription-schedules`).toPromise();
  }

  getById(id: string) {
    return this.http.get(`${environment.apiUrl}/subscription-schedules/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/subscription-schedules/${id}`, params)
      .pipe(map(x => {
          // update local storage
          const subscription = { ...this.scheduleValue, ...params };
          localStorage.setItem('subscription', JSON.stringify(subscription));

          // publish updated subscription to subscribers
          this.scheduleSubject.next(subscription);
          return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/subscription-schedules/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in subscription deleted their own record
        return x;
      }));
  }
}
