import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { TextareaField } from '../../../models/form.model';

@Component({
    selector: 'app-textarea-field',
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
        <textarea [id]="field().key"
                  [formControlName]="field().key"
                  [placeholder]="field().placeholder"
                  [rows]="asTextarea.rows"
                  class="form-control glass-input"></textarea>

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
export class TextareaFieldComponent extends BaseFieldComponent {
    get asTextarea() {
        return this.field() as TextareaField;
    }
}
