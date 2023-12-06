import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import jwt_decode from 'jwt-decode';
import { TrafficService } from '../../../services/traffic.service';
import { AdminComponent } from '../../admin.component';

@Component({
  selector: 'app-block-click',
  templateUrl: './block-click.component.html',
  styleUrls: ['./block-click.component.scss'],
})
export class BlockClickComponent implements OnInit, OnChanges {
  @Input() minClick = 0;
  @Input() minutes = 0;
  @Input() hourclick = 0;
  @Input() hours = 0;
  @Input() dayclick = 0;
  @Input() day = 0;
  @Input() months = 0;
  @Input() monthclick = 0;
  @Input() user: any = jwt_decode(localStorage.getItem('token'));
  @Input() id: string;
  @Output() onSubmitEmit = new EventEmitter();

  constructor(private trafficService: TrafficService) {}

  change($event) {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    console.log('parnet click');
    console.log(this.minClick);
    console.log(this.minutes);
  }

  onSubmit() {
    this.onSubmitEmit.emit({
      minClick: this.minClick,
      minutes: this.minutes,
      hourclick: this.hourclick,
      hours: this.hours,
      dayclick: this.dayclick,
      day: this.day,
      months: this.months,
      monthclick: this.monthclick,
    });
  }
}
