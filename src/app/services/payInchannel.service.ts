
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import { PayInChannel } from '../models/payInChannel';


@Injectable()
export class PayInChannelService {

  constructor(private http: HttpClient) {}


  getOne(businessid: number, id: number): Observable<PayInChannel> {
    const url = `http://localhost:3000/api/businesses/${businessid}/payinchannels/${id}`;
    return this.http.get<PayInChannel>(url);
  }

}
