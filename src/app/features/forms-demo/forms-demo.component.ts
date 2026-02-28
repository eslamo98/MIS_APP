import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { NotificationService } from '../../core/serivces/notification.service';
import { NotificationPosition } from '../../shared/models/notification.model';
import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { BaseFormField, TextField, DropdownField, TextareaField, DateField, UploadField, GridSection } from '../../shared/models/form.model';

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  template: `
    <div class="container py-4">
      <div class="mb-4 d-flex gap-2 flex-wrap justify-content-center">
        <span class="text-muted small w-100 text-center mb-2">Change Notification Position:</span>
        <button (click)="changePosition('top-right')" class="btn btn-sm btn-outline-primary rounded-pill px-3">Top Right</button>
        <button (click)="changePosition('top-center')" class="btn btn-sm btn-outline-primary rounded-pill px-3">Top Center</button>
        <button (click)="changePosition('bottom-right')" class="btn btn-sm btn-outline-primary rounded-pill px-3">Bottom Right</button>
        <button (click)="changePosition('bottom-center')" class="btn btn-sm btn-outline-primary rounded-pill px-3">Bottom Center</button>
      </div>

      <div class="mb-5 d-flex gap-3 justify-content-center">
        <button (click)="testNotify('success')" class="btn btn-success">Test Success</button>
        <button (click)="testNotify('error')" class="btn btn-danger">Test Error</button>
        <button (click)="testNotify('warning')" class="btn btn-warning">Test Warning</button>
        <button (click)="testNotify('info')" class="btn btn-info">Test Info</button>
      </div>

      <div class="row justify-content-center">
        <div class="col-12">
          <div class="glass-card p-5">
            <h2 class="fw-bold mb-2">Advanced Form Grid System</h2>
            <p class="text-muted mb-5">Experimental layout engine using nested grids and section-based grouping.</p>
            
            <app-dynamic-form 
              [fields]="formFields" 
              [gridSections]="gridConfig"
              submitLabel="Process Data"
              (formSubmit)="onFormSubmit($event)">
            </app-dynamic-form>

            <div *ngIf="submittedData" class="mt-5 animate-fade-in">
              <h5 class="fw-bold">Output Payload:</h5>
              <pre class="bg-dark text-success p-4 rounded-3 small"><code>{{ submittedData | json }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FormsDemoComponent {
  private notification = inject(NotificationService);
  submittedData: any = null;

  // Define Grid Sections
  gridConfig: GridSection[] = [
    { key: 'personal', label: 'Personal Information', colSpan: 8, order: 1 },
    { key: 'photo', label: 'Media', colSpan: 4, order: 2 },
    { key: 'additional', label: 'Additional Details', colSpan: 12, order: 3 }
  ];

  formFields: BaseFormField<any>[] = [
    // Personal Info Section
    new TextField({
      key: 'fullName',
      label: 'Full Name',
      placeholder: 'e.g. John Doe',
      required: true,
      validators: [Validators.required, Validators.minLength(3)],
      colSpan: 12,
      gridKey: 'personal',
      order: 1
    }),
    new TextField({
      key: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john@example.com',
      required: true,
      validators: [Validators.required, Validators.email],
      colSpan: 6,
      gridKey: 'personal',
      order: 2
    }),
    new DateField({
      key: 'birthDate',
      label: 'Date of Birth',
      required: true,
      validators: [Validators.required],
      colSpan: 6,
      gridKey: 'personal',
      order: 3
    }),

    // Photo Section
    new UploadField({
      key: 'avatar',
      label: 'Profile Picture',
      multiple: false,
      colSpan: 12,
      gridKey: 'photo',
      order: 1,
      placeholder: 'Upload Photo'
    }),

    // Additional Details Section
    new DropdownField({
      key: 'department',
      label: 'Target Department',
      options: [
        { key: 'it', value: 'IT Support' },
        { key: 'hr', value: 'Human Resources' },
        { key: 'sales', value: 'Sales & Marketing' }
      ],
      required: true,
      validators: [Validators.required],
      colSpan: 4,
      gridKey: 'additional',
      order: 1
    }),
    new TextareaField({
      key: 'bio',
      label: 'Professional Summary',
      placeholder: 'Briefly describe your career...',
      colSpan: 8,
      gridKey: 'additional',
      order: 2,
      rows: 2
    }),
    new UploadField({
      key: 'gallery',
      label: 'Certificates & Documents',
      multiple: true,
      colSpan: 12,
      gridKey: 'additional',
      order: 3,
      placeholder: 'Attach Files'
    })
  ];

  onFormSubmit(data: any) {
    this.submittedData = data;
    this.notification.success('Form layout processed successfully!', 'Grid Engine Active');
  }

  testNotify(type: string) {
    switch (type) {
      case 'success': this.notification.success('Operation completed!', 'Success'); break;
      case 'error': this.notification.error('Something went wrong.', 'Error Occurred'); break;
      case 'warning': this.notification.warning('Please check your input.', 'Wait a minute'); break;
      case 'info': this.notification.info('Here is some information.', 'Did you know?'); break;
    }
  }

  changePosition(pos: NotificationPosition) {
    this.notification.setPosition(pos);
    this.notification.info(`Notifications will now show at: ${pos}`, 'Position Updated');
  }
}
