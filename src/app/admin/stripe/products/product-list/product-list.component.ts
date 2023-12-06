import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbIconConfig, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfirmDeleteComponent } from 'src/app/admin/components/confirm-delete/confirm-delete.component';
import { ProductsService } from 'src/app/services/products.service';
import * as moment from 'moment';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  id: string;
  name: string;
  created: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  private data: TreeNode<FSEntry>[]

  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any
  defaultColumns: any
  allColumns: any

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private productService: ProductsService,
    public router: Router,
    public dialogService: NbDialogService,
    public toastrService: NbToastrService,
    public toastr: ToastrService,
    public zone:NgZone
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.productService.getAll().then((response: any) => {
      const data = []
      let sno: number = 1;
      for (const row of response.data) {
        data.push({
          data: {
            SNo: sno,
            ProductId: row.id,
            Name: row.name,
            Created: moment.unix(row.created).format('DD/MM/YYYY'),
          }
        }) 
        sno++;
      }
      this.data = data
      this.customColumns = ['Edit', 'Delete']
      this.defaultColumns = ['SNo', 'Name', 'Created']
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
        title: 'Are you sure you want to delete this product?',
      },
    });
    data.onClose.toPromise().then(data => {
      if(data){
        this.productService.delete(id).then(() => {
         // const status = 'Success'
         // const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
         // this.toastrService.show(status, 'Product deleted successfully', { status: status.toLowerCase(), icon: iconConfig })
          this.toastr.success('Product deleted successfully', 'Success');
          this.getData()
        }).catch(error => {
        //   const status = 'Warning'
        // const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
        // this.toastrService.show(status, 'Unable to delete product!', { status: status.toLowerCase(), icon: iconConfig });
        this.toastr.error('Submitted form has errors', 'Error');
        })
      }
    })
  }

}
