import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxGaugeModule } from 'ngx-gauge';

import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbTreeGridModule,
} from '@nebular/theme';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ChartHorizontalComponent } from './chart-horizontal/chart-horizontal.component';
import { ChartVerticallyComponent } from './chart-vertically/chart-vertically.component';
import { FraudComponent } from './fraud.component';
import { TableInfoComponent } from './table-info/table-info.component';
import { TableInvalidClickComponent } from './table-invalid-click/table-invalid-click.component';
import { TableListComponent } from './table-list/table-list.component';
import { LoaderModule } from '../loader/loader.module';
import { FraudRoutingModule } from './fraud-routing.module';

@NgModule({
  declarations: [
    FraudComponent,
    TableInfoComponent,
    ChartVerticallyComponent,
    ChartHorizontalComponent,
    TableListComponent,
    TableInvalidClickComponent,
  ],
  imports: [
    LoaderModule,
    FraudRoutingModule,
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbCheckboxModule,
    NbButtonModule,
    NbCardModule,
    NbDialogModule,
    NbInputModule,
    NbLayoutModule,
    NbTreeGridModule,
    NbDialogModule.forRoot(),
    NbListModule,
    NgxGaugeModule,

    NgbPaginationModule,
    FormsModule,
    NgxChartsModule,

    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FraudModule {}
