import { Component, Input } from '@angular/core';
import { Subscription } from '../../../models/Subscription';



@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html'
})
export class SubListComponent  {

  public subscriptions: Subscription[];
  public _processing = false;
  public pending = false;
  public all: number[];

  @Input()
  set subs(subs: Subscription[]) {
    this.subscriptions = subs;
  }

}
