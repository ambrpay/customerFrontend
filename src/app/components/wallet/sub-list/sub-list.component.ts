import { Component, Input, NgZone } from '@angular/core';
import { SubscriptionSmartContractService } from '../../../services/subscriptionSmartContract.service';
import { SubscriptionService } from '../../../services/subscription.service';
import { Subscription } from '../../../models/Subscription';



@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html'
})
export class SubListComponent  {

  public subscriptions: Subscription[];
  public _processing = false;
  public pending = false;
  public all: number[];


  constructor(
    private subscriptionService: SubscriptionService) {
    this._processing = true;
    if (!subscriptionService.isReady()) {
      subscriptionService.readyEvent().subscribe( (data: any) => {
        this.reloadInfos();
      });
    } else {
      this.reloadInfos();
    }
  }

  async reloadInfos() {
    this.subscriptions = this.subscriptionService.getSubscriptions();
    this._processing = false;
  }

}
