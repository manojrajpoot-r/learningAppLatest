import { Component, input, output ,inject, signal} from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTooltip } from '@angular/material/tooltip';
import { ConfirmService } from '../../services/confirm/confirm.service';

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
  tooltip?: string | ((row: T) => string);
  confirmTitle?: string;
  confirmMessage?: string;
  
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

  color?: string | ((row: T) => string);
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  loading?: (row: T) => boolean;
  confirm?: {
      title?: string;
      message?: string;
      icon?: string;
      confirmText?: string;
      cancelText?: string;
  }
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
  private confirm = inject(ConfirmService);
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
  loading=signal(false);
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

size?: 'sm' | 'md' | 'lg';
rounded?: boolean;



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

handleAction(action: TableAction<any>, row: any) {

  if (action.confirm) {

    this.confirm.open({

      title: action.confirmTitle ?? 'Confirmation',

      message: action.confirmMessage ?? 'Are you sure you want to continue?',

      onConfirm: () => {

        this.actionClick.emit({
          action: action.action,
          row
        });

      }

    });

    return;
  }

  this.actionClick.emit({
    action: action.action,
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

  if (typeof action.tooltip === 'function') {
    return action.tooltip(row);
  }

  if (action.tooltip) {
    return action.tooltip;
  }

  return action.label
      ? this.getLabel(action, row)
      : action.action;

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

  getColor(action: TableAction<any>, row: any) {
  return typeof action.color === 'function'
      ? action.color(row)
      : action.color;

}

getSize(action: TableAction<any>) {
  switch(action.size){
    case 'sm':
      return 'btn-sm';
    case 'lg':
      return 'btn-lg';
    default:
      return '';

  }

}

isLoading(action: TableAction<any>, row:any){
  return action.loading
      ? action.loading(row)
      : false;

}

isDisabled(action: TableAction<any>, row:any){
  return action.disabled
      ? action.disabled(row)
      : false;

}

}
