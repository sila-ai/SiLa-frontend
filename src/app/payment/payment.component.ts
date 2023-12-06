import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { NbToastrService, NbIconConfig } from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { PaymentService } from '../services/payment.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { CustomerService } from 'src/app/services/customer.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [DatePipe]
})

export class PaymentComponent implements OnInit {
  cards: any[] = [];

  price: string;
  customer: string;
  customerId: string;
  planId: string;
  amount: any;
  interval: string;
  planName: string;
  customerName: string;
  currency:string;
  loading = false;
  pay_loading = false;
  customer_subscription_status = false;

  cardForm: FormGroup = this.formBuilder.group({
    card_number: [''],
    exp_month: [''],
    name: [''],
    exp_year: [''],
    cvc: ['']
  });

  paymentForm: FormGroup = this.formBuilder.group({
    card: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionsService,
    public datePipe: DatePipe,
    private customerService: CustomerService,
    public toastrService: NbToastrService,
    public formError: FormServerErrorHandler,
    public toastr: ToastrService,
    public zone:NgZone,
    public authenticationService: AuthenticationService,
  ) {
  }

  get f() { return this.cardForm.controls; }

  redirect() { this.router.navigate(['./']); }

  ngOnInit(): void {

    this.getAllPaymentMethod();

    this.route.queryParams.subscribe(
      params => {
        this.planId = params.id;
        this.amount = params.amount;
        this.interval = params.interval;
        this.planName = params.name;
        this.currency = params.currency;
      }
    );

    // Get User Detail
    const token = localStorage.getItem('token');
    if (token !== null && token !== undefined) {
      const user: any = jwt_decode(token);
      // Getting customer ID from customer's stripe
      this.customerService.getStripeId(user.customerId)
        .then((response: any) => {
          this.customerId = response.customerInfo['customerId'];
          this.customerName = response.name;
        });

      this.subscriptionService.getcurrentSubcription(user.customerId)
      .then((response: any) => {
        if(response.length){
          this.customer_subscription_status = true
        }else{
          this.customer_subscription_status = false
        }
      });
    }
  }

  getAllPaymentMethod() {
    const token = localStorage.getItem('token');
    const user: any = jwt_decode(token);
    this.customerService.getStripeId(user.customerId)
      .then((response: any) => {
        console.log(response)
        this.paymentService.getAll({ customer: response.customerInfo['customerId'], type: 'card' }).then((response: any) => {
          this.cards = response && response.data ? response.data : [];
        });
      });
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.loading = true;
      const token = localStorage.getItem('token');
      const user: any = jwt_decode(token);
      this.customerService.getStripeId(user.customerId)
        .then((response: any) => {
          const formData: any = {
            customerId: response.customerId,
            card_number: Number(this.cardForm.value.card_number),
            name: this.cardForm.value.name,
            exp_month: Number(this.cardForm.value.exp_month),
            exp_year: Number(this.cardForm.value.exp_year),
            cvc: Number(this.cardForm.value.cvc)
          };
          this.paymentService.create(formData)
            .then((res) => {
              this.getAllPaymentMethod();
              this.cardForm.reset();
              this.toastr.success('Card added successfully','Success'); 
              this.loading = false;
            })
            .catch((error)=> {
              if (error.status === 400) {
                this.zone.run(() => { this.toastr.error('Please fill all card details', 'Error'); })
                this.formError.setFormErrors(this.cardForm, error);
                this.cardForm.reset();
              }
              this.loading = false;
            });
        });
    }
  }

  makePayment() {
    if (this.paymentForm.valid) {
      this.pay_loading = true;
      const subscribe = {
        customer: this.customerId,
        items: [{ price: this.planId }
        ],
        default_payment_method: this.paymentForm.value.card
      };
      console.log(subscribe)
      this.subscriptionService.create(subscribe)
        .then((res) => {
          this.pay_loading = false;
          this.router.navigate(['/user/billing']).then(() => {
            this.toastr.success('Subscribed successfully', 'Success');
          });
        })
        .catch(error => {
          const message = error.error.raw.message;
          this.zone.run(() => { this.toastr.error(message, 'Error'); })
          this.pay_loading = false;
        });
    } else {
      this.toastr.error('Please choose card', 'Error');
      this.pay_loading = false;
    }
  }


  // Only Integer Numbers
  keyPressNumbers(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  home(){
    const token = localStorage.getItem('token');
    if(token){
     // localStorage.removeItem('token');
      this.router.navigate(['/']);
    }
  }

  goBack() { 
    this.router.navigate(['/user/dashboard'])
  }




}

