
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import { TokenContract } from '../models/TokenContract';


@Injectable()
export class TokenContractService {

  constructor(private http: HttpClient) {}

  getTokenContracts(): Observable<TokenContract[]> {
    const url = `http://localhost:3000/api/tokencontracts`;
    return this.http.get<TokenContract[]>(url);
  }

}
