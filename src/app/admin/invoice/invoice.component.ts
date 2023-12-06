import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import jwt_decode from "jwt-decode";
import * as moment from 'moment';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { CustomerService } from 'src/app/services/customer.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  customerId: string;
  loading: boolean = false;

  data: any;
  Invoiceid;
  inviceuserId;
  invoice:any={};
  planDetail:any={};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    public toastrService: NbToastrService,
    private invoiceService: SubscriptionsService,
    public zone: NgZone,
    public toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.Invoiceid = params.id;
      this.getInvoicedetail()
    });

    // Get User Detail
    const token = localStorage.getItem('token')
    if (token !== null && token !== undefined) {
      const user: any = jwt_decode(token);
      // Getting customer ID from customer's stripe
      this.customerService.getStripeId(user.customerId)
        .then(response => {
          this.customerId = response['customerId'];
          console.log(this.customerId)
        })
    }

    
  }

  getInvoicedetail() {
    this.invoiceService.getInvoicedetail(this.Invoiceid).then((response: any) => {
      this.invoice = response;
      console.log(this.invoice)
      // this.inviceuserId=jwt_decode(this.invoice.id);
      this.planDetail = this.invoice.lines.data[0].plan;


    }).catch((error) => {
      this.zone.run(() => { this.toastr.error('Getting issue on fetching invoice details', 'Error'); })
      this.loading = false;
    });
  }

}
