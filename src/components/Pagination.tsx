"use client";

import { useDispatch } from "react-redux";
import { setPage } from "@/redux/Slices/movieSlice";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const dispatch = useDispatch();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setPage(page));
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
    }
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5; // Number of page buttons to show
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if end is at totalPages to show maxVisiblePages
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages: (number | string)[] = [];

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // Add page numbers in range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      className="flex justify-center items-center space-x-1 mt-6"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded font-medium transition cursor-pointer ${
          currentPage === 1
            ? "bg-gray-800 text-gray-400 cursor-not-allowed"
            : "bg-gray-700 text-gray-200 hover:bg-blue-500 hover:text-gray-100"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
        aria-label="Previous page"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        typeof page === "string" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-gray-400"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded font-medium transition cursor-pointer ${
              currentPage === page
                ? "bg-blue-600 text-gray-100"
                : "bg-gray-700 text-gray-200 hover:bg-blue-500 hover:text-gray-100"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
            aria-current={currentPage === page ? "page" : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded font-medium transition cursor-pointer ${
          currentPage === totalPages
            ? "bg-gray-800 text-gray-400 cursor-not-allowed"
            : "bg-gray-700 text-gray-200 hover:bg-blue-500 hover:text-gray-100"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
