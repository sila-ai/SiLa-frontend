import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import * as moment from 'moment';
import { number } from '@amcharts/amcharts4/core';
import { CustomerService } from 'src/app/services/customer.service';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  id: string;
  customer: string;
  quantity: number;
  status: string;
  start_date: string;
  created: string;
}

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {

  private data: TreeNode<FSEntry>[]

  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any
  defaultColumns: any
  allColumns: any

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  loading=false;
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private subscriptionService: SubscriptionsService,
    public router: Router,
    public dialogService: NbDialogService,
    public toastrService: NbToastrService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.loading = true;
    this.subscriptionService.getAll().then((response: any) => {
      const data = []
      let sno:number = 1

      for (const row of response.data) {
        data.push({
          data: {
            SNo: sno,
            Customer: row.customer_name,
            Plan: row.plan.nickname,
            Amount: `${row.plan.currency.toUpperCase()} ${row.plan.amount}`,
            Status: row.status,
            StartDate: moment.unix(row.current_period_start).format('DD/MM/YYYY'),
            EndDate: moment.unix(row.current_period_end).format('DD/MM/YYYY'),
          }
        }) 
        sno++;
      }
      this.loading = false;
      this.data = data
      this.defaultColumns = ['SNo', 'Customer', 'Plan', 'Amount' , 'Status', 'StartDate', 'EndDate']
      this.allColumns = [...this.defaultColumns]
      this.dataSource = this.dataSourceBuilder.create(this.data)
    })
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
}
