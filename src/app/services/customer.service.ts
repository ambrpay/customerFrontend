
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';

import { CustomerActivity } from '../models/CustomerActivity';
import { Web3Service } from './web3.service';


@Injectable()
export class CustomerService {

  private ready: EventEmitter<any> = new EventEmitter();

  public readyEvent() {
    return this.ready;
  }


  constructor(private http: HttpClient,
    private web3Service: Web3Service) {
      web3Service.readyEvent().subscribe(() => {
      });
  }


  public addUpdateCustomer(ambrSubscriptionPlanId: number, externalInfo: string): Observable<Object> {
    const data = {
      ethAddress : this.web3Service.getPrimaryAccount(),
      ambrSubscriptionPlanId,
      externalInfo,
    };
    const url = `http://localhost:3000/api/customers`;
    return this.http.post(url, data);
  }

}
