import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './services/alert.service';
import { Web3Service } from './services/web3.service';
import { SubscriptionSmartContractService } from './services/subscriptionSmartContract.service';
import { TokenSmartContractService } from './services/tokenSmartContract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private _web3: Web3Service,
    private _subscriptionSmartContractService: SubscriptionSmartContractService,
    private _tokenSmartContractService: TokenSmartContractService,
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let lang = params['lang'];
      if (!lang) {
        lang = this.translate.getBrowserLang();
      }
      const defLang = lang.match(/en|fr/) ? lang : 'en';
      this.translate.use(defLang);
    });
  }


  @HostListener('window:load')
  windowLoaded() {
    this._web3.connect();
    this._subscriptionSmartContractService.fetchSubscriptionManager();
    this._tokenSmartContractService.fetchContracts();
  }

}
