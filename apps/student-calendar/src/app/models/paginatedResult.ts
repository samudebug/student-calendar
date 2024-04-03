export interface PaginatedResult<T> {
  total: number;
  page: number;
  results: Array<T>

}
