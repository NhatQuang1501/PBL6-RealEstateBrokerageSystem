import PropTypes from 'prop-types';
import React, { useEffect } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const sidePages = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - sidePages);
      let endPage = Math.min(totalPages, currentPage + sidePages);

      if (startPage > 1) {
        pageNumbers.push(1, "...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        pageNumbers.push("...", totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const updatePage = (page) => {
    // Lưu `currentPage` vào `localStorage`
    localStorage.setItem("currentPage", page);
    onPageChange(page);

    // Reload trang
    window.location.reload();
  };

  return (
    <div className="flex justify-between items-center mt-2 bg-gray-200 p-2 rounded-lg w-full border-2 border-black">
      <button
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-l-lg font-bold"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        style={{ minWidth: "100px", textAlign: "center" }}
      >
        &lt; Trang trước
      </button>

      <div className="flex-1 flex justify-center mx-4 space-x-10">
        {generatePageNumbers().map((page, index) => (
          <button
            key={index}
            className={`w-12 h-10 flex items-center justify-center rounded-full ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-800"
            } ${page === "..." ? "cursor-default" : ""}`}
            onClick={() => page !== "..." && updatePage(page)}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-r-lg font-bold"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        style={{ minWidth: "100px", textAlign: "center" }}
      >
        Trang sau &gt;
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
};

export default Pagination;