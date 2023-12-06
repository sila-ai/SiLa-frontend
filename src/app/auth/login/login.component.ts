import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { NbDialogService, NbIconConfig, NbToastrService, } from '@nebular/theme';
import { User } from 'src/app/models/user';
import jwt_decode from "jwt-decode";
import { environment } from '../../../environments/environment';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PlansService } from 'src/app/services/plans.service';
import { CustomerService } from 'src/app/services/customer.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  @ViewChild('dialog')
  dialog: TemplateRef<any>;

  public get toastr(): ToastrService {
    return this._toastr;
  }
  public set toastr(value: ToastrService) {
    this._toastr = value;
  }
  public stripe_key: string = 'pk_test_51IbW5vJeWvg2Q9bCDq99fYZx6vPbO7rcRCnxZGhSMi99oYBzVAQ5KfgXKFg4F1TARJJQvfitQ92KwG7rrKayEPHK00iBBbivg1';
  public stripe_table: string = 'prctbl_1NxADmJeWvg2Q9bCUjffmPbt'
  id:string;
  email:string;

  plans:any[]=[];
  selectedPlan:any=null;
  token:any='';
  showUpgrade:boolean=false;

  authUrl;
  loading = false;

  form: FormGroup = this.formBuilder.group({
    email: [''],
    password: ['']
  })

  cardForm:FormGroup = this.formBuilder.group({
    card_number: [''],
    exp_month: [''],
    name: [''],
    exp_year: [''],
    cvc: ['']
  });

  loginResponse:any={};
  retUrl = null;
  isPlanPurchased ;
  isnotPlanPurchased ;
  step:any=1;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public formError: FormServerErrorHandler,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private customerService: CustomerService,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionsService,
    private plansService: PlansService,
    private _toastr: ToastrService,
    public zone:NgZone
  ) { }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  get cf() { return this.cardForm.controls; }

  ngOnInit() {
    localStorage.clear();
    this.getAllPlans();
    this.authUrl = environment.authUrl;
    this.route.queryParams.subscribe(params => {
      this.retUrl = params;
    });
    localStorage.setItem('getsubscription', JSON.stringify(this.retUrl));
    const token = localStorage.getItem('token')
    if (token !== undefined && token !== null) {

      try {
        const user: User = jwt_decode(token);
        
        if (this.retUrl.id != null && this.retUrl.id != undefined) {
          this.router.navigate(['/payment'], {
            queryParams: {
              id: this.retUrl.id,
              amount: this.retUrl.amount,
              interval: this.retUrl.interval,
              name: this.retUrl.name,
              currency:this.retUrl.currency

            }

          })

        }

        else {
          if(user.role ==='ADMIN'){
            this.router.navigateByUrl(`/${user.role.toLowerCase()}/chat`);
          }
          else{
            this.router.navigateByUrl(`/${user.role.toLowerCase()}/dashboard`);
          }

        }
      } catch (err) {

      }
    }
  }

  getAllPlans() {
    this.plansService
      .getAll()
      .then((response: any) => {
        this.plans = [{}];
        /*response.data.map((x, i) => {
          let nf = new Intl.NumberFormat();
          this.plans.push({
            id: x.id,
            product_name: x.product_name,
            currency: x.currency,
            amount: x.amount,
            interval: x.interval,
            nickname: nf.format(x.nickname),
          });
        });*/
      })
      .catch((error) => {
        // console.log(error);
      });

    // console.log(this.plans);
  }

  open(dialog: TemplateRef<any>) {
    /*this.dialogService.open(dialog, {
      context: 'this is some additional data passed to dialog',
    });*/
    window.open(`https://billing.stripe.com/p/login/test_aEU1703SVgQ21JS8ww?prefilled_email=${this.email}`, "_blank");
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.isPlanPurchased =2;
      this.isnotPlanPurchased  = 1;
      this.email=this.f.email.value;
      this.authenticationService.login(this.f.email.value, this.f.password.value)
        .then((response: any) => {
          if (response.status === false) {
            this.toastr.error(response['message'], 'Warning');
            this.formError.setFormErrors(this.form, response['message']);
          } else {
            this.id=response.user_info.id;
            localStorage.setItem('PlanPurchased',response.user_info.isPlanPurchased);
            if(response.user_info.isPlanPurchased===2){
                if (this.retUrl.id != null || this.retUrl.id != undefined) {

                  localStorage.setItem(`token`, response.access_token);
                  localStorage.setItem(`useremail`, JSON.stringify(response.user_info));
                  localStorage.setItem(`userrole`, response.role);

                  this.router.navigate(['/payment'], {
                    queryParams: {
                      id: this.retUrl.id,
                      amount: this.retUrl.amount,
                      interval: this.retUrl.interval,
                      name: this.retUrl.name
                    }
                  })
                  this.toastr.success('Login successfully', 'Success');

                }
                else{
                  this.toastr.error('Please take a subscription for login!', 'Error');
                  this.loginResponse = response;
                  this.showUpgrade=true;
                  this.open(this.dialog);
                  // document.getElementById('openDialog')?.click();
                  this.showUpgrade=false;
                  this.loading = false;
                  
                }
            }
            else if(response.user_info.isPlanPurchased===1 && response.user_info.role ==='USER'){
              if(response.user_info.isFirstTime){
                this.router.navigateByUrl(`/${response.user_info.role.toLowerCase()}/adwords`);
              }
              else{
                this.router.navigateByUrl(`/${response.user_info.role.toLowerCase()}/dashboard`);
              }
              this.toastr.success('Login successfully', 'Success');
              localStorage.setItem(`token`, response.access_token);
              localStorage.setItem(`useremail`, JSON.stringify(response.user_info));
              localStorage.setItem(`userrole`, response.role);
            }
            else if(response.user_info.isPlanPurchased===1 && response.user_info.role ==='ADMIN'){
              this.router.navigateByUrl(`/${response.user_info.role.toLowerCase()}/chat`);
              this.toastr.success('Login successfully', 'Success');
              localStorage.setItem(`token`, response.access_token);
              localStorage.setItem(`useremail`, JSON.stringify(response.user_info));
              localStorage.setItem(`userrole`, response.role);
            }


          }
        }).catch((err) => {
          if (err.status === 400) {
            this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error'); })
            this.formError.setFormErrors(this.form, err);
          }
          if(err.status==500){
            this.toastr.error('You are G-mail user so  please continue with G-mail', 'Error');
          }
          this.loading = false;
        });
    }
  }

  selectPackage(data) {
  //  console.log(data)
   this.selectedPlan = data.id;
   this.step=2;
   localStorage.setItem(`token`, this.loginResponse.access_token);
  }

  makePayment() {
    if (this.cardForm.valid) {
      this.loading = true;
      
      this.customerService.getStripeId(this.loginResponse?.user_info?.customerId)
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
              const subscribe = {
                customer: this.loginResponse?.user_info?.customerId,
                items: [{ price: this.selectedPlan }
                ],
                default_payment_method:cardResponse.paymentId
              };
              
              this.subscriptionService.create(subscribe)
                .then((res) => {
                  this._toastr.success('Subscribed successfully!');
                  localStorage.setItem(`token`, this.loginResponse.access_token);
                  localStorage.setItem(`useremail`, JSON.stringify(this.loginResponse.user_info));
                  localStorage.setItem(`userrole`, this.loginResponse.role);
                  if(this.loginResponse.user_info.isFirstTime){
                    this.router.navigateByUrl(`/${this.loginResponse.user_info.role.toLowerCase()}/adwords`);
                  }
                  else{
                    this.router.navigateByUrl(`/${this.loginResponse.user_info.role.toLowerCase()}/dashboard`);
                  }
                })
                .catch(error => {
                  this.loading = false;
                  const message = error.error.raw.message;
                  this.zone.run(() => { this.toastr.error(message, 'Error'); })
                  
                });
              
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


  forgotpassword() {
    this.router.navigate(['./Forgotpassword']);
  }

}
