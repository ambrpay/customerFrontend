import { Injectable } from '@angular/core';
import { SubscriptionSmartContractService } from './subscriptionSmartContract.service';
import { SubscriptionSmartContractERC20Service } from './subscriptionSmartContractERC20.service';
import { CustomerService } from './customer.service';



@Injectable()
export class SubscriptionService {

  constructor(
    private customerService: CustomerService,
    private subscriptionSmartContractService: SubscriptionSmartContractService,
    private subscriptionSmartContractERC20Service: SubscriptionSmartContractERC20Service,
  ) {

  }

  public addERC20Subscription(sub: any, allowance: number) {
    return this.subscriptionSmartContractERC20Service.addSubscription(sub.smartContractAddress,
      sub.tokenAddress,
      sub.payoutAddress,
      sub.subscriptionTimeFrame,
      sub.maxCryptoPrice,
      allowance).then( (o: any) => {
        console.log('is this the hash?', o );
        sub.transactionHash = o;
        this.addCustomer(sub);
      });
  }

  public addETHSubscription(sub: any, topUpAmount: number) {
    return this.subscriptionSmartContractService.addSubscription(sub.smartContractAddress,
      sub.payoutAddress,
      sub.subscriptionTimeFrame,
      sub.maxCryptoPrice,
      topUpAmount).then( (o: any) => {
        console.log('is this the hash?', o );
        sub.transactionHash = o;
        this.addCustomer(sub);
      });
  }

  private addCustomer(sub) {
    this.customerService.postSubscription(sub)
    .subscribe((res) => {
      console.log('result', res );
    }, (err) => {
      console.log(err);
    });
  }

}
