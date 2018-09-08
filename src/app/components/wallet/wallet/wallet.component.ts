import { Component, OnInit } from '@angular/core';
import { SubscriptionSmartContractService } from '../../../services/subscriptionSmartContract.service';
import { TokenContract } from '../../../models/TokenContract';
import { CustomerService } from '../../../services/customer.service';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html'
})
export class WalletComponent implements OnInit {

  public balanceWallet: any;
  public balanceLocal: any;

  public _processing = false;
  public tokens: TokenContract[];
  public amountAdd = 0;
  public amountWithdraw = 0;
  public _show  = '';
  public currency: string;
  public token: TokenContract;

  constructor(
    private _subscriptionSmartContractService: SubscriptionSmartContractService,
    private _customerService: CustomerService ) {
      console.log('I am called now on wallet!');
  }

  ngOnInit(): void {
    console.log('on init now');
    this.init();
  }

  async init() {
    this._processing = true;
    if ( this._subscriptionSmartContractService.isReady()) {
      this.reload();
    } else {
      this._subscriptionSmartContractService.readyEvent().subscribe(() => {
        this.reload();
      });
    }
  }

  async add() {
    await this._subscriptionSmartContractService.payETH(this.amountAdd);
    this.balanceWallet += this.amountAdd;
    this.balanceLocal -= this.amountAdd;
    this._customerService.publishCustomerActivty({
      type: 'TOPUP',
      amount: this.amountAdd,
      currency: this.currency
    });
    this.setShow('', '', null);
    this.reloadwithDelay();
  }

  async withdraw() {
    await this._subscriptionSmartContractService.withdrawFunds(this.amountWithdraw);
    this.balanceWallet -= this.amountWithdraw;
    this.balanceLocal += this.amountWithdraw;
    this._customerService.publishCustomerActivty({
      type: 'WITHDRAW',
      amount: this.amountWithdraw,
      currency: this.currency
    });
    this.setShow('', '', null);
    this.reloadwithDelay();
  }


  setShow(str: string, currency: string, token: TokenContract) {
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

  show(str) {
    return this._show === str;
  }

  async reload() {

    this.balanceWallet = await this._subscriptionSmartContractService.getETHBalance();
    this.balanceLocal = await this._subscriptionSmartContractService.getLocalETHBalance();
    this._processing = false;
  }

  reloadwithDelay() {
    setTimeout(() => {
      this.reload();
     }, 10000);
  }
}
