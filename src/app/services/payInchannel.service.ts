
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PayInChannel } from '../models/payInChannel';
import { ConfigService } from './config.service';

@Injectable()
export class PayInChannelService {

  constructor(private http: HttpClient, private configService: ConfigService) {}

  getOne(businessid: number, id: number): Observable<PayInChannel> {
    const url = this.configService.getConfig('server') + `/api/businesses/${businessid}/payinchannels/${id}`;
    return this.http.get<PayInChannel>(url);
  }

}
