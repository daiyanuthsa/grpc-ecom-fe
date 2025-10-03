import React from "react";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}) {
  const limitOptions = [2, 5, 10, 25, 50];

  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= totalPages - 1)
      return [totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pageChangeHandler = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange(newPage);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(event.target.value);
    onLimitChange(newLimit);
  };

  // Jangan tampilkan pagination jika hanya ada satu halaman atau kurang


  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      {/* Dropdown untuk Limit */}
      <div className="me-3">
        <select
          className="form-select form-select-sm rounded border-1 border-success"
          value={limit}
          onChange={handleLimitChange}
          aria-label="Items per page"
          style={{ width: "auto" }}
        >
          {limitOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Navigasi Halaman */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination" style={{ margin: 0 }}>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                aria-label="Previous"
                onClick={() => pageChangeHandler(currentPage - 1)}
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>

            {getPageNumbers().map((number) => (
              <li
                key={number}
                className={`page-item ${
                  currentPage === number ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => pageChangeHandler(number)}
                >
                  {number}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                aria-label="Next"
                onClick={() => pageChangeHandler(currentPage + 1)}
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Pagination;
