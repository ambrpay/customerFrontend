import { SubscriptionPlan } from './SubscriptionPlan';
import { TokenContract } from './TokenContract';

export class Subscription {
    public id: number;
    public smartcontractId: number;
    public customer: string;
    public tokenContract: string;
    public payoutAddress: string;
    public subscriptionPlanid: number;
    public cycleStart: Date;
    public subscriptionTimeFrame: number;
    public maxAmount: number;
    public withdrawnAmount: number;
    public approved: boolean;
    public exists: boolean;
    public subscriptionPlan: SubscriptionPlan;
    public tkn: TokenContract;
    public isNew: boolean;
}
