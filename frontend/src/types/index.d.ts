
export interface TableColumn<T> {
  key: string;
  title: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
  width?: string;
}
export interface CustomTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}
