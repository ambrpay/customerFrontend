import { Injectable, EventEmitter  } from '@angular/core';
import * as SubscriptionWallet from '../../../../subSmart/build/contracts/Ambr.json';
import { Web3Service } from './web3.service';
import { ConfigService } from './config.service';


@Injectable()
export class SubscriptionSmartContractService {

  private instance: any;

  private ready: EventEmitter<any> = new EventEmitter();
  private rdy: boolean;

  public isReady() {
    return this.rdy;
  }

  constructor(
    private web3Service: Web3Service,
    private configService: ConfigService
  ) {}

  async getAccount() {
    const acc = await this.web3Service.getAccount();
  }


  public async fetchSubscriptionManager() {
    this.instance = await this.web3Service.fetchContractInstance(this.getContractAddress(), SubscriptionWallet);
    this.ready.emit(null);
    this.rdy = true;
  }

  public getSubscriptionManager() {
    return this.instance;
  }

  public async getTokenBalance(contractAddress: string): Promise<number> {
    return await new Promise<number>((resolve, reject) => {
      this.instance.getTokenBalance(contractAddress, (e, res) => {
        if (e) { reject(e); }
        resolve(this.web3Service.getWeb3().fromWei(res).toNumber());
      });
    });
  }

  public getContractAddress(): string {
    return this.configService.getConfig('contractAddress');
  }


  public async addSubscription( payoutAddress: string,
    subscriptionTimeFrame: number,
    maxAmount: number,
    topupAmount: number)  {

    const acc = await this.web3Service.getPrimaryAccount();
    maxAmount = this.web3Service.getWeb3().toWei(maxAmount);
    topupAmount = this.web3Service.getWeb3().toWei(topupAmount);
    console.log(payoutAddress,
      subscriptionTimeFrame,
      topupAmount,
      maxAmount, 'how we call the contract.');
    return await new Promise<number>((resolve, reject) => {
        this.instance.addSubscription( payoutAddress,
        subscriptionTimeFrame,
        maxAmount,
        {value: topupAmount , gas: 500000, from: acc },
        (e, res) => {
          if (e) { reject(e); }
          resolve(res);
        });
    });
  }

  public async activateSubscription(i: number) {
    return await new Promise<number>((resolve, reject) => {
      const acc = this.web3Service.getPrimaryAccount();
      console.log('deactivate with', acc, i);
       this.instance.activateSubscription(i, {gas: 500000, from: acc}, (e, res) => {
        if (e) { reject(e); }
        resolve();
      } );
    });
  }

  public async deactivateSubscription(i: number) {
    return await new Promise<number>((resolve, reject) => {
      const acc = this.web3Service.getPrimaryAccount();
      console.log('deactivate with', acc, i);
      this.instance.deactivateSubscription(i, {gas: 500000, from: acc}, (e, res) => {
        if (e) { reject(e); }
       resolve();
     } );
   });
  }


  public async withdrawFunds(amount: any) {
    const value = this.web3Service.getWeb3().toWei(amount);
    console.log('withdrawing', value);
    return await new Promise<number>((resolve, reject) => {
      this.instance.withdrawETHFunds(value, {gas: 500000}, (e, res) => {
        if (e) { reject(e); }
        resolve();
      });
    });
  }

  public async getETHBalance() {
    const acc =  await this.web3Service.getAccount();
    return await new Promise<number>((resolve, reject) => {
      this.instance.getETHBalance(acc, (e, res) => {
        if (e) { reject(e); }
        resolve(this.web3Service.getWeb3().fromWei(res).toNumber());
      });
    });
  }

  public async getLocalETHBalance() {
    const acc =  await this.web3Service.getAccount();
    return await new Promise<number>((resolve, reject) => {
      this.web3Service.getWeb3().eth.getBalance(acc, (e, res) => {
        console.log(res, acc);
        if (e) { reject(e); }
        resolve(this.web3Service.getWeb3().fromWei(res).toNumber());
      });
    });
  }

  public async payETH(amount: number) {
    const acc =  await this.web3Service.getAccount();
    const value = this.web3Service.getWeb3().toWei(amount);
    console.log('the value', value, acc,  this.getContractAddress());
    return await new Promise<number>((resolve, reject) => {
      console.log(value);
      this.web3Service.getWeb3().eth.sendTransaction({ from: acc, to: this.getContractAddress(), value: value }, (e, res) => {
        console.log(e, res);
        if (e) { reject(e); }
        resolve();
      });
    });
  }

  public readyEvent() {
    return this.ready;
  }
}
