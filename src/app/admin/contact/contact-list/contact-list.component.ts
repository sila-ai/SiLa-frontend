import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfirmDeleteComponent } from 'src/app/admin/components/confirm-delete/confirm-delete.component';
import { ContactService } from 'src/app/services/contact.service';
import * as moment from 'moment';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  id: number;
  name: string;
  email: string;
  contactNumber: number;
  message: string;
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  private data: TreeNode<FSEntry>[];

  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any;
  defaultColumns: any;
  allColumns: any;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private contactService: ContactService,
    public router: Router,
    public dialogService: NbDialogService,
    public toastrService: NbToastrService,
    public zone:NgZone,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.contactService.getAll().then((response: any) => {
      const data = [];
      let sno: number = 1;
      for (const row of response) {
        data.push({
          data: {
            Id: sno,
            ContactId: row.id,
            Name: row.name,
            Email: row.email,
            Contact: row.contactNumber,
            Message: row.message,
            Created: moment(row.createDateTime).format('DD/MM/YYYY'),
            
          }
        });
        sno++;
      }
      this.data = data;
      this.customColumns = ['Delete']
      this.defaultColumns = ['Id', 'Name', 'Email', 'Contact', 'Message', 'Created' ];
      this.allColumns = [...this.defaultColumns, ...this.customColumns]
      this.dataSource = this.dataSourceBuilder.create(this.data);
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
    this.router.navigateByUrl(page);
  }

  delete(id) {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to delete?',
      },
    });
    data.onClose.toPromise().then(data => {
      if(data){
        this.contactService.delete(id).then(() => {
          this.toastr.success('Deleted successfully', 'Success')
          this.getData()
        }).catch((error) => {
          this.zone.run(() => { this.toastr.error('Something went wrong', 'Error');  })
        })
      }
    })
  }

}
