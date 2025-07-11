import './Pagination.css';

function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, hasNext, hasPrev, totalCount } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        {totalCount}件中 {(page - 1) * pagination.limit + 1}-
        {Math.min(page * pagination.limit, totalCount)}件を表示
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => handlePageClick(page - 1)}
          disabled={!hasPrev}
          className="pagination-button"
        >
          前へ
        </button>

        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => handlePageClick(pageNum)}
            className={`pagination-button ${page === pageNum ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => handlePageClick(page + 1)}
          disabled={!hasNext}
          className="pagination-button"
        >
          次へ
        </button>
      </div>
    </div>
  );
}

export default Pagination;
