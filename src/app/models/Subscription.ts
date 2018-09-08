import { SubscriptionPlan } from './SubscriptionPlan';
import { TokenContract } from './TokenContract';
import { Customer } from './Customer';

export class Subscription {
    public id: number;
    public hash: string;
    public smartcontractId: number;
    public tokenContract: string;
    public payoutAddress: string;
    public subscriptionPlanid: number;
    public cycleStart: Date;
    public subscriptionTimeFrame: number;
    public maxAmount: number;
    public withdrawnAmount: number;
    public approved: boolean;
    public exists: boolean;
    public subscriptionPlan: any;
    public tkn: TokenContract;
    public isNew: boolean;
    public customer: Customer;
}
