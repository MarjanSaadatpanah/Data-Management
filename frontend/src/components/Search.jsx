import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce'; // Import debounce
import { motion } from 'framer-motion';
import { BsCaretDownFill } from "react-icons/bs";
import countries from './Countries';
import { IoPersonCircleOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineLocalPhone } from "react-icons/md";
import { CiLinkedin } from "react-icons/ci";

import './topic-style.css'

import partnerPNG from "../img/partner-removebg-preview.png";
import thirdpartyPNG from "../img/Third-removebg-preview.png"

const Search = () => {
    const [searchTerms, setSearchTerms] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [message, setMessage] = useState(false);
    const searchInputRef = useRef(null);


    // show the details    
    const [projectDetailsExpanded, setProjectDetailsExpanded] = useState(false);
    const projectDetailsView = () => {
        setProjectDetailsExpanded(!projectDetailsExpanded);
    };
    const [coordinatorExpanded, setcoordinatorExpanded] = useState(false);
    const cordinatorView = () => {
        setcoordinatorExpanded(!coordinatorExpanded);
    };
    const [expandedParticipants, setExpandedParticipants] = useState({});
    const toggleParticipant = (index) => {
        setExpandedParticipants(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);


    const handleSearch = async (terms) => {
        try {
            const trimmedTerms = terms.split(/\s+/).filter(term => term.trim() !== '');


            const response = await axios.post('http://localhost:5000/search', {
                search_terms: trimmedTerms,
            });

            setSearchResults(response.data.data);
            setMessage(true);
            setTimeout(() => setMessage(false), 2000);
            console.log(response.data.data)
        } catch (err) {
            console.error(err);
        }
    };

    const debouncedSearch = debounce(handleSearch, 300); // Debounce

    const handleInputChange = (e) => {
        const newTerms = e.target.value;
        setSearchTerms(newTerms);
        debouncedSearch(newTerms); // Use debounced search
    };

    // Updated extraction function to handle the new data structure
    const extractProjectDetails = (project) => {

        // Check if this is the new format (with coordinator and participants)
        if (project.coordinator && project.participants) {
            const coordinator = project.coordinator;
            return {
                title: coordinator['Project Topic'] || 'Untitled Project',
                objective: coordinator['Objective'] || 'Objective',
                EuContribution: coordinator['EU Contribution'] || 'EU Contribution',
                acronym: coordinator['Acronym'] || 'No Acronym',
                fundedUnder: coordinator['Funded Under'] || 'Funded Under',
                ProjectWeb_Linkedin: coordinator['Project web or Linkedin'] || 'Project web or Linkedin',
                id: coordinator['Project ID'] || 'N/A',
                dates: {
                    start: coordinator['Start Date'] || 'Not Specified',
                    end: coordinator['End Date'] || 'Not Specified'
                },
                OrganizationCorrectContribution: coordinator['Organization correct contribution'] || 'Unknown',

                financials: {
                    totalCost: coordinator['Total Cost'] || 'Not Available',
                    netContribution: coordinator['Organization Net EU Contribution'] || 'Not Available'
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
                    flag: countries(coordinator['Country']),
                    organization: coordinator['Organization'] || 'Unknown',
                    country: coordinator['Country'] || 'Unknown',
                    role: coordinator['Organization Role'] || 'Coordinator',
                    netContribution: coordinator['Organization Net EU Contribution'] || 'Not Available',
                    coordinatorContact: coordinator['Contact'] || 'Not Available',
                    coordinatorRole: coordinator['Role'] || 'Not Available',
                    coordinatorEmail: coordinator['Email'] || 'Not Available',
                    coordinatorPhone: coordinator['Phone'] || 'Not Available',
                    coordinatorLinkedin: coordinator['Linkedin'] || 'Not Available'

                },
                participants: project.participants.map(participant => ({
                    flag: countries(participant['Country']),
                    organization: participant['Organization'] || 'Unknown',
                    OrganizationCorrectContribution_participant: participant['Organization correct contribution'] || 'Unknown',
                    country: participant['Country'] || 'Unknown',
                    role: participant['Organization Role'] || 'Participant',
                    netContribution: participant['Organization Net EU Contribution'] || 'Not Available',
                    participantContact: participant['Contact'] || 'Not Available',
                    participantRole: participant['Role'] || 'Not Available',
                    participantEmail: participant['Email'] || 'Not Available',
                    participantPhone: participant['Phone'] || 'Not Available',
                    participantLinkedin: participant['Linkedin'] || 'Not Available'
                })),
                CallForProposal: coordinator['Call for Proposal'] || 'Unknown'
            };
        }

        // Fallback to old format if needed
        return {
            title: project['Project Topic'] || 'Untitled Project',
            objective: project['Objective'] || 'Objective',
            acronym: project['Acronym'] || 'Untitled',
            EuContribution: project['EU Contribution'] || 'EU Contribution',
            fundedUnder: project['Funded Under'] || 'Funded Under',
            ProjectWeb_Linkedin: project['Project web or Linkedin'] || 'Project web or Linkedin',
            id: project['Project ID'] || 'N/A',
            organization: project['Organization'] || 'Unknown',
            OrganizationCorrectContribution: project['Organization correct contribution'] || 'Unknown',
            coordinatorContact: project['Contact'] || 'Not Available',
            coordinatorRole: project['Role'] || 'Not Available',
            coordinatorEmail: project['Email'] || 'Not Available',
            coordinatorPhone: project['Phone'] || 'Not Available',
            coordinatorLinkedin: project['Linkedin'] || 'Not Available',

            country: project['Country'] || 'Unknown',
            CallForProposal: project['Call for Proposal'] || 'Unknown',
            dates: {
                start: project['Start Date'] || 'Not Specified',
                end: project['End Date'] || 'Not Specified'
            },
            financials: {
                totalCost: project['Total Cost'] || 'Not Available',
                netContribution: project['Organization Net EU Contribution'] || 'Not Available'
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
                netContribution: project['Organization Net EU Contribution'] || 'Not Available'
            },
            participants: [] // Empty array for old format   
        };


    };

    const handleProjectSelect = (project) => {
        const extractedProject = extractProjectDetails(project);
        setSelectedProject(extractedProject);
    };

    return (
        <div className="pr-5 pl-5 pt-5 w-[95%] h-[calc(100vh-20px)] mt-3 max-w-8xl mx-auto rounded-lg overflow-hidden shadow-xl bg-gray-50">
            <form onSubmit={handleSearch} className="flex mb-4 px-3">
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

                <aside class="project-list-sidebar w-80 p-3 border-r border-border-color flex-shrink-0 overflow-y-auto max-h-[calc(100vh-100px)]">

                    <nav>
                        <ul>
                            {searchResults.map((result, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleProjectSelect(result)}
                                    class="project-item mb-2 rounded-md overflow-hidden bg-blue-50 p-5 hover:bg-blue-100">
                                    <p className='text'>
                                        {result.coordinator ? result.coordinator['Project Topic'] : result['Project Topic']}
                                    </p>
                                    <p class="text-sm text-gray-500 m-0">
                                        {result.coordinator ? result.coordinator['Organization'] : result['Organization']}
                                    </p>

                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Detailed Project View */}
                <div className='pl-7 overflow-y-auto max-h-[calc(100vh-100px)]'>
                    {/* <h2 className="mb-2 text-lg pl-4">Project Details</h2> */}
                    {selectedProject && (
                        <div className=" px-4 rounded space-y-3">

                            <label className="inline-flex items-center  justify-between text-gray-900 w-full pb-5 ">
                                <div class="block">
                                    <div className='flex'>
                                        <div class="w-full ml-1">
                                            <div>
                                                <p class="text-3xl mb-2 pr-16">{selectedProject.title} </p>
                                                <h4 className="text-sm text-blue-700">{selectedProject.acronym}</h4>
                                            </div>

                                            <ul className="grid gap-1 grid-cols-2 mt-4">
                                                <li>
                                                    <label className="inline-flex items-center justify-between text-gray-900 w-full   rounded  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div className="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-sm">
                                                                        <p>Project ID: <span className='font-medium'>{selectedProject.id}</span></p>
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
                                                                    <div class="text-sm">
                                                                        <p>Start Date: <span className='font-medium'>{selectedProject.dates.start}</span></p>
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
                                                                    <div class="text-sm">
                                                                        <p>Total Cost: <span className='font-medium'>{selectedProject.financials.totalCost}</span></p>
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
                                                                    <div class="text-sm">
                                                                        <p>End Date: <span className='font-medium'>{selectedProject.dates.end}</span></p>
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
                                                                    <div class="text-sm">
                                                                        <p>Funded Under:  <span className='font-medium'>{selectedProject.fundedUnder}</span></p>
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
                                                                    <div class="text-sm">
                                                                        <p>EU Contribution: <span className='font-medium'>{selectedProject.EuContribution}</span></p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </li>
                                            </ul>

                                            {projectDetailsExpanded && (
                                                <div className='mt-1'>
                                                    <label className="inline-flex mb-3 items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div className="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-base">
                                                                        <p>
                                                                            <span className='text-sm'>Programme: </span> <br />
                                                                            {selectedProject.additionalInfo.programme}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label class="inline-flex mb-3 items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div class="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-base">
                                                                        <p><span className='text-sm'>Topic: </span> <br />{selectedProject.additionalInfo.topic}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label class="inline-flex mb-3 items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div class="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-base">
                                                                        <p><span className='text-sm'>Call for Proposal: </span> <br /> {selectedProject.CallForProposal}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label class="inline-flex mb-3 items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div class="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-base">
                                                                        <p><span className='text-sm'>Project Contacts: </span> <br /> {selectedProject.ProjectWeb_Linkedin}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label class="inline-flex mb-3 items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
                                                        <div class="block">
                                                            <div className='flex'>
                                                                <div class="w-full">
                                                                    <div class="text-base">
                                                                        <p><span className='text-sm'>Objective: </span> <br /> {selectedProject.objective}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            )}
                                            <button onClick={projectDetailsView} class=" hover:font-bold px-2 inline-flex items-center">
                                                {!projectDetailsExpanded ? (<span>More details...</span>) : (<span>Less details...</span>)}

                                                <motion.span animate={{ rotate: projectDetailsExpanded ? 180 : 0 }}>
                                                    <BsCaretDownFill className="ml-3" />
                                                </motion.span>
                                            </button>

                                        </div>
                                    </div>
                                </div >
                            </label >

                            {/* Coordinated by: */}
                            < div className="pb-2 mb-3 mt-5" >
                                <h3 className="text-lg">Coordinated by:</h3>
                                <label className="inline-flex items-center justify-between text-gray-900 w-full py-3 border-t-2 border-t-gray-200 cursor-pointer hover:bg-slate-300">
                                    <div className="block w-full">
                                        <div className='flex w-full'>
                                            <div class="w-3/5 ml-4 pr-3">
                                                <div class="text-base font-semibold">
                                                    <span>{selectedProject.coordinator.organization} </span>
                                                </div>
                                                <div class="mt-1 flex">
                                                    <img
                                                        src={`https://flagcdn.com/${selectedProject.coordinator.flag}.svg`}
                                                        width="20"
                                                        height="14"

                                                        className="mr-2" // Optional styling
                                                    />
                                                    <p class="text-xs">{selectedProject.coordinator.country}</p>
                                                </div>
                                            </div>
                                            <div class="w-1/5">
                                                <p> Net EU Contribution: <br /> {selectedProject.coordinator.netContribution}</p>
                                            </div>
                                            <div class="w-1/5 ml-2">
                                                <p>Total Contributions: <br /> {selectedProject.OrganizationCorrectContribution}</p>
                                            </div>
                                            <div class=" ml-2">
                                                <button onClick={cordinatorView} class=" hover:font-bold px-5 inline-flex items-center">
                                                    <motion.span animate={{ rotate: coordinatorExpanded ? 180 : 0 }}>
                                                        <BsCaretDownFill className="ml-3" />
                                                    </motion.span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* show details of coordinator */}
                                        {coordinatorExpanded && (
                                            <motion.div>
                                                <div class="ml-5 mt-5">
                                                    <div className='flex'>
                                                        <IoPersonCircleOutline className='mt-1 mr-2' />
                                                        <p>
                                                            <span className='font-bold'> {selectedProject.coordinator.coordinatorContact}</span> / {selectedProject.coordinator.coordinatorRole}
                                                        </p>
                                                    </div>
                                                    <div className='flex'><HiOutlineMail className='mt-1 mr-2' /><p>{selectedProject.coordinator.coordinatorEmail}</p></div>
                                                    <div className='flex'><MdOutlineLocalPhone className='mt-1 mr-2' /><p>{selectedProject.coordinator.coordinatorPhone}</p></div>
                                                    <div className='flex'><CiLinkedin className='mt-1 mr-2' /><p>{selectedProject.coordinator.coordinatorLinkedin}</p></div>

                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </label>
                            </div >

                            {/* Participant(s): */}
                            < div className="pb-2 mt-5" >
                                <h3 className="text-lg">Participant(s):</h3>
                                <ul className="grid w-full gap-2 grid-cols-1">
                                    {selectedProject.participants.length > 1 ? (
                                        selectedProject.participants.slice(1).map((participant, index) => (
                                            <li key={index + 1}>
                                                <label className="inline-flex items-center justify-between text-gray-900 w-full py-3 border-t-2 border-t-gray-200 cursor-pointer hover:bg-slate-300">
                                                    <div className="block w-full">
                                                        <div className='flex w-full'>
                                                            <div class="flex w-3/5 ml-4 pr-3">
                                                                <div class="text-base font-semibold">
                                                                    {participant.role === "partner" && (
                                                                        // <span className='text-green-500 font-bold text-sm mr-2'>
                                                                        //     participant.role
                                                                        // </span>
                                                                        <img src={partnerPNG} width="70" />
                                                                    )}
                                                                    {participant.role === "Third-party" && (
                                                                        // <span className='text-green-500 font-bold text-sm mr-2'>
                                                                        //     participant.role
                                                                        // </span>
                                                                        <img src={thirdpartyPNG} width="70" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <span>{participant.organization} </span>
                                                                    <div class="mt-1 flex">
                                                                        <img
                                                                            src={`https://flagcdn.com/${participant.flag}.svg`}
                                                                            width="20"
                                                                            height="14"
                                                                            className="mr-2"
                                                                        />
                                                                        <p class="text-xs">{participant.country}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="w-1/5">
                                                                <p>Net EU Contribution: <br /> {participant.netContribution}</p>
                                                            </div>
                                                            <div class="w-1/5 ml-2">
                                                                <p>Total Contributions: <br /> {participant.OrganizationCorrectContribution_participant}</p>
                                                            </div>
                                                            <div class=" ml-2">
                                                                <button onClick={() => toggleParticipant(index)} class=" hover:font-bold px-5 inline-flex items-center">
                                                                    <motion.span animate={{ rotate: expandedParticipants[index] ? 180 : 0 }}>
                                                                        <BsCaretDownFill className="ml-3" />
                                                                    </motion.span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* show details of coordinator */}
                                                        {expandedParticipants[index] && (
                                                            <motion.div>
                                                                <div class="ml-5 mt-5">
                                                                    <div className='flex'>
                                                                        <IoPersonCircleOutline className='mt-1 mr-2' />
                                                                        <p>
                                                                            <span className='font-bold'> {participant.participantContact}</span> / {participant.participantRole}
                                                                        </p>
                                                                    </div>
                                                                    <div className='flex'><HiOutlineMail className='mt-1 mr-2' /><p>{participant.participantEmail}</p></div>
                                                                    <div className='flex'><MdOutlineLocalPhone className='mt-1 mr-2' /><p>{participant.participantPhone}</p></div>
                                                                    <div className='flex'><CiLinkedin className='mt-1 mr-2' /><p>{participant.participantLinkedin}</p></div>

                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </label>
                                            </li>
                                        ))
                                    ) : (
                                        <p>No other participants found</p>
                                    )}
                                </ul>
                            </div >
                        </div >
                    )}
                    {
                        message && (
                            <p className='p-9'>Select a project to view details</p>
                        )
                    }
                </div >
            </div >
        </div >
    );
}
export default Search;