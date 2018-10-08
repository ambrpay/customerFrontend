
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from './config.service';



@Injectable()
export class RateService {

  constructor(private http: HttpClient,
              private configService: ConfigService) {}


  get(from: string, to: string): Observable<number> {
    const url =  this.configService.getConfig('server') + `/api/rate/${from}/${to}`;
    console.log('calling', url);
    return this.http.get<number>(url);
  }

}
