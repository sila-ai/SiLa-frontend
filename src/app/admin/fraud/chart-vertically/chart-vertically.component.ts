import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-vertically',
  templateUrl: './chart-vertically.component.html',
  styleUrls: ['./chart-vertically.component.scss'],
})
export class ChartVerticallyComponent implements OnInit {
  @Input() series1 = [];
  @Input() series2 = [];
  @Input() totalClick: number;
  @Input() ip: number;
  @Input() bot: number;
  @Input() js: number;
  @Input() farm: number;
  @Input() country: any[] = [];

  // series1 = [
  //   {
  //     "name": "Mac",
  //     "value": 20,
  //     "label": "20%"
  //   },
  //   {
  //     "name": "Android",
  //     "value": 70,
  //     "label": "70%"
  //   },
  //   {
  //     "name": "ios",
  //     "value": 70,
  //     "label": "70%"
  //   },
  //   {
  //     "name": "Windows",
  //     "value": 70,
  //     "label": "70%"
  //   }
  // ];
  // series2 = [
  //   {
  //     "name": "Chorme",
  //     "value": 20,
  //     "label": "20%"
  //   },
  //   {
  //     "name": "Firefox",
  //     "value": 70,
  //     "label": "70%"
  //   },
  //   {
  //     "name": "Safari",
  //     "value": 70,
  //     "label": "70%"
  //   },
  //   {
  //     "name": "Opera",
  //     "value": 70,
  //     "label": "70%"
  //   },
  //   {
  //     "name": "Edge",
  //     "value": 70,
  //     "label": "70%"
  //   }
  // ];

  pieChartLabel(series: any[], name: string): string {
    const item = series.filter((data) => data.name === name);
    if (item.length > 0) {
      return item[0].label;
    }
    return name;
  }

  constructor() {}

  ngOnInit(): void {}
}
