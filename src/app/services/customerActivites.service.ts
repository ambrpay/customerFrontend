
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';

import { CustomerActivity } from '../models/CustomerActivity';
import { Web3Service } from './web3.service';


@Injectable()
export class CustomerActivityService {

  private customerActivities: CustomerActivity[];

  private ready: EventEmitter<any> = new EventEmitter();

  public readyEvent() {
    return this.ready;
  }


  constructor(private http: HttpClient,
    private web3Service: Web3Service) {
      web3Service.readyEvent().subscribe(() => {
        this.fetch();
      });
  }

  private fetch() {
    const account = this.web3Service.getPrimaryAccount();
    this.getCustomerActivities(account)
    .subscribe(customerActivities => {
      this.customerActivities = customerActivities;
      this.ready.emit();
     });
  }


  public getActivities(): CustomerActivity[] {
    return this.customerActivities;
  }

  private getCustomerActivities(account): Observable<CustomerActivity[]> {
    const url = `http://localhost:3000/api/activities/byCustomer/${account}`;
    return this.http.get<CustomerActivity[]>(url);
  }

  public publishCustomerActivty(data: any) {
    const c: CustomerActivity = new CustomerActivity();
    c.createdAt = new Date();
    c.entry = JSON.stringify(data);
    this.customerActivities.push(c);
    this.postCustomerActivity(c);
  }

  private postCustomerActivity(customerActivity:  CustomerActivity) {
    const account = this.web3Service.getPrimaryAccount();
    const url = `http://localhost:3000/api/activities/add/${account}`;
    return this.http.post(url, customerActivity).subscribe(() => {
      console.log('we done it');
    });
  }


}
