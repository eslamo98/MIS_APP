import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
    selector: 'app-checkbox-field',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="form()" class="form-group-container d-flex align-items-center gap-3 py-2">
      <div class="toggle-switch-wrapper">
        <label class="toggle-switch" [for]="field().key">
          <input
            type="checkbox"
            [id]="field().key"
            [formControlName]="field().key"
            class="toggle-input"
          >
          <span class="toggle-slider"></span>
        </label>
      </div>
      <label [for]="field().key" class="form-label fw-bold mb-0 cursor-pointer d-flex align-items-center gap-2">
        {{ field().label }}
        @if (field().required) {
          <span class="text-danger small">*</span>
        }
        @if (control?.value) {
          <span class="badge bg-success-subtle text-success rounded-pill small">Enabled</span>
        } @else {
          <span class="badge bg-secondary-subtle text-secondary rounded-pill small">Disabled</span>
        }
      </label>
    </div>
  `,
    styles: [`
    .toggle-switch-wrapper { flex-shrink: 0; }
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 26px;
      cursor: pointer;
      margin: 0;
    }
    .toggle-input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }
    .toggle-slider {
      position: absolute;
      inset: 0;
      background: var(--color-border, #dee2e6);
      border-radius: 26px;
      transition: 0.3s ease;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      left: 3px;
      top: 3px;
      background: #fff;
      border-radius: 50%;
      transition: 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .toggle-input:checked + .toggle-slider {
      background: #667eea;
    }
    .toggle-input:checked + .toggle-slider::before {
      transform: translateX(22px);
    }
    .cursor-pointer { cursor: pointer; user-select: none; }
  `]
})
export class CheckboxFieldComponent extends BaseFieldComponent { }
