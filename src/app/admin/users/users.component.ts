import { Component, OnInit } from '@angular/core';
import {first} from "rxjs/operators";

import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users = null;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authenticationService.getAll().then(response => {
      this.users = response
    })
  }

  deleteUser(id: string) {
    this.authenticationService.delete(id)
  }
}
