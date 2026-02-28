import { Component, inject, OnInit, viewChild, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SearchPaneComponent } from '../../../shared/components/search-pane/search-pane.component';
import { SearchResultsComponent } from '../../../shared/components/search-results/search-results.component';
import { DynamicFormModalComponent } from '../../../shared/components/dynamic-form-modal/dynamic-form-modal.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { BaseFormField, TextField, UploadField, GridSection } from '../../../shared/models/form.model';
import { Modules, TableColumn } from '../../../shared/models/common.model';
import { UserService, UserListItem } from '../../../core/serivces/user.service';
import { NotificationService } from '../../../core/serivces/notification.service';
import { LanguageService } from '../../../shared/services/language.service';
import { ExportService } from '../../../core/serivces/export.service';
import { UsersLang } from './users-mgmt.component.lang';

@Component({
  selector: 'app-users-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchPaneComponent, SearchResultsComponent, DynamicFormModalComponent, ConfirmationModalComponent],
  templateUrl: './users-mgmt.component.html',
  styleUrls: ['./users-mgmt.component.css']
})
export class UsersMgmtComponent implements OnInit {
  private userService    = inject(UserService);
  private http           = inject(HttpClient);
  private notification   = inject(NotificationService);
  private langService    = inject(LanguageService);
  private exportService  = inject(ExportService);
  private cdr            = inject(ChangeDetectorRef);

  formModal = viewChild<DynamicFormModalComponent>('formModal');

  t    = UsersLang;
  lang = this.langService.currentLang;

  Modules = Modules;
  users = signal<UserListItem[]>([]);
  isModalOpen           = false;
  isConfirmOpen         = false;
  confirmMessage        = '';
  pendingDeactivateId: number | null = null;
  editingUserId: number | null       = null;
  modalTitle   = '';
  submitLabel  = '';

  pagination = {
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageSizeOptions: [5, 10, 25, 50]
  };

  currentFilters: any = {};

  searchGrid: GridSection[] = [
    { key: 'filters', label: 'Filter Users', colSpan: 12, order: 1 }
  ];

  gridConfig: GridSection[] = [
    { key: 'basics', label: this.t.SEC_BASIC[this.lang()],  colSpan: 8, order: 1 },
    { key: 'avatar', label: this.t.SEC_AVATAR[this.lang()], colSpan: 4, order: 2 }
  ];

  getFormFields(isUpdate: boolean): BaseFormField<any>[] {
    const fields: BaseFormField<any>[] = [
      new TextField({
        key: 'userName',
        label: this.t.LABEL_USERNAME[this.lang()],
        required: true,
        validators: [Validators.required],
        colSpan: 6, gridKey: 'basics', order: 1
      }),
      new TextField({
        key: 'email',
        label: this.t.LABEL_EMAIL[this.lang()],
        type: 'email',
        required: true,
        validators: [Validators.required, Validators.email],
        colSpan: 6, gridKey: 'basics', order: 2
      })
    ];

    if (!isUpdate) {
      fields.push(
        new TextField({
          key: 'password',
          label: this.t.LABEL_PASSWORD[this.lang()],
          type: 'password',
          required: true,
          validators: [Validators.required, Validators.minLength(6)],
          colSpan: 6, gridKey: 'basics', order: 3
        }),
        new TextField({
          key: 'confirmPassword',
          label: this.t.LABEL_CONFIRM_PASSWORD[this.lang()],
          type: 'password',
          required: true,
          validators: [Validators.required],
          colSpan: 6, gridKey: 'basics', order: 4
        })
      );
    }

    fields.push(
      new TextField({ key: 'nickname',     label: this.t.LABEL_NICKNAME[this.lang()],     colSpan: 6,  gridKey: 'basics', order: 5 }),
      new TextField({ key: 'phoneNumber',  label: this.t.LABEL_PHONE[this.lang()],        colSpan: 6,  gridKey: 'basics', order: 6 }),
      new TextField({
        key: 'nationalId',
        label: this.t.LABEL_NATIONAL_ID[this.lang()],
        validators: [Validators.required, Validators.pattern('^[0-9]{14}$')],
        required: true,
        colSpan: 6, gridKey: 'basics', order: 7
      }),
      new TextField({ key: 'description',  label: this.t.LABEL_DESCRIPTION[this.lang()], type: 'textarea', colSpan: 12, gridKey: 'basics', order: 8 }),
      new UploadField({ key: 'imagePayload', label: this.t.LABEL_AVATAR[this.lang()],    colSpan: 12, gridKey: 'avatar', order: 1 })
    );

    return fields;
  }

  formFields: BaseFormField<any>[] = [];

  searchFields: BaseFormField<any>[] = [
    new TextField({
      key: 'searchTerm',
      label: 'Search',
      placeholder: 'Name or Email...',
      colSpan: 12, gridKey: 'filters', order: 1
    })
  ];

