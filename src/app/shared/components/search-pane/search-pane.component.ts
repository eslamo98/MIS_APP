import { Component, inject, viewChild, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { BaseFormField, GridSection } from '../../models/form.model';
import { AuthService } from '../../../core/serivces/auth.service';
import { ActionTypes } from '../../models/common.model';

@Component({
    selector: 'app-search-pane',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent],
    template: `
    <div class="search-pane glass-card p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="fw-bold mb-0">
          <i class="fas fa-search me-2 text-primary"></i> Search Filters
        </h5>
        <div class="d-flex gap-2">
          @if (canCreate()) {
            <button (click)="onCreate()" class="btn btn-success btn-sm rounded-pill px-3">
              <i class="fas fa-plus me-1"></i> Create New
            </button>
          }
          @if (canExport()) {
            <button (click)="onExportExcel()" class="btn btn-outline-success btn-sm rounded-pill px-2 px-md-3">
              <i class="fas fa-file-excel me-1"></i> Excel
            </button>
            <button (click)="onExportWord()" class="btn btn-outline-primary btn-sm rounded-pill px-2 px-md-3">
              <i class="fas fa-file-word me-1"></i> Word
            </button>
            <button (click)="onDownloadPdf()" class="btn btn-outline-danger btn-sm rounded-pill px-2 px-md-3">
              <i class="fas fa-file-pdf me-1"></i> PDF
            </button>
          }
        </div>
      </div>

      <app-dynamic-form
        #searchForm
        [fields]="fields()"
        [gridSections]="gridSections()"
        [showSubmitButton]="false"
        [showValidation]="false"
        (formSubmit)="onSearch($event)">
      </app-dynamic-form>

      <div class="d-flex justify-content-start gap-2 mt-2">
        <button (click)="searchForm.onSubmit()" class="btn btn-primary px-4 rounded-pill">
          <i class="fas fa-search me-2"></i> Search
        </button>
        <button (click)="onReset()" class="btn btn-light px-4 rounded-pill border">
          <i class="fas fa-sync-alt me-2"></i> New Search
        </button>
      </div>
    </div>
  `,
    styles: [`
    .search-pane {
        border-radius: 24px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-sm);
    }
    .btn-sm { font-size: 0.8rem; font-weight: 600; }
  `]
})
export class SearchPaneComponent {
    fields       = input<BaseFormField<any>[]>([]);
    gridSections = input<GridSection[]>([]);
    moduleName   = input<string>('');

    search      = output<any>();
    reset       = output<void>();
    create      = output<void>();
    exportExcel = output<any>();
    exportWord  = output<any>();
    downloadPdf = output<any>();

    searchForm = viewChild.required<DynamicFormComponent>('searchForm');

    private authService = inject(AuthService);

    canCreate = computed(() => true);
    // canCreate = computed(() => this.authService.checkPermission(ActionTypes.Create, this.moduleName()));
    canExport = computed(() => this.authService.checkPermission(ActionTypes.Export, this.moduleName()));

    onSearch(data: any) {
        this.search.emit(data);
    }

    onReset() {
        this.searchForm().resetForm();
        this.reset.emit();
    }

    onCreate() {
        this.create.emit();
    }

    onExportExcel() {
        this.exportExcel.emit(this.searchForm().getFormValue());
    }

    onExportWord() {
        this.exportWord.emit(this.searchForm().getFormValue());
    }

    onDownloadPdf() {
        this.downloadPdf.emit(this.searchForm().getFormValue());
    }
}
