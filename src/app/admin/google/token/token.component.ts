import { Component, OnInit } from '@angular/core';
import { GoogleService } from '../../../services/google.service';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent implements OnInit {
  constructor(
    private googleService: GoogleService,
    private route: ActivatedRoute
  ) {}
  accounts = [];
  refreshToken: string = '';
  user: any = jwt_decode(localStorage.getItem('token'));
  success: boolean = false;
  accountIssue: boolean = false;
  selectAccount: any = 'Select Ad Account';
  manager: boolean = false;
  load: boolean = false;

  formOnSubmit() {
    if (this.user.id && this.selectAccount) {
      this.load = false;
      this.googleService
        .postSendAccount({
          user: this.user.id,
          account: this.selectAccount,
          refreshToken: this.refreshToken,
        })
        .subscribe((accountRes: any) => {
          if (accountRes.success) {
            this.success = true;
            this.load = true;

            // window.location.href = window.location.origin + '/#/user/adwords';
          }
          if (accountRes.manager) {
            this.manager = true;
            this.load = true;
          }
          if (this.accountIssue) {
            this.accountIssue = true;
            this.load = true;
          }
        });
    } else {
      this.accountIssue = true;
      this.load = false;
    }
  }
  ngOnInit(): void {
    if (this.user) {
      const code = this.route.snapshot.queryParamMap.get('code');

      this.googleService.getAdwordToken(code).subscribe((item: any) => {
        if (item.success) {
          this.accounts = item.account;
          this.refreshToken = item.refreshToken;
          this.load = true;
        } else {
          this.success = false;
          this.accountIssue = true;
          this.load = true;
        }
      });
    }
  }
}