  columns: TableColumn[] = [
    { key: 'avatarUrl',    label: 'Avatar',    type: 'image' },
    { key: 'userName',     label: 'Username'                 },
    { key: 'email',        label: 'Email'                    },
    { key: 'phoneNumber',  label: 'Phone'                    },
    { key: 'status',       label: 'Status',    type: 'badge' }
  ];

  ngOnInit() {
    this.formFields = this.getFormFields(false);
    this.loadUsers();
  }

  loadUsers() {
    const params = {
      pageIndex: this.pagination.pageIndex,
      pageSize:  this.pagination.pageSize,
      ...this.currentFilters
    };

    this.userService.getPaged(params).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.users.set(res.data.items || []);
          this.pagination.totalCount = res.data.totalCount;
          // this.cdr.detectChanges();
        }
      },
      error: () => this.notification.error(this.t.LOAD_ERROR[this.lang()])
    });
  }

  handleSearch(filters: any) {
    this.currentFilters = { ...filters };
    this.pagination.pageIndex = 1;
    this.loadUsers();
  }

  handleReset() {
    this.currentFilters = {};
    this.pagination.pageIndex = 1;
    this.loadUsers();
  }

  onPageChange(event: any) {
    this.pagination.pageIndex = event.pageIndex;
    this.pagination.pageSize  = event.pageSize;
    this.loadUsers();
  }

  onCreate() {
    this.editingUserId = null;
    this.formFields    = this.getFormFields(false);
    this.modalTitle    = this.t.MODAL_CREATE_TITLE[this.lang()];
    this.submitLabel   = this.t.BTN_CREATE[this.lang()];
    this.isModalOpen   = true;
  }

  onEdit(user: UserListItem) {
    this.editingUserId = user.id;
    this.formFields    = this.getFormFields(true);
    this.modalTitle    = `${this.t.MODAL_EDIT_TITLE[this.lang()]}: ${user.userName}`;
    this.submitLabel   = this.t.BTN_UPDATE[this.lang()];
    this.isModalOpen   = true;

    setTimeout(() => {
      const form = this.formModal()?.modalForm()?.form;
      if (form) {
        form.patchValue({
          userName:    user.userName,
          email:       user.email,
          nickname:    user.nickname,
          phoneNumber: user.phoneNumber,
          nationalId:  user.nationalId,
          description: user.description
        });

        if (user.avatarUrl) {
          form.get('imagePayload')?.patchValue({ url: user.avatarUrl });
        }
      }
    });
  }

  onDeactivate(user: UserListItem) {
    this.pendingDeactivateId = user.id;
    this.confirmMessage      = `${this.t.CONFIRM_DEACTIVATE_MSG[this.lang()]} "${user.userName}"?`;
    this.isConfirmOpen       = true;
  }

  onDeactivateConfirmed() {
    if (this.pendingDeactivateId === null) return;
    this.isConfirmOpen = false;
    this.userService.deactivate(this.pendingDeactivateId).subscribe({
      next: () => {
        this.notification.success(this.t.SUCCESS_DEACTIVATE[this.lang()]);
        this.pendingDeactivateId = null;
        this.loadUsers();
      },
      error: () => {
        this.notification.error(this.t.DEACTIVATE_ERROR[this.lang()]);
        this.pendingDeactivateId = null;
      }
    });
  }

  onModalSubmit(data: any) {
    if (this.editingUserId) {
      this.userService.update(this.editingUserId, data).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.notification.success(this.t.SUCCESS_UPDATE[this.lang()]);
            this.isModalOpen = false;
            this.loadUsers();
          } else {
            this.notification.error(res.message);
          }
        },
        error: () => this.notification.error(this.t.UPDATE_ERROR[this.lang()])
      });
    } else {
      this.userService.create(data).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.notification.success(this.t.SUCCESS_CREATE[this.lang()]);
            this.isModalOpen = false;
            this.loadUsers();
          } else {
            this.notification.error(res.message);
          }
        },
        error: () => this.notification.error(this.t.CREATE_ERROR[this.lang()])
      });
    }
  }

  handleExport(type: string, filterValues?: any) {
    this.userService.getAll().subscribe(res => {
      if (res.isSuccess) {
        const options = {
          fileName: 'users_report',
          title:    'Users Management Report',
          data:     res.data,
          columns:  this.columns.filter(c => c.key !== 'avatarUrl'),
          filters:  []
        };
        switch (type) {
          case 'excel': this.exportService.exportToExcel(options); break;
          case 'pdf':   this.exportService.exportToPdf(options);   break;
          case 'word':  this.exportService.exportToWord(options);  break;
        }
      }
    });
  }
}
