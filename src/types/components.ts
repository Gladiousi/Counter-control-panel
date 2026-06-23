export type TableHeaderCellProps = {
  children: React.ReactNode;
};

export type TableCellProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}