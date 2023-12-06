import { FormControl, FormGroup } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Socket } from 'ngx-socket-io';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import jwt_decode from 'jwt-decode';
import { ClickLogService } from 'src/app/services/click-log.service';
import { TrafficService } from '../../../services/traffic.service';
import {
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from '@nebular/theme';
import { MatDatepicker } from '@angular/material/datepicker';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CustomTooltip } from './customTooltip';
import jwtDecode from 'jwt-decode';
export interface Country {
  id: number;
  company: string;
  ip: number;
  name: string;
  flag: string;
  city: string;
  device: string;
  click: string;
  time: string;
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface CLEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
}

interface CLEntry {
  CampaignID: String;
  IP: String;
  OS: String;
  DeviceType: String;
  JS: Boolean;
  ClickTime: Date;
  VPN: Boolean;
  Country: String;
  City: String;
  Browser: String;
  ISP: String;
  Bot: Boolean;
  Farm: Boolean;
  Blocked: Boolean;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [DecimalPipe],
})
export class TableComponent implements OnInit {
  data: TreeNode<CLEntry>[] = [];

  customColumns: any;
  selectedColumns: any[] = [];
  defaultColumns: [
    'CampaignID',
    'IP',
    'OS',
    'DeviceType',
    'ClickTime',
    'Country',
    'City',
    'Browser',
    'ISP',
    'Validated'
  ];
  selectedColumn: any = '';
  searchName: string = '';
  allColumns: any;
  dataSource: NbTreeGridDataSource<CLEntry>;
  page: number = 1;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  userLog: any[] = [];
  campaignOne: FormGroup;
  public tooltipShowDelay = 0;
  public tooltipHideDelay = 2000;
  public frameworkComponents = { customTooltip: CustomTooltip };
  public defaultColDef: ColDef = {
    flex: 100,
    sortable: true,
    filter: true,
    tooltipComponent: 'CustomTooltip',
  };

  columnDefs: ColDef[] = [
    { field: 'campaignID' },
    { field: 'keyword' },
    { field: 'IVT' },
    { field: 'blocked' },
    { field: 'country', tooltipField: 'countryName' },
    { field: 'clickSource' },
  ];

  selectedHeaders: any = [];
  rowData = [
    {
      campaignID: 7,
      keyword: 'Outfit',
      IVT: 35000,
      blocked: 500,
      country: '🇮🇱',
      countryName: 'Israel',
      clickSource: 'USA',
      IP: '192.168.0.0',
      OS: 'MAC',
      Device_Type: 'Mobile',
      Click_Time: '9:00',
      City: 'Vadodara',
      Browser: 'Chrome',
      ISP: 'Demo',
      Validated: 'Yes',
    },
    {
      campaignID: 8,
      keyword: 'Software',
      IVT: 35000,
      blocked: 500,
      country: '🇮🇱',
      countryName: 'Israel',
      clickSource: 'USA',
      IP: '192.168.0.0',
      OS: 'MAC',
      Device_Type: 'Mobile',
      Click_Time: '9:00',
      City: 'Vadodara',
      Browser: 'Chrome',
      ISP: 'Demo',
      Validated: 'Yes',
    },
  ];

  searchBy = [
    'IP',
    'OS',
    'Device_Type',
    'Click_Time',
    'City',
    'Browser',
    'ISP',
    'Validated',
  ];

  tableData = [
    {
      date: '02-21-2018',
      number: '00087',
      customer: 'Reactial',
      amount: '$2500',
      outstanding: '0',
    },
    {
      date: '02-16-2018',
      number: '00086',
      customer: 'Promotional',
      amount: '$1890',
      outstanding: '0',
    },
    {
      date: '02-29-2018',
      number: '00085',
      customer: 'Effie Wotkins',
      amount: '$3400',
      outstanding: '0',
    },
  ];
  private gridApi!: GridApi;
  // @Input() userLog: any[] = [];

