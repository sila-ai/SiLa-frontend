import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    NbButtonModule,
    NbCardModule,
    NbDialogModule,
    NbInputModule,
    NbLayoutModule,
    NbTreeGridModule
} from '@nebular/theme';
import { TableInfoComponent } from "./table-info.component";
@NgModule({
    declarations: [
        TableInfoComponent,
    ],
    imports: [
        CommonModule,
        NbButtonModule,
        NbCardModule,
        NbDialogModule,
        NbInputModule,
        NbLayoutModule,
        NbTreeGridModule
    ]
})
export class TableInfoModule { }
