import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const Test = () => {
    const [searchTerms, setSearchTerms] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const handleSearch = async (terms) => {
        try {
            const trimmedTerm = terms.trim();
            if (!trimmedTerm) {
                setSearchResults([]);
                return;
            }

            const response = await axios.post('http://localhost:5000/search', {
                search_terms: trimmedTerm,
            });

            setSearchResults(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const debouncedSearch = debounce(handleSearch, 300);

    const handleInputChange = (e) => {
        const newTerms = e.target.value;
        setSearchTerms(newTerms);
        debouncedSearch(newTerms);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission reload
        handleSearch(searchTerms); // Use current search terms
    };

    return (
        <div>
            {/* Updated form submission handler */}
            <form onSubmit={handleSubmit} className="flex mb-4 px-3">
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerms}
                    onChange={handleInputChange}
                    placeholder="Enter search terms"
                    className="flex-grow p-2 border rounded-l w-1/2 mr-1"
                />
            </form>

            <div className="flex">
                <ul>
                    {searchResults.map((result, index) => (
                        <li key={index}>
                            <p>
                                {result.coordinator
                                    ? result.coordinator['Project Topic']
                                    : result['Project Topic']
                                }
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Test;