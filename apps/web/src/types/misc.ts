export interface FilterParams {
  [key: string]: string | number;
}

export interface SearchParams extends FilterParams {
  searchText: string;
  sortBy: string;
}

export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
}

export interface PaginationApiParams {
  limit?: number;
  offset?: number;
}

export interface ListResponse<Data> {
  data: Data[];
  total: number;
}
