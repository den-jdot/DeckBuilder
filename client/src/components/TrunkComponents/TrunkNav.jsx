export default function TrunkNav({ currentPage, setCurrentPage, maxPages }) {
  return (
    <div className="trunk-nav">
      <button
        onClick={() => setCurrentPage(0)}
        disabled={currentPage === 0}
      >
        ⏮
      </button>
      <button
        onClick={() => setCurrentPage(prev => Math.max(0, prev - 10))}
        disabled={currentPage <= 0}
      >
        «
      </button>
      <button
        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
        disabled={currentPage === 0}
      >
        ◀
      </button>

      <span> Page {currentPage + 1} / {maxPages} </span>

      <button
        onClick={() => setCurrentPage(prev => Math.min(maxPages - 1, prev + 1))}
        disabled={currentPage + 1 >= maxPages}
      >
        ▶
      </button>
      <button
        onClick={() => setCurrentPage(prev => Math.min(maxPages - 1, prev + 10))}
        disabled={currentPage + 1 >= maxPages}
      >
        »
      </button>
      <button
        onClick={() => setCurrentPage(maxPages - 1)}
        disabled={currentPage + 1 >= maxPages}
      >
        ⏭
      </button>
    </div>
  );
}
