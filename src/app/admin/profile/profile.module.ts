import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ProfileComponent} from "./profile.component";
import {NbCardModule, NbInputModule, NbLayoutModule} from "@nebular/theme";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
  ]
})

export class ProfileModule { }
