import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, and window around current
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '1.5rem',
      }}
    >
      <button
        className="btn btn-secondary btn-sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '0.4rem 0.6rem' }}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
        <span>Prev</span>
      </button>

      {pages.map((p, index) =>
        p === '...' ? (
          <span
            key={`ellipsis-${index}`}
            style={{ color: 'var(--text-dim)', padding: '0 0.4rem' }}
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`btn btn-sm ${
              p === currentPage ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => onPageChange(p)}
            style={{ minWidth: '34px', height: '34px', padding: 0 }}
          >
            {p}
          </button>
        )
      )}

      <button
        className="btn btn-secondary btn-sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '0.4rem 0.6rem' }}
        aria-label="Next Page"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
