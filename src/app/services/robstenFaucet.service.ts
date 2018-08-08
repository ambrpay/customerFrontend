
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Web3Service } from './web3.service';



@Injectable()
export class RobstenFaucetService {

  constructor(private http: HttpClient,
              private web3service: Web3Service,
             ) {}


  tap(): Observable<any> {
    const data =  { toWhom: this.web3service.getPrimaryAccount()};
    const url = `https://ropsten.faucet.b9lab.com/tap`;
    console.log('calling', url , data);
    return this.http.post<any>(url, data);
  }

}
