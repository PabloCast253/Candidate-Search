
import { useEffect, useState } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import { Candidate } from "../interfaces/Candidate.interface";

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  /** Load saved candidates from local storage on mount */
  useEffect(() => {
    const storedCandidates: Candidate[] = JSON.parse(localStorage.getItem("savedCandidates") || "[]");
    setSavedCandidates(storedCandidates);
  }, []);

  /** Fetch GitHub candidates when the component mounts */
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const users: Candidate[] = await searchGithub();
        console.log("Fetched Candidates:", users);

        if (users.length > 0) {
          const firstCandidate = await searchGithubUser(users[0].login as unknown as string);
          setCandidates(users);
          setCurrentCandidate(firstCandidate);
        } else {
          console.warn("No candidates found.");
          setCurrentCandidate(null);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setCurrentCandidate(null);
      }
    };

    fetchCandidates();
  }, []);

  /** Save current candidate to local storage and fetch the next one */
  const saveCandidate = () => {
    if (!currentCandidate) return;

    const updatedSaved = [...savedCandidates, currentCandidate];
    setSavedCandidates(updatedSaved);
    localStorage.setItem("savedCandidates", JSON.stringify(updatedSaved));

    nextCandidate();
  };

  /** Fetch and display the next candidate */
  const nextCandidate = async () => {
    if (candidates.length <= 1) {
      setCurrentCandidate(null);
      return;
    }

    const newCandidates = candidates.slice(1);
    console.log("Next Candidate:", newCandidates[0]);

    try {
      const nextUser = await searchGithubUser(newCandidates[0].login as unknown as string);
      setCandidates(newCandidates);
      setCurrentCandidate(nextUser);
    } catch (error) {
      console.error("Error fetching next candidate:", error);
      setCurrentCandidate(null);
    }
  };

  return (
    <div className="p-4">
      {currentCandidate ? (
        <div className="border p-4 rounded shadow">
          <img
            src={currentCandidate.avatar_url}
            alt={String(currentCandidate.login)}
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-lg font-bold">
  {currentCandidate?.name ?? String(currentCandidate?.login) ?? "No Name Available"}
          </h2>
      <a href={typeof currentCandidate?.html_url === "string" ? currentCandidate.html_url : "#"} target="_blank" rel="noopener noreferrer">
  {typeof currentCandidate?.html_url === "string" ? currentCandidate.html_url : "Profile"}
</a>
          <p>Location: {currentCandidate.location || "Unknown"}</p>
          <p>Email: {currentCandidate.email || "Unavailable"}</p>
          <p>
            GitHub:{" "}
            <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">
              {currentCandidate.html_url}
            </a>
          </p>
          <p>Company: {currentCandidate.company || "N/A"}</p>
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
