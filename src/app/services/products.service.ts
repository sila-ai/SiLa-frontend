import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  header: any;
  constructor(
    private http: HttpClient
  ) {
    const token = localStorage.getItem('token');
    this.header = { headers : { Authorization: `Bearer ${token}` }};
  }

  create(product: Product) {
    return this.http.post(`${environment.apiUrl}/products`, product,this.header).toPromise();
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/products`,this.header).toPromise();
  }

  getById(id: string) {
    return this.http.get(`${environment.apiUrl}/products/${id}`,this.header).toPromise();
  }

  update(id, params) {
    return this.http.patch(`${environment.apiUrl}/products/${id}`, params,this.header).toPromise();
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/products/${id}`,this.header).toPromise();
  }
}
