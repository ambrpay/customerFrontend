import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from '../models/Subscription';
import { SubscriptionSmartContractService } from './subscriptionSmartContract.service';
import { TokenContract } from '../models/TokenContract';
import { CustomerService } from './customer.service';
import { Web3Service } from './web3.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { SubscriptionPlan } from '../models/SubscriptionPlan';


@Injectable()
export class SubscriptionService {

  // private subscriptions: any = {};
  private subscriptions = new Map<number, Subscription>();
  private tokenContracts: TokenContract [];
  private ready: EventEmitter<any> = new EventEmitter();

  private rdy: boolean;


  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private web3Service: Web3Service,
    private subscriptionSmartContractService: SubscriptionSmartContractService,
    private configService: ConfigService
  ) {
    if (!this.subscriptionSmartContractService.isReady()) {
      web3Service.readyEvent()
      .subscribe( async ( ) => {
        console.log('gotten ready event!');
        this.refresh();
      });
    } else {
      this.refresh();
    }
  }


  public readyEvent(): EventEmitter<any> {
    return this.ready;
  }

  public isReady() {
    return this.rdy;
  }

  public getSubscriptions(): Subscription[] {
    return Array.from(this.subscriptions.values());
  }

  public refresh() {
    this.fetchSubscriptionsBackend()
    .subscribe(subs => {
      console.log(subs.length);
      console.log('open stuff a lot');
      subs.forEach(sub => {
        const id: number = +sub.subscriptionPlanid;
        this.subscriptions.set(id, sub);
        console.log('added stuff');
      });
      console.log('we emit already why?');
      this.ready.emit();
      this.rdy = true;
    });
  }



  public addSubscription(payoutAddress: string,
    subscriptonPlan: SubscriptionPlan,
    currency: string,
    subscriptionTimeFrame: number,
    maxAmount: number,
    externalCustomerInfo: string,
    email: string
     ) {
      const promise = new Promise((resolve, reject) => {
        let tkn: TokenContract;
        const topUpAmount = maxAmount * 2;
        if (currency.toUpperCase() === 'ETH') {
          tkn = new TokenContract();
          tkn.name = 'Ethereum';
          tkn.symbol = 'ETH';
          tkn.address = '0x0';
        } else {
          tkn = this.tokenContracts.find( tokenC  => currency.toUpperCase() === tokenC.symbol.toUpperCase());
        }
        return this.customerService.addUpdateCustomer(subscriptonPlan.id, externalCustomerInfo,email).subscribe(() => {
          return this.subscriptionSmartContractService.addSubscription(payoutAddress,
            subscriptonPlan.id,
            tkn.address,
            subscriptionTimeFrame,
            maxAmount,topUpAmount).then( o => {
              const sub = new Subscription();
              sub.tokenContract = tkn.address;
              sub.payoutAddress = payoutAddress;
              sub.subscriptionPlanid = subscriptonPlan.id;
              sub.cycleStart = new Date();
              sub.subscriptionTimeFrame = subscriptionTimeFrame;
              sub.maxAmount = maxAmount;
              sub.withdrawnAmount = 0;
              sub.approved = true;
              sub.exists = true;
              sub.subscriptionPlan = subscriptonPlan;
              sub.tkn = tkn;
              sub.isNew = true;
              this.subscriptions.set(sub.subscriptionPlanid, sub);
              resolve(o);
            });
        });
    });
    return promise;
  }


  public cointainsSubscription(subscriptionPlanid: number): boolean {
    console.log('here are the subscriptions in');
    const id: number =  +subscriptionPlanid;
    console.log(this.subscriptions);
    console.log(this.subscriptions.get(id), 1, id);
    return !!this.subscriptions.get(id);
  }

  public fetchSubscriptionsBackend(): Observable<Subscription[]> {
    const acc = this.web3Service.getPrimaryAccount();
    const url = this.configService.getConfig('server') + `/api/subscriptions/bycustomer/${acc}`;
    console.log('callingbackend', url);
    return this.http.get<Subscription[]>(url);
  }

}
