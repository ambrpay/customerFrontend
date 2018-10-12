import { Component,  Input } from '@angular/core';



@Component({
  selector: 'app-howto',
  templateUrl: './howto.component.html'
})
export class HowtoComponent  {
  public subPlan: any;

  @Input()
  set subscriptionPlan(subscriptionPlan: any) {
    this.subPlan = subscriptionPlan;
  }

}
