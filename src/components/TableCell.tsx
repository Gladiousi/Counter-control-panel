import type { TableCellProps } from '../types/components';

export const TableCell = ({
  children,
  className = '',
  title,
}: TableCellProps) => {
  return (
    <td
      className={`p-3.5 text-black align-middle ${className}`}
      title={title}
    >
      {children}
    </td>
  );
};
