import { Business } from './Business';
import { Subscription } from './Subscription';

export class SubscriptionPlan {
    public id: number;
    public title: string;
    public description: string;
    public deleted: boolean;
    public price: number;
    public currency: string;
    public interval: number;
    public businessid: number;
    public business: Business;
}
