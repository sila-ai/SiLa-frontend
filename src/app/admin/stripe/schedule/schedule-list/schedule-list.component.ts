import { Component, OnInit } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { CustomerService } from 'src/app/services/customer.service';
import * as moment from 'moment';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  id: string;
  name: string;
  email: string;
  description: string;
  created: string;
}
@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {

  private data: TreeNode<FSEntry>[]

  dataSource: NbTreeGridDataSource<FSEntry>;

  customColumns: any
  defaultColumns: any
  allColumns: any


  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.customerService.getAll().then((response: any) => {
      const data = []
      for (const row of response.data) {
        data.push({
          data: {
            Id: row.id,
            Name: row.name,
            Email: row.email,
            Description: row.description,
            Created: moment(row.created)
            
          }
        }) 
      }
      console.log(data)
      this.data = data
      this.defaultColumns = ['Id', 'Name', 'Email', 'Description', 'Created']
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

  add(){

  }

}
