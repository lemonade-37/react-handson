function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, hasNext, hasPrev, totalCount, limit } = pagination;

  if (totalPages <= 1) {
    return null;
  }

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

  const pageNumbers = getPageNumbers();
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="pagination">
      <div className="pagination-info">
        {totalCount}件中 {startItem}-{endItem}件を表示
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="pagination-btn"
        >
          前へ
        </button>

        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="pagination-btn"
        >
          次へ
        </button>
      </div>
    </div>
  );
}

export default Pagination;
