import { Observable } from 'rxjs';

export interface LiveUpdateChart {
  liveChart: { value: [string, number] }[];
}

export abstract class WebHitsData {
  abstract getWebHitsLiveUpdateCardData(hits: string): Observable<any[]>;
  abstract getWebHitsCardData(hits: string): Observable<LiveUpdateChart>;
}
