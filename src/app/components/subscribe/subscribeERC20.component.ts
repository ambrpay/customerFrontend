import { Component,  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionPlanService } from '../../services/subscriptionPlan.service';
import { SubscriptionService } from '../../services/subscription.service';
import { AlertService } from '../../services/alert.service';
import { RateService } from '../../services/rate.service';
import { RobstenFaucetService } from '../../services/robstenFaucet.service';
import { Web3Service } from '../../services/web3.service';
import { ConfigService } from '../../services/config.service';
import { SubscriptionSmartContractERC20Service } from '../../services/subscriptionSmartContractERC20.service';


@Component({
  selector: 'app-subscribeeth',
  templateUrl: './subscribeERC20.component.html'
})
export class SubscribeERC20Component  {

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
  public smartContractAddr: string;
  public erc20ContractAddr: string;
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
    private subscriptionSmartContratERC20Serice: SubscriptionSmartContractERC20Service,
    private subscriptionService: SubscriptionService,
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
    // 0x565cd743a9da67f9cc753c428fd7c8fd613ea830 subscruptionContractERC20
    // 0x3c83116b6f5dd133caa985d70c6e84f092d3a4b6 Token Address Robsten
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
    this.smartContractAddr =  this.configService.getConfig('contractAddressERC20');


    this.subscriptionPlanService.getOne(this.subscriptionPlanid).subscribe(subscriptionPlan => {
        this.subscriptionPlan = subscriptionPlan;
        // this.subscriptionPlan.sRopsenTokenAddress = '0x3c83116b6f5dd133caa985d70c6e84f092d3a4b6';
        if (this.isRobstenMode) {
          this.erc20ContractAddr = this.subscriptionPlan.sRopsenTokenAddress;
        } else  {
          this.erc20ContractAddr = this.subscriptionPlan.sMainNetTokenAddress;
        }
        if (this.subscriptionPlan.iPrice <= 0) {
          this.priceNotSet = true;
        }
        console.log( this.subscriptionPlan);
        this.currency = this.subscriptionPlan.sCurrencyCode;
        this.fetchConversionRate();
      }
    );
  }

  fetchConversionRate() {
    console.log('fetching rate', this.currency, this.subscriptionPlan.sCurrencyCode);
    // this.currency = 'eth';
    // this.subscriptionPlan.sCurrencyCode = 'ETH';
    // this.rateService.get( this.currency, this.subscriptionPlan.sCurrencyCode)
    // .subscribe( rate => {
      const rate = 1;
      console.log('we fetched rate it was' + rate);
      this.conversionRate =  1 / rate;
      if (this.subscriptionPlan.iPrice <= 0) {
        this.subscriptionPlan.iPrice = rate * 0.045;
      }
      this.aproxPrice = this.subscriptionPlan.iPrice * this.conversionRate;
      this.minAmount = this.aproxPrice * this.subscriptionPlan.iFirstMultiplier;
      this.fetchAmount();
      this._processing = false;
    // });
  }

  async addSubscribtion() {
    this._processing = true;
      const sub = {
        price : this.subscriptionPlan.iPrice,
        subscriptionPlanId : this.subscriptionPlanid,
        tokenAddress : this.erc20ContractAddr,
        payoutAddress : this.subscriptionPlan.sWallet,
        subscriptionTimeFrame : this.subscriptionPlan.iDaysInterval,
        maxCryptoPrice : this.aproxPrice * 1.5,
        smartContractAddress : this.smartContractAddr,
        withdrawnCryptoAmount : 0,
        status : 'PENDING',
        customer : {
          ethAddress:  this.web3Service.getPrimaryAccount(),
          email: this.email,
          externalInfo: this.externalInfo
        }
      };
      console.log(sub);
      const allowanceAmount = 1000000000;
    try {
      await  this.subscriptionService.addERC20Subscription(sub, allowanceAmount);
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

  async fetchAmount() {
    this.amount = await this.subscriptionSmartContratERC20Serice.getTotalTokens(this.erc20ContractAddr);
  }

}
