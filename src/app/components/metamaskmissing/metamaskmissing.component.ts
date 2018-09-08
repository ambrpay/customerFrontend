import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';



@Component({
  templateUrl: './metamaskmissing.component.html'
})

export class MetamaskMissingComponent  {

  public browserMap = {
    firefox: {
      url: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
      text: 'Get metamask from Firefox app store'
    },
    chrome: {
      url: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      text: 'Get metamask from Chrome app store'
    },
    opera: {
      url: 'https://addons.opera.com/en/extensions/details/metamask/',
      text: 'Get metamask from Opera app store'
    },
  };

  public active;
  public redirectURL;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params: Params) => {
      const browser = params['browser'];
      this.active = this.browserMap[browser];
      console.log(browser);
      this.redirectURL = decodeURIComponent(this.activatedRoute.snapshot.queryParams['rDir']);
      console.log(this.redirectURL);
      if (window['web3js']) {
        window.location.href = this.redirectURL;
      }
      // setTimeout(() => {
      //
      // }, 10000);
    });
  }


}
