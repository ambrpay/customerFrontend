import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/wallet/layout.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { MetamaskMissingComponent } from './components/metamaskmissing/metamaskmissing.component';
import { WrongBrowserComponent } from './components/wrongbrowser/wrongbrowser.component';
import { MetamaskPasswordComponent } from './components/metamaskpassword/metamaskpassword.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
  {
    path: 'add',
    component: SubscribeComponent
  },
  {
    path: 'metamaskmissing/:browser',
    component: MetamaskMissingComponent
  },
  {
    path: 'wrongbrowser',
    component: WrongBrowserComponent
  },
  {
    path: 'metamaskpassword',
    component: MetamaskPasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
