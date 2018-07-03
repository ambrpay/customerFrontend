import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/wallet/layout.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
  {
    path: 'add',
    component: SubscribeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
