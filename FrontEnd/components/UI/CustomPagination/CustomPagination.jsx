import React from 'react';
import styles from './CustomPagination.module.scss';

const CustomPagination = ({ 
  count, 
  page, 
  onChange, 
  showFirstButton = true, 
  showLastButton = true 
}) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= count && newPage !== page) {
      onChange(null, newPage);
    }
  };

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(count - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < count - 1) {
      rangeWithDots.push('...', count);
    } else {
      rangeWithDots.push(count);
    }

    return rangeWithDots;
  };

  if (count <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.pagination}>
      {/* First Button */}
      {showFirstButton && (
        <button
          className={`${styles.pageButton} ${styles.firstButton}`}
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
          aria-label="Go to first page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m11 17-5-5 5-5"/>
            <path d="m18 17-5-5 5-5"/>
          </svg>
        </button>
      )}

      {/* Previous Button */}
      <button
        className={`${styles.pageButton} ${styles.prevButton}`}
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        aria-label="Go to previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Page Numbers */}
      {visiblePages.map((pageNumber, index) => (
        <React.Fragment key={index}>
          {pageNumber === '...' ? (
            <span className={styles.ellipsis}>...</span>
          ) : (
            <button
              className={`${styles.pageButton} ${styles.numberButton} ${
                page === pageNumber ? styles.active : ''
              }`}
              onClick={() => handlePageChange(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={page === pageNumber ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <button
        className={`${styles.pageButton} ${styles.nextButton}`}
        onClick={() => handlePageChange(page + 1)}
        disabled={page === count}
        aria-label="Go to next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>

      {/* Last Button */}
      {showLastButton && (
        <button
          className={`${styles.pageButton} ${styles.lastButton}`}
          onClick={() => handlePageChange(count)}
          disabled={page === count}
          aria-label="Go to last page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 17 5-5-5-5"/>
            <path d="m13 17 5-5-5-5"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default CustomPagination;
