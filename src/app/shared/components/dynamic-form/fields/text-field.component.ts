import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { TextBoxField } from '../../../models/form.model';

@Component({
    selector: 'app-text-field',
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
        <input [type]="asTextBox.type"
               [id]="field().key"
               [formControlName]="field().key"
               [placeholder]="field().placeholder"
               [readOnly]="field().readonly"
               class="form-control glass-input">

        <div class="validation-icons position-absolute end-0 top-50 translate-middle-y pe-3">
          @if (isValid) {
            <i class="fas fa-check-circle text-success animate-pop"></i>
          }
          @if (isInvalid) {
            <i class="fas fa-exclamation-circle text-danger animate-pop"></i>
          }
        </div>
      </div>

      @if (isInvalid) {
        <div class="error-container mt-1 ms-1">
          <small class="text-danger animate-fade-in">
            <i class="fas fa-info-circle me-1"></i>
            @if (control?.errors?.['nameExists']) {
              <span>This name is already taken.</span>
            } @else {
              <span>{{ field().label }} is invalid or required.</span>
            }
          </small>
        </div>
      }
    </div>
  `,
    styleUrls: ['../dynamic-form.component.css']
})
export class TextFieldComponent extends BaseFieldComponent {
    get asTextBox(): TextBoxField {
        return this.field() as TextBoxField;
    }
}
