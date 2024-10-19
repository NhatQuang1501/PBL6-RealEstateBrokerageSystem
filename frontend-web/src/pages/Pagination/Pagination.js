const Pagination = ({ accountsPerPage, totalAccounts, paginate }) => {
   
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalAccounts / accountsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav className="flex justify-center mt-6">
        <ul className="inline-flex items-center -space-x-px">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className="px-3 py-2 ml-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-blue-500 hover:text-white"
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  export default Pagination;