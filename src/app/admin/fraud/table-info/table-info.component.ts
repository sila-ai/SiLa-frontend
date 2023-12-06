import {Component, Directive, Input, OnInit, Output, EventEmitter, ViewChildren, QueryList} from '@angular/core';
import { NbDialogService, NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfirmDeleteComponent } from 'src/app/admin/components/confirm-delete/confirm-delete.component';
import { CustomerUserService } from 'src/app/services/customer-user.service';
import { Router, ActivatedRoute } from '@angular/router'
import * as moment from 'moment';
import jwt_decode from "jwt-decode";

import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { CustomerService } from 'src/app/services/customer.service';



interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Sno: number;
  PurchasedDate: string;
  Paymentmethod: string;
  Planpurchased: string;
  Amount:string;
}


@Component({
  selector: 'app-table-info',
  templateUrl: './table-info.component.html',
  styleUrls: ['./table-info.component.scss']
})
export class TableInfoComponent implements OnInit { 
  
  data: TreeNode<FSEntry>[] = []
  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any
  defaultColumns: any
  allColumns: any

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private customerUserService: CustomerUserService,
    public router: Router,
    private route: ActivatedRoute,
    public dialogService: NbDialogService,
    public toastrService: NbToastrService
  ) { }


  ngOnInit(): void {
    this.getData()
  }

  
  getData() {
    this.data.push(
      {
        data: {
          Sno: 1,
          PurchasedDate: '12/09/2021',
          Paymentmethod: 'Credit card',
          Planpurchased: 'Basic',
          Amount:'$243'
        }
      },
      {
        data: {
          Sno: 2,
          PurchasedDate: '12/09/2021',
          Paymentmethod: 'Cash Account',
          Planpurchased: 'Professional',
          Amount:'$764'
        }
      }
    );
    this.customColumns = ['Edit']
    this.defaultColumns = ['Sno', 'PurchasedDate', 'Paymentmethod', 'Planpurchased', 'Amount']
    this.allColumns = [...this.defaultColumns, ...this.customColumns]
    this.dataSource = this.dataSourceBuilder.create(this.data)
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
    this.router.navigateByUrl(page)
  }

  delete(id: string) {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to delete this customer user?',
      },
    });
    data.onClose.toPromise().then(data => {
      if (data) {
        this.customerUserService.delete(id).then(() => {
          const status = 'Success'
          const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
          this.toastrService.show(status, 'Customer user deleted successfully', { status: status.toLowerCase(), icon: iconConfig })
          this.getData()
        }).catch(error => {
          const status = 'Warning'
          const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
          this.toastrService.show(status, 'Unable to delete customer user!', { status: status.toLowerCase(), icon: iconConfig });
        })
      }
    })
  }
}

