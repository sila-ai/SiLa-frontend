import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfirmDeleteComponent } from 'src/app/admin/components/confirm-delete/confirm-delete.component';
import { PricesService } from 'src/app/services/prices.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  created: string;
}

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {

  private data: TreeNode<FSEntry>[]

  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any
  defaultColumns: any
  allColumns: any

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private priceService: PricesService,
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
    this.priceService.getAll().then((response: any) => {
      const data = []
      for (const row of response.data) {
        data.push({
          data: {
            Id: row.id,
            ProductId: row.product,
            Name: row.nickname,
            Amount: row.unit_amount,
            Currency: row.currency,
            Created: row.created,
          }
        }) 
      }
      console.log(data)
      this.data = data
      this.customColumns = ['Edit', 'Delete']
      this.defaultColumns = ['Id', 'ProductId', 'Name', 'Amount', 'Currency', 'Created']
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
        title: 'Are you sure you want to delete this price?',
      },
    });
    data.onClose.toPromise().then(data => {
      if(data){
        this.priceService.delete(id).then(() => {
         // const status = 'Success'
        //  const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
         // this.toastrService.show(status, 'Price deleted successfully', { status: status.toLowerCase(), icon: iconConfig })
         this.toastr.success('Price deleted successfully','Success');
          this.getData()
        }).catch((error) => {
          this.toastr.error("Submitted form has errors", 'Error');
        //  const status = 'Warning'
        //const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
       // this.toastrService.show(status, 'Unable to delete price!', { status: status.toLowerCase(), icon: iconConfig });
        })
      }
    })
  }

}
