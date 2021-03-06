import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ERC20Validator } from './directives/erc20.directive';
import { BTCValidator } from './directives/btc.directive';
import { ClipboardModule } from 'ngx-clipboard';


import { AlertComponent } from './components/common/alert/alert.component';
import { AlertService } from './services/alert.service';
import { HeaderComponent } from './components/common/header/header.component';
import { CustomFormsModule } from 'ng4-validators';
import { SubscriptionSmartContractService } from './services/subscriptionSmartContract.service';

import { Web3Service } from './services/web3.service';
import { LayoutComponent } from './components/wallet/layout.component';
import { WalletComponent } from './components/wallet/wallet/wallet.component';
import { SubListComponent } from './components/wallet/sub-list/sub-list.component';
import { SubscriptionPlanService } from './services/subscriptionPlan.service';
import { SubscriptionService } from './services/subscription.service';
import { SubCardComponent } from './components/wallet/sub-list/sub-card/sub-card.component';
import { SubscribeETHComponent } from './components/subscribe/subscribeETH.component';
import { ActivityComponent } from './components/wallet/activity/activity.component';
import { CustomerService } from './services/customer.service';
import { MetamaskMissingComponent } from './components/metamaskmissing/metamaskmissing.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { WrongBrowserComponent } from './components/wrongbrowser/wrongbrowser.component';
import { MetamaskPasswordComponent } from './components/metamaskpassword/metamaskpassword.component';
import { RateService } from './services/rate.service';
import { ConfigService } from './services/config.service';
import { RobstenFaucetService } from './services/robstenFaucet.service';

import { SubscribeERC20Component } from './components/subscribe/subscribeERC20.component';
import { SubscriptionSmartContractERC20Service } from './services/subscriptionSmartContractERC20.service';
import { HowtoERC20Component } from './components/howtoERC20/howtoERC20.component';
import { HowtoETHComponent } from './components/howtoETH/howtoETH.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HeaderComponent,
    LayoutComponent,
    WalletComponent,
    SubListComponent,
    ActivityComponent,
    SubCardComponent,
    SubscribeETHComponent,
    SubscribeERC20Component,
    MetamaskMissingComponent,
    WrongBrowserComponent,
    MetamaskPasswordComponent,
    HowtoERC20Component,
    HowtoETHComponent,
    ERC20Validator,
    BTCValidator,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    CustomFormsModule,
    ClipboardModule,
    ReactiveFormsModule,
    DeviceDetectorModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory ,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    SubscriptionSmartContractService,
    SubscriptionSmartContractERC20Service,
    Web3Service,
    SubscriptionPlanService,
    CustomerService,
    SubscriptionService,
    RobstenFaucetService,
    ConfigService,
    RateService,
    AlertService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
