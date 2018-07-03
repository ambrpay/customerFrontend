import { FormControl } from '@angular/forms';

export interface ValidationResult {
    [key: string]: boolean;
}

export class PasswordValidator {

    public static strong(control: FormControl): ValidationResult {
        const hasNumber = /\d/.test(control.value);
        const hasUpper = /[A-Z]/.test(control.value);
        const hasLower = /[a-z]/.test(control.value);
        const hasnumber = /[0-9]/.test(control.value);
        const specialchar = /[^A-Za-z0-9]/.test(control.value);
        const valid = hasNumber && hasUpper && hasLower && hasnumber && specialchar;
        if (!valid) {
            return { strong: true };
        }
        return null;
    }
}
