export default function TrunkNav({ currentPage, setCurrentPage, maxPages }) {
  return (
    <div className="trunk-nav">
      <button
        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
        disabled={currentPage === 0}
      >
        ◀ Prev
      </button>
      <span> Page {currentPage + 1} / {maxPages} </span>
      <button
        onClick={() => setCurrentPage(prev => Math.min(maxPages - 1, prev + 1))}
        disabled={currentPage + 1 >= maxPages}
      >
        Next ▶
      </button>
    </div>
  );
}
