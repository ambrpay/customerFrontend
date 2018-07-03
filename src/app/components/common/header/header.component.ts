import { Component,  } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  templateUrl: 'header.component.html',
  selector: 'app-header'
})
export class HeaderComponent {

  constructor(
    private router: Router,
    ) {}


}
