import { Component } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';



@Component({
  templateUrl: './metamaskpassword.component.html'
})

export class MetamaskPasswordComponent  {

  public redirectURL;
  public intervall: Observable<number>;

  constructor(private activatedRoute: ActivatedRoute,
              private web3Service: Web3Service) {
    this.redirectURL = decodeURIComponent(this.activatedRoute.snapshot.queryParams['redirecturl']);
    console.log(this.redirectURL);
    this.intervall = IntervalObservable.create(300);
    const subscription = this.intervall
    .subscribe(() => {
      console.log('are we unlocked?');
      if (web3Service.isUnlocked()) {
        web3Service.connect();
        console.log('we are now unlocked');
        window.location.href = this.redirectURL;
        subscription.unsubscribe();
      }
    });
  }

}
