
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Web3Service } from './web3.service';
import { ConfigService } from './config.service';
import { Customer } from '../models/Customer';
import { CustomerActivity } from '../models/CustomerActivity';
import { Subscription } from '../models/Subscription';


@Injectable()
export class CustomerService {

  public customer = new Customer();
  private ready: EventEmitter<any> = new EventEmitter();
  private rdy: boolean;

  constructor(private http: HttpClient,
    private web3Service: Web3Service,
    private configService: ConfigService) {
      web3Service.readyEvent()
      .subscribe( async ( ) => {
        this.fetch();
      });
  }

  public readyEvent(): EventEmitter<any> {
    return this.ready;
  }

  public isReady() {
    return this.rdy;
  }

  private  fetch() {
    const url = this.configService.getConfig('server') + `/api/wallet/${this.web3Service.getPrimaryAccount()}`;
     this.http.get<Customer>(url)
    .subscribe(customer => {
      this.customer = customer;
      this.ready.emit();
      this.rdy = true;
    });
  }

  public getCustomer() {
    return this.customer;
  }

  public publishCustomerActivty(data: any) {
    const c: any = {};
    c.date = new Date();
    c.activity = JSON.stringify(data);
    this.customer.activities.push(c);
    const account = this.web3Service.getPrimaryAccount();
    const url =  this.configService.getConfig('server') + `/api/activity/${account}`;
    return this.http.post(url, c);
  }

  public postSubscription(sub: any): Observable<Object> {
    console.log(JSON.stringify(sub));
    const url = this.configService.getConfig('server') + `/api/subscription`;
    console.log('last before push', url);
    return this.http.post(url, sub);
  }

}
