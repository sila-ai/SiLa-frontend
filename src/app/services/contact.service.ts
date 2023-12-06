import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Contact } from '../models/contact';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    header: any;

    constructor(
        private http: HttpClient
    ) {}

    create(Contact: Contact) {
        return this.http.post(`${environment.apiUrl}/contact`, Contact).toPromise();
    }

    getAll() {
        return this.http.get(`${environment.apiUrl}/contact`).toPromise();
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/contact/${id}`).toPromise();
    }
}
