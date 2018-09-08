import { Injectable } from '@angular/core';
import { Subscription } from '../models/Subscription';
import { SubscriptionSmartContractService } from './subscriptionSmartContract.service';
import { TokenContract } from '../models/TokenContract';
import { CustomerService } from './customer.service';
import { Web3Service } from './web3.service';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { Customer } from '../models/Customer';


@Injectable()
export class SubscriptionService {

  constructor(
    private customerService: CustomerService,
    private web3Service: Web3Service,
    private subscriptionSmartContractService: SubscriptionSmartContractService,
  ) {

  }

  public addSubscription(payoutAddress: string,
    subscriptionPlanid: number,
    subscriptionTimeFrame: number,
    price: number,
    maxAmount: number,
    externalCustomerInfo: string,
    email: string,
     ) {

        const sub: any = {};
        sub.price = price;
        sub.subscriptionPlanId = subscriptionPlanid;
        sub.payoutAddress = payoutAddress;
        sub.subscriptionTimeFrame = subscriptionTimeFrame;
        sub.maxCryptoPrice = maxAmount;
        sub.withdrawnCryptoAmount = 0;
        sub.status = 'PENDING';
        sub.customer = {
          ethAddress:  this.web3Service.getPrimaryAccount(),
          email: email,
          externalInfo: externalCustomerInfo
        };

        const topUpAmount = maxAmount * 2;

        return this.subscriptionSmartContractService.addSubscription(payoutAddress,
          subscriptionTimeFrame,
          maxAmount,
          topUpAmount).then( (o: any) => {
            console.log('is this the hash?', o );
            sub.transactionHash = o;
            this.customerService.postSubscription(sub)
            .subscribe((res) => {
              console.log('result', res );
            }, (err) => {
              console.log(err);
            });
            return;
          });
  }

}
