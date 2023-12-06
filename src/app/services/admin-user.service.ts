import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  header: any;

  constructor(
    private http: HttpClient
  ) {
    const token = localStorage.getItem('token');
    this.header = { headers : { Authorization: `Bearer ${token}` }};
  }

  create(Customer: User) {
    return this.http.post(`${environment.apiUrl}/users/create`, Customer,this.header).toPromise();
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/users/role/ADMIN`, this.header).toPromise();
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`, this.header).toPromise();
  }

  update(id, params) {
    return this.http.patch(`${environment.apiUrl}/users/update/${id}`, params, this.header).toPromise();
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/delete/${id}`,this.header).toPromise();
  }
}
