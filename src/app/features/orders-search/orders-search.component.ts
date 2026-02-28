import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPaneComponent } from '../../shared/components/search-pane/search-pane.component';
import { SearchResultsComponent } from '../../shared/components/search-results/search-results.component';
import { BaseFormField, TextField, DropdownField, DateField, GridSection, UploadField } from '../../shared/models/form.model';
import { TableColumn, Modules, ActionTypes } from '../../shared/models/common.model';
import { NotificationService } from '../../core/serivces/notification.service';
import { DynamicFormModalComponent } from '../../shared/components/dynamic-form-modal/dynamic-form-modal.component';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-orders-search',
    standalone: true,
    imports: [CommonModule, SearchPaneComponent, SearchResultsComponent, DynamicFormModalComponent],
    template: `
    <div class="container-fluid py-4">
      <app-dynamic-form-modal
        [isOpen]="isModalOpen"
        [fields]="modalFields"
        [gridSections]="modalGrid"
        title="Create New Order"
        submitLabel="Create System Order"
        (close)="isModalOpen = false"
        (submit)="processModalSubmit($event)">
      </app-dynamic-form-modal>

      <div class="row">
        <div class="col-12">
          <!-- Page Header -->
          <div class="mb-4">
            <h3 class="fw-bold mb-1">Orders Management</h3>
            <p class="text-muted">Manage system orders, exports, and customer interactions.</p>
          </div>

          <!-- Search Pane -->
          <app-search-pane 
            [fields]="searchFields" 
            [gridSections]="gridSections"
            [moduleName]="Modules.Orders"
            (search)="handleSearch($event)"
            (reset)="handleReset()"
            (create)="handleCreate()"
            (exportExcel)="handleExport('excel')"
            (downloadPdf)="handleExport('pdf')">
          </app-search-pane>

          <!-- Results Table -->
          <div class="search-results-container animate-fade-in shadow-sm rounded-4 overflow-hidden bg-surface">
            <app-search-results 
              [data]="filteredData" 
              [columns]="columns"
              [moduleName]="Modules.Orders"
              [isPaged]="true"
              (edit)="onEdit($event)"
              (delete)="onDelete($event)">
            </app-search-results>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrdersSearchComponent {
    private notification = inject(NotificationService);
    Modules = Modules;

    isModalOpen = false;
    modalGrid: GridSection[] = [
        { key: 'info', label: 'Order Basics', colSpan: 12, order: 1 }
    ];

    modalFields: BaseFormField<any>[] = [
        new TextField({ key: 'customerName', label: 'Customer Name', required: true, validators: [Validators.required], colSpan: 6, gridKey: 'info', order: 1 }),
        new TextField({ key: 'amount', label: 'Total Amount', type: 'number', required: true, validators: [Validators.required], colSpan: 6, gridKey: 'info', order: 2 }),
        new DropdownField({
            key: 'status', label: 'Status', colSpan: 6, gridKey: 'info', order: 3,
            options: [{ key: 'Pending', value: 'Pending' }, { key: 'Completed', value: 'Completed' }]
        }),
        new DateField({ key: 'orderDate', label: 'Order Date', colSpan: 6, gridKey: 'info', order: 4 }),
        new UploadField({ key: 'attachment', label: 'Invoice Attachment', colSpan: 12, gridKey: 'info', order: 5 })
    ];

    // Search Definitions
    gridSections: GridSection[] = [
        { key: 'main', label: 'Quick Filters', colSpan: 12, order: 1 }
    ];

    searchFields: BaseFormField<any>[] = [
        new TextField({ key: 'orderId', label: 'Order ID', placeholder: 'e.g. ORD-001', colSpan: 3, gridKey: 'main', order: 1 }),
        new TextField({ key: 'customer', label: 'Customer Name', placeholder: 'Search name...', colSpan: 3, gridKey: 'main', order: 2 }),
        new DropdownField({
            key: 'status',
            label: 'Status',
            colSpan: 3,
            gridKey: 'main',
            order: 3,
            options: [
                { key: 'Completed', value: 'Completed' },
                { key: 'Pending', value: 'Pending' },
                { key: 'Cancelled', value: 'Cancelled' }
            ]
        }),
        new DateField({ key: 'date', label: 'Date', colSpan: 3, gridKey: 'main', order: 4 })
    ];

    // Table Definitions
    columns: TableColumn[] = [
        { key: 'orderId', label: 'Order ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'status', label: 'Status', type: 'badge' },
        { key: 'date', label: 'Order Date', type: 'date' },
        { key: 'amount', label: 'Total Amount', type: 'currency' }
    ];

    staticData = [
        { id: 1, orderId: 'ORD-001', customer: 'John Doe', status: 'Completed', date: new Date(), amount: 450.00 },
        { id: 2, orderId: 'ORD-002', customer: 'Jane Smith', status: 'Pending', date: new Date(), amount: 120.50 },
        { id: 3, orderId: 'ORD-003', customer: 'Alice Wong', status: 'Completed', date: new Date(), amount: 99.00 },
        { id: 4, orderId: 'ORD-004', customer: 'Bob Miller', status: 'Cancelled', date: new Date(), amount: 300.25 },
        { id: 5, orderId: 'ORD-005', customer: 'Charlie Brown', status: 'Completed', date: new Date(), amount: 1500.00 }
    ];

    filteredData = [...this.staticData];

    handleSearch(filters: any) {
        this.notification.info('Applying filters...', 'Search Filter');
        this.filteredData = this.staticData.filter(item => {
            let matches = true;
            if (filters.orderId && !item.orderId.toLowerCase().includes(filters.orderId.toLowerCase())) matches = false;
            if (filters.customer && !item.customer.toLowerCase().includes(filters.customer.toLowerCase())) matches = false;
            if (filters.status && item.status !== filters.status) matches = false;
            return matches;
        });
    }

    handleReset() {
        this.filteredData = [...this.staticData];
        this.notification.info('Search filters cleared.', 'Reset');
    }

    handleCreate() {
        this.isModalOpen = true;
    }

    processModalSubmit(data: any) {
        this.isModalOpen = false;
        this.notification.success('New order created successfully!', 'System Updated');
        console.log('Modal Form Data:', data);
    }

    handleExport(type: 'excel' | 'pdf') {
        this.notification.warning(`Generating ${type.toUpperCase()} report...`, 'Exporting');
    }

    onEdit(item: any) {
        this.notification.info(`Editing order: ${item.orderId}`, 'Action: Edit');
    }

    onDelete(item: any) {
        this.notification.error(`Order ${item.orderId} marked for deletion.`, 'Action: Delete');
    }
}
