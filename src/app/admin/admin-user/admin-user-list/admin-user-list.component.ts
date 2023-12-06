import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfirmDeleteComponent } from 'src/app/admin/components/confirm-delete/confirm-delete.component';
import { AdminUserService } from 'src/app/services/admin-user.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import jwt_decode from "jwt-decode";

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss']
})
export class AdminUserListComponent implements OnInit {

  private data: TreeNode<FSEntry>[]

  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any
  defaultColumns: any
  allColumns: any

  loggedInUserId: number = null;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private adminUserService: AdminUserService,
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
    const token = localStorage.getItem('token');
    if (token !== null || token !== undefined) {
      const user: any = jwt_decode(token);
      this.loggedInUserId = user.id;
    }
    this.adminUserService.getAll().then((response: any) => {
      const data = []
      let sno: number = 1;
      for (const row of response) {
        data.push({
          data: {
            SNo: sno,
            UserId: row.id,
            Name: row.name,
            Email: row.email
          }
        })
        sno++;
      }
      this.data = data
      this.customColumns = ['Edit', 'Delete']
      this.defaultColumns = ['SNo', 'Name', 'Email']
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

  delete(id) {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to delete this admin user?',
      },
    });
    data.onClose.toPromise().then(data => {
      if(data){
        this.adminUserService.delete(id).then(() => {
         // const status = 'Success'
       //   const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
          this.toastr.success('Admin user deleted successfully', 'Success')
          //this.toastrService.show(status, 'Admin user deleted successfully', { status: status.toLowerCase(), icon: iconConfig })
          this.getData()
        }).catch((error) => {
        //   const status = 'Warning'
        // const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
        this.zone.run(() => { this.toastr.error('Something went wrong', 'Error');  })
      //  this.toastrService.show(status, 'Unable to delete admin user!', { status: status.toLowerCase(), icon: iconConfig });
        })
      }
    })
  }
}
