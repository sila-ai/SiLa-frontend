import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { TrafficService } from '../../../services/traffic.service';
import { SetupService } from '../../../services/setup.service';
import { GoogleService } from '../../../services/google.service';
import { AdminComponent } from '../../admin.component';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-block-traffic',
  templateUrl: './block-traffic.component.html',
  styleUrls: ['./block-traffic.component.scss'],
})
export class BlockTrafficComponent implements OnInit {
  public selectedValuesIp = [];
  public selectedValuesOs = [];
  public selectedValuesChannel = [];
  public selectedValuesBrowser = [];
  public selectedValuesDevice = [];
  public selectedValuesIsp = [];

  //Toggle
  toggleProxy = true;
  toggleJS = true;
  togglePost = true;
  country: any[] = [];
  city: any[] = [];

  campaigns = ['Campaing 1', 'Campaing 2', 'Campaing 3'];
  selectCp = 'global';
  selected;
  selectedData;

  minClick = 0;
  minutes = 0;
  hourclick = 0;
  hours = 0;
  dayclick = 0;
  day = 0;
  months = 0;
  monthclick = 0;

  id: string;
  slCp = 'global';
  urldata = [];
  global: any;
  account: boolean = true;
  loader: boolean = false;

  constructor(
    private trafficService: TrafficService,
    private setupService: SetupService,
    private adminComponent: AdminComponent,
    private googleService: GoogleService
  ) {}

  change($event) {}
  getCityCountry($event) {
    this.city = $event.city;
    this.country = $event.country;
  }
  submit() {
    if (this.slCp) {
      this.loader = false;
      this.trafficService
        .sendTrafficRule({
          proxy: this.toggleProxy,
          js: this.toggleJS,
          vpn: this.togglePost,
          ip: this.selectedValuesIp,
          os: this.selectedValuesOs,
          channel: this.selectedValuesChannel,
          browser: this.selectedValuesBrowser,
          device: this.selectedValuesDevice,
          isp: this.selectedValuesIsp,
          minutes: this.minutes,
          minClick: this.minClick,
          hours: this.hours,
          hourclick: this.hourclick,
          day: this.day,
          dayclick: this.dayclick,
          months: this.months,
          monthclick: this.monthclick,
          city: this.city,
          country: this.country,
          campaignId:
            this.slCp === 'global'
              ? this.adminComponent.campaigns
              : [this.slCp],
        })
        .subscribe((res) => {
          const filter = this.urldata.filter(
            (cmp) => cmp.campaignId === this.slCp.toString()
          );

          if (filter.length === 0 && this.slCp !== 'global') {
            console.log('new update');
            const updateArr = [
              ...this.urldata,
              {
                proxy: this.toggleProxy,
                js: this.toggleJS,
                vpn: this.togglePost,
                ip: this.selectedValuesIp,
                os: this.selectedValuesOs,
                channel: this.selectedValuesChannel,
                browser: this.selectedValuesBrowser,
                device: this.selectedValuesDevice,
                isp: this.selectedValuesIsp,
                clickTime: {
                  hour: {
                    click: this.hourclick,
                    time: this.hours,
                  },
                  month: {
                    click: this.monthclick,
                    time: this.months,
                  },
                  day: {
                    click: this.dayclick,
                    time: this.day,
                  },
                  minutes: {
                    click: this.minClick,
                    time: this.minutes,
                  },
                },
                campaignId: this.slCp,
                city: this.city,
                country: this.country,
              },
            ];
            this.urldata = updateArr;
          } else if (filter.length > 0 && this.slCp !== 'global') {
            filter[0].proxy = this.toggleProxy;
            filter[0].js = this.toggleJS;
            filter[0].vpn = this.togglePost;
            filter[0].ip = this.selectedValuesIp;
            filter[0].os = this.selectedValuesOs;
            filter[0].channel = this.selectedValuesChannel;
            filter[0].browser = this.selectedValuesBrowser;
            filter[0].device = this.selectedValuesDevice;
            filter[0].isp = this.selectedValuesIsp;
            filter[0].clickTime.minutes.time = this.minutes;
            filter[0].clickTime.minutes.click = this.minClick;
            filter[0].clickTime.hour.time = this.hours;
            filter[0].clickTime.hour.click = this.hourclick;
            filter[0].clickTime.day.time = this.day;
            filter[0].clickTime.day.click = this.dayclick;
            filter[0].clickTime.month.time = this.months;
            filter[0].clickTime.month.click = this.monthclick;

            filter[0].city = this.city;
            filter[0].country = this.country;

            const cutArr = this.urldata.filter(
              (cmp) => cmp.campaignId !== this.slCp.toString()
            );
            this.urldata = [...filter, ...cutArr];
          } else if (this.slCp === 'global') {
            const updateAll = [];
            for (const cmpId of this.adminComponent.campaigns) {
              updateAll.push({
                campaignId: cmpId,

                proxy: this.toggleProxy,
                js: this.toggleJS,
                vpn: this.togglePost,
                ip: this.selectedValuesIp,
                os: this.selectedValuesOs,
                channel: this.selectedValuesChannel,
                browser: this.selectedValuesBrowser,
                device: this.selectedValuesDevice,
                isp: this.selectedValuesIsp,
                clickTime: {
                  hour: {
                    click: this.hourclick,
                    time: this.hours,
                  },
                  month: {
                    click: this.monthclick,
                    time: this.months,
                  },
                  day: {
                    click: this.dayclick,
                    time: this.day,
                  },
                  minutes: {
                    click: this.minClick,
                    time: this.minutes,
                  },
                },
                city: this.city,
                country: this.country,
              });
            }
            this.urldata = updateAll;
            if (updateAll.length > 0) {
              this.global = updateAll[0];
            }
          }
          this.loader = true;
        });
    }
  }

