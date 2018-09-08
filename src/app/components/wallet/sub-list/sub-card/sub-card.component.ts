import { Component, Input, NgZone } from '@angular/core';
import { Subscription } from '../../../../models/Subscription';
import { SubscriptionSmartContractService } from '../../../../services/subscriptionSmartContract.service';

@Component({
  selector: 'app-sub-card',
  templateUrl: './sub-card.component.html'
})
export class SubCardComponent  {

  public sub: any;
  constructor(private subscriptionSmartContractService: SubscriptionSmartContractService) { }

  @Input()
  set subscription(subscription: any) {
    this.sub = subscription;
    console.log('got the sub!', this.sub);
  }

  private async deactivate() {
    await this.subscriptionSmartContractService.deactivateSubscription(this.sub.smartContractId);
    this.sub.approved = false;
  }

  private async activate() {
    await this.subscriptionSmartContractService.activateSubscription(this.sub.smartContractId);
    this.sub.approved = true;
  }

}
