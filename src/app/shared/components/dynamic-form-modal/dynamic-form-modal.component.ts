import { Component, viewChild, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTemplateComponent } from '../modal-template/modal-template.component';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { BaseFormField, GridSection } from '../../models/form.model';

@Component({
  selector: 'app-dynamic-form-modal',
  standalone: true,
  imports: [CommonModule, ModalTemplateComponent, DynamicFormComponent],
  template: `
    @if (isOpen()) {
      <app-modal-template
        [title]="title()"
        [showFooter]="true"
        (close)="onCancel()">

        <app-dynamic-form
          #modalForm
          [fields]="fields()"
          [gridSections]="gridSections()"
          [submitLabel]="submitLabel()"
          [showSubmitButton]="false"
          [showValidation]="true"
          (valueChanges)="valueChanges.emit($event)"
          (formSubmit)="onFormSubmit($event)">
        </app-dynamic-form>

        <div footer class="d-flex gap-2 w-100 justify-content-end">
          <button type="button" class="btn btn-light rounded-pill px-4 border" (click)="onCancel()">
            Cancel
          </button>
          <button type="button" class="btn btn-primary-gradient rounded-pill px-5 shadow-sm" (click)="modalForm.onSubmit()">
            {{ submitLabel() }}
          </button>
        </div>

      </app-modal-template>
    }
  `
})
export class DynamicFormModalComponent {
  isOpen       = input<boolean>(false);
  title        = input<string>('Form Modal');
  fields       = input<BaseFormField<any>[]>([]);
  gridSections = input<GridSection[]>([]);
  submitLabel  = input<string>('Save');

  close        = output<void>();
  submit       = output<any>();
  valueChanges = output<any>();

  modalForm = viewChild.required<DynamicFormComponent>('modalForm');

  onCancel() {
    this.close.emit();
  }

  onFormSubmit(data: any) {
    this.submit.emit(data);
  }

  /** Public API for parents to patch form values after modal opens */
  patchValue(values: Record<string, any>) {
    this.modalForm().form.patchValue(values);
  }

  getControl(key: string) {
    return this.modalForm().form.get(key);
  }
}
