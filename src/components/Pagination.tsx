import React from 'react';
import { PaginationInfo } from '../types/pokemon';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  loading = false
}) => {
  const { currentPage, totalPages } = pagination;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        aria-label="Página anterior"
      >
        ‹
      </button>

      {getVisiblePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="pagination-dots">...</span>
          ) : (
            <button
              className={`pagination-button ${
                page === currentPage ? 'active' : ''
              }`}
              onClick={() => onPageChange(page as number)}
              disabled={loading}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        aria-label="Página siguiente"
      >
        ›
      </button>
    </div>
  );
};
