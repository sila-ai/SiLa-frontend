import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrafficComponent } from './traffic.component';
import { BlockTrafficComponent } from './block-traffic/block-traffic.component';
import { MapComponent } from './map/map.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoaderModule } from '../loader/loader.module';
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbToggleModule,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { NgxMatTagInputModule } from 'ngx-mat-tag-input';

// it is for ng mat
// import { MatSelectModule } from '@angular/material/select';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    TrafficComponent,
    BlockTrafficComponent,
    MapComponent,
    // BlockClickComponent
  ],
  imports: [
    LoaderModule,
    CommonModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    FormsModule,
    NgxMatTagInputModule,
    NbToggleModule,
    NbButtonModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class TrafficModule {}
