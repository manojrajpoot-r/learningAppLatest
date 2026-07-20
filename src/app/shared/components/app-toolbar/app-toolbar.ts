
  import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-app-toolbar',
  imports: [],
  templateUrl: './app-toolbar.html',
  styleUrl: './app-toolbar.css',
})
export class AppToolbar {

  // Search
  searchPlaceholder = input('Search...');
  showSearch = input(true);

  // Buttons
  showAdd = input(true);
  showExport = input(true);
  showFilter = input(false);
  showRefresh = input(false);

  addText = input('Add New');
  exportText = input('Export');

  // Events
  search = output<string>();
  add = output<void>();
  export = output<void>();
  filter = output<void>();
  refresh = output<void>();

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
