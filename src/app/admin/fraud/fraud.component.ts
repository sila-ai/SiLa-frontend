import { Component, OnInit } from '@angular/core';
import { TrafficService } from '../../services/traffic.service';
import { GoogleService } from '../../services/google.service';
import { AdminComponent } from '../admin.component';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-fraud',
  templateUrl: './fraud.component.html',
  styleUrls: ['./fraud.component.scss'],
})
export class FraudComponent implements OnInit {
  userLog: [] = [];
  ip: number = 0;
  bot: number = 0;
  farm: number = 0;
  js: number = 0;
  totalClick: number = 0;
  invalidClick: number = 0;
  validClick: number = 0;
  totalInvalid: number = 0;
  totalvalid: number = 0;
  savings: number = 0;
  country: any[] = [];
  device: Object = {};
  browser: Object = {};
  series1: any[] = [];
  series2: any[] = [];
  campaignsList: any[] = [];
  load: boolean = false;
  constructor(
    private trafficService: TrafficService,
    private adminComponent: AdminComponent,
    private googleService: GoogleService
  ) {}

  private dynamicVisit(device) {
    const seriesArr1 = [];
    const objArr1 = Object.keys(device);
    objArr1.map((item) =>
      seriesArr1.push({
        name: item,
        value: device[item],
        label: device[item] + '%',
      })
    );
    const series1 =
      seriesArr1.length > 0
        ? seriesArr1
        : [
            {
              name: 'None',
              value: 100,
              label: 100 + '%',
            },
          ];
    return series1;
  }

  private math(value) {
    return Math.round(value * 100) / 100;
  }

  private filterCampaign(userLog, cmp) {
    this.totalClick = userLog.length;
    let ip = 0;
    let invalidClick = 0;
    let countryShort = {};
    let country = {};
    let device = {};
    let browser = {};
    let farm = 0;
    let bot = 0;
    let js = 0;
    let validClick = 0;
    let savings = 0;
    let savingLoop = 0;
    cmp.map((item: any) => {
      if (item.metrics.average_cpc) {
        savings += item.metrics.average_cpc;
        savingLoop += 1;
      }
    });
    userLog.map((item: any) => {
      if (item.block) {
        ip += 1;
        invalidClick += 1;
        countryShort[item.countryShort] = countryShort[item.countryShort]
          ? countryShort[item.countryShort] + 1
          : 1;
        country[item.country] = 1;
        device[item.device] = device[item.device] ? device[item.device] + 1 : 1;
        browser[item.browser] = browser[item.browser]
          ? browser[item.browser] + 1
          : 1;
      }
      if (item.farm) {
        farm += 1;
      }
      if (item.bot) {
        bot += 1;
      }
      if (item.jsEnabled === 'disabled') {
        js += 1;
      }
      if (!item.block) {
        validClick += 1;
      }
    });
    this.ip = ip;
    this.invalidClick = invalidClick;
    this.device = device;
    this.browser = browser;
    this.farm = farm;
    this.bot = bot;
    this.js = js;
    this.validClick = validClick;
    const countries = [];
    const objCountryShort = Object.keys(countryShort);
    const objCountry = Object.keys(country);
    objCountryShort.map((item, i) =>
      countries.push({
        flag: 'https://flagcdn.com/' + item.toLocaleLowerCase() + '.svg',
        ranking: countryShort[item],
        name: objCountry[i],
      })
    );
    this.country = countries;

    if (this.totalClick) {
      this.totalInvalid = this.math((invalidClick / this.totalClick) * 100);
      this.totalvalid = this.math((validClick / this.totalClick) * 100);
    } else {
      this.totalInvalid = 0;
      this.totalvalid = 0;
    }

    this.savings = savingLoop
      ? this.math(((savings / savingLoop) * invalidClick) / 1000000)
      : 0;

    this.series1 = this.dynamicVisit(device);
    this.series2 = this.dynamicVisit(browser);
    this.load = true;
  }

  async ngOnInit() {
    this.adminComponent.slCmp = 'global';

    const campaign: any = await this.googleService.getCampaign().toPromise();

    if (campaign) {
      const campaignsList = campaign.campaign;
      this.adminComponent.setCampaign(campaignsList);
      this.campaignsList = campaignsList;
      if (this.adminComponent.slCmp === 'global') {
        this.filterCampaign(this.userLog, campaignsList);
      } else {
        const fraudLog = this.userLog.filter(
          (cmp: any) => cmp.campaignid === this.adminComponent.slCmp
        );
        const filter = campaignsList.filter(
          (cmp) => cmp.campaign.id === parseInt(this.adminComponent.slCmp)
        );
        this.filterCampaign(fraudLog, filter);
      }
    } else {
      this.load = true;
    }

    this.adminComponent.changeCp.subscribe(() => {
      if (this.adminComponent.slCmp === 'global') {
        this.filterCampaign(this.userLog, this.campaignsList);
      } else {
        const fraudLog = this.userLog.filter(
          (cmp: any) => cmp.campaignid === this.adminComponent.slCmp
        );
        const filter = this.campaignsList.filter(
          (cmp) => cmp.campaign.id === parseInt(this.adminComponent.slCmp)
        );
        this.filterCampaign(fraudLog, filter);
      }
    });
  }
}
