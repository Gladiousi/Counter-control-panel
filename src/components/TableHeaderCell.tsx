import type { TableHeaderCellProps } from '../types/components';

export const TableHeaderCell = ({
  children,
}: TableHeaderCellProps) => {
  return (
    <th
      className="sticky top-0 bg-slate-100 py-2 px-3 z-10 text-[13px] font-medium text-[#697180]"
    >
      {children}
    </th>
  );
};
