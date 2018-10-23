import { Injectable, EventEmitter  } from '@angular/core';
import * as SubscriptionWallet from '../../../../subSmart/build/contracts/Ambr.json';
import { Web3Service } from './web3.service';
import { ConfigService } from './config.service';
import { async } from '@angular/core/testing';


@Injectable()
export class SubscriptionSmartContractService {


  constructor(
    private web3Service: Web3Service
  ) {}


  public async addSubscription(smartContractAddr: string,
    payoutAddress: string,
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
      return await new Promise<number>(async(resolve, reject) => {
        const instance = await this.web3Service.fetchContractInstance(smartContractAddr, SubscriptionWallet);
        instance.addSubscription( payoutAddress,
        subscriptionTimeFrame,
        maxAmount,
        {value: topupAmount , gas: 500000, from: acc },
        (e, res) => {
          if (e) { reject(e); }
          resolve(res);
        });
    });
  }

  public async activateSubscription(smartContractAddr: string,i: number) {
    return await new Promise<number>(async (resolve, reject) => {
      const acc = this.web3Service.getPrimaryAccount();
      console.log('deactivate with', acc, i);
      const instance = await this.web3Service.fetchContractInstance(smartContractAddr, SubscriptionWallet);
      instance.activateSubscription(i, {gas: 500000, from: acc}, (e, res) => {
        if (e) { reject(e); }
        resolve();
      } );
    });
  }

  public async deactivateSubscription(smartContractAddr: string, i: number) {
    return await new Promise<number>(async (resolve, reject) => {
      const acc = this.web3Service.getPrimaryAccount();
      console.log('deactivate with', acc, i);
      const instance = await this.web3Service.fetchContractInstance(smartContractAddr, SubscriptionWallet);
      instance.deactivateSubscription(i, {gas: 500000, from: acc}, (e, res) => {
        if (e) { reject(e); }
       resolve();
     } );
   });
  }


  public async withdrawFunds(smartContractAddr: string, amount: any) {
    const value = this.web3Service.getWeb3().toWei(amount);
    console.log('withdrawing', value);
    return await new Promise<number>(async (resolve, reject) => {
      const instance = await this.web3Service.fetchContractInstance(smartContractAddr, SubscriptionWallet);
      instance.withdrawETHFunds(value, {gas: 500000}, (e, res) => {
        if (e) { reject(e); }
        resolve();
      });
    });
  }

  public async getETHBalance(smartContractAddr: string) {
    const acc =  await this.web3Service.getAccount();
    return await new Promise<number>(async (resolve, reject) => {
      const instance = await this.web3Service.fetchContractInstance(smartContractAddr, SubscriptionWallet);
      instance.getETHBalance(acc, (e, res) => {
        if (e) { reject(e); }
        resolve(this.web3Service.getWeb3().fromWei(res).toNumber());
      });
    });
  }

  public async getLocalETHBalance() {
    const acc =  await this.web3Service.getAccount();
    return await new Promise<number>(async (resolve, reject) => {
      this.web3Service.getWeb3().eth.getBalance(acc, (e, res) => {
        console.log(res, acc);
        if (e) { reject(e); }
        resolve(this.web3Service.getWeb3().fromWei(res).toNumber());
      });
    });
  }

  public async payETH(smartContractAddr: string, amount: number) {
    const acc =  await this.web3Service.getAccount();
    const value = this.web3Service.getWeb3().toWei(amount);
    console.log('the value', value, acc,  smartContractAddr);
    return await new Promise<number>(async (resolve, reject) => {
      console.log(value);
      this.web3Service.getWeb3().eth.sendTransaction({ from: acc, to: smartContractAddr, value: value }, (e, res) => {
        console.log(e, res);
        if (e) { reject(e); }
        resolve();
      });
    });
  }

}
