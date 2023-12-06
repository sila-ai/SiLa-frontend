import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SetupService } from 'src/app/services/setup.service';
import { GoogleService } from '../../services/google.service';
import jwt_decode from 'jwt-decode';
import { Subject } from 'rxjs';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss'],
})
export class GoogleComponent implements OnInit {
  resetFormSubject: Subject<boolean> = new Subject<boolean>();
  constructor(
    private googleService: GoogleService,
    private setupService: SetupService,
    private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private route: ActivatedRoute
  ) {}

  user: any = jwt_decode(localStorage.getItem('token'));
  script: any = '';
  loader = false;

  urlInfo: any[];
  url: any;
  trafficUrl: string;
  token = localStorage.getItem('token');
  success = false;
  mode = '';
  editId = '';
  creation = false;
  final: any = '';
  finalPrintURL: any = '';
  userId: any = '';

  ngOnInit(): void {
    this.setupService.getUrlList().subscribe((item: any) => {
      if (item.success) {
        this.url = item.url;
        this.userId = item.user;
      }
    });
  }

  finalURL() {
    if (this.final && this.userId) {
      this.finalPrintURL =
        this.final +
        '?campaignid={campaignid}&keyword={keyword}&userId=' +
        this.userId;
    }
    console.log(this.url);
  }
  resetChildForm() {
    this.resetFormSubject.next(true);
  }

  getSetup() {
    this.route.queryParams.subscribe((params) => {
      if (this.user && params.edit && params.mode === 'edit') {
        this.editId = params.edit;
        this.mode = params.mode;
        this.loader = true;
        this.setupService
          .getSetup(this.user, this.editId, this.mode)
          .subscribe((item: any) => {
            if (item.url.Item) {
              this.trafficUrl = item.url.Item.url;
              this.url = item.url.Item.redirect;
              this.urlInfo = item.url.Item;
            }
            this.loader = false;
          });
      }
    });
  }

  create() {
    if (this.token && this.url) {
      this.loader = true;
      this.setupService
        .createSetup({ user: this.user.customerId, redirect: this.url })
        .subscribe((subUrl: any) => {
          if (subUrl.success) {
            this.success = true;
            this.trafficUrl = subUrl.url;
            this.creation = true;
            this.loader = false;
            this.resetChildForm();
          }
        });
    }
  }

  update() {
    if (!this.token || this.token === null) {
      return;
    }
    this.loader = true;
    this.setupService
      .updateSetup({ id: this.editId, redirect: this.url })
      .subscribe((subUrl: any) => {
        if (subUrl.success) {
          this.success = true;
          this.loader = false;
        }
      });
  }

  connectAdword() {
    this.googleService.getConnectGoogle().subscribe((item: any) => {
      console.log(item);
      if (item.url) {
        window.location.href = item.url;
      }
    });
  }

  getTrackingScript() {
    this.trackingService.getTracking().subscribe((script: any) => {
      console.log(script);
      this.script = script.script;
      this.loader = false;
    });
  }

  tabChange(event: any) {
    if (event.tabTitle === 'Your tracking URL') {
      this.getTrackingScript();
    }
  }
}
