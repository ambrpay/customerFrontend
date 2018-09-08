
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { ConfigService } from './config.service';


@Injectable()
export class SubscriptionPlanService {

  constructor(private http: HttpClient,
              private configService: ConfigService) {}

  // getOne(businessid: number, ids: number): Observable<SubscriptionPlan> {
  //   const url = this.configService.getConfig('server') + `/api/businesses/${businessid}/subscriptionplans/${ids}`;
  //   return this.http.get<SubscriptionPlan>(url);
  // }

  getOne(id: number): Observable<any> {
    const url = this.configService.getConfig('server') + `/api/subscriptionPlan/${id}`;
    return this.http.get<any>(url);
  }

}
