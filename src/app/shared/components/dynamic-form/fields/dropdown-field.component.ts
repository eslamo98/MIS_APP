import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { DropdownField } from '../../../models/form.model';

@Component({
    selector: 'app-dropdown-field',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="form()" class="form-group-container" [class.is-valid]="isValid" [class.is-invalid]="isInvalid">
      <label [for]="field().key" class="form-label fw-bold d-flex justify-content-between">
        {{ field().label }}
        @if (field().required) {
          <span class="text-danger small">*</span>
        }
      </label>

      <div class="input-wrapper position-relative">
        <select [id]="field().key" [formControlName]="field().key" class="form-select glass-input">
          <option value="">{{ field().placeholder || 'Select option' }}</option>
          @for (opt of asDropdown.options; track opt.key) {
            <option [value]="opt.key">{{ opt.value }}</option>
          }
        </select>

        <div class="validation-icons position-absolute end-0 top-50 translate-middle-y pe-3">
          @if (isValid) {
            <i class="fas fa-check-circle text-success animate-pop"></i>
          }
          @if (isInvalid) {
            <i class="fas fa-exclamation-circle text-danger animate-pop"></i>
          }
        </div>
      </div>
    </div>
  `,
    styleUrls: ['../dynamic-form.component.css']
})
export class DropdownFieldComponent extends BaseFieldComponent {
    get asDropdown() {
        return this.field() as DropdownField;
    }
}