  date(dt) {
    const date = new Date(dt);
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
  }

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<CLEntry>,
    private ClickLogService: ClickLogService,
    public router: Router,
    private trafficService: TrafficService,
    private socket: Socket
  ) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    });
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  private helperObj(item) {
    const isBlock = item.block ? 1 : 0;
    return {
      campaignID: item.campaignid,
      keyword: item.keyword,
      IVT: isBlock,
      blocked: isBlock,
      country: item.country,
      countryName: item.country,
      clickSource: item.country,
      IP: item.ip,
      OS: item.os,
      Device_Type: item.device,
      Click_Time: this.date(item.clickTime),
      City: item.city,
      Browser: item.browser,
      ISP: item.isp,
      Validated: item.jsEnabled,
      Bot: item.bot,
      VPN: item.proxy,
    };
  }
  fetchAllTrafficData(start = null, end = null, emit = null) {
    this.trafficService.getuserTrafic(start, end).subscribe((total: any) => {
      // if (emit && total.userId) {
      //   this.socket.emit('adduser', { userId: total.userId });
      // }
      if (total?.data) {
        const updateLogs = [];
        for (const item of total?.data?.Items) {
          const isBlock = item.block ? 1 : 0;
          updateLogs.push(this.helperObj(item));
        }
        this.userLog = updateLogs;
      }
    });
  }

  ngOnInit(): void {
    const user: any = jwtDecode(localStorage.getItem('token'));

    this.socket.on('upcomingLog', (data: any) => {
      if (data.userId) {
        this.userLog = [this.helperObj(data), ...this.userLog];
      }
    });

    this.fetchAllTrafficData('', '', true);
  }

  onSearch(event: any) {
    this.searchName = event.target.value;
  }
  showImage(show: boolean, i: any) {
    if (show) {
      document.getElementById(`countryName ${i}`).style.display = 'inline';
    } else {
      document.getElementById(`countryName ${i}`).style.display = 'none';
    }
  }

  changeHeader() {
    let insterdCol = [
      { field: 'campaignID' },
      { field: 'keyword' },
      { field: 'IVT' },
      { field: 'blocked' },
      { field: 'country' },
      { field: 'clickSource' },
    ];
    this.selectedHeaders.forEach((element) => {
      insterdCol.push({ field: element });
    });
    this.gridApi.setColumnDefs(insterdCol);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  selectColumn(name: any) {
    const ifColumn = this.selectedColumns.findIndex((x) => x === name);
    if (ifColumn != -1) {
      this.selectedColumns.splice(ifColumn, 1);
      document.getElementById(name).style.color = 'black';
      document.getElementById(name).style.border = '1px solid black !important';
    } else {
      document.getElementById(name).style.color = 'green';
      document.getElementById(name).style.border = '1px solid blue !important';
      this.selectedColumns.push(name);
    }
    // if(this.selectedColumn === name){
    //   document.getElementById(name).style.color='black';
    //   document.getElementById(name).style.border='1px solid black !important';
    //   this.selectedColumn='';
    // }
    // else{
    //   if(this.selectedColumn !== ''){
    //     document.getElementById(this.selectedColumn).style.color='black';
    //     document.getElementById(this.selectedColumn).style.border='1px solid black !important';
    //   }

    // this.selectedColumn=name;
    // document.getElementById(name).style.color='green';
    // document.getElementById(name).style.border='1px solid blue !important';
  }

  ConvertToCSV(objArray, headerList) {
    let array = objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }

    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';

      // const keys = Object.keys(array[i]);
      // console.log('i');
      // console.log(i);

      // for (let head in keys) {
      //   console.log(array[head]);
      //   line += ',' + array[i][head];
      // }

      for (let index in headerList) {
        let head = headerList[index];

        console.log(array[i][head]);
        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

  downloadFile(data, filename = 'data') {
    let csvData = this.ConvertToCSV(data, [
      'campaignID',
      'keyword',
      'IP',
      'OS',
      'Device_Type',
      'Validated',
      'Click_Time',
      'VPN',
      'country',
      'City',
      'Browser',
      'ISP',
      'Bot',
    ]);
    console.log(csvData);
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  downloadCsv() {
    if (this.userLog.length > 0) {
      this.downloadFile(this.userLog, 'FraudReport');
    } else {
      alert('No File to download');
    }
  }
  // ngOnChanges(): void {

  // }
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

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }

  changePage(page) {
    this.router.navigateByUrl(page);
  }

  start: number = 0;
  end: number = 0;
  dateStartEvent($event) {
    this.start = new Date($event.value).getTime();
    if (this.start && this.end) {
      this.fetchAllTrafficData(this.start, this.end);
    }
  }
  dateEndEvent($event) {
    this.end = new Date($event.value).getTime();
    if (this.start && this.end) {
      this.fetchAllTrafficData(this.start, this.end);
    }
  }
}

@Component({
  selector: 'nb-fs-icon',
  template: `
    <nb-tree-grid-row-toggle
      [expanded]="expanded"
      *ngIf="isDir(); else fileIcon"
    >
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
