import { Component,  Input } from '@angular/core';



@Component({
  selector: 'app-howtoerc20',
  templateUrl: './howtoERC20.component.html'
})
export class HowtoERC20Component  {
  public subPlan: any;

  @Input()
  set subscriptionPlan(subscriptionPlan: any) {
    this.subPlan = subscriptionPlan;
  }

}
