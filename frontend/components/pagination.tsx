import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-gray-500">
        Mostrando{" "}
        <span className="font-medium text-pitch-black">{startItem}</span>–
        <span className="font-medium text-pitch-black">{endItem}</span> de{" "}
        <span className="font-medium text-pitch-black">{totalItems}</span>{" "}
        veículos
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 px-3 text-sm font-medium text-pitch-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </Button>

        {getVisiblePages().map((page) => (
          <Button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition ${
              currentPage === page
                ? "border-dark-emerald bg-dark-emerald text-white"
                : "border-gray-200 text-pitch-black hover:bg-gray-50"
            }`}
          >
            {page}
          </Button>
        ))}

        <Button
          type="button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 px-3 text-sm font-medium text-pitch-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
