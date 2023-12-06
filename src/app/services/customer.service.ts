import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Customer } from '../models/customer';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  header: any;
  private customerSubject: BehaviorSubject<Customer>;
  public customer: Observable<Customer>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.customerSubject = new BehaviorSubject<Customer>(JSON.parse(localStorage.getItem('Customer')));
    this.customer = this.customerSubject.asObservable();
    const token = localStorage.getItem('token');
    this.header = { headers: { Authorization: `Bearer ${token}` } };
  }

  public get CustomerValue(): Customer {
    return this.customerSubject.value;
  }

  create(Customer: Customer) {
    return this.http.post(`${environment.apiUrl}/customers`,Customer,this.header).toPromise();
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/customers`).toPromise();
  }

  getById(id: string) {
    return this.http.get<Customer>(`${environment.apiUrl}/customers/${id}`).toPromise();
  }

  getStripeId(id: string){
    return this.http.get(`${environment.apiUrl}/customers/get-customer-stripe-id/${id}`).toPromise();
  }

  update(id, params) {
    return this.http.patch(`${environment.apiUrl}/customers/${id}`, params,this.header).toPromise();
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/customers/${id}`,this.header).toPromise();
  }
}
