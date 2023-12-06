import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { NbDialogService, NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfirmDeleteComponent } from 'src/app/admin/components/confirm-delete/confirm-delete.component';
import { CustomerUserService } from 'src/app/services/customer-user.service';
import jwt_decode from "jwt-decode";
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Id: number;
  CustomerId: string;
  Name: string;
  Email: string;
}

@Component({
  selector: 'app-customer-user-list',
  templateUrl: './customer-user-list.component.html',
  styleUrls: ['./customer-user-list.component.scss']
})
export class CustomerUserListComponent implements OnInit {
  data: TreeNode<FSEntry>[] = []
  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any
  defaultColumns: any
  allColumns: any

  loggedInUserId: number = null;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private customerUserService: CustomerUserService,
    public router: Router,
    private route: ActivatedRoute,
    public dialogService: NbDialogService,
    public toastrService: NbToastrService,
    public zone:NgZone,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getData()
  }
  
  getData() {
    const token = localStorage.getItem('token');
    if (token !== null || token !== undefined) {
 
      try {
        const user: any = jwt_decode(token);
        this.loggedInUserId = user.id;
        this.customerUserService.getAll(user.customerId).then((response: any) => {
          const data = [];
          let sno: number = 1;
          for (const row of response) {
            data.push({
              data: {
                SNo : sno,
                Id: row.id,
                Name: row.name,
                Email: row.email,
              }
            });
            sno++;
          }
          this.data = data;
          this.customColumns = ['Edit', 'Delete'];
          this.defaultColumns = ['SNo', 'Name', 'Email'];
          this.allColumns = [...this.defaultColumns, ...this.customColumns];
          this.dataSource = this.dataSourceBuilder.create(this.data);
        });
      } catch (error) {
        return false;
      }
    }
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

  changePage(page) {
    this.router.navigateByUrl(page)
  }

  delete(id) {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to delete this customer user?',
      },
    });
    data.onClose.toPromise().then(data => {
      if (data) {
        this.customerUserService.delete(id).then(() => {
          // const status = 'Success'
          // const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
          // this.toastrService.show(status, 'Customer user deleted successfully', { status: status.toLowerCase(), icon: iconConfig })
          this.toastr.success('Customer user deleted successfully', 'Success');
          this.getData()
        }).catch(error => {
          // const status = 'Warning'
          // const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
          this.zone.run(() => { this.toastr.error(error.message, 'Error');  })
          // this.toastrService.show(status, 'Unable to delete customer user!', { status: status.toLowerCase(), icon: iconConfig });
        })
      }
    })
  }
}
