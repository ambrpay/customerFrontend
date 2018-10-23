import { Component, OnInit } from '@angular/core';
import { SubscriptionSmartContractService } from '../../../services/subscriptionSmartContract.service';
import { TokenContract } from '../../../models/TokenContract';
import { CustomerService } from '../../../services/customer.service';
import { Web3Service } from '../../../services/web3.service';
import { ConfigService } from '../../../services/config.service';


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
    private _web3Service: Web3Service,
    private _subscriptionSmartContractService: SubscriptionSmartContractService,
    private _configService: ConfigService,
    private _customerService: CustomerService ) {
      console.log('I am called now on wallet!');
  }

  ngOnInit(): void {
    console.log('on init now');
    this.init();
  }

  async init() {
    this._processing = true;
    if ( this._web3Service.isReady()) {
      this.reload();
    } else {
      this._web3Service.readyEvent().subscribe(() => {
        this.reload();
      });
    }
  }

  async add() {
    await this._subscriptionSmartContractService.payETH(this._configService.getConfig('contractAddress'), this.amountAdd);
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
    await this._subscriptionSmartContractService.withdrawFunds(this._configService.getConfig('contractAddress'), this.amountWithdraw);
    // TODO: FIX THIS.
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

    this.balanceWallet = await this._subscriptionSmartContractService.getETHBalance(this._configService.getConfig('contractAddress'));
    this.balanceLocal = await this._subscriptionSmartContractService.getLocalETHBalance();
    this._processing = false;
  }

  reloadwithDelay() {
    setTimeout(() => {
      this.reload();
     }, 10000);
  }
}
