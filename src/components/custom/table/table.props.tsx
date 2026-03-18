export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface Props<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: keyof T) => void;
  renderActions?: (row: T, index?: number) => React.ReactNode;
  page?: number;
  totalPages?: number;
  isDisplayPagination?: boolean;
  setPage?: (page: number) => void;
}
