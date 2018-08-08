
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { CustomerActivity } from '../models/CustomerActivity';
import { Web3Service } from './web3.service';
import { ConfigService } from './config.service';


@Injectable()
export class CustomerActivityService {

  private customerActivities: CustomerActivity[];

  private ready: EventEmitter<any> = new EventEmitter();
  private rdy: boolean;
  public isReady() {
    return this.rdy;
  }

  public readyEvent() {
    return this.ready;
  }


  constructor(private http: HttpClient,
    private web3Service: Web3Service,
    private configService: ConfigService) {

      if (!web3Service.isReady()) {
        web3Service.readyEvent().subscribe(() => {
          this.fetch();
        });
      } else {
        this.fetch();
      }
  }

  private fetch() {
    const account = this.web3Service.getPrimaryAccount();
    this.getCustomerActivities(account)
    .subscribe(customerActivities => {
      this.customerActivities = customerActivities;
      this.ready.emit();
      this.rdy = true;

     });
  }


  public getActivities(): CustomerActivity[] {
    return this.customerActivities;
  }

  private getCustomerActivities(account): Observable<CustomerActivity[]> {
    const url = this.configService.getConfig('server') + `/api/activities/byCustomer/${account}`;
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
    const url =  this.configService.getConfig('server') + `/api/activities/add/${account}`;
    return this.http.post(url, customerActivity).subscribe(() => {
      console.log('we done it');
    });
  }


}
