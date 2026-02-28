import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseFormField } from '../../../models/form.model';
import { CommonModule } from '@angular/common';

@Component({
    template: '',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export abstract class BaseFieldComponent {
    field = input.required<BaseFormField<any>>();
    form = input.required<FormGroup>();
    showValidation = input<boolean>(true);

    get control() {
        return this.form().get(this.field().key);
    }

    get isValid() {
        if (!this.showValidation()) return false;
        return this.control && this.control.valid && (this.control.dirty || this.control.touched);
    }

    get isInvalid() {
        if (!this.showValidation()) return false;
        return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
    }
}
