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
const ethereumAddress = require('ethereum-address');

@Directive({
  selector: '[app-erc20validator][ngModel]',
  providers: [
   {
    provide: NG_VALIDATORS,
    useExisting: ERC20Validator,
    multi: true
   }
  ]
 })
 export class ERC20Validator implements Validator {
  validator: ValidatorFn;
  constructor() {
     this.validator = this.erc20Validator();
    }
  validate(c: FormControl) {
     return this.validator(c);
    }
  erc20Validator(): ValidatorFn {
     return (c: FormControl) => {
      if (ethereumAddress.isAddress(c.value)) {
        return null;
      } else {
        return {
          erc20validator: {
            valid: false
          }
        };
      }
   };
  }
}
