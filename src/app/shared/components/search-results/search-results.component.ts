import { Component, Input, Output, EventEmitter, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TablePagination, PageChangeEvent, ActionTypes } from '../../models/common.model';
import { AuthService } from '../../../core/serivces/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  private authService = inject(AuthService);
  protected readonly Math = Math;
  resourceUrl: string = environment.resourceApiUrl;
  data = input<any[]>([]);
  columns = input<TableColumn[]>([]);
  moduleName = input<string>('');
  isPaged = input<boolean>(false);
  pagination = input<TablePagination>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageSizeOptions: [5, 10, 25, 50]
  });

  @Input() showEdit: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() customActions: { icon: string; label: string; cssClass?: string; emitKey: string }[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() customAction = new EventEmitter<{ action: string; item: any }>();
  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  readonly ActionTypes = ActionTypes;

  get canEdit(): boolean {
    return this.showEdit && this.authService.checkPermission(ActionTypes.Update, this.moduleName());
  }

  get canDelete(): boolean {
    return this.showDelete && this.authService.checkPermission(ActionTypes.Delete, this.moduleName());
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }

  onCustomAction(emitKey: string, item: any) {
    this.customAction.emit({ action: emitKey, item });
  }

  onPageChange(newPageIndex: number) {
    if (newPageIndex < 1 || newPageIndex > this.totalPages) return;
    this.pageChange.emit({
      pageIndex: newPageIndex,
      pageSize: this.pagination().pageSize
    });
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pageChange.emit({
      pageIndex: 1,
      pageSize: newSize
    });
  }

  get totalPages(): number {
    return Math.ceil(this.pagination().totalCount / this.pagination().pageSize);
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.pagination().pageIndex;
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;

    if (total <= maxPagesToShow) {
      startPage = 1;
      endPage = total;
    } else {
      const pagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
      const pagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;
      if (current <= pagesBeforeCurrent) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (current + pagesAfterCurrent >= total) {
        startPage = total - maxPagesToShow + 1;
        endPage = total;
      } else {
        startPage = current - pagesBeforeCurrent;
        endPage = current + pagesAfterCurrent;
      }
    }

    return Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
  }
}
