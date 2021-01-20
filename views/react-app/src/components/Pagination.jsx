function Pagination({ changePage, pageResultsCount })
{
  const handleNext = () => changePage('Next');
  const handlePrevious = () => changePage('Previous');

  return (
    <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing
      <span className="font-medium"> {pageResultsCount.start} </span>
      to
      <span className="font-medium"> {pageResultsCount.end} </span>
      of
      <span className="font-medium"> {pageResultsCount.total} </span>
      results
    </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end">
        <button onClick={handlePrevious} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Previous
    </button>
        <button onClick={handleNext} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Next
    </button>
      </div>
    </nav>
  )
}

export default Pagination;
