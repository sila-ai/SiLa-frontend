import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
})
export class TableListComponent implements OnInit {
  @Input() country: any[] = [];

  // countries: { name: string; flag: string; ranking: number }[] = [
  //   {
  //     name: 'United States',
  //     flag: 'a/a4/Flag_of_the_United_States.svg',
  //     ranking: 777,
  //   },
  //   { name: 'Canada', flag: 'c/cf/Flag_of_Canada.svg', ranking: 756 },
  //   { name: 'Germany', flag: 'b/ba/Flag_of_Germany.svg', ranking: 562 },
  //   { name: 'France', flag: 'c/c3/Flag_of_France.svg', ranking: 423 },
  //   { name: 'Brazil', flag: '0/05/Flag_of_Brazil.svg', ranking: 223 },
  //   { name: 'Vietnam', flag: '2/21/Flag_of_Vietnam.svg', ranking: 203 },
  //   { name: 'Russia', flag: 'f/f3/Flag_of_Russia.svg', ranking: 200 },
  //   { name: 'Portugal', flag: '5/5c/Flag_of_Portugal.svg', ranking: 123 },
  //   { name: 'Bangladesh', flag: 'https://flagcdn.com/za.svg', ranking: 123 },
  //   { name: 'Bangladesh', flag: 'https://flagcdn.com/bn.svg', ranking: 123 },
  // ];

  constructor() {}

  ngOnInit(): void {}
}
