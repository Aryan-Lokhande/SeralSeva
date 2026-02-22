import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className="
      flex items-center justify-between
      px-4 py-3
      bg-[var(--bg-sec)]
      border-t border-[var(--bg-ter)]
    "
    >
      {/* Info */}
      <div className="text-sm text-[var(--txt-dim)]">
        Showing{" "}
        <span className="font-medium text-[var(--txt)]">{startItem}</span> to{" "}
        <span className="font-medium text-[var(--txt)]">{endItem}</span> of{" "}
        <span className="font-medium text-[var(--txt)]">{totalItems}</span>{" "}
        results
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="
          p-2 rounded-[var(--radius)] border border-[var(--bg-ter)]
          bg-[var(--bg-primary)] hover:bg-[var(--bg-ter)]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4 text-[var(--txt-dim)]" />
        </button>

        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
          p-2 rounded-[var(--radius)] border border-[var(--bg-ter)]
          bg-[var(--bg-primary)] hover:bg-[var(--bg-ter)]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-[var(--txt-dim)]" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`
            px-4 py-2
            rounded-[var(--radius)]
            border
            transition-all duration-200
            ${
              page === currentPage
                ? ` bg-[var(--btn)] 
                  text-white border-[var(--btn)] 
                  shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.45)]`
                : page === "..."
                  ? ` border-transparent text-[var(--txt-dim)] cursor-default `
                  : `border-[var(--bg-ter)] bg-[var(--bg-primary)]
                  hover:bg-[var(--bg-ter)] text-[var(--txt)]`
            }
          `}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
          p-2 rounded-[var(--radius)] border border-[var(--bg-ter)]
          bg-[var(--bg-primary)] hover:bg-[var(--bg-ter)]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4 text-[var(--txt-dim)]" />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="
          p-2 rounded-[var(--radius)] border border-[var(--bg-ter)]
          bg-[var(--bg-primary)] hover:bg-[var(--bg-ter)]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4 text-[var(--txt-dim)]" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
