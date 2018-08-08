
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenContract } from '../models/TokenContract';
import { ConfigService } from './config.service';


@Injectable()
export class TokenContractService {

  constructor(private http: HttpClient,
              private configService: ConfigService) {}

  getTokenContracts(): Observable<TokenContract[]> {
    const url = this.configService.getConfig('server') + `/api/tokencontracts`;
    return this.http.get<TokenContract[]>(url);
  }

}
