import { Component, Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SubscriptionPlanService } from '../../services/subscriptionPlan.service';
import { SubscriptionPlan } from '../../models/SubscriptionPlan';
import { PayInChannelService } from '../../services/payinchannel.service';
import { PayInChannel } from '../../models/payInChannel';
import { SubscriptionService } from '../../services/subscription.service';
import { AlertService } from '../../services/alert.service';
import { RateService } from '../../services/rate.service';
import { RobstenFaucetService } from '../../services/robstenFaucet.service';
import { Web3Service } from '../../services/web3.service';
import { ConfigService } from '../../services/config.service';
import { Subscription } from '../../models/Subscription';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html'
})
export class SubscribeComponent  {

  public _processing = true;
  public subscriptionPlan: SubscriptionPlan;
  public payInChannel: PayInChannel;
  public payoutWallet: string;
  public businessid: number;
  public subscriptionPlanid: number;
  public payinChannelid: number;
  public currency: string;
  public externalInfo: string;
  public aproxPrice: number;
  public conversionRate: number;
  public isRobsten: boolean;
  public isRobstenMode: boolean;
  public amount;
  public email: string;
  public successLink: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private payInChannelService: PayInChannelService,
    private subscriptionPlanService: SubscriptionPlanService,
    private subscriptionService: SubscriptionService,
    private robstenService: RobstenFaucetService,
    private configService: ConfigService,
    private web3Service: Web3Service,
    private rateService: RateService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.businessid = this.activatedRoute.snapshot.queryParams['b'];
    this.subscriptionPlanid = this.activatedRoute.snapshot.queryParams['p'];
    this.payinChannelid = this.activatedRoute.snapshot.queryParams['c'];
    this.externalInfo = this.activatedRoute.snapshot.queryParams['ext'];
    this.email = this.activatedRoute.snapshot.queryParams['email'];
    this.successLink = this.activatedRoute.snapshot.queryParams['successLink'];
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

  private async fetchInfos() {
    this.isRobsten = await this.web3Service.isRobsten();
    this.isRobstenMode = this.configService.getConfig('robstenMode');
    this.fetchAmount();

    this.subscriptionPlanService.getOne(this.businessid, this.subscriptionPlanid).subscribe(subscriptionPlan => {
        this.subscriptionPlan = subscriptionPlan;
        if (this.subscriptionService.cointainsSubscription( this.subscriptionPlanid)) {
          window.location.href = this.successLink;
          console.log('containsSubscription');
        }
        this.fetchChannel();
      }
    );
  }



  fetchChannel() {
    this.payInChannelService.getOne(this.businessid, this.payinChannelid).subscribe(payInChannel  => {
      this.payInChannel = payInChannel;
      this.payInChannel.data = JSON.parse(this.payInChannel.data);
      this.payoutWallet = this.payInChannel.data.wallet;
      this.currency = this.payInChannel.currency;
      this.fetchConversionRate();
    });
  }

  fetchConversionRate() {
    console.log('fetching rate', this.currency, this.subscriptionPlan.currency);
    this.rateService.get( this.currency, this.subscriptionPlan.currency)
    .subscribe( rate => {
      console.log('we fetched rate it was' + rate);
      this.conversionRate =  1 / rate;
      this.aproxPrice = this.subscriptionPlan.price * this.conversionRate;
      this._processing = false;
    });
  }

  async addSubscribtion() {
    this._processing = true;
    console.log(this.payoutWallet,
      this.subscriptionPlan,
      this.currency,
      this.subscriptionPlan.interval,
      this.aproxPrice * 1.5);
    try {
      await this.subscriptionService.addSubscription(this.payoutWallet,
        this.subscriptionPlan,
        this.currency,
        this.subscriptionPlan.interval,
        this.aproxPrice * 1.5,
        this.externalInfo,
        this.email);
        window.location.href = this.successLink;
    } catch (e) {
      this.alertService.error('Subscribing did not work. Could it be that you have canceled the transaction or run out of funds?');
      this._processing = false;
    }
  }

  async fetchAmount() {
    this.amount = await this.web3Service.getAccountBalance();
    if (this.isRobsten && this.isRobstenMode) {
      this.waitForFundsToArrive(0);
    }
  }

  async waitForFundsToArrive(i) {
    this.amount = await this.web3Service.getAccountBalance();

    if (this.amount <= 0) {
      if ( i % 60 === 0) {
        this.robstenService.tap().subscribe(x => { console.log(x); });
      }
      setTimeout(() => {
        console.log('waiting for funds to arrive');
        this.waitForFundsToArrive(i + 1);
       }, 500);
    }
  }


}
