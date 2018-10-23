import { Component,  Input } from '@angular/core';



@Component({
  selector: 'app-howtoeth',
  templateUrl: './howtoETH.component.html'
})
export class HowtoETHComponent  {
  public subPlan: any;

  @Input()
  set subscriptionPlan(subscriptionPlan: any) {
    this.subPlan = subscriptionPlan;
  }

}
