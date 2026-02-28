import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseFormField, CheckboxField } from '../models/form.model';

@Injectable({
    providedIn: 'root'
})
export class FormHelperService {
    constructor() { }

    toFormGroup(fields: BaseFormField<string>[]) {
        const group: any = {};

        fields.forEach(field => {
            // For checkboxes (boolean), use false as default, not empty string
            const defaultValue = field instanceof CheckboxField
                ? (field.value ?? false)
                : (field.value ?? '');

            group[field.key] = new FormControl(
                defaultValue,
                {
                    validators: field.validators,
                    asyncValidators: field.asyncValidators
                }
            );
        });
        return new FormGroup(group);
    }
}