  async ngOnInit() {
    this.adminComponent.slCmp = 'global';
    const campaign: any = await this.googleService.getCampaign().toPromise();
    // const campaign: any = {
    //   campaign: [],
    // };
    const campaignsList = campaign.campaign;
    if (campaign.account === 'none') {
      this.account = false;
    }
    this.adminComponent.setCampaign(campaignsList);

    const urldata: any = await this.setupService.getRule().toPromise();

    this.urldata = urldata.url.Items;

    this.loader = true;

    // event trigger on Change campaign
    this.adminComponent.changeCp.subscribe(() => {
      console.log(this.adminComponent.slCmp);
      this.slCp = this.adminComponent.slCmp;
      const filter = this.urldata.filter(
        (cmp) => cmp.campaignId.toString() === this.slCp.toString()
      );

      if (filter.length > 0) {
        const urlInfo = filter[0];
        this.minClick = urlInfo.clickTime.minutes.click;
        this.minutes = urlInfo.clickTime.minutes.time;
        this.hourclick = urlInfo.clickTime.hour.click;
        this.hours = urlInfo.clickTime.hour.time / 60;
        this.dayclick = urlInfo.clickTime.day.click;
        this.day = urlInfo.clickTime.day.time / (60 * 24);
        this.months = urlInfo.clickTime.month.time / (60 * 24 * 30);
        this.monthclick = urlInfo.clickTime.month.click;
        this.selectedValuesIp = urlInfo.ip;
        this.selectedValuesOs = urlInfo.os;
        this.selectedValuesChannel = urlInfo.channel;
        this.selectedValuesBrowser = urlInfo.browser;
        this.selectedValuesDevice = urlInfo.device;
        this.selectedValuesIsp = urlInfo.isp;
        this.toggleProxy = urlInfo.proxy;
        this.toggleJS = urlInfo.js;
        this.togglePost = urlInfo.vpn;
        this.city = urlInfo.city;
        this.country = urlInfo.country;
      } else if (this.slCp === 'global' && this.global) {
        this.minClick = this.global.clickTime.minutes.click;
        this.minutes = this.global.clickTime.minutes.time;
        this.hourclick = this.global.clickTime.hour.click;
        this.hours = this.global.clickTime.hour.time / 60;
        this.dayclick = this.global.clickTime.day.click;
        this.day = this.global.clickTime.day.time / (60 * 24);
        this.months = this.global.clickTime.month.time / (60 * 24 * 30);
        this.monthclick = this.global.clickTime.month.click;
        this.selectedValuesIp = this.global.ip;
        this.selectedValuesOs = this.global.os;
        this.selectedValuesChannel = this.global.channel;
        this.selectedValuesBrowser = this.global.browser;
        this.selectedValuesDevice = this.global.device;
        this.selectedValuesIsp = this.global.isp;
        this.toggleProxy = this.global.proxy;
        this.toggleJS = this.global.js;
        this.togglePost = this.global.vpn;
        this.city = this.global.city;
        this.country = this.global.country;
      } else {
        this.minClick = 0;
        this.minutes = 0;
        this.hourclick = 0;
        this.hours = 0;
        this.dayclick = 0;
        this.day = 0;
        this.months = 0;
        this.monthclick = 0;
        this.selectedValuesIp = [];
        this.selectedValuesOs = [];
        this.selectedValuesChannel = [];
        this.selectedValuesBrowser = [];
        this.selectedValuesDevice = [];
        this.selectedValuesIsp = [];
        this.toggleProxy = true;
        this.toggleJS = true;
        this.togglePost = true;
        this.city = [];
        this.country = [];
      }
    });
  }
}
