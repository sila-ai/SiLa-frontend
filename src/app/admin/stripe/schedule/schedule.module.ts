import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';


@NgModule({
  declarations: [ScheduleListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbTreeGridModule,
    NbInputModule,
    NbButtonModule
  ]
})
export class ScheduleModule { }
