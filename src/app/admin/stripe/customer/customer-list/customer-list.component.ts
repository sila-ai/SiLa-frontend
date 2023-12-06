import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfirmDeleteComponent } from 'src/app/admin/components/confirm-delete/confirm-delete.component';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgZone } from '@angular/core';
interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  id: string;
  customerId: string;
  name: string;
  email: string;
  created: string;
}

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  private data: TreeNode<FSEntry>[]

  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any
  defaultColumns: any
  allColumns: any

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private customerService: CustomerService,
    public router: Router,
    public dialogService: NbDialogService,
    public toastrService: NbToastrService,
    public zone:NgZone,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.customerService.getAll().then((response: any) => {
      const data = []
      for (const row of response) {
        data.push({
          data: {
            Id: row.id,
            CustomerId: row.customerId,
            Name: row.name,
            Email: row.email,
            Created: row.created,
          }
        })
      }
      this.data = data
      this.customColumns = ['Edit', 'Delete']
      this.defaultColumns = ['Id', 'CustomerId', 'Name', 'Email', 'Created']
      this.allColumns = [...this.defaultColumns, ...this.customColumns]
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

  delete(id: string) {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to delete this customer?',
      },
    });
    data.onClose.toPromise().then(data => {
      if(data){
        this.customerService.delete(id).then(() => {
        //  const status = 'Success'
         // const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
          this.toastr.success('Customer deleted successfully', 'Success');
        //  this.toastrService.show(status, 'Customer deleted successfully', { status: status.toLowerCase(), icon: iconConfig })
          this.getData()
        }).catch((error) => {
         // const status = 'Warning'
       // const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
       this.toastr.error('Submitted form has errors', 'Error');
        })
      }
    })
  }

}
