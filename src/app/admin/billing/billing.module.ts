import {NgModule,CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import { 
  NbButtonModule, 
  NbCardModule, 
  NbDialogModule, 
  NbInputModule, 
  NbLayoutModule, 
  NbTreeGridModule 
} from '@nebular/theme';
import {BillingComponent} from "./billing.component";
import { ViewaddonComponent } from './viewaddon/viewaddon.component';
import { BuyaddonsuccessComponent } from './buyaddonsuccess/buyaddonsuccess.component';
import { BuyaddonFailedComponent } from './buyaddon-failed/buyaddon-failed.component';

@NgModule({
  declarations: [
    BillingComponent,
    ViewaddonComponent,
    BuyaddonsuccessComponent,
    BuyaddonFailedComponent,

  ],
  imports: [
    CommonModule,
    NbButtonModule, 
    NbCardModule, 
    NbDialogModule, 
    NbInputModule, 
    NbLayoutModule, 
    NbTreeGridModule 
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class BillingModule { }
