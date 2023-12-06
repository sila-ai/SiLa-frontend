import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-config-dialog',
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialogComponent implements OnInit {
 
  constructor(protected ref: NbDialogRef<ConfigDialogComponent>) { 
  }

  ngOnInit(): void {
  }

  dismiss() { 
    this.ref.close();
  }


}









 


