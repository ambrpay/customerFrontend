import { Injectable, EventEmitter } from '@angular/core';
import { COMPILER_OPTIONS } from '@angular/core/src/linker/compiler';
import { ConfigService } from './config.service';




@Injectable()
export class Web3Service {
  web3: any;
  primaryAccount: any;

  constructor( private configService: ConfigService) {}

  private ready: EventEmitter<any> = new EventEmitter();

  private rdy: boolean;
  public isReady() {
    return this.rdy;
  }


  public readyEvent():  EventEmitter<any> {
    return this.ready;
  }

  isUnlocked() {
    return this.web3.eth.accounts.length > 0;
  }

  connect() {
      console.log('do we have web3js?', window['web3js']);
      this.web3 = window['web3js'];
      this.getAccount().then(acc => {
        console.log('account!', acc);
        this.primaryAccount = acc;
        this.ready.emit();
        this.rdy = true;
        console.log('web3 is ready');
      });
  }

  getWeb3() {
    return this.web3;
  }

  getPrimaryAccount(): string {
    return this.primaryAccount;
  }

  getAccount() {

    return new Promise((resolve, reject) => {

      this.web3.eth.getAccounts(( e, o) => {
        console.log('do we have an error getting accounts?', e);
        return resolve(o[0]);
       });
    });
  }

  async fetchContractInstance(contractAddress: any, ctr: any) {

    const ctrct = this.web3.eth.contract(ctr.abi);
    const sampleContractInstance = ctrct.at(contractAddress);

    return sampleContractInstance;
  }

  contractcall(f: any) {
    return new Promise((resolve, reject) => {
       f.call(res => {resolve(res); });
    });
  }

  createContractInstance(subContract, acc) {

    return new Promise((resolve, reject) => {

      const c = this.web3.eth.contract(subContract.abi);
      c.new({
        from: acc ,
        data: subContract.bytecode,
        gasLimit: '0x21000',
        gas: '0x470000'
      },
      function (e, i) {
        console.log('e and i ', e, i);
        if (!e) {
          console.log(i);
          console.log(e);
          if (typeof i.address !== 'undefined') {
            console.log('Contract mined! address: ' + i.address + ' transactionHash: ' + i.transactionHash);
            return resolve(i);
          } else {
            console.log('undef why?');
            console.log('we wait a few!');
          }
        }
      });
    });
  }

  getAccountBalance() {
    return new Promise((resolve, reject) => {
      this.getAccount()
      .then((account) => {
        if (!account) { return resolve(null); }
        this.web3.eth.getBalance(account, ( e, o) => {
          const value = this.web3.fromWei(o);
          return resolve(value);
         });
      });
    });
  }

  pay (contractAddress: any, amount: any) {
    return new Promise((resolve, reject) => {
      this.getAccount()
      .then((account) => {
        if (!account) { return resolve(null); }
        const value = this.web3.toWei(amount);
        this.web3.eth.sendTransaction({ from: account, to: contractAddress, value: value },
          (e, o) => {
            return resolve(o);
          });
      });
    });
  }

  isRobsten(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err, netId) => {
        console.log('network id', netId);
        if (netId - 3  === 0) {
          resolve(true);
        } else {
           resolve(false);
        }
      });
    });
  }


}
