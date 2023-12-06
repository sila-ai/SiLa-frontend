import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleComponent } from './google.component';
import { LoaderModule } from '../loader/loader.module';
import {NbLayoutModule, NbTabsetModule} from '@nebular/theme';

@NgModule({
  declarations: [GoogleComponent],
  imports: [FormsModule, CommonModule,
    FormsModule,
    LoaderModule, NbTabsetModule, NbLayoutModule,],
})
export class GoogleModule {}
