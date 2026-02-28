import { Component, inject, OnInit, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { SearchPaneComponent } from '../../../shared/components/search-pane/search-pane.component';
import { SearchResultsComponent } from '../../../shared/components/search-results/search-results.component';
import { DynamicFormModalComponent } from '../../../shared/components/dynamic-form-modal/dynamic-form-modal.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { BaseFormField, TextField, DropdownField, GridSection } from '../../../shared/models/form.model';
import { ActionTypes, Modules, TableColumn } from '../../../shared/models/common.model';
import { PermissionListItem, PermissionService } from '../../../core/serivces/permission.service';
import { ModuleService } from '../../../core/serivces/module.service';
import { ActionTypeService } from '../../../core/serivces/action-type.service';
import { ExportService } from '../../../core/serivces/export.service';
import { NotificationService } from '../../../core/serivces/notification.service';
import { LanguageService } from '../../../shared/services/language.service';
import { forkJoin } from 'rxjs';
import { PermissionsLang } from './permissions-mgmt.component.lang';

@Component({
    selector: 'app-permissions-mgmt',
    standalone: true,
    imports: [CommonModule, FormsModule, SearchPaneComponent, SearchResultsComponent, DynamicFormModalComponent, ConfirmationModalComponent],
    templateUrl: './permissions-mgmt.component.html',
    styleUrls: ['./permissions-mgmt.component.css']
})
export class PermissionsMgmtComponent implements OnInit {
    private permissionService = inject(PermissionService);
    private moduleService     = inject(ModuleService);
    private actionTypeService = inject(ActionTypeService);
    private exportService     = inject(ExportService);
    private notification      = inject(NotificationService);
    private langService       = inject(LanguageService);

    formModal = viewChild<DynamicFormModalComponent>('formModal');

    t    = PermissionsLang;
    lang = this.langService.currentLang;

    Modules     = Modules;
    ActionTypes = ActionTypes;

    permissions           = signal<PermissionListItem[]>([]);
    isModalOpen           = signal(false);
    isConfirmOpen         = signal(false);
    isBulkConfirmOpen     = signal(false);
    isBulkLoading         = signal(false);
    selectedBulkModuleId  = signal<number | null>(null);

    pagination = signal({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageSizeOptions: [5, 10, 25, 50]
    });

    confirmMessage            = '';
    bulkConfirmMessage        = '';
    pendingDeleteId: number | null     = null;
    editingPermissionId: number | null = null;
    modalTitle  = '';
    submitLabel = '';

    currentFilters: any = {};

    gridConfig: GridSection[] = [
        { key: 'basics', label: 'Permission Details', colSpan: 12, order: 1 }
    ];

    searchGrid: GridSection[] = [
        { key: 'filters', label: 'Filter Permissions', colSpan: 12, order: 1 }
    ];

    moduleOptions: { key: any, value: string }[] = [];
    actionOptions: { key: any, value: string }[] = [];

    formFields: BaseFormField<any>[] = [
        new DropdownField({
            key: 'moduleId', label: 'Module', required: true,
            validators: [Validators.required], options: [],
            colSpan: 6, gridKey: 'basics', order: 1
        }),
        new DropdownField({
            key: 'actionTypeId', label: 'Action Type', required: true,
            validators: [Validators.required], options: [],
            colSpan: 6, gridKey: 'basics', order: 2
        }),
        new TextField({
            key: 'name', label: 'Display Name', placeholder: 'e.g. Can Read Orders',
            required: true, validators: [Validators.required],
            colSpan: 12, gridKey: 'basics', order: 3
        }),
        new TextField({
            key: 'code', label: 'Permission Code', placeholder: 'GENERATED.AUTOMATICALLY',
            required: true, readonly: true, validators: [Validators.required],
            colSpan: 12, gridKey: 'basics', order: 4
        })
    ];

    searchFields: BaseFormField<any>[] = [
        new DropdownField({
            key: 'moduleId', label: 'Module',
            colSpan: 12, gridKey: 'filters', order: 1, options: []
        })
    ];

    columns: TableColumn[] = [
        { key: 'name',       label: 'Permission Name'       },
        { key: 'code',       label: 'System Code'           },
        { key: 'moduleName', label: 'Module', type: 'badge' },
        { key: 'roleCount',  label: 'Roles Assigned'        }
    ];

    ngOnInit() {
        this.loadDropdownData();
        setTimeout(() => this.loadPermissions(), 0);
    }

    loadDropdownData() {
        forkJoin({
            modules: this.moduleService.getAll(),
            actions: this.actionTypeService.getAll()
        }).subscribe({
            next: (res) => {
                if (res.modules.isSuccess && res.actions.isSuccess) {
                    this.moduleOptions = res.modules.data.map(m => ({ key: m.id, value: m.displayName || m.name }));
                    this.actionOptions = res.actions.data.map(a => ({ key: a.id, value: a.displayName || a.name }));

                    const moduleField = this.formFields.find(f => f.key === 'moduleId') as DropdownField;
                    if (moduleField) moduleField.options = this.moduleOptions;

                    const actionField = this.formFields.find(f => f.key === 'actionTypeId') as DropdownField;
                    if (actionField) actionField.options = this.actionOptions;

                    const searchModuleField = this.searchFields.find(f => f.key === 'moduleId') as DropdownField;
                    if (searchModuleField) searchModuleField.options = this.moduleOptions;
                }
            }
        });
    }

    loadPermissions() {
        const p = this.pagination();
        const params = { pageIndex: p.pageIndex, pageSize: p.pageSize, ...this.currentFilters };

        this.permissionService.getPaged(params).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    this.permissions.set(res.data.items || []);
                    this.pagination.update(p => ({ ...p, totalCount: res.data.totalCount }));
                }
            },
            error: () => this.notification.error(this.t.LOAD_ERROR[this.lang()])
        });
    }

    handleSearch(filters: any) {
        this.currentFilters = { ...filters };
        this.pagination.update(p => ({ ...p, pageIndex: 1 }));
        this.loadPermissions();
    }

    handleReset() {
        this.currentFilters = {};
        this.pagination.update(p => ({ ...p, pageIndex: 1 }));
        this.loadPermissions();
    }

    onPageChange(event: any) {
        this.pagination.update(p => ({ ...p, pageIndex: event.pageIndex, pageSize: event.pageSize }));
        this.loadPermissions();
    }

    onFormValueChange(values: any) {
        const actionId = values.actionTypeId;
        const moduleId = values.moduleId;
        if (actionId && moduleId) {
            const action = this.actionOptions.find(o => o.key == actionId)?.value || '';
            const module = this.moduleOptions.find(o => o.key == moduleId)?.value || '';
            if (action && module) {
                const code = `${action}.${module}`.replace(/\s+/g, '').toUpperCase();
                this.formModal()?.getControl('code')?.patchValue(code, { emitEvent: false });
            }
        }
    }

    handleCreate() {
        this.editingPermissionId = null;
        this.modalTitle  = this.t.MODAL_CREATE_TITLE[this.lang()];
        this.submitLabel = this.t.BTN_CREATE[this.lang()];
        this.formFields.forEach(f => f.value = undefined);
        this.isModalOpen.set(true);
    }

    onEdit(permission: PermissionListItem) {
        this.editingPermissionId = permission.id;
        this.modalTitle  = `${this.t.MODAL_EDIT_TITLE[this.lang()]}: ${permission.name}`;
        this.submitLabel = this.t.BTN_UPDATE[this.lang()];
        this.isModalOpen.set(true);

        setTimeout(() => {
            this.formModal()?.patchValue({
                moduleId:     permission.moduleId,
                actionTypeId: permission.actionTypeId,
                name:         permission.name,
                code:         permission.code
            });
        });
    }

    onDelete(permission: PermissionListItem) {
        this.pendingDeleteId = permission.id;
        this.confirmMessage  = `${this.t.CONFIRM_DELETE_MSG[this.lang()]} "${permission.name}"? ${this.t.CONFIRM_DELETE_SUB[this.lang()]}`;
        this.isConfirmOpen.set(true);
    }

    onDeleteConfirmed() {
        if (this.pendingDeleteId === null) return;
        this.isConfirmOpen.set(false);
        this.permissionService.delete(this.pendingDeleteId).subscribe({
            next: () => {
                this.notification.success(this.t.SUCCESS_DELETE[this.lang()]);
                this.pendingDeleteId = null;
                this.loadPermissions();
            },
            error: () => {
                this.notification.error(this.t.DELETE_ERROR[this.lang()]);
                this.pendingDeleteId = null;
            }
        });
    }

    onModalSubmit(data: any) {
        const payload = {
            id: this.editingPermissionId || 0,
            name: data.name, code: data.code,
            moduleId: data.moduleId, actionTypeId: data.actionTypeId
        };

        const obs = this.editingPermissionId
            ? this.permissionService.update(this.editingPermissionId, payload)
            : this.permissionService.create(payload);

        obs.subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    this.notification.success(this.t.SUCCESS_SAVE[this.lang()]);
                    this.isModalOpen.set(false);
                    this.loadPermissions();
                } else {
                    this.notification.error(res.message || 'Operation failed.');
                }
            },
            error: () => this.notification.error(this.t.VALIDATION_ERROR[this.lang()])
        });
    }

    requestBulkInit() {
        if (!this.selectedBulkModuleId()) return;
        const moduleName = this.moduleOptions.find(m => m.key === this.selectedBulkModuleId())?.value || '';
        this.bulkConfirmMessage =
            `${this.t.CONFIRM_BULK_TITLE[this.lang()]} "${moduleName}".\n` +
            `Existing permissions will NOT be duplicated. Do you want to continue?`;
        this.isBulkConfirmOpen.set(true);
    }

    onBulkInitConfirmed() {
        if (!this.selectedBulkModuleId()) return;
        this.isBulkConfirmOpen.set(false);
        this.isBulkLoading.set(true);

        this.moduleService.initializePermissions(this.selectedBulkModuleId()!).subscribe({
            next: (res) => {
                this.isBulkLoading.set(false);
                if (res.isSuccess) {
                    this.notification.success(res.message || 'All permissions initialized successfully!');
                    this.selectedBulkModuleId.set(null);
                    this.loadPermissions();
                } else {
                    this.notification.error(res.message || 'Failed to initialize permissions.');
                }
            },
            error: () => {
                this.isBulkLoading.set(false);
                this.notification.error('Error initializing permissions. Please try again.');
            }
        });
    }

    handleExport(type: string, filterValues?: any) {
        this.notification.info(this.t.EXPORT_PREPARING[this.lang()]);

        const dataToExport = [...this.permissions()].map(p => ({
            ...p, module: p.moduleName || p.module
        }));

        const exportCols = this.columns.map(c => ({ key: c.key, label: c.label }));

        const displayFilters: { label: string, value: string }[] = [];
        if (filterValues) {
            Object.keys(filterValues).forEach(key => {
                const val = filterValues[key];
                if (val !== null && val !== undefined && val !== '') {
                    const field    = this.searchFields.find(f => f.key === key);
                    const label    = field?.label || key;
                    let displayVal = val;
                    if (field instanceof DropdownField) {
                        displayVal = field.options.find(o => o.key == val)?.value || val;
                    }
                    displayFilters.push({ label, value: String(displayVal) });
                }
            });
        }

        const options = {
            fileName: 'permissions_report',
            title:    'Permissions Management Report',
            data:     dataToExport,
            columns:  exportCols,
            filters:  displayFilters
        };

        switch (type.toLowerCase()) {
            case 'excel': this.exportService.exportToExcel(options); break;
            case 'pdf':   this.exportService.exportToPdf(options);   break;
            case 'word':  this.exportService.exportToWord(options);  break;
        }
    }
}
