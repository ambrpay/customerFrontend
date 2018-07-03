import { Component, Input, NgZone, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Web3Service } from '../../../services/web3.service';
import { SubscriptionSmartContractService } from '../../../services/subscriptionSmartContract.service';
import { TokenSmartContractService } from '../../../services/tokenSmartContract.service';
import { TokenContract } from '../../../models/TokenContract';
import { CustomerActivity } from '../../../models/CustomerActivity';
import { CustomerActivityService } from '../../../services/customerActivites.service';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html'
})
export class WalletComponent  {
  private balanceWallet: any;
  private balanceLocal: any;

  private _processing = false;
  private tokens: TokenContract[];
  private amountAdd = 0;
  private amountWithdraw = 0;
  private _show  = '';
  private currency: string;
  private token: TokenContract;

   constructor(
    private _web3: Web3Service,
    private _subscriptionSmartContractService: SubscriptionSmartContractService,
    private _tokenSmartContractService: TokenSmartContractService,
    private _customerActivityService: CustomerActivityService ) {
      this.init();
  }

  async init() {
    this._processing = true;
    this._tokenSmartContractService.readyEvent()
      .subscribe(async () => {
        this.reload();
      });
  }

  async add() {
    await this._subscriptionSmartContractService.payETH(this.amountAdd);
    this.balanceWallet += this.amountAdd;
    this.balanceLocal -= this.amountAdd;
    this._customerActivityService.publishCustomerActivty({
      type: 'TOPUP',
      amount: this.amountAdd,
      currency: this.currency
    });
    this.setShow('', '', null);
    this.reloadwithDelay();
  }

  async setAllowance() {
    await this._tokenSmartContractService.setAllowance(this.token.address, this.amountAdd);
    this.token.balanceWallet = this.amountAdd;
    this._customerActivityService.publishCustomerActivty({
      type: 'ALLOWANCE',
      amount: this.amountAdd,
      currency: this.currency
    });
    this.setShow('', '', null);
    this.reloadwithDelay();
  }

  async revokeAllowance(t: TokenContract) {
    await this._tokenSmartContractService.setAllowance(t.address, 0);
    t.balanceWallet = 0;
    this._customerActivityService.publishCustomerActivty({
      type: 'ALLOWANCE',
      amount: 0,
      currency: t.symbol
    });
    this.setShow('', '', null);
    this.reloadwithDelay();
  }

  async withdraw() {
    await this._subscriptionSmartContractService.withdrawFunds(this.amountWithdraw);
    this.balanceWallet -= this.amountWithdraw;
    this.balanceLocal += this.amountWithdraw;
    this._customerActivityService.publishCustomerActivty({
      type: 'WITHDRAW',
      amount: this.amountWithdraw,
      currency: this.currency
    });
    this.setShow('', '', null);
    this.reloadwithDelay();
  }


  private setShow(str: string, currency: string, token: TokenContract) {
    if (this._show === str && this.currency === currency) {
        this._show = '';
        this.currency = '';
        this.token = null;
    } else {
      this._show = str;
      this.currency = currency;
      this.token = token;
    }

  }


  private show(str) {
    return this._show === str;
  }



  async reload() {
    console.log('refreshing');
    this.tokens = this._tokenSmartContractService.getAllTokens();
    this.balanceWallet = await this._subscriptionSmartContractService.getETHBalance();
    this.balanceLocal = await this._subscriptionSmartContractService.getLocalETHBalance();
    console.log(this.tokens);
    this._processing = false;
  }

  reloadwithDelay() {
    setTimeout(() => {
      //  window.location.href = '/';
      console.log('token update');
      this._tokenSmartContractService.loadTokens();
      this.reload();
      console.log('refreshed again');
     }, 10000);
  }
}
