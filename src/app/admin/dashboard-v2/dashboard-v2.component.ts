import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TrafficService } from '../../services/traffic.service';
import { GoogleService } from '../../services/google.service';
import { AdminComponent } from '../admin.component';
import { Socket } from 'ngx-socket-io';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { LiveUpdateChart, WebHitsData } from 'src/app/services/web-hits';
import { switchMap, takeWhile } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { graphic } from 'echarts';
// import LinearGradient from 'zrender/lib/graphic/LinearGradient';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss'],
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'rotateY(179deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'rotateY(0)',
        })
      ),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in')),
    ]),
  ],
})
export class DashboardV2Component implements OnInit, OnDestroy {
  @Input() selectedHits: string = 'Filter';
  @Input() monthVisit;
  isLoading = false;
  barChart: any;

  userLog: any[] = [];
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
  fraudCampaign: Object = {};
  keyword: Object = {};
  automationTool: number = 0;
  browserSpoofing: number = 0;
  searchEngine: number = 0;
  vm: number = 0;

  series1: any[] = [];
  series2: any[] = [];
  campaignsList: any[] = [];
  load: boolean = false;
  flip0: string = 'inactive';
  flip1: string = 'inactive';
  flip2: string = 'inactive';
  flip3: string = 'inactive';
  colorScheme = {
    domain: ['#5AA454', '#7aa3e5'],
  };
  barColorScheme = {
    domain: ['#7aa3e5'],
  };
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  timeline: boolean = true;
  private alive = true;
  webHitsLiveUpdateCardData: LiveUpdateChart;
  liveUpdateChartData: { value: [string, number] }[];
  intervalSubscription: Subscription;
  webHitsTheme: string;
  view;
  times: string[] = [
    'Filter',
    '1 Day',
    '3 Days',
    '7 Days',
    'Month',
    '3 Months',
    '6 Months',
  ];

  keywordList = [
    { name: 'Keyword 1', value: 50 },
    { name: 'Keyword 2', value: 70 },
    { name: 'Keyword 3', value: 20 },
    { name: 'Keyword 4', value: 40 },
    { name: 'Keyword 5', value: 76 },
    { name: 'Keyword 6', value: 47 },
    { name: 'Keyword 7', value: 86 },
    { name: 'Keyword 8', value: 35 },
    { name: 'Keyword 9', value: 90 },
    { name: 'Keyword 10', value: 10 },
  ];

  campainList = [
    { name: 'Campain 1', value: 50 },
    { name: 'Campain 2', value: 70 },
    { name: 'Campain 3', value: 20 },
    { name: 'Campain 4', value: 40 },
    { name: 'Campain 5', value: 76 },
    { name: 'Campain 6', value: 47 },
    { name: 'Campain 7', value: 86 },
    { name: 'Campain 8', value: 35 },
    { name: 'Campain 9', value: 90 },
  ];
  max = 100;
  min = 0;

