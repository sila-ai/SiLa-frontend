import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  baseUrl = 'https://api.stripe.com';
  token =
    'pk_test_51IbW5vJeWvg2Q9bCDq99fYZx6vPbO7rcRCnxZGhSMi99oYBzVAQ5KfgXKFg4F1TARJJQvfitQ92KwG7rrKayEPHK00iBBbivg1';

  constructor(private router: Router, private http: HttpClient) {}

  headers: {
    Authorization: `Bearer pk_test_51IbW5vJeWvg2Q9bCDq99fYZx6vPbO7rcRCnxZGhSMi99oYBzVAQ5KfgXKFg4F1TARJJQvfitQ92KwG7rrKayEPHK00iBBbivg1`;
  };
  // ßgetAll() {
  //   return this.http.get(`${this.baseUrl}/v1/customers/cus_JNDTMOzLBPbjlD/sources`, { headers: this.headers}).toPromise();
  // }
}
