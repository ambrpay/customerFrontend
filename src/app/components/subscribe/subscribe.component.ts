import { Component, Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SubscriptionPlanService } from '../../services/subscriptionPlan.service';
import { SubscriptionPlan } from '../../models/SubscriptionPlan';
import { SubscriptionService } from '../../services/subscription.service';
import { AlertService } from '../../services/alert.service';
import { RateService } from '../../services/rate.service';
import { RobstenFaucetService } from '../../services/robstenFaucet.service';
import { Web3Service } from '../../services/web3.service';
import { ConfigService } from '../../services/config.service';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html'
})
export class SubscribeComponent  {

  public _processing = true;
  public subscriptionPlan: any;
  public businessid: number;
  public subscriptionPlanid: number;
  public currency: string;
  public externalInfo: string;
  public aproxPrice: number;
  public conversionRate: number;
  public isRobsten: boolean;
  public isRobstenMode: boolean;
  public amount;
  public email: string;
  public rate: number;
  public successLink: string;
  public subscribed = false;
  public minAmount = 0;
  public emailNotSet = false;
  public priceNotSet = false;


  get price(): String {
    return this.subscriptionPlan.iPrice;
  }

  set price(val) {
    this.subscriptionPlan.iPrice = val;
    this.aproxPrice = this.subscriptionPlan.iPrice * this.conversionRate;
    this.minAmount = this.aproxPrice * this.subscriptionPlan.iFirstMultiplier;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private subscriptionPlanService: SubscriptionPlanService,
    private subscriptionService: SubscriptionService,
    private robstenService: RobstenFaucetService,
    private configService: ConfigService,
    private web3Service: Web3Service,
    private rateService: RateService,
    private alertService: AlertService
  ) {
    this.businessid = this.activatedRoute.snapshot.queryParams['b'];
    this.subscriptionPlanid = this.activatedRoute.snapshot.queryParams['p'];
    this.externalInfo = this.activatedRoute.snapshot.queryParams['ext'];
    this.email = this.activatedRoute.snapshot.queryParams['email'];
    this.successLink = this.activatedRoute.snapshot.queryParams['successLink'] || '#/';

    if (!this.externalInfo) {
      this.externalInfo = this.makeid();
    }

    if (!this.email) {
      this.emailNotSet = true;
    }

    if (!this.subscriptionPlanid || !this.externalInfo || !this.successLink ) {
      console.log('we have an error');
      setTimeout(() => {
        this.alertService.error('The subscription is not defined properly, norhing further can be done here currently! \
                                 probably the link was wrong');
      }, 1000);
       //
    } else {
      if (this.web3Service.isReady()) {
        console.log('ready to fetch web3 stuff');
        this.fetchInfos();
      } else {
        this.web3Service.readyEvent().subscribe(() => {
          this.fetchInfos();
          console.log('ready to fetch web3 stuff');
        });
      }
    }
  }

  private makeid() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private async fetchInfos() {
    this.isRobsten = await this.web3Service.isRobsten();
    this.isRobstenMode = this.configService.getConfig('robstenMode');


    this.subscriptionPlanService.getOne(this.subscriptionPlanid).subscribe(subscriptionPlan => {
        this.subscriptionPlan = subscriptionPlan;
        if (this.subscriptionPlan.iPrice <= 0) {
          this.priceNotSet = true;
        }
        console.log( this.subscriptionPlan);
        //this.subscriptionPlan.sWallet = '0xE5e32bd821F1C7Be5C2B2bE466d4e762C803747B';
        // if (this.subscriptionService.cointainsSubscription( this.subscriptionPlanid)) {
        //   window.location.href = this.successLink;
        //   console.log('containsSubscription');
        // }
        this.currency = 'ETH';
        this.fetchConversionRate();
      }
    );
  }

  fetchConversionRate() {
    console.log('fetching rate', this.currency, this.subscriptionPlan.sCurrencyCode);
    this.rateService.get( this.currency, this.subscriptionPlan.sCurrencyCode)
    .subscribe( rate => {
      console.log('we fetched rate it was' + rate);
      this.conversionRate =  1 / rate;
      if (this.subscriptionPlan.iPrice <= 0) {
        this.subscriptionPlan.iPrice = rate * 0.045;
      }
      this.aproxPrice = this.subscriptionPlan.iPrice * this.conversionRate;
      this.minAmount = this.aproxPrice * this.subscriptionPlan.iFirstMultiplier;
      this.fetchAmount(this.minAmount);
      this._processing = false;
    });
  }

  async addSubscribtion() {
    this._processing = true;
    console.log(this.subscriptionPlan.sWallet,
      this.subscriptionPlan,
      this.subscriptionPlan.iDaysInterval,
      this.aproxPrice * 1.5);
    try {
      await  this.subscriptionService.addSubscription(
        this.subscriptionPlan.sWallet,
        this.subscriptionPlanid,
        this.subscriptionPlan.iDaysInterval,
        this.subscriptionPlan.iPrice,
        this.aproxPrice * 1.5,
        this.externalInfo,
        this.email);
        this._processing = false;
        this.subscribed = true;
        setTimeout(() => {
           window.location.href = this.successLink;
        }, 7000);
    } catch (e) {
      this.alertService.error('Subscribing did not work. Could it be that you have canceled the transaction or run out of funds?');
      this._processing = false;
    }
  }

  async fetchAmount(minAmount) {
    this.amount = await this.web3Service.getAccountBalance();
    if (this.isRobsten && this.isRobstenMode) {
      this.waitForFundsToArrive(0, minAmount);
    }
  }

  async waitForFundsToArrive(i, minAmount) {
    this.amount = await this.web3Service.getAccountBalance();
    if (this.amount <= minAmount) {
      if ( i % 60 === 0) {
        this.robstenService.tap().subscribe(x => { console.log(x); });
      }
      setTimeout(() => {
        console.log('waiting for funds to arrive');
        this.waitForFundsToArrive(i + 1, minAmount);
       }, 500);
    }
  }

}
