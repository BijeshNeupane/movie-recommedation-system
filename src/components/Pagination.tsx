"use client";

import { useDispatch } from "react-redux";
import { setPage } from "@/redux/Slices/movieSlice";
import { useState, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const dispatch = useDispatch();
  const [maxVisiblePages, setMaxVisiblePages] = useState(5); // Default for SSR

  // Update maxVisiblePages based on window width (client-side only)
  useEffect(() => {
    const updateMaxVisiblePages = () => {
      setMaxVisiblePages(window.innerWidth < 640 ? 3 : 5);
    };

    updateMaxVisiblePages(); // Initial check
    window.addEventListener("resize", updateMaxVisiblePages);
    return () => window.removeEventListener("resize", updateMaxVisiblePages);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setPage(page));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

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
      className="flex justify-center items-center space-x-0.5 sm:space-x-1 mt-6 flex-wrap gap-y-2"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 sm:px-3 sm:py-2 rounded font-medium transition cursor-pointer text-sm sm:text-base ${
          currentPage === 1
            ? "bg-gray-800 text-gray-400 cursor-not-allowed"
            : "bg-gray-700 text-gray-200 hover:bg-blue-500 hover:text-gray-100"
        } `}
        aria-label="Previous page"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        typeof page === "string" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 sm:px-3 py-1 sm:py-2 text-gray-400 text-sm sm:text-base hidden sm:inline"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded font-medium transition cursor-pointer text-sm sm:text-base ${
              currentPage === page
                ? "bg-blue-600 text-gray-100"
                : "bg-gray-700 text-gray-200 hover:bg-blue-500 hover:text-gray-100"
            }`}
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
        className={`px-2 py-1 sm:px-3 sm:py-2 rounded font-medium transition cursor-pointer text-sm sm:text-base ${
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
