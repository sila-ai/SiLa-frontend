import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbDialogService,
  NbIconConfig,
  NbSortDirection,
  NbSortRequest,
  NbToastrService,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from '@nebular/theme';
import { ConfirmDeleteComponent } from 'src/app/admin/components/confirm-delete/confirm-delete.component';
import { PlansService } from 'src/app/services/plans.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgZone } from '@angular/core';
interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  id: string;
  product: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  created: string;
}

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss'],
})
export class PlanListComponent implements OnInit {
  private data: TreeNode<FSEntry>[];

  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any;
  defaultColumns: any;
  allColumns: any;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private planService: PlansService,
    public router: Router,
    public dialogService: NbDialogService,
    public zone: NgZone,
    public toastr: ToastrService,
    public toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.planService.getAll().then((response: any) => {
      const data = [];
      let sno: number = 1;
      for (const row of response.data) {
        var nf = new Intl.NumberFormat();
        data.push({
          data: {
            SNo: sno,
            PlanId: row.id,
            'Product Name': row.product_name,

            Clicks: nf.format(row.nickname) + ' Click',
            Amount: row.amount + ' ' + row.currency.toUpperCase(),

            Interval: row.interval.toUpperCase(),
            Created: moment.unix(row.created).format('DD/MM/YYYY'),
          },
        });
        sno++;
      }
      this.data = data;
      this.customColumns = ['Edit', 'Delete'];
      this.defaultColumns = [
        'SNo',
        'Product Name',
        'Clicks',
        'Amount',
        'Interval',
        'Created',
      ];
      this.allColumns = [...this.defaultColumns, ...this.customColumns];
      this.dataSource = this.dataSourceBuilder.create(this.data);
    });
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
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
    this.router.navigateByUrl(page);
  }

  delete(id: string) {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to delete this plan?',
      },
    });
    data.onClose.toPromise().then((data) => {
      if (data) {
        this.planService
          .delete(id)
          .then(() => {
            //const status = 'Success'
            //const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
            // this.toastrService.show(status, 'Plan deleted successfully', { status: status.toLowerCase(), icon: iconConfig })
            this.toastr.success('Plan deleted successfully', 'Success');
            this.getData();
          })
          .catch((error) => {
            // const status = 'Warning'
            //const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
            // this.toastrService.show(status, 'Unable to delete plan!', { status: status.toLowerCase(), icon: iconConfig });
            this.toastr.error('Submitted form has errors', 'Error');
          });
      }
    });
  }
}
