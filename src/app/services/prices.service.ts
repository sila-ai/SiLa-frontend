import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Price } from '../models/price';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PricesService {

  constructor(
    private http: HttpClient
  ) {}


  create(price: Price) {
    return this.http.post(`${environment.apiUrl}/prices/register`, price).toPromise();
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/prices`).toPromise();
  }

  getById(id: string) {
    return this.http.get(`${environment.apiUrl}/prices/${id}`).toPromise();
  }

  update(id, params) {
    return this.http.patch(`${environment.apiUrl}/prices/${id}`, params).toPromise();
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/prices/${id}`).toPromise();
  }
}
