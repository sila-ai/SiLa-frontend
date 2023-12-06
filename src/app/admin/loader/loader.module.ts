import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader.component';
import { NbLayoutModule, NbTabsetModule } from '@nebular/theme';
@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule, NbLayoutModule, NbTabsetModule],
  exports: [LoaderComponent],
})
export class LoaderModule {}
