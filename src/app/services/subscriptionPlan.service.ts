
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { ConfigService } from './config.service';


@Injectable()
export class SubscriptionPlanService {

  constructor(private http: HttpClient,
              private configService: ConfigService) {}

  getSubscriptionPlans(ids: number[]): Observable<SubscriptionPlan[]> {
    const plans = {
      plans: ids,
    };
    const url = this.configService.getConfig('server') + `/api/subscriptionPlans/getplans`;
    return this.http.post<SubscriptionPlan[]>(url, plans);
  }

  getOne(businessid: number, ids: number): Observable<SubscriptionPlan> {
    const url = this.configService.getConfig('server') + `/api/businesses/${businessid}/subscriptionplans/${ids}`;
    return this.http.get<SubscriptionPlan>(url);
  }

}
