import React, { useState } from 'react';
import axios from 'axios';


const Test = () => {
    const [searchTerms, setSearchTerms] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);


    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent default form submission
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


    // Updated extraction function to handle the new data structure
    const extractProjectDetails = (project) => {
        // Check if this is the new format (with coordinator and participants)
        if (project.coordinator && project.participants) {
            const coordinator = project.coordinator;
            return {
                title: coordinator['Project Topic'] || 'Untitled Project',
                acronym: coordinator['Acronym'] || 'No Acronym',
                id: coordinator['Project ID'] || 'N/A',
                dates: {
                    start: coordinator['Start Date'] || 'Not Specified',
                    end: coordinator['End Date'] || 'Not Specified'
                },
                TotalNumberOfContributionInProject: coordinator['TotalNumberOfContributionInProject'] || 'Unknown',

                financials: {
                    totalCost: coordinator['Total Cost'] || 'Not Available',
                    netContribution: coordinator['Net EU Contribution'] || 'Not Available'
                },
                contact: {
                    name: coordinator['Contact'] || 'No Contact',
                    email: coordinator['Email'] || 'No Email',
                    phone: coordinator['Phone'] || 'No Phone'
                },
                additionalInfo: {
                    programme: coordinator['Programme'] || 'Unspecified',
                    topic: coordinator['Topic'] || 'No Additional Topic'
                },
                coordinator: {
                    organization: coordinator['Organization'] || 'Unknown',
                    country: coordinator['Country'] || 'Unknown',
                    role: coordinator['Organization Role'] || 'Coordinator',
                    netContribution: coordinator['Net EU Contribution'] || 'Not Available'
                },
                participants: project.participants.map(participant => ({
                    organization: participant['Organization'] || 'Unknown',
                    totalNumber: participant['TotalNumberOfContributionInProject'] || 'Unknown',
                    country: participant['Country'] || 'Unknown',
                    role: participant['Organization Role'] || 'Participant',
                    netContribution: participant['Net EU Contribution'] || 'Not Available'
                })),
                CallForProposal: coordinator['Call for Proposal'] || 'Unknown'
            };
        }

        // Fallback to old format if needed
        return {
            title: project['Project Topic'] || 'Untitled Project',
            acronym: project['Acronym'] || 'Untitled',
            id: project['Project ID'] || 'N/A',
            organization: project['Organization'] || 'Unknown',
            TotalNumberOfContributionInProject: project['TotalNumberOfContributionInProject'] || 'Unknown',

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
            },
            coordinator: {
                organization: project['Organization'] || 'Unknown',
                country: project['Country'] || 'Unknown',
                role: project['Organization Role'] || 'Unknown',
                netContribution: project['Net EU Contribution'] || 'Not Available'
            },
            participants: [] // Empty array for old format
        };
    };
    const handleProjectSelect = (project) => {
        const extractedProject = extractProjectDetails(project);
        setSelectedProject(extractedProject);
    };

    return (
        <div className="container mx-auto p-4">



            <form onSubmit={handleSearch} className="flex mb-4">
                <input
                    type="text"
                    value={searchTerms}
                    onChange={(e) => setSearchTerms(e.target.value)}
                    placeholder="Enter search terms"
                    className="flex-grow p-2 border rounded-l w-1/2"
                />
                <button
                    type="submit"  // Important: set type to submit
                    className="bg-blue-400 text-white p-2 rounded-r"
                >
                    Search
                </button>
            </form>


            <div className="flex">
                {/* Search Results List */}
                <div className='w-1/3'>
                    <h2 className="mb-2 text-lg">Search Results</h2>
                    {searchResults.map((result, index) => (
                        <div
                            key={index}
                            onClick={() => handleProjectSelect(result)}
                            className="cursor-pointer p-2 border hover:bg-gray-100 mb-2 p-9"
                        >
                            <h3 className="font-semibold">
                                {result.coordinator ? result.coordinator['Project Topic'] : result['Project Topic']}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {result.coordinator ? result.coordinator['Organization'] : result['Organization']}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Detailed Project View */}
                <div className='w-2/3 pl-7'>
                    <h2 className="mb-2 text-lg pl-4">Project Details</h2>
                    {selectedProject ? (
                        <div className=" px-4 rounded space-y-3">

                            <label className="inline-flex items-center bg-gray-100 justify-between text-gray-900 w-full p-5 border-2 border-gray-200 rounded-lg cursor-pointer">
                                <div class="block">
                                    <div className='flex'>
                                        <div class="w-full ml-4">
                                            <div>
                                                <span class="text-xl mb-2 border-b border-b-2">{selectedProject.title} </span>
                                                <h4 className="text-sm text-blue-700">{selectedProject.acronym}</h4>
                                            </div>

                                            <ul className="grid gap-1 grid-cols-2 mt-4">
                                                <li>
                                                    <label className="inline-flex items-center justify-between text-gray-900 w-full   rounded  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div className="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-base ">
                                                                        <p>Project ID: {selectedProject.id}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </li>

                                                <li>
                                                    <label class="inline-flex items-center justify-between text-gray-900 w-full   rounded  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div class="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-base ">
                                                                        <p>Start Date: {selectedProject.dates.start}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </li>
                                                <li>
                                                    <label class="inline-flex items-center justify-between text-gray-900 w-full   rounded  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div class="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-base ">
                                                                        <p>Total Cost: {selectedProject.financials.totalCost}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </li>
                                                <li>
                                                    <label class="inline-flex items-center justify-between text-gray-900 w-full   rounded  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div class="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-base ">
                                                                        <p>End Date: {selectedProject.dates.end}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </li>
                                            </ul>

                                            <div className='mt-1'>
                                                <label className="inline-flex  items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                    <div className="block">
                                                        <div className='flex'>
                                                            <div class="w-full">
                                                                <div class="text-base">
                                                                    <p>Programme:  {selectedProject.additionalInfo.programme}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                                <label class="inline-flex  items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                    <div class="block">
                                                        <div className='flex'>
                                                            <div class="w-full">
                                                                <div class="text-base">
                                                                    <p>Topic:  {selectedProject.additionalInfo.topic}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                                <label class="inline-flex  items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                    <div class="block">
                                                        <div className='flex'>
                                                            <div class="w-full">
                                                                <div class="text-base">
                                                                    <p>Call for Proposal:   {selectedProject.CallForProposal}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </label>

                            {/* Coordinated by: */}
                            <div className="pb-2 mb-3 ">
                                <h3 className="mb-2 text-lg">Coordinated by:</h3>
                                <label className="inline-flex items-center justify-between text-gray-900 w-full py-3 border-2 border-gray-200 cursor-pointer hover:bg-slate-300">
                                    <div className="block w-full">
                                        <div className='flex w-full'>
                                            <div class="w-3/6 ml-4">
                                                <div class="text-base mb-3 font-semibold">
                                                    <span>{selectedProject.coordinator.organization} </span>
                                                </div>
                                            </div>
                                            <div class="w-1/6 ml-2">
                                                <p>Country: <br /> {selectedProject.coordinator.country}</p>
                                            </div>
                                            <div class="w-1/6">
                                                <p>Net EU Contribution: <br /> {selectedProject.coordinator.netContribution}</p>
                                            </div>
                                            <div class="w-1/6 ml-2">
                                                <p>Total Contributions: <br /> {selectedProject.TotalNumberOfContributionInProject}</p>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Participant(s): */}
                            <div className="pb-2">
                                <h3 className="mb-2 text-lg">Participant(s):</h3>
                                <ul className="grid w-full gap-6 grid-cols-1">
                                    {selectedProject.participants.length > 0 ? (
                                        selectedProject.participants.map((participant, index) => (
                                            <li key={index}>
                                                <label className="inline-flex items-center justify-between text-gray-900 w-full py-1 border-b-2 border-gray-500 cursor-pointer hover:bg-slate-300">
                                                    <div className="block w-full">
                                                        <div className='flex w-full'>
                                                            <div class="w-3/6 ml-4">
                                                                <div class="text-base mb-3 font-semibold">

                                                                    <span className='text-green-500 font-bold text-sm mr-2'>
                                                                        {participant.role !== "Participant" && (
                                                                            participant.role
                                                                        )}
                                                                    </span>
                                                                    <span >
                                                                        {participant.organization}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="w-1/6 ml-2">
                                                                <p>Country: <br /> {participant.country}</p>
                                                            </div>
                                                            <div class="w-1/6">
                                                                <p>Net EU Contribution: <br /> {participant.netContribution}</p>
                                                            </div>
                                                            <div class="w-1/6 ml-2">
                                                                <p>Total Contributions: <br /> {participant.totalNumber}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>




                                            </li>
                                        ))
                                    ) : (
                                        <p>No other participants found</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Select a project to view details</p>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Test;