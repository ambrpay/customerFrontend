import { Component, Input, NgZone } from '@angular/core';
import { SubscriptionSmartContractService } from '../../../services/subscriptionSmartContract.service';
import { SubscriptionService } from '../../../services/subscription.service';
import { Subscription } from '../../../models/Subscription';



@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html'
})
export class SubListComponent  {

  private subscriptions: Subscription[];
  private _processing = false;
  private all: number[];

  constructor(
    private subscriptionService: SubscriptionService) {
    this._processing = true;
    subscriptionService.readyEvent().subscribe( (data: any) => {
      console.log('got the ready signal!');
      this.reloadInfos();
    });
  }


  async reloadInfos() {
    this.subscriptions = this.subscriptionService.getSubscriptions();
    this._processing = false;
  }



}
