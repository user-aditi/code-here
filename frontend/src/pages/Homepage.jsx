import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // Clear solved problems on logout
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-base-300">
      {/* Navigation Bar */}
      <nav className="navbar bg-base-100/70 backdrop-blur-md shadow-lg px-6 sticky top-0 z-50 border-b border-white/5">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-2xl font-bold tracking-tight text-primary">LeetCode</NavLink>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost border border-white/10 rounded-full px-6 transition-all hover:bg-base-200 hover:border-white/20 shadow-sm">
              <span className="text-sm font-medium">{user?.firstName || 'User'}</span>
            </div>
            <ul className="mt-3 p-3 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-white/10">
              <li><button onClick={handleLogout} className="text-error hover:bg-error/10">Logout</button></li>
              {user?.role === 'admin' && <li><NavLink to="/admin" className="hover:bg-primary/10 hover:text-primary mt-1">Admin Dashboard</NavLink></li>}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-8 max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Problem Collection</h1>
          <p className="text-base-content/70">Sharpen your coding skills with our curated list of algorithmic challenges.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 bg-base-100/50 p-4 rounded-2xl backdrop-blur-sm border border-white/5 shadow-sm">
          {/* New Status Filter */}
          <select 
            className="select select-bordered bg-base-200/50 border-white/10 hover:border-white/20 transition-colors"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select 
            className="select select-bordered bg-base-200/50 border-white/10 hover:border-white/20 transition-colors"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className="select select-bordered bg-base-200/50 border-white/10 hover:border-white/20 transition-colors"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-5">
          {filteredProblems.map(problem => (
            <div key={problem._id} className="card bg-base-100/80 backdrop-blur-md shadow-lg hover:shadow-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group">
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <h2 className="card-title text-xl font-semibold">
                    <NavLink to={`/problem/${problem._id}`} className="hover:text-primary transition-colors flex items-center gap-3">
                      <span className="text-base-content/50 group-hover:text-primary/50">#</span>
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some(sp => sp._id === problem._id) && (
                    <div className="badge badge-success badge-outline gap-1 px-3 py-3 font-medium bg-success/10 border-success/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-4">
                  <div className={`badge badge-outline py-3 px-4 font-medium ${getDifficultyBadgeColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info badge-outline py-3 px-4 font-medium bg-info/5 border-info/30">
                    {problem.tags}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredProblems.length === 0 && (
            <div className="text-center py-20 bg-base-100/30 rounded-2xl border border-dashed border-white/10">
              <p className="text-base-content/50 text-lg">No problems found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;