import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-horizontal',
  templateUrl: './chart-horizontal.component.html',
  styleUrls: ['./chart-horizontal.component.scss'],
})
export class ChartHorizontalComponent implements OnInit {
  options: any;

  // gauge-invalid-clicks
  gaugeType = 'arch';
  gaugeValue = 48;
  gaugeForm = 'round';
  gaugeThink = 15;
  gaugeColor = 'rgb(89,139,255)';
  gaugeAnim = 2500;
  gaugeSize = 150;
  gaugeAppendText = '%';

  // gauge-valid-clicks
  gaugeTypeValid = 'arch';
  gaugeValueValid = 71;
  gaugeFormValid = 'round';
  gaugeThinkValid = 15;
  gaugeColorValid = 'rgb(89,139,255)';
  gaugeAnimValid = 2500;
  gaugeSizeValid = 150;
  gaugeAppendTextValid = '%';

  @Input() totalInvalid = 0;
  @Input() totalvalid = 0;
  @Input() totalClick = 0;
  @Input() savings = 0;
  @Input() validClick = 0;
  @Input() invalidClick = 0;

  // //savings
  // savings: {score: number}[] = [
  //   {score: 137.25}
  // ];

  // //total-clicks
  // totals: {clicks: number}[] = [
  //   {clicks: 17510}
  // ];

  constructor() {}

  ngOnInit(): void {}
}
