import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Subscription } from '../models/subscription';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SubscriptionsService {
  private subscriptionSubject: BehaviorSubject<Subscription>;
  public subscription: Observable<Subscription>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.subscriptionSubject = new BehaviorSubject<Subscription>(JSON.parse(localStorage.getItem('subscription')));
    this.subscription = this.subscriptionSubject.asObservable();
  }

  public get subscriptionValue(): Subscription {
    return this.subscriptionSubject.value;
  }

  create(subscription: Subscription) {
    return this.http.post(`${environment.apiUrl}/subscriptions/create`, subscription).toPromise();
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/subscriptions`).toPromise();
  }

  getCustomerSubscription(id: string) {
    return this.http.get(`${environment.apiUrl}/subscriptions/customer/${id}`).toPromise();
  }

  getById(id: string) {
    return this.http.get(`${environment.apiUrl}/subscriptions/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/subscriptions/${id}`, params)
      .pipe(map(x => {
          // update local storage
          const subscription = { ...this.subscriptionValue, ...params };
          localStorage.setItem('subscription', JSON.stringify(subscription));

          // publish updated subscription to subscribers
          this.subscriptionSubject.next(subscription);
          return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/subscriptions/${id}`).toPromise();
  }

  getcurrentSubcription(id){
    return this.http.get(`${environment.apiUrl}/subscriptions/customer/latest/${id}`).toPromise();
  }

  reactivateSubcription(id){
    return this.http.get(`${environment.apiUrl}/subscriptions/reactivate/${id}`).toPromise();
  }

  getInvoiceList(id: string) {
    return this.http.get(`${environment.apiUrl}/invoice/customer/${id}`).toPromise();
  }

  getInvoicedetail(id:string){
    return this.http.get(`${environment.apiUrl}/invoice/${id}`).toPromise();
  }

  getAddonList(){
    return this.http.get(`${environment.apiUrl}/session`).toPromise();
  }
}
