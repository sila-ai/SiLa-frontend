import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import {environment} from '../../environments/environment';
import { BankAccount } from '../models/bank-account';

@Injectable({
  providedIn: 'root'
})

export class BankAccountService {
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
    this.header = { headers : { Authorization:  `Bearer ${token}` }};
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  generateBankToken(bank: BankAccount){
    return this.http.post(`${environment.apiUrl}/customers/generate-token`, bank, this.header).toPromise();
  }

  create(source: any, customerId: string) {
    return this.http.post(`${environment.apiUrl}/bank-account/${customerId}`, source, this.header).toPromise();
  }

  verify(customerId: string, bankId: string, params: any ) {
    return this.http.post(`${environment.apiUrl}/bank-account/${customerId}/${bankId}/verify`, params, this.header).toPromise();
  }

  attach(customer: any, paymentId: string) {
    return this.http.post(`${environment.apiUrl}/payment-method/${paymentId}/attach`, customer).toPromise();
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/payment-method`).toPromise();
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
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
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        return x;
      }));
  }
}
