
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Web3Service } from './web3.service';
import { ConfigService } from './config.service';


@Injectable()
export class CustomerService {



  constructor(private http: HttpClient,
    private web3Service: Web3Service,
    private configService: ConfigService) {
  }


  public addUpdateCustomer(ambrSubscriptionPlanId: number, externalInfo: string, email: string): Observable<Object> {
    const data = {
      ethAddress : this.web3Service.getPrimaryAccount(),
      ambrSubscriptionPlanId,
      externalInfo,
      email
    };
    const url = this.configService.getConfig('server') + `/api/customers`;
    return this.http.post(url, data);
  }

}
