import { CustomTooltip } from './customTooltip';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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
} from "@nebular/theme";
import { FilterTablePipe } from "src/app/helpers/filter.pipe";
import { TableRoutingModule } from "./table-routing.module";

import { TableComponent } from "./table.component";
import { MatNativeDateModule } from "@angular/material/core";
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    // NgxPaginationModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    TableRoutingModule,
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbCheckboxModule,
    NbButtonModule,
    NbDialogModule,
    NbInputModule,
    NbLayoutModule,
    NbTreeGridModule,
    NbDialogModule.forRoot(),
    NbListModule,
    MatTableModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    AgGridModule.withComponents([CustomTooltip])

  ],
  declarations: [TableComponent, FilterTablePipe, CustomTooltip],

})
export class TableModule {}
