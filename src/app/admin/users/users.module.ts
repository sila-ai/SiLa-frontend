import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersComponent} from './users.component';
import {NbActionsModule, NbButtonModule, NbCardModule, NbIconModule, NbLayoutModule, NbMenuModule, NbSelectModule,
  NbSidebarModule, NbTooltipModule} from '@nebular/theme';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    UsersComponent,
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    UserRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule,

    NbIconModule,
    NbActionsModule,
    NbTooltipModule,
    NbButtonModule,
    NbSidebarModule.forRoot(),
    NbCardModule,
    NbMenuModule.forRoot(),

  ]
})

export class UsersModule { }
