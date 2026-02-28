import { Component, inject, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPaneComponent } from '../../../shared/components/search-pane/search-pane.component';
import { SearchResultsComponent } from '../../../shared/components/search-results/search-results.component';
import { DynamicFormModalComponent } from '../../../shared/components/dynamic-form-modal/dynamic-form-modal.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { BaseFormField, TextField, TextareaField, GridSection, CheckboxField, DropdownField } from '../../../shared/models/form.model';
import { ActionTypes, Modules, TableColumn } from '../../../shared/models/common.model';
import { ExportService } from '../../../core/serivces/export.service';
import { ModuleService, ModuleListItem } from '../../../core/serivces/module.service';
import { NotificationService } from '../../../core/serivces/notification.service';
import { LanguageService } from '../../../shared/services/language.service';
import { Validators } from '@angular/forms';
import { ModulesLang } from './modules-mgmt.component.lang';

@Component({
    selector: 'app-modules-mgmt',
    standalone: true,
    imports: [CommonModule, SearchPaneComponent, SearchResultsComponent, DynamicFormModalComponent, ConfirmationModalComponent],
    templateUrl: './modules-mgmt.component.html',
    styleUrls: ['./modules-mgmt.component.css']
})
export class ModulesMgmtComponent implements OnInit {
    private moduleService = inject(ModuleService);
    private exportService = inject(ExportService);
    private notification = inject(NotificationService);
    private cdr = inject(ChangeDetectorRef);
    private langService = inject(LanguageService);

    // Localization
    t = ModulesLang;
    lang = this.langService.currentLang;

    Modules = Modules;
    modules =signal<ModuleListItem[]>([]);
    isModalOpen = false;

    // Delete confirmation
    isConfirmOpen = false;
    confirmMessage = '';
    pendingDeleteId: number | null = null;

    // Initialize permissions confirmation
    isInitPermConfirmOpen = false;
    initPermConfirmMessage = '';
    pendingInitPermModuleId: number | null = null;
    pendingInitPermModuleName = '';

    editingModuleId: number | null = null;
    modalTitle = '';
    submitLabel = '';

    pagination = {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageSizeOptions: [5, 10, 25, 50]
    };

    lastFilters: any = {};

    gridConfig: GridSection[] = [{ key: 'basics', label: this.t.SEC_DETAILS[this.lang()], colSpan: 12, order: 1 }];
    searchGrid: GridSection[] = [{ key: 'filters', label: this.t.SEC_FILTER[this.lang()], colSpan: 12, order: 1 }];

    formFields: BaseFormField<any>[] = [
        new TextField({ key: 'name', label: this.t.LABEL_NAME[this.lang()], placeholder: 'e.g. ORDERS', required: true, validators: [Validators.required], colSpan: 6, gridKey: 'basics', order: 1 }),
        new TextField({ key: 'displayName', label: this.t.LABEL_DISPLAY_NAME[this.lang()], placeholder: 'e.g. Orders Management', required: true, validators: [Validators.required], colSpan: 6, gridKey: 'basics', order: 2 }),
        new TextField({ key: 'orderIndex', label: this.t.LABEL_ORDER[this.lang()], type: 'number', value: 0, colSpan: 6, gridKey: 'basics', order: 3 }),
        new TextareaField({ key: 'description', label: this.t.LABEL_DESCRIPTION[this.lang()], placeholder: 'Module description...', colSpan: 12, gridKey: 'basics', order: 4, rows: 3 }),
        new CheckboxField({
            key: 'initializePermissions',
            label: this.t.LABEL_INIT_PERMS[this.lang()],
            value: false,
            colSpan: 12,
            gridKey: 'basics',
            order: 5
        })
    ];

    searchFields: BaseFormField<any>[] = [
        new TextField({ key: 'searchTerm', label: 'Search', placeholder: 'Name or Display Name...', colSpan: 12, gridKey: 'filters', order: 1 })
    ];

    columns: TableColumn[] = [
        { key: 'name', label: 'System Name' },
        { key: 'displayName', label: 'Display Name' },
        { key: 'orderIndex', label: 'Order' },
        { key: 'permissionCount', label: 'Permissions' }
    ];

    /** Custom per-row action buttons for the table */
    tableCustomActions = [
        {
            icon: 'fas fa-shield-alt',
            label: 'Initialize All Permissions',
            cssClass: 'btn-custom',
            emitKey: 'initPermissions'
        }
    ];

    ngOnInit() {
        this.loadModules();
    }

