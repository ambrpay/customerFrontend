import { Component, Input, NgZone, HostListener } from '@angular/core';
import { CustomerActivityService } from '../../../services/customerActivites.service';
import { CustomerActivity } from '../../../models/CustomerActivity';
import { SubscriptionService } from '../../../services/subscription.service';
import { SubscriptionSmartContractService } from '../../../services/subscriptionSmartContract.service';
import { Web3Service } from '../../../services/web3.service';



@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html'
})
export class ActivityComponent  {
  public customerActivities: CustomerActivity[] = [];
  public _processing = false;
  public issuers: any;

  constructor(
    private customerActivityService: CustomerActivityService) {
      if (!customerActivityService.isReady()) {
        this.customerActivityService.readyEvent()
        .subscribe(() => {
          console.log('gotten ready for  activites');
          this.customerActivities = this.customerActivityService.getActivities();
          console.log('have activitites', this.customerActivities);
        });
      } else {
        this.customerActivities = this.customerActivityService.getActivities();
      }
    }


  public getText(activity: CustomerActivity) {
    try {
      const obj = JSON.parse(activity.entry);
      switch (obj.type) {
        case 'TOPUP': {
            return `You toped up your account with ${obj.amount} ${obj.currency}`;
        } case 'WITHDRAW': {
          return `You withdrew from your account ${obj.amount} ${obj.currency}`;
        } case 'ALLOWANCE': {
          return `You set the subscription wallets allowance to ${obj.amount} ${obj.currency} for future payments`;
        }  case 'PAYED': {
          return `You payed ${obj.amount} ${obj.currency} to ${obj.businessname} for ${obj.subscriptionname}`;
        } case 'REFUNDED': {
          return `You got refunded ${obj.amount} ${obj.currency} from ${obj.businessname} for ${obj.subscriptionname}`;
        } default: {
          return activity.entry;
        }
      }
    } catch (e) {
      console.log(e);
      return activity.entry;
    }
  }

  public getSymbol(activity: CustomerActivity) {
    try {
      const obj = JSON.parse(activity.entry);
      switch (obj.type) {
        case 'TOPUP': {
            return `pe-7s-upload`;
        } case 'WITHDRAW': {
          return `pe-7s-download`;
        } case 'ALLOWANCE': {
          return `pe-7s-upload`;
        }  case 'PAYED': {
          return `pe-7s-right-arrow`;
        } case 'REFUNDED': {
          return `pe-7s-left-arrow`;
        } default: {
          return '';
        }
      }
    } catch (e) {
      console.log(e);
      return activity.entry;
    }
  }
}
