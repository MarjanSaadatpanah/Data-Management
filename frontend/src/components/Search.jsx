import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
    const [searchTerms, setSearchTerms] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleSearch = async () => {
        try {
            const terms = searchTerms.split(/\s+/).filter(term => term.trim() !== '');

            const response = await axios.post('http://localhost:5000/search', {
                search_terms: terms
            });

            setSearchResults(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Custom extraction function for specific data presentation
    const extractProjectDetails = (project) => {


        return {
            title: project['Project Topic'] || 'Untitled Project',
            id: project['Project ID'] || 'N/A',
            organization: project['Organization'] || 'Unknown',
            country: project['Country'] || 'Unknown',
            CallForProposal: project['Call for Proposal'] || 'Unknown',

            dates: {
                start: project['Start Date'] || 'Not Specified',
                end: project['End Date'] || 'Not Specified'
            },
            financials: {
                totalCost: project['Total Cost'] || 'Not Available',
                netContribution: project['Net EU Contribution'] || 'Not Available'
            },
            contact: {
                name: project['Contact'] || 'No Contact',
                email: project['Email'] || 'No Email',
                phone: project['Phone'] || 'No Phone'
            },
            additionalInfo: {
                programme: project['Programme'] || 'Unspecified',
                topic: project['Topic'] || 'No Additional Topic'
            }
        };
    };

    const handleProjectSelect = (project) => {
        const extractedProject = extractProjectDetails(project);
        setSelectedProject(extractedProject);
    };

    return (
        <div className="container mx-auto p-4">
            {/* Search Input (Same as previous example) */}
            <div className="flex mb-4">
                <input
                    type="text"
                    value={searchTerms}
                    onChange={(e) => setSearchTerms(e.target.value)}
                    placeholder="Enter search terms"
                    className="flex-grow p-2 border rounded-l"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded-r"
                >
                    Search
                </button>
            </div>

            <div className="flex">
                {/* Search Results List */}
                <div className='w-1/3'>
                    <h2 className="text-xl font-bold mb-2">Search Results</h2>
                    {searchResults.map((result, index) => (
                        <div
                            key={index}
                            onClick={() => handleProjectSelect(result)}
                            className="cursor-pointer p-2 border hover:bg-gray-100 mb-2 p-9"
                        >
                            <h3 className="font-semibold">{result['Project Topic']}</h3>

                        </div>
                    ))}
                </div>

                {/* Detailed Project View with Structured Data */}

                {selectedProject && (
                    <div className='w-2/3 pl-7'>
                        <h2 className="text-xl font-bold mb-2 pl-4">Project Details</h2>
                        <div className=" p-4 rounded space-y-3">
                            <h3 className="text-lg font-bold">{selectedProject.title}</h3>
                            <div>
                                <p>Project ID: {selectedProject.id}</p>
                                <p>Start Date: {selectedProject.dates.start}</p>
                                <p>End Date: {selectedProject.dates.end}</p>
                                <p>Total Cost: {selectedProject.financials.totalCost}</p>
                            </div>

                            <div>
                                <p>Programme: {selectedProject.additionalInfo.programme}</p>
                                <p>Topic: {selectedProject.additionalInfo.topic}</p>
                                <p>Call for Proposal: {selectedProject.CallForProposal}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Coordinated by:</h4>
                                <p> {selectedProject.organization}</p>
                                <p>Country: {selectedProject.country}</p>
                                <p>Net EU Contribution: {selectedProject.financials.netContribution}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Participant(s):</h4>
                                <p> Participant 1</p>
                                <p>Country: </p>
                                <p>Net EU Contribution: </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Search;