    loadModules(pageIndex = 1, pageSize = 10, searchTerm?: string) {
        const params = {
            pageIndex,
            pageSize,
            searchTerm: searchTerm || ''
        };

        this.moduleService.getPaged(params).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    this.modules.set(res.data.items);
                    this.pagination = {
                        ...this.pagination,
                        pageIndex: res.data.pageIndex,
                        pageSize: res.data.pageSize,
                        totalCount: res.data.totalCount
                    };
                    // this.cdr.detectChanges();
                }
            },
            error: () => this.notification.error(this.t.LOAD_ERROR[this.lang()])
        });
    }

    handleSearch(filters: any) {
        this.lastFilters = filters;
        this.loadModules(1, this.pagination.pageSize, filters.searchTerm);
    }

    handleReset() {
        this.lastFilters = {};
        this.loadModules(1, this.pagination.pageSize);
    }

    onPageChange(event: any) {
        this.loadModules(event.pageIndex, event.pageSize, this.lastFilters.searchTerm);
    }

    handleCreate() {
        this.editingModuleId = null;
        this.modalTitle = this.t.MODAL_CREATE_TITLE[this.lang()];
        this.submitLabel = this.t.BTN_CREATE[this.lang()];
        this.formFields.forEach(f => f.value = undefined);
        // Show the initializePermissions checkbox only on create
        const initPermField = this.formFields.find(f => f.key === 'initializePermissions');
        if (initPermField) initPermField.colSpan = 12;
        this.isModalOpen = true;
    }

    onEdit(module: ModuleListItem) {
        this.editingModuleId = module.id;
        this.modalTitle = `${this.t.MODAL_EDIT_TITLE[this.lang()]}: ${module.displayName}`;
        this.submitLabel = this.t.BTN_UPDATE[this.lang()];
        this.formFields.forEach(f => { f.value = (module as any)[f.key]; });
        // Hide initializePermissions on edit (use the dedicated row action instead)
        const initPermField = this.formFields.find(f => f.key === 'initializePermissions');
        if (initPermField) { initPermField.colSpan = 0; initPermField.value = false; }
        this.isModalOpen = true;
    }

    onDelete(module: ModuleListItem) {
        this.pendingDeleteId = module.id;
        this.confirmMessage = `${this.t.CONFIRM_DELETE_MSG[this.lang()]} "${module.displayName}"?`;
        this.isConfirmOpen = true;
    }

    onDeleteConfirmed() {
        if (this.pendingDeleteId === null) return;
        this.moduleService.delete(this.pendingDeleteId).subscribe({
            next: () => {
                this.notification.success(this.t.SUCCESS_DELETE[this.lang()]);
                this.isConfirmOpen = false;
                this.loadModules();
            },
            error: () => this.notification.error(this.t.DELETE_ERROR[this.lang()])
        });
    }

    /** Handle custom row actions emitted by SearchResultsComponent */
    onCustomAction(event: { action: string; item: ModuleListItem }) {
        if (event.action === 'initPermissions') {
            this.pendingInitPermModuleId = event.item.id;
            this.pendingInitPermModuleName = event.item.displayName;
            this.initPermConfirmMessage =
                `${this.t.CONFIRM_INIT_MSG[this.lang()]} "${event.item.displayName}".\n` +
                `${this.t.CONFIRM_INIT_SUB[this.lang()]}`;
            this.isInitPermConfirmOpen = true;
        }
    }

    onInitPermissionsConfirmed() {
        if (this.pendingInitPermModuleId === null) return;
        this.isInitPermConfirmOpen = false;
        const moduleId = this.pendingInitPermModuleId;

        this.moduleService.initializePermissions(moduleId).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    this.notification.success(res.message || this.t.SUCCESS_INIT[this.lang()]);
                    this.loadModules(this.pagination.pageIndex, this.pagination.pageSize, this.lastFilters.searchTerm);
                } else {
                    this.notification.error(res.message || 'Operation failed.');
                }
                this.pendingInitPermModuleId = null;
                this.pendingInitPermModuleName = '';
            },
            error: () => {
                this.notification.error(this.t.INIT_ERROR[this.lang()]);
                this.pendingInitPermModuleId = null;
            }
        });
    }

    onModalSubmit(data: any) {
        const obs = this.editingModuleId
            ? this.moduleService.update(this.editingModuleId, { id: this.editingModuleId, ...data })
            : this.moduleService.create({
                name: data.name,
                displayName: data.displayName,
                description: data.description,
                orderIndex: data.orderIndex || 0,
                initializePermissions: !!data.initializePermissions
            });

        obs.subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    const msg = (!this.editingModuleId && data.initializePermissions)
                        ? `Module created and all permissions initialized for "${data.displayName}"!`
                        : this.t.SUCCESS_SAVE[this.lang()];
                    this.notification.success(msg);
                    this.isModalOpen = false;
                    this.loadModules();
                } else {
                    this.notification.error(res.message);
                }
            },
            error: () => this.notification.error(this.t.SAVE_ERROR[this.lang()])
        });
    }

    handleExport(type: string, filterValues?: any) {
        this.notification.info(this.t.EXPORT_PREPARING[this.lang()]);

        const exportCols = this.columns.map(c => ({
            key: c.key,
            label: c.label
        }));

        const displayFilters: { label: string, value: string }[] = [];
        if (filterValues) {
            Object.keys(filterValues).forEach(key => {
                const val = filterValues[key];
                if (val !== null && val !== undefined && val !== '') {
                    const field = this.searchFields.find(f => f.key === key);
                    const label = field?.label || key;
                    let displayVal = val;

                    if (field && field instanceof DropdownField) {
                        displayVal = field.options.find((o: any) => o.key == val)?.value || val;
                    }
                    displayFilters.push({ label, value: String(displayVal) });
                }
            });
        }

        const options = {
            fileName: 'modules_report',
            title: 'System Modules Report',
            data: this.modules(),
            columns: exportCols,
            filters: displayFilters
        };

        switch (type.toLowerCase()) {
            case 'excel':
                this.exportService.exportToExcel(options);
                break;
            case 'pdf':
                this.exportService.exportToPdf(options);
                break;
            case 'word':
                this.exportService.exportToWord(options);
                break;
        }
    }
}
