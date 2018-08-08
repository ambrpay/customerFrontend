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
import { TokenSmartContractService } from './services/tokenSmartContract.service';
import { Web3Service } from './services/web3.service';
import { TokenContractService } from './services/tokenContract.service';
import { LayoutComponent } from './components/wallet/layout.component';
import { WalletComponent } from './components/wallet/wallet/wallet.component';
import { SubListComponent } from './components/wallet/sub-list/sub-list.component';
import { SubscriptionPlanService } from './services/subscriptionPlan.service';
import { SubscriptionService } from './services/subscription.service';
import { SubCardComponent } from './components/wallet/sub-list/sub-card/sub-card.component';
import { PayInChannelService } from './services/payinchannel.service';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { ActivityComponent } from './components/wallet/activity/activity.component';
import { CustomerActivityService } from './services/customerActivites.service';
import { CustomerService } from './services/customer.service';
import { MetamaskMissingComponent } from './components/metamaskmissing/metamaskmissing.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { WrongBrowserComponent } from './components/wrongbrowser/wrongbrowser.component';
import { MetamaskPasswordComponent } from './components/metamaskpassword/metamaskpassword.component';
import { RateService } from './services/rate.service';
import { ConfigService } from './services/config.service';
import { RobstenFaucetService } from './services/robstenFaucet.service';

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
    SubscribeComponent,
    MetamaskMissingComponent,
    WrongBrowserComponent,
    MetamaskPasswordComponent,
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
    TokenSmartContractService,
    Web3Service,
    TokenContractService,
    SubscriptionPlanService,
    CustomerService,
    SubscriptionService,
    PayInChannelService,
    RobstenFaucetService,
    ConfigService,
    CustomerActivityService,
    RateService,
    AlertService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
