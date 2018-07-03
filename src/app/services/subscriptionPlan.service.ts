
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import { SubscriptionPlan } from '../models/SubscriptionPlan';


@Injectable()
export class SubscriptionPlanService {

  constructor(private http: HttpClient) {}

  getSubscriptionPlans(ids: number[]): Observable<SubscriptionPlan[]> {
    const plans = {
      plans: ids,
    };
    const url = `http://localhost:3000/api/subscriptionPlans/getplans`;
    return this.http.post<SubscriptionPlan[]>(url, plans);
  }

  getOne(businessid: number, ids: number): Observable<SubscriptionPlan> {
    const url = `http://localhost:3000/api/businesses/${businessid}/subscriptionplans/${ids}`;
    return this.http.get<SubscriptionPlan>(url);
  }

}
