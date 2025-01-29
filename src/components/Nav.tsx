
import { Link } from 'react-router-dom';
const Nav = () => {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Candidate Search</h1>
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">
          Candidate Search
        </Link>
        <Link to="/SavedCandidates" className="hover:underline">
          Saved Candidates
        </Link>
      </div>
    </nav>
  );
};

export default Nav;