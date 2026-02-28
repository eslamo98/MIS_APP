import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPaneComponent } from '../../../shared/components/search-pane/search-pane.component';
import { SearchResultsComponent } from '../../../shared/components/search-results/search-results.component';
import { DynamicFormModalComponent } from '../../../shared/components/dynamic-form-modal/dynamic-form-modal.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { BaseFormField, TextField, TextareaField, DropdownField, GridSection } from '../../../shared/models/form.model';
import { ActionTypes, Modules, TableColumn } from '../../../shared/models/common.model';
import { ExportService } from '../../../core/serivces/export.service';
import { RoleService, Role } from '../../../core/serivces/role.service';
import { NotificationService } from '../../../core/serivces/notification.service';
import { LanguageService } from '../../../shared/services/language.service';
import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, map, catchError, of, timer, switchMap } from 'rxjs';
import { RolesLang } from './roles-mgmt.component.lang';

@Component({
    selector: 'app-roles-mgmt',
    standalone: true,
    imports: [CommonModule, SearchPaneComponent, SearchResultsComponent, DynamicFormModalComponent, ConfirmationModalComponent],
    templateUrl: './roles-mgmt.component.html',
    styleUrls: ['./roles-mgmt.component.css']
})
export class RolesMgmtComponent implements OnInit {
    private roleService   = inject(RoleService);
    private exportService = inject(ExportService);
    private notification  = inject(NotificationService);
    private langService   = inject(LanguageService);

    t    = RolesLang;
    lang = this.langService.currentLang;

    Modules = Modules;

    roles         = signal<Role[]>([]);
    isModalOpen   = signal(false);
    isConfirmOpen = signal(false);

    confirmMessage   = '';
    pendingDeleteId: number | null = null;
    editingRoleId: number | null   = null;
    modalTitle  = '';
    submitLabel = '';

    pagination = signal({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageSizeOptions: [5, 10, 25, 50]
    });

    currentFilters: any = {};

    gridConfig: GridSection[] = [
        { key: 'basics', label: this.t.SEC_ID[this.lang()], colSpan: 12, order: 1 }
    ];

    searchGrid: GridSection[] = [
        { key: 'filters', label: this.t.SEC_SEARCH[this.lang()], colSpan: 12, order: 1 }
    ];

    formFields: BaseFormField<any>[] = [
        new TextField({
            key: 'name',
            label: this.t.LABEL_NAME[this.lang()],
            placeholder: 'Enter unique role name...',
            required: true,
            validators: [Validators.required, Validators.minLength(3)],
            asyncValidators: [this.roleNameAsyncValidator.bind(this)],
            colSpan: 6, gridKey: 'basics', order: 1
        }),
        new DropdownField({
            key: 'isActive',
            label: this.t.LABEL_STATUS[this.lang()],
            required: true,
            colSpan: 6, gridKey: 'basics', order: 2,
            value: 'true',
            options: [
                { key: 'true',  value: this.t.STATUS_ACTIVE[this.lang()]   },
                { key: 'false', value: this.t.STATUS_INACTIVE[this.lang()] }
            ]
        }),
        new TextareaField({
            key: 'description',
            label: this.t.LABEL_DESCRIPTION[this.lang()],
            placeholder: 'Explain the purpose of this role...',
            colSpan: 12, gridKey: 'basics', order: 3, rows: 3
        })
    ];

    searchFields: BaseFormField<any>[] = [
        new TextField({
            key: 'searchTerm',
            label: 'Term',
            placeholder: this.t.SEARCH_TERM[this.lang()],
            colSpan: 8, gridKey: 'filters', order: 1
        }),
        new DropdownField({
            key: 'status',
            label: this.t.LABEL_STATUS[this.lang()],
            colSpan: 4, gridKey: 'filters', order: 2,
            options: [
                { key: 'true',  value: this.t.STATUS_ACTIVE[this.lang()]   },
                { key: 'false', value: this.t.STATUS_INACTIVE[this.lang()] }
            ]
        })
    ];

    columns: TableColumn[] = [
        { key: 'name',            label: 'Role Name'     },
        { key: 'permissionCount', label: 'Permissions'   },
        { key: 'userCount',       label: 'Users Assigned'}
    ];

