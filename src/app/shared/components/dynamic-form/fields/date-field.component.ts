import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
    selector: 'app-date-field',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="form()" class="form-group-container" [class.is-valid]="isValid" [class.is-invalid]="isInvalid">
      <label [for]="field().key" class="form-label fw-bold">
        {{ field().label }}
        @if (field().required) {
          <span class="text-danger small">*</span>
        }
      </label>

      <div class="input-wrapper position-relative">
        <input type="date" [id]="field().key" [formControlName]="field().key" class="form-control glass-input">

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
export class DateFieldComponent extends BaseFieldComponent { }
