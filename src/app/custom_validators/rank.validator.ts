import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

export class ParentErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const controlTouched = !!(control && (control.dirty || control.touched));
        const controlInvalid = !!(control && control.invalid);
        const parentInvalid = !!(control && control.parent && control.parent.invalid && (control.parent.dirty || control.parent.touched));

        return (controlTouched && (controlInvalid || parentInvalid));
    }
}

export class RankValidator {
    private static Ranks: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    static validateRank(control: FormControl) {
        let rank = control.value;
        return !rank || RankValidator.Ranks.includes(rank) ? null : {
            validateRank: {
                error: false
            }
        };
    }
    static validateMinMax(formGroup: FormGroup) {
        const min = formGroup.get('minRank');
        const max = formGroup.get('maxRank');
        if (!min || !max || min.invalid || max.invalid) {
            return null;
        }
        if (RankValidator.Ranks.indexOf(min.value) <= RankValidator.Ranks.indexOf(max.value)) {
            return null;
        }
        return {
            validateMinMax: {
                error: false
            }
        };
    }
} 