    ngOnInit() {
        this.loadRoles();
    }

    loadRoles() {
        const p = this.pagination();
        const params = {
            pageIndex: p.pageIndex,
            pageSize:  p.pageSize,
            ...this.currentFilters
        };

        this.roleService.getPaged(params).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    this.roles.set(res.data.items || []);
                    this.pagination.update(p => ({ ...p, totalCount: res.data.totalCount }));
                }
            },
            error: () => this.notification.error(this.t.LOAD_ERROR[this.lang()])
        });
    }

    handleSearch(filters: any) {
        this.currentFilters = { ...filters };
        this.pagination.update(p => ({ ...p, pageIndex: 1 }));
        this.loadRoles();
    }

    handleReset() {
        this.currentFilters = {};
        this.pagination.update(p => ({ ...p, pageIndex: 1 }));
        this.loadRoles();
    }

    onPageChange(event: any) {
        this.pagination.update(p => ({ ...p, pageIndex: event.pageIndex, pageSize: event.pageSize }));
        this.loadRoles();
    }

    handleCreate() {
        this.editingRoleId = null;
        this.modalTitle    = this.t.MODAL_CREATE_TITLE[this.lang()];
        this.submitLabel   = this.t.BTN_CREATE[this.lang()];
        this.formFields.forEach(f => f.value = undefined);
        this.isModalOpen.set(true);
    }

    onEdit(role: Role) {
        this.editingRoleId = role.id;
        this.modalTitle    = `${this.t.MODAL_EDIT_TITLE[this.lang()]}: ${role.name}`;
        this.submitLabel   = this.t.BTN_UPDATE[this.lang()];
        this.formFields.forEach(f => { f.value = (role as any)[f.key]; });
        this.isModalOpen.set(true);
    }

    onDelete(role: Role) {
        this.pendingDeleteId = role.id;
        this.confirmMessage  = `${this.t.CONFIRM_DELETE_MSG[this.lang()]} "${role.name}"? ${this.t.CONFIRM_DELETE_SUB[this.lang()]}`;
        this.isConfirmOpen.set(true);
    }

    onDeleteConfirmed() {
        if (this.pendingDeleteId === null) return;
        this.isConfirmOpen.set(false);
        this.roleService.delete(this.pendingDeleteId).subscribe({
            next: () => {
                this.notification.success(this.t.SUCCESS_DELETE[this.lang()]);
                this.pendingDeleteId = null;
                this.loadRoles();
            },
            error: () => {
                this.notification.error(this.t.DELETE_ERROR[this.lang()]);
                this.pendingDeleteId = null;
            }
        });
    }

    onModalSubmit(data: any) {
        data.isActive = data.isActive === 'true';

        const obs = this.editingRoleId
            ? this.roleService.update(this.editingRoleId, data)
            : this.roleService.create(data);

        obs.subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    this.notification.success(this.editingRoleId
                        ? this.t.SUCCESS_UPDATE[this.lang()]
                        : this.t.SUCCESS_CREATE[this.lang()]);
                    this.isModalOpen.set(false);
                    this.loadRoles();
                } else {
                    this.notification.error(res.message || 'Operation failed.');
                }
            },
            error: () => this.notification.error(this.t.SAVE_ERROR[this.lang()])
        });
    }

    handleExport(type: string, filterValues?: any) {
        this.notification.info(this.t.EXPORT_PREPARING[this.lang()]);

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
            fileName: 'roles_report',
            title:    'Role Management Report',
            data:     this.roles(),
            columns:  exportCols,
            filters:  displayFilters
        };

        switch (type.toLowerCase()) {
            case 'excel': this.exportService.exportToExcel(options); break;
            case 'pdf':   this.exportService.exportToPdf(options);   break;
            case 'word':  this.exportService.exportToWord(options);  break;
        }
    }

    roleNameAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value) return of(null);
        return timer(500).pipe(
            switchMap(() => this.roleService.checkNameExists(control.value)),
            map(exists => exists ? { nameExists: true } : null),
            catchError(() => of(null))
        );
    }
}
