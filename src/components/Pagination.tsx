import type { PaginationProps } from '../types/components';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 2) {
      pages.push(1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages);
    } else if (currentPage >= totalPages - 1) {
      pages.push(1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      );
    }
  }

  return (
    <div className="flex justify-end px-4 py-2 border-t border-[#EEF0F4] text-sm text-black bg-white rounded-b-xl gap-2 select-none">
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <div
              key={`dots-${index}`}
              className="size-8 flex items-center justify-center select-none border rounded-md border-[#CED5DE] "
            >
              ...
            </div>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            disabled={disabled}
            className={`size-8 flex items-center justify-center rounded-md border border-[#CED5DE] transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed ${
              isActive ? 'bg-[#f2f5f8]' : 'bg-white hover:bg-[#f7f8f9]'
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};
