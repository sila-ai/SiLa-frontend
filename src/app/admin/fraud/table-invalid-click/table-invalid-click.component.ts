import { Component, OnInit, Input } from '@angular/core';

export interface Click {
  ip: number;
  bot: number;
  accidental: number;
  competitor: number;
  farm: number;
  disabled: number;
  // proxy: number;
  // country: number;
  // city: number;
  // device: number;
  // os: number;
}

const Clicks: Click[] = [
  {
    ip: 568,
    bot: 566,
    accidental: 453,
    competitor: 444,
    farm: 399,
    disabled: 390,
    // proxy: 378,
    // country: 354,
    // city: 333,
    // device: 321,
    // os: 35
  },
];

@Component({
  selector: 'app-table-invalid-click',
  templateUrl: './table-invalid-click.component.html',
  styleUrls: ['./table-invalid-click.component.scss'],
})
export class TableInvalidClickComponent implements OnInit {
  @Input() ip: number;
  @Input() bot: number;
  @Input() js: number;
  @Input() farm: number;
  clicks = Clicks;

  constructor() {}

  ngOnInit(): void {}
}
