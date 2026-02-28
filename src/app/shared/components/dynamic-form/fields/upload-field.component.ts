import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { UploadField, FilePayload, FileState } from '../../../models/form.model';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-upload-field',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="form()" class="form-group-container" [class.is-valid]="isValid" [class.is-invalid]="isInvalid">
      <label class="form-label fw-bold d-flex justify-content-between">
        {{ field().label }}
        @if (field().required) {
          <span class="text-danger small">*</span>
        }
      </label>

      <div class="upload-container">
        <input type="file"
               (change)="onFileSelected($event)"
               [multiple]="asUpload.multiple"
               class="d-none" #fileInput
               accept="image/*">

        <div class="previews d-flex flex-wrap gap-2 mb-2">
          @for (file of getFiles(); track file.filename; let i = $index) {
            <div class="preview-item position-relative">
              <img [src]="getImageSrc(file)" alt="preview" class="rounded-3 shadow-sm border">
              <button type="button" (click)="removeFile(i)"
                      class="btn-remove btn btn-danger btn-sm rounded-circle position-absolute top-0 start-100 translate-middle">
                <i class="fas fa-times"></i>
              </button>
            </div>
          }
        </div>

        <button type="button" (click)="fileInput.click()" class="btn btn-outline-primary btn-upload w-100 py-3">
          <i class="fas" [ngClass]="asUpload.multiple ? 'fa-images' : 'fa-image'"></i>
          {{ field().placeholder || (asUpload.multiple ? 'Add Images' : 'Upload Image') }}
        </button>
      </div>

      @if (isInvalid) {
        <div class="error-container mt-1 ms-1">
          <small class="text-danger animate-fade-in">
            <i class="fas fa-info-circle me-1"></i> {{ field().label }} is invalid or required.
          </small>
        </div>
      }
    </div>
  `,
    styleUrls: ['../dynamic-form.component.css']
})
export class UploadFieldComponent extends BaseFieldComponent {
    private cdr = inject(ChangeDetectorRef);
    baseResourcesUrl: string = environment.resourceApiUrl;

    get asUpload() {
        return this.field() as UploadField;
    }

    getImageSrc(file: FilePayload): string {
        return file.url?.startsWith('http') ? file.url
            : file.url?.startsWith('data') ? file.url
            : this.baseResourcesUrl + '/' + file.url;
    }

    onFileSelected(event: any) {
        const files = event.target.files as FileList;
        if (!files || files.length === 0) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const payload: FilePayload = {
                    filename: file.name,
                    base64: reader.result as string,
                    state: FileState.Added
                };
                if (this.asUpload.multiple) {
                    const currentValues = this.control?.value || [];
                    this.control?.setValue([...currentValues, payload]);
                } else {
                    this.control?.setValue(payload);
                }
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        });
        event.target.value = '';
    }

    removeFile(index: number) {
        if (!this.control) return;

        if (this.asUpload.multiple && Array.isArray(this.control.value)) {
            const updatedFiles = [...this.control.value];
            const file = updatedFiles[index];
            if (file.state === FileState.Attached) {
                file.state = FileState.Deleted;
            } else {
                updatedFiles.splice(index, 1);
            }
            this.control.setValue(updatedFiles);
        } else {
            const file = this.control.value as FilePayload;
            if (file && file.state === FileState.Attached) {
                this.control.setValue({ ...file, state: FileState.Deleted });
            } else {
                this.control.setValue(null);
            }
        }
    }

    getFiles(): FilePayload[] {
        const val = this.control?.value;
        if (!val) return [];
        const files = Array.isArray(val) ? val : [val];
        return files.filter(f => f && f.state !== FileState.Deleted);
    }
}
