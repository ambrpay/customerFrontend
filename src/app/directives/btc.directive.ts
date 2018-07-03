import {
  ReactiveFormsModule,
  NG_VALIDATORS,
  FormsModule,
  FormGroup,
  FormControl,
  ValidatorFn,
  Validator
 } from '@angular/forms';

import { Directive } from '@angular/core';
declare var require: any;
const cryptaddress = require('cryptaddress-validator');

@Directive({
  selector: '[app-btcvalidator][ngModel]',
  providers: [
   {
    provide: NG_VALIDATORS,
    useExisting: BTCValidator,
    multi: true
   }
  ]
 })
 export class BTCValidator implements Validator {
  validator: ValidatorFn;
  constructor() {
     this.validator = this.btcValidator();
    }
  validate(c: FormControl) {
     return this.validator(c);
    }
  btcValidator(): ValidatorFn {
     return (c: FormControl) => {
      if (cryptaddress('btc').test(c.value)) {
        return null;
      } else {
        return {
          btcvalidator: {
            valid: false
          }
        };
      }
   };
  }
}
