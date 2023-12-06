import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {LayoutService} from './layout.service';
import {WebHitsService} from './web-hits.service';
import {WebHitsData} from './web-hits';

const DATA_SERVICES = [
  { provide: WebHitsData, useClass: WebHitsService },
];

export const NB_CORE_PROVIDERS = [
  ...DATA_SERVICES,
  LayoutService,
];

const SERVICES = [
  WebHitsService
];

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [
    ...NB_CORE_PROVIDERS,
    ...SERVICES,
  ]
})

export class ServiceModule { }
