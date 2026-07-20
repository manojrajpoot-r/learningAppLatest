import { Component, input, output } from '@angular/core';
import { User } from '../../../core/models/user/user.model';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
export interface TableColumn<T> {
  field: keyof T;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;

  type?:
  | 'text'
  | 'tag'
  | 'image'
  | 'avatar'
  | 'date'
  | 'currency'
  | 'boolean'
  | 'custom';

  format?: (row: T) => any;
  class?: string | ((row: T) => string);
  tag?: {
    activeText: string;
    inactiveText: string;
    activeClass: string;
    inactiveClass: string;
  };
}
export interface TableAction<T> {
  action: string;
  icon?: string | ((row: T) => string);
  label?: string | ((row: T) => string);

  severity?:
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | ((row: T) =>
    'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger');

  tooltip?: string | ((row: T) => string);
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [Pagination, MatCard, MatFormFieldModule, MatIcon],
  templateUrl: './table.html',
  styleUrl: './table.css'
})

export class Table {
  title = input('');
  showSearch = input(true);
  showExport = input(true);
  showAdd = input(true);
  showSerialNumber = input(true);
  addButtonText = input('Add New');
  searchPlaceholder = input('Search...');

  totalLabel = input('Total');
  showTotal = input(true);
  showFilter = input(false);
  filterClick = output<void>();



  data = input.required<any[]>();
  columns = input.required<TableColumn<any>[]>();
  actions = input.required<TableAction<any>[]>();
  loading = input(false);
  pageNumber = input.required<number>();
  pageSize = input.required<number>();
  totalRecords = input.required<number>();
  pageChange = output<number>();
  search = output<string>();

  addClick = output<void>();
  exportClick = output<void>();

  actionClick = output<{
    action: string;
    row: User
  }>();

  selectionChange = output<any[]>();


  sortField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  sortChange = output<{
    field: string;
    order: 'asc' | 'desc';
  }>();

  getSerialNumber(index: number): number {
    return ((this.pageNumber() - 1) * this.pageSize()) + index + 1;
  }
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  getButtonClass(severity?: string) {
    switch (severity) {
      case 'primary':
        return 'btn-primary';
      case 'success':
        return 'btn-success';
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-info';
      default:
        return 'btn-secondary';
    }
  }

  handleAction(action: string, row: any) {
    this.actionClick.emit({
      action,
      row
    });
  }

  getLabel(action: TableAction<any>, row: any): string {
    return typeof action.label === 'function'
      ? action.label(row)
      : (action.label ?? '');
  }

  getSeverity(action: TableAction<any>, row: any) {
    return typeof action.severity === 'function'
      ? action.severity(row)
      : action.severity;
  }

  getIcon(action: TableAction<any>, row: any): string {
    return typeof action.icon === 'function'
      ? action.icon(row)
      : (action.icon ?? '');
  }

  getTooltip(action: TableAction<any>, row: any): string {
    return typeof action.tooltip === 'function'
      ? action.tooltip(row)
      : (action.tooltip ?? '');
  }




  sort(column: TableColumn<any>) {
    if (!column.sortable) return;
    if (this.sortField === column.field) {

      this.sortOrder =
        this.sortOrder === 'asc'
          ? 'desc'
          : 'asc';

    } else {

      this.sortField = column.field as string;
      this.sortOrder = 'asc';

    }

    this.sortChange.emit({
      field: this.sortField,
      order: this.sortOrder

    });

  }

}
