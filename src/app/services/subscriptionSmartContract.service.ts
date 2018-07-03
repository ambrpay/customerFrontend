import { Injectable, HostListener, EventEmitter  } from '@angular/core';
import * as SubscriptionWallet from '../../../../subSmart/build/contracts/Ambr.json';
import { Web3Service } from './web3.service';
import { TokenContract } from '../models/TokenContract';
import { Subscription } from '../models/Subscription';



@Injectable()
export class SubscriptionSmartContractService {

  private instance: any;
  private contractAddress = '0xd793dd4f7b317614df033cfeec12955523554fdc'; //

  private ready: EventEmitter<any> = new EventEmitter();

  constructor(
    private web3Service: Web3Service
  ) {}

  async getAccount() {
    const acc = await this.web3Service.getAccount();
  }

  public async fetchSubscriptionManager() {
    this.instance = await this.web3Service.fetchContractInstance(this.contractAddress, SubscriptionWallet);
    this.ready.emit(null);
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
    return this.contractAddress;
  }


  public async getSubscriptionInfo(i: number): Promise<Subscription> {
    return await new Promise<Subscription>((resolve, reject) => {
      this.instance.getSubscrition(i, (e, values) => {
        console.log('the values???');
        if (e) { reject(e); }
        const s: Subscription = new Subscription();
        console.log('vals!', values);
        s.id = i;
        s.customer = values[0];
        s.tokenContract = values[1];
        s.payoutAddress = values[2];
        s.ambrSubscriptionPlanId = values[3].toNumber();
        s.cycleStart = new Date(values[4] * 1000);
        s.subscriptionTimeFrame = values[5].toNumber();
        s.maxAmount = this.web3Service.getWeb3().fromWei(values[6]).toNumber();
        s.withdrawnAmount = this.web3Service.getWeb3().fromWei(values[7]).toNumber();
        s.approved = values[8];
        s.exists = values[9];
        console.log('returning ', s);
        resolve(s);
      });
    });
  }


  public async getSubscriptionLength(): Promise<number> {
    return await new Promise<number>((resolve, reject) => {
      this.instance.getSubscriptionLength((e, res) => {
        if (e) { reject(e); }
        resolve(res.toNumber());
      });
    });
  }

  public async addSubscription( payoutAddress: string,
    ambrSubscriptionPlanId: number,
    tokenContract: string,
    subscriptionTimeFrame: number,
    maxAmount: number)  {

    const acc = await this.web3Service.getAccount();
    const value = this.web3Service.getWeb3().toWei(maxAmount);
    console.log(payoutAddress,
      ambrSubscriptionPlanId,
      tokenContract,
      subscriptionTimeFrame,
      value, 'how we call the contract.');
    return await new Promise<number>((resolve, reject) => {
        this.instance.addSubscription( payoutAddress,
        ambrSubscriptionPlanId,
        tokenContract,
        subscriptionTimeFrame,
        value,
        {gas: 500000},
        (e, res) => {
          if (e) { reject(e); }
          resolve();
        });
    });
  }

  public async activateSubscription(i: number) {
    return await new Promise<number>((resolve, reject) => {
       this.instance.activateSubscription(i, {gas: 500000}, (e, res) => {
        if (e) { reject(e); }
        resolve();
      } );
    });
  }

  public async deactivateSubscription(i: number) {
    return await new Promise<number>((resolve, reject) => {
      console.log(this.instance);
      this.instance.deactivateSubscription(i, {gas: 500000}, (e, res) => {
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
    console.log('the value', value, acc,  this.contractAddress);
    return await new Promise<number>((resolve, reject) => {
      console.log(value);
      this.web3Service.getWeb3().eth.sendTransaction({ from: acc, to: this.contractAddress, value: value }, (e, res) => {
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
