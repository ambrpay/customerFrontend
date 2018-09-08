import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Web3Service } from './services/web3.service';
import { SubscriptionSmartContractService } from './services/subscriptionSmartContract.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  hostloaded = false;
  rdir;
  constructor(
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private _web3: Web3Service,
    private _subscriptionSmartContractService: SubscriptionSmartContractService,
    private deviceService: DeviceDetectorService,
    private configService: ConfigService,
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
  hostLoaded() {
    this.hostloaded = true;
  }

  getLoaded(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('waiting for funds to arrive');
        if (this.hostloaded) {
          resolve(true);
        }
       }, 300);
    });
  }
  // @HostListener('window:popstate', ['$event'])
  async windowLoaded() {
    this.rdir  = decodeURIComponent(this.activatedRoute.snapshot.queryParams['rdir']);
    console.log('this is rdir', this.rdir);
    await this.getLoaded();
    await this.configService.load();
    if (!this.correctBrowser()) {
      if (window.location.href.indexOf('wrongbrowser') === -1) {
        window.location.href = '#/wrongbrowser';
      }
      return;
    }

    if (!window['web3js']) {
      console.log(window.location.href);
      if (window.location.href.indexOf('metamaskmissing') === -1) {
        window.location.href = '#/metamaskmissing/' + this.getbrowser() + '?rdir=' + encodeURIComponent(window.location.href);
      }
      return;
    }
    if (this.rdir !== 'undefined') {
      console.log('found rdir!!!!!!', this.rdir);
      window.location.href = this.rdir;
      return;
    }

    this._web3.connect();
    if (!this._web3.isUnlocked()) {
      console.log('is locked', window.location.href );
      if (window.location.href.indexOf('metamaskpassword') === -1) {
          window.location.href = '#/metamaskpassword?redirecturl=' + encodeURIComponent(window.location.href);
      }

      return;
    }
    this._subscriptionSmartContractService.fetchSubscriptionManager();
  }

   correctBrowser() {

    switch (this.getbrowser()) {
      case 'chrome':
      case 'firefox':
      case 'opera':
        return true;
      default:
        return false;
    }
  }

  getbrowser() {
    return this.deviceService.getDeviceInfo().browser;
  }
}
