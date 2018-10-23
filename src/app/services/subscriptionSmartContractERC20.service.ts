import { Injectable, EventEmitter  } from '@angular/core';
import * as SubscriptionWallet from '../../../../subSmart/build/contracts/SubscriptionManagementERC20.json';
import * as erc20Interface from '../../../../subSmart/build/contracts/ERC20.json';
import { Web3Service } from './web3.service';


@Injectable()
export class SubscriptionSmartContractERC20Service {

  constructor(
    private web3Service: Web3Service
  ) {}


  public async addSubscription(smartContractAddr: string,
    tokenAddress: string,
    payoutAddress: string,
    subscriptionTimeFrame: number,
    maxAmount: number,
    allowance: number)  {

    const acc = await this.web3Service.getPrimaryAccount();
    maxAmount = this.web3Service.getWeb3().toWei(maxAmount);

    console.log(tokenAddress,
      payoutAddress,
      subscriptionTimeFrame,
      maxAmount, 'how we call the contract.');

    await new Promise<number>(async (resolve, reject) => {
        const instance = await this.web3Service.fetchContractInstance(tokenAddress, erc20Interface);
        instance.approve(smartContractAddr,  allowance, { gas: 500000, from: acc },
        (e, res) => {
            if (e) { reject(e); }
            resolve(res);
        });
    });

    return await new Promise<number>(async (resolve, reject) => {
        const instance = await this.web3Service.fetchContractInstance(smartContractAddr, SubscriptionWallet);
        instance.addSubscription(tokenAddress, payoutAddress, subscriptionTimeFrame, maxAmount, { gas: 500000, from: acc },
        (e, res) => {
            if (e) { reject(e); }
            resolve(res);
        });
    });
  }

  public async activateSubscription(smartContractAddr: string, i: number) {
    return await new Promise<number>(async(resolve, reject) => {
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
      const instance = await this.web3Service.fetchContractInstance(smartContractAddr, SubscriptionWallet);
      instance.deactivateSubscription(i, {gas: 500000, from: acc}, (e, res) => {
        if (e) { reject(e); }
       resolve();
     } );
   });
  }

  public async getTotalTokens( contractAddress: string): Promise<number> {
    return await new Promise<number>(async (resolve, reject) => {
      const instance = await this.web3Service.fetchContractInstance(contractAddress, erc20Interface);
      const acc = this.web3Service.getPrimaryAccount();
      instance.balanceOf(acc, (e, res) => {
        if (e) { reject(e); }
        resolve(this.web3Service.getWeb3().fromWei(res).toNumber());
      });
    });
  }

  public async getAllowance(smartContractAddr: string, contractAddress: string): Promise<number> {
    return await new Promise<number>(async (resolve, reject) => {
      const acc = this.web3Service.getPrimaryAccount();
      const instance = await this.web3Service.fetchContractInstance(contractAddress, erc20Interface);
      instance.allowance(acc, smartContractAddr, (e, res) => {
        if (e) { reject(e); }
        resolve(this.web3Service.getWeb3().fromWei(res).toNumber());
      });
    });
  }

}
