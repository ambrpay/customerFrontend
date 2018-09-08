import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';



@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent  {

  public customer: any;
  constructor(private customerService: CustomerService) {
    if (customerService.isReady()) {
      this.load();
    } else {
      customerService.readyEvent().subscribe(() => {
        this.load();
      });
    }
  }

  load() {
    this.customer = this.customerService.customer;
    console.log(this.customer);
  }


}
