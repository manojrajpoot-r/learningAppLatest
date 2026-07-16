import { Component, input, output } from '@angular/core';
import { User } from '../../../core/models/user/user.model';
import { Pagination } from '../../../shared/components/pagination/pagination';

export interface TableColumn<T> {
  field: keyof T;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  type?: 'text' | 'tag' | 'image' | 'date' | 'currency';
  hidden?: boolean;

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
  imports: [Pagination],
  templateUrl: './table.html',
  styleUrl: './table.css'
})

export class Table {
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
