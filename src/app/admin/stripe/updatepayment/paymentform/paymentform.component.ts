import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { NbToastrService, NbIconConfig ,NbDialogService} from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { PaymentService } from '../../../../services/payment.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { CustomerService } from 'src/app/services/customer.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-paymentform',
  templateUrl: './paymentform.component.html',
  styleUrls: ['./paymentform.component.scss'],
  providers: [DatePipe]
})
export class PaymentformComponent implements OnInit {
  cards: any[] = [];
  loading = false;
  price: string;
  customer: string;
  customerId: string;
  planId: string;
  amount: string;
  interval: string;
  planName: string;
  customerName: string;
  currency:string;
  cardInfo;
  cardNumber;
  cardid;

  cardForm : FormGroup= this.formBuilder.group({
    name:[''],
    exp_month: [''],
    exp_year: [''],
   
  });
  constructor(private formBuilder: FormBuilder,
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
    public dialogService: NbDialogService,
  ) { }
 
  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      this.cardid = params.id
      const customerId = localStorage.getItem('customerid');
      this.paymentService.getInfobyid({ customer: customerId, type: 'card' },params.id).then((response: any) => {
        this.cardNumber = response.card.last4
        this.cardForm = this.formBuilder.group({
          name:response.billing_details.name,
          exp_month: response.card.exp_month,
          exp_year: response.card.exp_year,
         
        });
   })
    });
    
  
  }
  get f() { return this.cardForm.controls; }
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
    if (this.cardForm.valid) {
      //this.loading = true;
      const formData: any = {

              exp_month: Number(this.cardForm.value.exp_month),
              exp_year: Number(this.cardForm.value.exp_year),
              name:this.cardForm.value.name
              
            };
      this.paymentService.updatePaymentinfo(formData ,this.cardid).then((response:any)=>{
         if(response){
          this.toastr.success('Card update successfully','Success');
          this.router.navigate(['/user/update-payment-information']);
         }
         

      })
      .catch((error)=> {
        if (error.status === 400) {
          this.zone.run(() => { this.toastr.error('Please fill all card details', 'Error'); })
          this.formError.setFormErrors(this.cardForm, error);
         // this.cardForm.reset();
        }
        this.loading = false;
      });
    }
  }

 
}
