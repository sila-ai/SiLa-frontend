import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenComponent } from './token.component';
import { LoaderModule } from '../../loader/loader.module';
@NgModule({
  declarations: [TokenComponent],
  imports: [FormsModule, CommonModule, LoaderModule],
})
export class TokenModule {}
