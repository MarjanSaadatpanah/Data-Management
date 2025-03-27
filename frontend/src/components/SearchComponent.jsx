import React, { useState, useMemo } from 'react';
import axios from 'axios';

const SearchComponent = () => {
    const [searchTerms, setSearchTerms] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [columns, setColumns] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });

    const handleSearch = async () => {
        try {
            // Split search terms and trim whitespace
            const terms = searchTerms.split(/\s+/).filter(term => term.trim() !== '');

            if (terms.length === 0) {
                setError('Please enter at least one search term');
                return;
            }

            const response = await axios.post('http://localhost:5000/search', {
                search_terms: terms
            });

            setSearchResults(response.data.data);
            setColumns(response.data.columns);
            setError('');
            // Reset pagination and sort when new search is performed
            setCurrentPage(1);
            setSortConfig({ key: null, direction: 'ascending' });
        } catch (err) {
            setError('Failed to fetch search results');
            console.error(err);
        }
    };

    const handleSort = (columnKey) => {
        let direction = 'ascending';

        // If the same column is clicked again, toggle direction
        if (sortConfig.key === columnKey) {
            direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        }

        // Create a copy of results and sort
        const sortedResults = [...searchResults].sort((a, b) => {
            // Handle potential undefined or null values
            const valueA = a[columnKey] ?? '';
            const valueB = b[columnKey] ?? '';

            // Compare values based on direction
            if (direction === 'ascending') {
                return valueA.toString().localeCompare(valueB.toString());
            } else {
                return valueB.toString().localeCompare(valueA.toString());
            }
        });

        setSearchResults(sortedResults);
        setSortConfig({ key: columnKey, direction });
        // Reset to first page after sorting
        setCurrentPage(1);
    };

    // Pagination logic
    const paginatedResults = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * resultsPerPage;
        const lastPageIndex = firstPageIndex + resultsPerPage;
        return searchResults.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, searchResults, resultsPerPage]);

    // Calculate total pages
    const totalPages = Math.ceil(searchResults.length / resultsPerPage);

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Project Search</h1>

            <div className="flex mb-4">
                <input
                    type="text"
                    value={searchTerms}
                    onChange={(e) => setSearchTerms(e.target.value)}
                    placeholder="Enter search terms (space-separated)"
                    className="flex-grow p-2 border rounded-l"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded-r"
                >
                    Search
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    {error}
                </div>
            )}

            {searchResults.length > 0 && (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-200">
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            className="border p-2 cursor-pointer hover:bg-gray-300"
                                            onClick={() => handleSort(column)}
                                        >
                                            {column}
                                            {sortConfig.key === column && (
                                                <span className="ml-2">
                                                    {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedResults.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-100">
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex} className="border p-2">
                                                {row[column] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        {/* Results per page selector */}
                        <div className="flex items-center">
                            <span className="mr-2">Show</span>
                            <select
                                value={resultsPerPage}
                                onChange={(e) => {
                                    setResultsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="border p-1"
                            >
                                {[10, 25, 50, 100].map(number => (
                                    <option key={number} value={number}>
                                        {number}
                                    </option>
                                ))}
                            </select>
                            <span className="ml-2">entries</span>
                        </div>

                        {/* Pagination Navigation */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>

                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`px-3 py-1 border rounded ${currentPage === number
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-blue-500'
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>

                        {/* Page Info */}
                        <div>
                            Showing {((currentPage - 1) * resultsPerPage) + 1} to{' '}
                            {Math.min(currentPage * resultsPerPage, searchResults.length)} of{' '}
                            {searchResults.length} entries
                        </div>
                    </div>
                </>
            )}

            {searchResults.length === 0 && searchTerms && !error && (
                <p className="text-gray-500">No matching rows found.</p>
            )}
        </div>
    );
};

export default SearchComponent;