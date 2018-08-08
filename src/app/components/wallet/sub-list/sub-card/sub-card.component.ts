import { Component, Input, NgZone } from '@angular/core';
import { Subscription } from '../../../../models/Subscription';
import { SubscriptionSmartContractService } from '../../../../services/subscriptionSmartContract.service';

@Component({
  selector: 'app-sub-card',
  templateUrl: './sub-card.component.html'
})
export class SubCardComponent  {

  public sub: Subscription;
  constructor(private subscriptionSmartContractService: SubscriptionSmartContractService) { }

  @Input()
  set subscription(subscription: Subscription) {
    this.sub = subscription;
    console.log('got the sub!', this.sub);
  }

  private async deactivate() {
    await this.subscriptionSmartContractService.deactivateSubscription(this.sub.smartcontractId);
    this.sub.approved = false;
  }

  private async activate() {
    await this.subscriptionSmartContractService.activateSubscription(this.sub.smartcontractId);
    this.sub.approved = true;
  }

}
