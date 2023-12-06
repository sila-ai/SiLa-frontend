import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { Payment } from '../models/payment';
import {environment} from '../../environments/environment';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class PaymentService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  header: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();

    const token = localStorage.getItem('token');
    this.header = { headers : { Authorization: `Bearer ${token}` }};
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  create(payment: Payment) {
    return this.http.post(`${environment.apiUrl}/payment-method/create`, payment, this.header).toPromise();
  }

  attach(customer: any, paymentId: string) {
    return this.http.post(`${environment.apiUrl}/payment-method/${paymentId}/attach`, customer, this.header).toPromise();
  }

  getAll(params: any) {
    return this.http.post(`${environment.apiUrl}/payment-method`, params, this.header).toPromise();
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`, this.header);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params, this.header)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id == this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`, this.header)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        return x;
      }));
  }
  getInfobyid(params: any,id) {
    return this.http.get(`${environment.apiUrl}/payment-method/${id}`
    , this.header).toPromise();
  }

  updatePaymentinfo(parmas:any,id){
    return this.http.patch(`${environment.apiUrl}/payment-method/${id}`,
    parmas, this.header).toPromise();
  }

  deletecardinfo(id){
    return this.http.post(`${environment.apiUrl}/payment-method/${id}/detach`,'',this.header).toPromise();
  }
}
