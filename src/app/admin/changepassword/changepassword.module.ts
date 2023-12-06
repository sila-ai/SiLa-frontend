import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ChangepasswordComponent} from "./changepassword.component";
import {NbCardModule, NbInputModule, NbLayoutModule} from "@nebular/theme";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ChangepasswordComponent,
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
  ]
})

export class ChangepasswordModule { }







