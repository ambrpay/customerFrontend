import { Component, Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SubscriptionPlanService } from '../../services/subscriptionPlan.service';
import { SubscriptionPlan } from '../../models/SubscriptionPlan';
import { PayInChannelService } from '../../services/payinchannel.service';
import { PayInChannel } from '../../models/payInChannel';
import { SubscriptionService } from '../../services/subscription.service';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html'
})
export class SubscribeComponent  {

  private _processing = true;
  private subscriptionPlan: SubscriptionPlan;
  private payInChannel: PayInChannel;
  private payoutWallet: string;
  private businessid: number;
  private subscriptionPlanid: number;
  private payinChannelid: number;
  private currency: string;
  private externalInfo: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private payInChannelService: PayInChannelService,
    private subscriptionPlanService: SubscriptionPlanService,
    private subscriptionService: SubscriptionService,
    private alertService: AlertService
  ) {
    this.businessid = this.activatedRoute.snapshot.queryParams['b'];
    this.subscriptionPlanid = this.activatedRoute.snapshot.queryParams['p'];
    this.payinChannelid = this.activatedRoute.snapshot.queryParams['c'];
    this.externalInfo = this.activatedRoute.snapshot.queryParams['ext'];
    console.log(this.businessid, this.subscriptionPlanid, this.payinChannelid);
    if (!this.businessid || !this.subscriptionPlanid || !this.payinChannelid || !this.externalInfo) {
      console.log('we have an error');
      setTimeout(() => {
        this.alertService.error('The subscription is not defined properly, norhing further can be done here currently! \
                                 probably the link was wrong');
      }, 1000);

       //
    } else {
      subscriptionService.readyEvent().subscribe(() => this.fetchInfos());
    }
  }

  private fetchInfos() {
    this.subscriptionPlanService.getOne(this.businessid, this.subscriptionPlanid).subscribe(subscriptionPlan => {
        this.subscriptionPlan = subscriptionPlan;
        if (this.subscriptionService.cointainsSubscription( this.subscriptionPlanid)) {
          window.location.href = '/';
        }
        this._processing = false;
      }
    );
    this.payInChannelService.getOne(this.businessid, this.payinChannelid).subscribe(payInChannel  => {
      this.payInChannel = payInChannel;
      this.payInChannel.data = JSON.parse(this.payInChannel.data);
      this.payoutWallet = this.payInChannel.data.wallet;
      this.currency = this.payInChannel.currency;
    });
  }

  async addSubscribtion() {
    this._processing = true;
    console.log(this.payoutWallet,
      this.subscriptionPlanid,
      this.currency,
      this.subscriptionPlan.interval,
      this.subscriptionPlan.price * 1.3);
    try {
      await this.subscriptionService.addSubscription(this.payoutWallet,
        this.subscriptionPlanid,
        this.currency,
        this.subscriptionPlan.interval,
        this.subscriptionPlan.price * 1.3,
        this.externalInfo);
        setTimeout(() => {
          window.location.href = '/';
        }, 5000);
    } catch (e) {
      this.alertService.error('Subscribing did not work. Could it be that you have canceled the transaction or run out of funds?');
      this._processing = false;
    }
  }

}