  options: any = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#D6E2FC',
        },
      },
    },
    color: ['red', 'rgb(90, 164, 84)', 'orange', 'rgb(122, 163, 229)'],
    legend: {
      data: ['Blocked', 'Valid', 'IVT', 'Total'],
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        //  data: ['Last 30 days'],
      },
    ],
    yAxis: [
      {
        type: 'value',
        boundaryGap: false,
        data: [
          '0',
          '20',
          '40',
          '60',
          '80',
          '100',
          '120',
          '140',
          '160',
          '180',
          '200',
        ],
      },
    ],
    series: [
      {
        name: 'Blocked',
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'red',
            },
            {
              offset: 1,
              color: '#fff',
            },
          ]),
        },
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Valid',
        type: 'line',
        smooth: true,

        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(90, 164, 84)',
            },
            {
              offset: 1,
              color: '#fff',
            },
          ]),
        },
        data: [0, 0, 0, 0, 0, 0, 0],
        //data: [200],
      },
      {
        name: 'IVT',
        type: 'line',
        smooth: true,

        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'orange',
            },
            {
              offset: 1,
              color: '#fff',
            },
          ]),
        },
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Total',
        type: 'line',
        smooth: true,

        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(122, 163, 229)',
            },
            {
              offset: 1,
              color: '#fff',
            },
          ]),
        },
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };
  oldOptions: any;
  constructor(
    private trafficService: TrafficService,
    private themeService: NbThemeService,
    private adminComponent: AdminComponent,
    private googleService: GoogleService,
    private webHitsService: WebHitsData,
    private socket: Socket
  ) {
    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe((theme) => {
        this.webHitsTheme = theme.name;
      });
    this.view = [innerWidth / 1.3, 400];
  }

  // private dynamicVisit(device) {
  //   const seriesArr1 = [];
  //   const objArr1 = Object.keys(device);
  //   objArr1.map((item) =>
  //     seriesArr1.push({
  //       name: item,
  //       value: device[item],
  //       label: device[item] + '%',
  //     })
  //   );
  //   const series1 =
  //     seriesArr1.length > 0
  //       ? seriesArr1
  //       : [
  //           {
  //             name: 'None',
  //             value: 100,
  //             label: 100 + '%',
  //           },
  //         ];
  //   return series1;
  // }

  private math(value) {
    if (value > 0) {
      return Math.round(value * 100) / 100;
    }
    return 0;
  }

  private dynamicLiveChart(data) {
    const customDateSplit = (date) => {
      const newDate = `${new Date(date)}`;
      const today = newDate.split(' ');
      return today;
    };

    const customDate = (date) => {
      const today = customDateSplit(date);
      return today[0] + '-' + today[1] + '-' + today[2] + '-' + today[3];
    };
    const objToValues = (value) => {
      return Object.values(value);
    };
    const day = [1, 2, 3, 4, 5, 6, 7];
    var date = new Date();

    const last7DaysValid = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };
    const last7DaysInvalid = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };
    const last7DaysTotal = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    day.map((item, i) => {
      if (i !== 0) {
        date.setDate(date.getDate() - 1);
      }
      data.map((log) => {
        if (customDate(log.clickTime) === customDate(date.getTime())) {
          if (log.block) {
            last7DaysInvalid[customDateSplit(date)[0]] =
              last7DaysInvalid[customDateSplit(date)[0]] + 1;
          } else {
            last7DaysValid[customDateSplit(date)[0]] =
              last7DaysValid[customDateSplit(date)[0]] + 1;
          }
          last7DaysTotal[customDateSplit(date)[0]] =
            last7DaysTotal[customDateSplit(date)[0]] + 1;
        }
      });
    });

    let options: any = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#D6E2FC',
          },
        },
      },
      color: ['red', 'rgb(90, 164, 84)', 'orange', 'rgb(122, 163, 229)'],
      legend: {
        data: ['Blocked', 'Valid', 'IVT', 'Total'],
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '2%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          //  data: ['Last 30 days'],
        },
      ],
      yAxis: [
        {
          type: 'value',
          boundaryGap: false,
          data: [
            '0',
            '20',
            '40',
            '60',
            '80',
            '100',
            '120',
            '140',
            '160',
            '180',
            '200',
          ],
        },
      ],
      series: [
        {
          name: 'Blocked',
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'red',
              },
              {
                offset: 1,
                color: '#fff',
              },
            ]),
          },
          data: objToValues(last7DaysInvalid),
        },
        {
          name: 'Valid',
          type: 'line',
          smooth: true,

          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(90, 164, 84)',
              },
              {
                offset: 1,
                color: '#fff',
              },
            ]),
          },
          data: objToValues(last7DaysValid),
        },
        {
          name: 'IVT',
          type: 'line',
          smooth: true,

          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'orange',
              },
              {
                offset: 1,
                color: '#fff',
              },
            ]),
          },
          data: objToValues(last7DaysInvalid),
        },
        {
          name: 'Total',
          type: 'line',
          smooth: true,

          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(122, 163, 229)',
              },
              {
                offset: 1,
                color: '#fff',
              },
            ]),
          },
          data: objToValues(last7DaysTotal),
        },
      ],
    };

    // this.options.series[0].data = objToValues(last7DaysInvalid);
    // this.options.series[1].data = objToValues(last7DaysValid);
    // this.options.series[2].data = objToValues(last7DaysInvalid);
    // this.options.series[3].data = objToValues(last7DaysTotal);
    this.oldOptions = options;
    this.options = options;
  }

  private dynamicLiveChartFilter(data, time) {
    console.log('this.adminComponent.slCmp');
    console.log(this.adminComponent.slCmp);
    const dateFilter = (day) => {
      const date = new Date();
      let inValid = 0;
      let valid = 0;
      let total = 0;

      date.setDate(date.getDate() - day);
      const getTime = date.getTime();
      data.map((log) => {
        if (new Date(log.clickTime).getTime() >= getTime) {
          if (log.block) inValid += 1;
          if (!log.block) valid += 1;
          total += 1;
        }
      });

      let options: any = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#D6E2FC',
            },
          },
        },
        color: ['red', 'rgb(90, 164, 84)', 'orange', 'rgb(122, 163, 229)'],
        legend: {
          data: ['Blocked', 'Valid', 'IVT', 'Total'],
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [time],
            //  data: ['Last 30 days'],
          },
        ],
        yAxis: [
          {
            type: 'value',
            boundaryGap: false,
            data: [
              '0',
              '20',
              '40',
              '60',
              '80',
              '100',
              '120',
              '140',
              '160',
              '180',
              '200',
            ],
          },
        ],
        series: [
          {
            name: 'Blocked',
            type: 'line',
            smooth: true,
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'red',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
            data: [inValid],
          },
          {
            name: 'Valid',
            type: 'line',
            smooth: true,

            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(90, 164, 84)',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
            data: [valid],
          },
          {
            name: 'IVT',
            type: 'line',
            smooth: true,

            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'orange',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
            data: [inValid],
          },
          {
            name: 'Total',
            type: 'line',
            smooth: true,

            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(122, 163, 229)',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
            data: [total],
          },
        ],
      };

      this.options = options;
    };

    if (time === 'Filter' && this.oldOptions) {
      this.options = this.oldOptions;
    }

    if (time === '1 Day') {
      dateFilter(1);
    }
    if (time === '3 Days') {
      dateFilter(3);
    }
    if (time === '7 Days') {
      dateFilter(7);
    }
    if (time === 'Month') {
      dateFilter(30);
    }
    if (time === '3 Months') {
      dateFilter(90);
    }
    if (time === '6 Months') {
      dateFilter(180);
    }

    // console.log(data);
    // console.log(time);

    // console.log(inValid);
    // console.log(valid);
    // console.log(inValid);

    // this.options.series[0].data = [10];
    // this.options.series[1].data = [20];
    // this.options.series[2].data = [100];
    // this.options.series[3].data = [100];
    // this.options.xAxis[0].data = [time];
  }

  private filterCampaign(userLog, cmp) {
    this.totalClick = userLog.length;
    let ip = 0;
    let invalidClick = 0;
    let countryShort = {};
    let country = {};
    let device = {};
    let browser = {};
    let keyword = {};
    let fraudCampaign = {};
    let farm = 0;
    let bot = 0;
    let js = 0;
    let validClick = 0;
    let savings = 0;
    let savingLoop = 0;

    let automationTool: number = 0;
    let browserSpoofing: number = 0;
    let searchEngine: number = 0;
    let vm: number = 0;

    cmp.map((item: any) => {
      if (item.metrics && item.metrics.average_cpc) {
        console.log('cpc pass');
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

        fraudCampaign[item.campaignid] = fraudCampaign[item.campaignid]
          ? fraudCampaign[item.campaignid] + 1
          : 1;
      }

      keyword[item.keyword] = keyword[item.keyword]
        ? keyword[item.keyword] + 1
        : 1;

      if (item.farm) {
        farm += 1;
      }
      if (item.bot) {
        bot += 1;
        automationTool += item.automationTool;
        browserSpoofing += item.browserSpoofing;
        searchEngine += item.searchEngine;
        vm += item.vm;
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
    this.fraudCampaign = fraudCampaign;
    this.keyword = keyword;

    this.automationTool = automationTool;
    this.browserSpoofing = browserSpoofing;
    this.searchEngine = searchEngine;
    this.vm = vm;

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

    // this.series1 = this.dynamicVisit(device);
    // this.series2 = this.dynamicVisit(browser);

    console.log('kiad');
    this.load = true;
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }
  onSelect(event) {
    console.log(event);
  }

  getFraudCampaigns() {
    if (this.fraudCampaign) {
      return Object.keys(this.fraudCampaign);
    } else {
      return [];
    }
  }
  getKeyword() {
    if (this.keyword) {
      return Object.keys(this.keyword);
    } else {
      return [];
    }
  }

  campaignFilterByLog(userLog, campaignsList) {
    if (this.adminComponent.slCmp === 'global') {
      this.filterCampaign(userLog, campaignsList);
    } else {
      const fraudLog = userLog.filter(
        (cmp: any) => cmp.campaignid === this.adminComponent.slCmp
      );
      const filter = campaignsList.filter(
        (cmp) => cmp.campaign.id === parseInt(this.adminComponent.slCmp)
      );
      this.filterCampaign(fraudLog, filter);
    }
  }
  async ngOnInit() {
    // const dataAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    // const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321];
    // const yMax = 500;
    // const dataShadow = [];

    // // tslint:disable-next-line: prefer-for-of
    // for (let i = 0; i < data.length; i++) {
    //   dataShadow.push(yMax);
    // }

    // this.barChart = {
    //   yAxis: {
    //     data: dataAxis,
    //     axisLabel: {
    //       inside: false,
    //       color: '#000',
    //     },
    //     axisTick: {
    //       show: false,
    //     },
    //     axisLine: {
    //       show: false,
    //     },
    //     z: 10,
    //   },
    //   xAxis: {
    //     axisLine: {
    //       show: false,
    //     },
    //     axisTick: {
    //       show: false,
    //     },
    //     axisLabel: {
    //       textStyle: {
    //         color: '#999',
    //       },
    //     },
    //   },
    //   dataZoom: [
    //     {
    //       type: 'inside',
    //     },
    //   ],
    //   series: [
    //     {
    //       // For shadow
    //       type: 'bar',
    //       itemStyle: {
    //         color: 'rgba(0,0,0,0.05)',
    //       },
    //       barGap: '-100%',
    //       barCategoryGap: '40%',
    //       data: dataShadow,
    //       animation: false,
    //     },
    //     {
    //       type: 'bar',
    //       itemStyle: {
    //         color: new LinearGradient(0, 0, 0, 1, [
    //           { offset: 0, color: '#83bff6' },
    //           { offset: 0.5, color: '#188df0' },
    //           { offset: 1, color: '#188df0' },
    //         ]),
    //       },
    //       emphasis: {
    //         itemStyle: {
    //           color: new LinearGradient(0, 0, 0, 1, [
    //             { offset: 0, color: '#2378f7' },
    //             { offset: 0.7, color: '#2378f7' },
    //             { offset: 1, color: '#83bff6' },
    //           ]),
    //         },
    //       },
    //       data,
    //     },
    //   ],
    // };

    // this.getWebHitsCardData(this.selectedHits);

    this.adminComponent.slCmp = 'global';

    // Fetch campaign IDS and click logs
    const campaign: any = await this.googleService.getCampaign().toPromise();
    const clickLog: any = await this.trafficService.getuserTrafic().toPromise();

    if (clickLog.success) {
      // this.socket.emit('adduser', { userId: clickLog.userId });
      this.userLog = clickLog.data.Items;
      this.dynamicLiveChart(this.userLog);
    }

    if (campaign) {
      const campaignsList = campaign.campaign;
      this.adminComponent.setCampaign(campaignsList);
      this.campaignsList = campaignsList;

      this.campaignFilterByLog(this.userLog, campaignsList);

      // if (this.adminComponent.slCmp === 'global') {
      //   this.filterCampaign(this.userLog, campaignsList);
      // } else {
      //   const fraudLog = this.userLog.filter(
      //     (cmp: any) => cmp.campaignid === this.adminComponent.slCmp
      //   );
      //   const filter = campaignsList.filter(
      //     (cmp) => cmp.campaign.id === parseInt(this.adminComponent.slCmp)
      //   );
      //   this.filterCampaign(fraudLog, filter);
      // }
    } else {
      this.load = true;
    }

    // It will work based on onChange campaign ID
    this.adminComponent.changeCp.subscribe(() => {
      this.campaignFilterByLog(this.userLog, this.campaignsList);

      // if (this.adminComponent.slCmp === 'global') {
      //   this.filterCampaign(this.userLog, this.campaignsList);
      // } else {
      //   const fraudLog = this.userLog.filter(
      //     (cmp: any) => cmp.campaignid === this.adminComponent.slCmp
      //   );
      //   const filter = this.campaignsList.filter(
      //     (cmp) => cmp.campaign.id === parseInt(this.adminComponent.slCmp)
      //   );
      //   this.filterCampaign(fraudLog, filter);
      // }
    });

    // Event listner for upcoming click logs
    this.socket.on('upcomingLog', (data: any) => {
      if (data.userId) {
        this.userLog = [data, ...this.userLog];
        this.dynamicLiveChart(this.userLog);
        this.campaignFilterByLog(this.userLog, this.campaignsList);
      }
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  changeTime(time) {
    this.dynamicLiveChartFilter(this.userLog, time);
    // if (this.selectedHits !== time) {
    //   this.selectedHits = time;
    //   this.getWebHitsCardData(this.selectedHits);
    // }
  }

  private getWebHitsCardData(time) {
    this.webHitsService
      .getWebHitsCardData(time)
      .pipe(takeWhile(() => this.alive))
      .subscribe((webHitsLiveUpdateCardData: LiveUpdateChart) => {
        this.webHitsLiveUpdateCardData = webHitsLiveUpdateCardData;
        this.liveUpdateChartData = webHitsLiveUpdateCardData.liveChart;

        this.startReceivingLiveData(time);
      });
  }

  startReceivingLiveData(time) {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    this.intervalSubscription = interval(400)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.webHitsService.getWebHitsLiveUpdateCardData(time))
      )
      .subscribe((liveUpdateChartData: any[]) => {
        this.liveUpdateChartData = [...liveUpdateChartData];
      });
  }

  toggleFlip(index) {
    switch (index) {
      case 0:
        this.flip0 = this.flip0 == 'inactive' ? 'active' : 'inactive';

        break;
      case 1:
        this.flip1 = this.flip1 == 'inactive' ? 'active' : 'inactive';
        break;
      case 2:
        this.flip2 = this.flip2 == 'inactive' ? 'active' : 'inactive';
        break;
      case 3:
        this.flip3 = this.flip3 == 'inactive' ? 'active' : 'inactive';
        break;

      default:
        break;
    }
  }
}
