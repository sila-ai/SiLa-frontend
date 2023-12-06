import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { CustomerService } from 'src/app/services/customer.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteComponent } from 'src/app/admin/components/confirm-delete/confirm-delete.component';
import {NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbDialogService } from '@nebular/theme';
interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
interface BEntry {
  id: string;
  status: string;
  nickname: string;
  amount: number;
  current_period_start: string;
  current_period_end: string;
 
}

@Component({
  selector: 'app-updatepayment',
  templateUrl: './updatepayment.component.html',
  styleUrls: ['./updatepayment.component.scss']
})
export class UpdatepaymentComponent implements OnInit {
  private data: TreeNode<BEntry>[];

  dataSource: NbTreeGridDataSource<BEntry>;
  customerId;
  customerName;
  customColumns: any;
  defaultColumns: any;
  allColumns: any;
  cards;
  sortColumn: string;
 
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  
  // sortDirection: NbSortDirection = NbSortDirection.NONE;ards;

  constructor(private paymentService: PaymentService,
    private customerService: CustomerService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<BEntry>, private route: ActivatedRoute,
    private router: Router,
    public dialogService: NbDialogService,
    public toastr: ToastrService,
    public zone:NgZone) { }
   
  ngOnInit(): void {
    // Get User Detail
    this.customerdetail();

    

  }

  customerdetail() {
    const token = localStorage.getItem('token');
    if (token !== null && token !== undefined) {
      const user: any = jwt_decode(token);
      // Getting customer ID from customer's stripe
      this.customerService.getStripeId(user.customerId)
        .then((response: any) => {
          this.customerId = response.customerId;
          localStorage.setItem('customerid', this.customerId);
          this.customerName = response.name;
          this.getData(this.customerId);
        });

    }
   
  }

  getData(id) {
    this.paymentService.getAll({ customer: id, type: 'card' }).then((response: any) => {
      this.cards = response && response.data ? response.data : [];
      const data = []
      let sno: number = 1;
      for (const row of response.data) {
        data.push({
          data: {
            'SNo': sno, 
            'Id': row.id, 
            'Card Number': "**********"+row.card.last4,
            'Name': row.billing_details.name,
            'Expire Month/Year': row.card.exp_month+"/"+row.card.exp_year,
          }
        })
       sno++;
      }
      this.data = data
      this.customColumns = ['Edit', 'Delete']
      this.defaultColumns = ['SNo', 'Card Number', 'Name', 'Expire Month/Year']
      this.allColumns = [...this.defaultColumns, ...this.customColumns]
      this.dataSource = this.dataSourceBuilder.create(this.data)
    });

  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }
  changePage(page: string) {
    this.router.navigate([page])
  }
 
  delete(id) {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to delete this card?',
      },
    });
    data.onClose.toPromise().then(data => {
      if (data) {
        this.paymentService.deletecardinfo(id).then(() => {
        
          this.toastr.success('Card detail delete successfully', 'Success');
          this.getData(this.customerId);
        }).catch(error => {

          this.zone.run(() => { this.toastr.error(error.message, 'Error');  })
         
        })
      }
    })
  }
   // Only Integer Numbers
  

 

}
