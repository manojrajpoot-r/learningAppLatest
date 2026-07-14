import { Component, output, input, computed } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  pageNumber = input.required<number>();
  pageSize = input.required<number>();
  totalRecords = input.required<number>();
  pageChanged = output<number>();
  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()))


  pages = computed(() => Array.from(
    { length: this.totalPages() },
    (_, i) => i + 1
  ))



  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.pageChanged.emit(page);
  }
}
