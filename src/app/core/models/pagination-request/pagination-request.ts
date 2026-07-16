export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
