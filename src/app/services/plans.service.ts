import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plan } from '../models/plan';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PlansService {
  header: any;
  constructor(
    private http: HttpClient
  ) { 
    const token = localStorage.getItem('token');
    this.header = { headers : { Authorization: `Bearer ${token}` }};
  }

  create(plan: Plan) {
    return this.http.post(`${environment.apiUrl}/plans`, plan, this.header).toPromise();
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/plans`).toPromise();
  }

  getById(id: string) {
    return this.http.get(`${environment.apiUrl}/plans/${id}`).toPromise();
  }

  update(id, params) {
    return this.http.patch(`${environment.apiUrl}/plans/${id}`, params,this.header).toPromise();
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/plans/${id}`,this.header).toPromise();
  }
  getAllprice(){
    return this.http.get(`${environment.apiUrl}/prices`).toPromise();
  }

  buyAddon(addOn){
   
    return this.http.post(`${environment.apiUrl}/session`,addOn).toPromise();
  }

  getaddonDetail(Id){
    return this.http.get(`${environment.apiUrl}/payment-intent/${Id}`,).toPromise();
  }

  getMoreaddonDetail(Id){
    return this.http.get(`${environment.apiUrl}/session/items/${Id}`,).toPromise();
  }

  getAllClick(Id){
    return this.http.get(`${environment.apiUrl}/session/clicks/${Id}`).toPromise();
  }
  

}
