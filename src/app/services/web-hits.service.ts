import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { LiveUpdateChart, WebHitsData } from './web-hits';

@Injectable()
export class WebHitsService extends WebHitsData {
  private hitsDate: Date = new Date();
  private hitsValue = Math.random() * 1000;
  private ONE_DAY = 24 * 3600 * 1000;

  private liveUpdateChartData = {
    day: {
      liveChart: [],
    },
    week: {
      liveChart: [],
    },
    month: {
      liveChart: [],
    },
  };

  getDefaultLiveChartData(elementsNumber: number) {
    this.hitsDate = new Date(2015, 1, 1);
    this.hitsValue = Math.random() * 100;

    return Array.from(Array(elementsNumber)).map((item) =>
      this.generateRandomLiveChartData()
    );
  }

  generateRandomLiveChartData() {
    this.hitsDate = new Date(this.hitsDate.getTime() + this.ONE_DAY);
    this.hitsValue = this.hitsValue + Math.random() * 21 - 10;

    if (this.hitsValue < 0) {
      this.hitsValue = Math.random() * 100;
    }

    return {
      name: this.hitsDate.toString(),
      value: [
        [
          this.hitsDate.getFullYear(),
          this.hitsDate.getMonth() + 1,
          this.hitsDate.getDate(),
        ].join('/'),
        Math.round(this.hitsValue),
      ],
    };
  }

  getWebHitsLiveUpdateCardData(time): Observable<any[]> {
    const data = this.liveUpdateChartData[time.toLowerCase()];
    const newValue = this.generateRandomLiveChartData();

    data.liveChart.shift();
    data.liveChart.push(newValue);

    return observableOf(data.liveChart);
  }

  getWebHitsCardData(currency: string): Observable<LiveUpdateChart> {
    const data = this.liveUpdateChartData[currency.toLowerCase()];

    data.liveChart = this.getDefaultLiveChartData(600);

    return observableOf(data);
  }
}
