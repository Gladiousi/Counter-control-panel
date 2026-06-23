import type { TableCellProps } from '../types/components';

export const TableCell = ({ children, className = '' }: TableCellProps) => {
  return (
    <td
      className={`px-3.5 py-1.5 text-[14px] tracking-normal align-middle ${className}`}
    >
      {children}
    </td>
  );
};
