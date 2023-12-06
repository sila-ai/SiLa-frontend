import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  header: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    const token = localStorage.getItem('token');
    this.header = { headers : { Authorization: `Bearer ${token}` }};
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, password}).toPromise();
  }

  forgotPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/auth/forgotPassword`, { email }).toPromise();
  }

  getLoggedInUser(): any{
    return this.http.get<User>(`${environment.apiUrl}/auth`).toPromise();
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/auth/logout`).toPromise();
  }

  register(user: any) {
    if(!user.is_agree){
      user.is_agree="";
      return this.http.post(`${environment.apiUrl}/auth/registration`, user).toPromise();
    }
    else{
      return this.http.post(`${environment.apiUrl}/auth/registration`, user).toPromise();
    }
    
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`).toPromise();
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`).toPromise();
  }

  update(id: number, params: any) {
    return this.http.patch(`${environment.apiUrl}/users/update/${id}`, params, this.header).toPromise();
  }

  updatePassword(id: number, params: any) {
    return this.http.patch(`${environment.apiUrl}/users/update-password/${id}`, params, this.header).toPromise();
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`).toPromise();
  }

  getToken(){
    return localStorage.getItem('token');
  }
  auht2Logout(authToken){
    return this.http.get("https://accounts.google.com/o/oauth2/revoke?token="+authToken).toPromise();
  }
}
