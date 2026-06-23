import type { TableHeaderCellProps } from '../types/components';

export const TableHeaderCell = ({
  children,
}: TableHeaderCellProps) => {
  return (
    <th
      className="sticky top-0 bg-slate-100 py-2 pl-3 z-10 text-xs font-medium text-[#697180] tracking-wider"
    >
      {children}
    </th>
  );
};
