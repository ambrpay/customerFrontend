import { CustomerActivity } from './CustomerActivity';
import { Subscription } from './Subscription';

export class Customer {
  public id: number;
  public externalInfo: string;
  public email: string[] = [''];
  public wallet: String;
  public subscriptions: Subscription[] = [];
  public activities: CustomerActivity[] = [];
}
