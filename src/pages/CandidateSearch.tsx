import React, { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  // Load saved candidates from local storage on mount
  useEffect(() => {
    const storedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    setSavedCandidates(storedCandidates);
  }, []);

  // Fetch initial candidates when the component mounts
  useEffect(() => {
    const fetchCandidates = async () => {
      const users = await searchGithub();
      if (users.length > 0) {
        const detailedCandidate = await searchGithubUser(users[0].login);
        setCandidates(users);
        setCurrentCandidate(detailedCandidate);
      }
    };
    fetchCandidates();
  }, []);

  // Save candidate to local storage and move to next candidate
  const saveCandidate = () => {
    if (currentCandidate) {
      const updatedSavedCandidates = [...savedCandidates, currentCandidate];
      setSavedCandidates(updatedSavedCandidates);
      localStorage.setItem('savedCandidates', JSON.stringify(updatedSavedCandidates));
    }
    nextCandidate();
  };

  // Move to the next candidate without saving
  const nextCandidate = async () => {
    if (candidates.length > 1) {
      const newCandidates = candidates.slice(1);
      const nextUser = await searchGithubUser(newCandidates[0].login);
      setCandidates(newCandidates);
      setCurrentCandidate(nextUser);
    } else {
      setCurrentCandidate(null);
    }
  };

  return (
    <div className="p-4">
      {currentCandidate ? (
        <div className="border p-4 rounded shadow">
          <img src={currentCandidate.avatar_url} alt={currentCandidate.login} className="w-24 h-24 rounded-full mb-4" />
          <h2 className="text-lg font-bold">{currentCandidate.name || currentCandidate.login}</h2>
          <p>Username: {currentCandidate.login}</p>
          <p>Location: {currentCandidate.location || 'Unknown'}</p>
          <p>Email: {currentCandidate.email || 'Unavailable'}</p>
          <p>
            GitHub: <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">{currentCandidate.html_url}</a>
          </p>
          <p>Company: {currentCandidate.company || 'N/A'}</p>
          <div className="mt-4">
            <button onClick={saveCandidate} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
              + (Save)
            </button>
            <button onClick={nextCandidate} className="bg-red-500 text-white px-4 py-2 rounded">
              - (Skip)
            </button>
          </div>
        </div>
      ) : (
        <p>No more candidates available.</p>
      )}
    </div>
  );
};

export default CandidateSearch;
