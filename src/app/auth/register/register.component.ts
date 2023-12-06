import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { NbIconConfig, NbToastrService,  } from '@nebular/theme';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { CustomerService } from 'src/app/services/customer.service';
import { PaymentService } from 'src/app/services/payment.service';
@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit,OnDestroy {

  loading = false;

  form: FormGroup = this.formBuilder.group({
    role: ['USER'],
    name: [''],
    email: [''],
    password: [''],
    is_agree: ['']
  });

  cardForm:FormGroup = this.formBuilder.group({
    card_number: [''],
    exp_month: [''],
    name: [''],
    exp_year: [''],
    cvc: ['']
  });

  step:any=1;
  cardId:any={};
  data;
  user:any={};

  ngOnDestroy(){
    localStorage.clear();
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public formError: FormServerErrorHandler,
    private customerService: CustomerService,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionsService,
    private toastrService: NbToastrService,
    public toastr: ToastrService,
    public zone:NgZone
  ) { }

  get f() { return this.form.controls; }
  get cf() { return this.cardForm.controls; }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.data = params
      console.log(params)
    });
  }

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

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.authenticationService.register(this.form.value)
        .then((response:any) => {
          if (response['status'] === 400) {
            const status = 'Warning';
            const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
            this.toastrService.show(status, response['error'], { status: status.toLowerCase(), icon: iconConfig });
            this.formError.setFormErrors(this.form, response['error']);
          } else {
            
            localStorage.setItem(`token`, response.access_token);

            this.loading=false;
            this.toastr.success('Registered successfully', 'Success');
            this.step = 2;
            this.user = response.user_info;
            
          }
        }).catch((err) => {
          console.log(err)
          if (err.status === 400) {
            this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error'); })
            this.formError.setFormErrors(this.form, err);
          } else if (err.status === 406) {
            this.zone.run(() => { this.toastr.error('User already exist with this email, please try another one', 'Error'); })
          }
          this.loading = false;
        });
    }
  }

  makePayment() {
    if (this.cardForm.valid) {
      this.loading = true;
      
      this.customerService.getStripeId(this.user?.customerId)
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
            .then((cardResponse:any) => {
              this.cardId = cardResponse.paymentId;
              
              const subscribe = {
                customer: this.user?.customerId,
                items: [{ price: this.data.planId }
                ],
                default_payment_method:this.cardId
              };
              
              this.subscriptionService.create(subscribe)
                .then((res) => {
                  
                  this.router.navigate(['/login']).then(() => {
                    this.toastr.success('Subscribed successfully', 'Success');
                  });
                })
                .catch(error => {
                  console.log(error)
                  const message = error.error.raw.message;
                  this.zone.run(() => { this.toastr.error(message, 'Error'); })
                  
                });
              this.loading = false;
            })
            .catch((error)=> {
              if (error.status === 400) {
                this.zone.run(() => { this.toastr.error('Please fill all card details', 'Error'); })
                this.formError.setFormErrors(this.cardForm, error);
                this.cardForm.reset();
              }
              if(error.status == 406){
                this.toastr.error('Card is not acceptable')
              }
              this.loading = false;
            });
        });
    }
   
  }

  Login() {
    if (this.data.params) {
      this.router.navigate(['/login'], {
        queryParams: {
          id: this.data.params.id,
          amount: this.data.params.amount,
          interval: this.data.params.interval,
          name: this.data.params.name,
          currency:this.data.params.currency
        }
      })
    }
    else {
      this.router.navigate(['/login'])
    }
  }
}

