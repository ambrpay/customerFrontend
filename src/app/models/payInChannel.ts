
import { Business } from './Business';


export class PayInChannel  {
    public id: number;
    public currency: string;
    public deleted: boolean;
    public businessid: number;
    public business: Business;
    public data: any;
}
