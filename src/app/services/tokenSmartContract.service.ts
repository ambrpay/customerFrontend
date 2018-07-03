import { Injectable, HostListener, EventEmitter  } from '@angular/core';

import * as ERC20 from '../../../../subSmart/build/contracts/ERC20.json';
import * as Ambr from '../../../../subSmart/build/contracts/Ambr.json';
import { Web3Service } from './web3.service';
import { TokenContractService } from './tokenContract.service';
import { TokenContract } from '../models/TokenContract';
import { SubscriptionSmartContractService } from './subscriptionSmartContract.service';



@Injectable()
export class TokenSmartContractService {

  private instance: any;

  private tokens: TokenContract[];

  private userAddress  = '0x47D61767f6893b435AB48Da7acA93A22A912B3fF';
  private ready: EventEmitter<any> = new EventEmitter();

  constructor(
    private web3Service: Web3Service,
    private tokenContractService: TokenContractService,
    private subscriptionContractService: SubscriptionSmartContractService ) {}


  fetchContracts() {
    this.tokenContractService.getTokenContracts()
    .subscribe((tkns: TokenContract[]) => {
      this.tokens = tkns;
      this.loadTokens();
      this.ready.emit(null);
    });
  }

  loadTokens() {
    this.tokens.forEach(async (tkn) => {

      try {
        const instance  = await this.web3Service.fetchContractInstance(tkn.address, ERC20);
        tkn.balance = await this.balanceOf(instance, this.userAddress);
        tkn.balanceWallet = await this.subscriptionContractService.getTokenBalance(tkn.address);
      } catch (err) {
        console.log(err);
      }

    });
    console.log('loaded tokens', this.tokens);
  }

  public async balanceOf(instance: any, userAddress: string): Promise<number> {
    return await new Promise<number>((resolve, reject) => {
      console.log(instance.address);
      instance.balanceOf(userAddress, (e, o) => {
        if (e) { reject(e); }
        resolve(this.web3Service.getWeb3().fromWei(o).toNumber());
      });
    });
  }


  public getAllTokens(): TokenContract [] {
    return this.tokens;
  }

  public async setAllowance(contractAddress: any, amount: number ) {
    const to  = this.subscriptionContractService.getContractAddress();
    const value = this.web3Service.getWeb3().toWei(amount);
    const instance = await this.web3Service.fetchContractInstance(contractAddress, ERC20);
    return await new Promise<number>((resolve, reject) => {
      console.log(instance.address);
      instance.approve(to, value, {from: this.userAddress}, (e, o) => {
        console.log( e, o);
        if (e) { reject(e); }
        resolve();
      });
    });
  }

  public readyEvent() {
    return this.ready;
  }

}
