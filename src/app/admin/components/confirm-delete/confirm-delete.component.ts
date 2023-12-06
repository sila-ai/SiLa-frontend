import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

interface DialogData{
  title: string
}

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  title: string

  constructor(public dialogService: NbDialogService, protected dialogRef: NbDialogRef<ConfirmDeleteComponent>) { }

  ngOnInit(): void {
  }

  close(status: boolean) {
    this.dialogRef.close(status);
  }

}
