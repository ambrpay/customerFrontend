import { Injectable, EventEmitter, COMPILER_OPTIONS } from '@angular/core';
import { Subscription } from '../models/Subscription';
import { SubscriptionSmartContractService } from './subscriptionSmartContract.service';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { SubscriptionPlanService } from './subscriptionPlan.service';
import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';
import { TokenContract } from '../models/TokenContract';
import { TokenContractService } from './tokenContract.service';
import { CustomerService } from './customer.service';


@Injectable()
export class SubscriptionService {

  private instance: any;
  private subscriptions: Subscription [];
  private tokenContracts: TokenContract [];
  private ready: EventEmitter<any> = new EventEmitter();

  constructor(
    private tokenContractService: TokenContractService,
    private subscriptionPlanService: SubscriptionPlanService,
    private customerService: CustomerService,
    private subscriptionSmartContractService: SubscriptionSmartContractService
  ) {
    subscriptionSmartContractService.readyEvent()
    .subscribe( async ( ) => {
      console.log('gotten ready event!');
      this.refesh();
    });
  }

  public readyEvent(): EventEmitter<any> {
    return this.ready;
  }

  public getSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  private async refesh() {
    const planIds: number [] = [];
    this.subscriptions = [];
    const length = await this.subscriptionSmartContractService.getSubscriptionLength();
    console.log('fetching!', length);
    for (let i = 0; i < length; i++ ) {
      console.log('fetching one', i);
      try {
        console.log('trying');
        const sub: Subscription = await this.subscriptionSmartContractService.getSubscriptionInfo(i);
        console.log('gotten one', sub);
        this.subscriptions.push(sub);
        planIds.push(sub.ambrSubscriptionPlanId);
      } catch ( e ) {
        console.log('there was an error fething this subscription', e);
      }

    }
    this.mergeWithPlans(planIds);
  }

  private mergeWithPlans(planIds) {
    this.subscriptionPlanService.getSubscriptionPlans(planIds).subscribe(
      (plans) => {
        for (let i = 0; i < this.subscriptions.length; i++ ) {
          this.subscriptions[i].subscriptionPlan = plans.find( sp  => this.subscriptions[i].ambrSubscriptionPlanId === sp.id );
        }
        this.mergeSmartContracts();
      }
    );
  }


  private mergeSmartContracts() {
    this.tokenContractService.getTokenContracts().subscribe(
      (contracts: TokenContract[]) => {
        this.tokenContracts = contracts;
        for (let i = 0; i < this.subscriptions.length; i++ ) {
          this.subscriptions[i].tkn = contracts.find( tokenC  => {
            return this.subscriptions[i].tokenContract === tokenC.address;
          });
          if (this.subscriptions[i].tokenContract === '0x0000000000000000000000000000000000000000') {
            this.subscriptions[i].tkn = new TokenContract();
            this.subscriptions[i].tkn.symbol = 'ETH';
            console.log('set token');
          }
          console.log(this.subscriptions[i]);
        }
        console.log(this.subscriptions);
        this.ready.emit();
      }
    );
  }


  public addSubscription(payoutAddress: string,
    ambrSubscriptionPlanId: number,
    currency: string,
    subscriptionTimeFrame: number,
    maxAmount: number,
    externalCustomerInfo: string) {
      const promise = new Promise((resolve, reject) => {
        let tokenAddress: string;
        if (currency.toUpperCase() === 'ETH') {
          tokenAddress = '0x0';
        } else {
          const tkn = this.tokenContracts.find( tokenC  => currency.toUpperCase() === tokenC.symbol.toUpperCase());
          tokenAddress = tkn.address;
        }
        return this.customerService.addUpdateCustomer(ambrSubscriptionPlanId, externalCustomerInfo).subscribe(() => {
          return this.subscriptionSmartContractService.addSubscription(payoutAddress,
            ambrSubscriptionPlanId,
            tokenAddress,
            subscriptionTimeFrame,
            maxAmount).then( o => {
              resolve(o);
            });
        });
    });
    return promise;
  }


  public cointainsSubscription(subscriptionPlanId: number): boolean {
    console.log(subscriptionPlanId, this.subscriptions);
    const found = this.subscriptions.find( sub  => (subscriptionPlanId - sub.ambrSubscriptionPlanId) === 0 );
    console.log(found, 'found it');
    return !!this.subscriptions.find( sub  => (subscriptionPlanId - sub.ambrSubscriptionPlanId) === 0 );
  }

}
