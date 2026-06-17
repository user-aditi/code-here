import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; 
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';

const ProgressRing = ({ title, value, max, colorClass }) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-4 bg-base-200/50 rounded-2xl border border-white/5 shadow-sm">
      <div className="relative flex items-center justify-center mb-3">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-base-300" />
          <circle 
            cx="48" cy="48" r={radius} 
            stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            className={`transition-all duration-1000 ease-out ${colorClass}`} 
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-bold">{percentage}%</span>
          <span className="text-[10px] text-base-content/50 uppercase tracking-wider">{value}/{max}</span>
        </div>
      </div>
      <span className="font-semibold text-sm tracking-wide">{title}</span>
    </div>
  );
};

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
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

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
    setSolvedProblems([]);
  };

  // Stats calculation
  const stats = {
    easy: { total: 0, solved: 0 },
    medium: { total: 0, solved: 0 },
    hard: { total: 0, solved: 0 },
  };

  problems.forEach(p => {
    if (stats[p.difficulty]) {
      stats[p.difficulty].total++;
    }
  });

  solvedProblems.forEach(p => {
    if (stats[p.difficulty]) {
      stats[p.difficulty].solved++;
    }
  });

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const isSolved = solvedProblems.some(sp => sp._id === problem._id);
    const statusMatch = filters.status === 'all' || 
                        (filters.status === 'solved' ? isSolved : !isSolved);
    return difficultyMatch && tagMatch && statusMatch;
  });

  // Sorting
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen bg-base-300 font-sans">
      {/* Sticky Glass Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-base-100/70 border-b border-white/10 shadow-sm supports-[backdrop-filter]:bg-base-100/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-bold text-white text-lg leading-none">&lt;/&gt;</span>
            </div>
            <NavLink to="/" className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-base-content to-base-content/70">code-here</NavLink>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-sm rounded-full px-4 border border-white/10 hover:bg-base-200/50 hover:border-white/20 transition-all">
                <span className="text-sm font-medium">{user?.firstName || 'User'}</span>
              </div>
              <ul className="mt-3 p-2 shadow-2xl menu menu-sm dropdown-content bg-base-200/95 backdrop-blur-xl rounded-xl w-52 border border-white/10">
                <li><button onClick={handleLogout} className="text-error hover:bg-error/10 hover:text-error rounded-lg">Logout</button></li>
                {user?.role === 'admin' && <div className="divider my-1"></div>}
                {user?.role === 'admin' && <li><NavLink to="/admin" className="hover:bg-primary/10 hover:text-primary rounded-lg font-medium">Admin Dashboard</NavLink></li>}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6 md:p-8 max-w-6xl space-y-10">
        
        {/* Dashboard Header & Progress Rings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
          <div className="lg:col-span-1 space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-base-content/60 text-sm leading-relaxed">Track your progress and tackle new algorithmic challenges.</p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-3 gap-4">
            <ProgressRing title="Easy" value={stats.easy.solved} max={stats.easy.total} colorClass="text-success" />
            <ProgressRing title="Medium" value={stats.medium.solved} max={stats.medium.total} colorClass="text-warning" />
            <ProgressRing title="Hard" value={stats.hard.solved} max={stats.hard.total} colorClass="text-error" />
          </div>
        </div>

        {/* Problems Section */}
        <div className="bg-base-100/50 backdrop-blur-sm rounded-3xl border border-white/5 shadow-xl overflow-hidden">
          {/* Filters Bar */}
          <div className="p-6 border-b border-white/5 bg-base-200/30 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <select 
                className="select select-sm select-bordered bg-base-100 border-white/10 hover:border-white/20 transition-colors focus:ring-2 focus:ring-primary/50 font-medium"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">Status: All</option>
                <option value="solved">Status: Solved</option>
                <option value="unsolved">Status: Unsolved</option>
              </select>

              <select 
                className="select select-sm select-bordered bg-base-100 border-white/10 hover:border-white/20 transition-colors focus:ring-2 focus:ring-primary/50 font-medium"
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                <option value="all">Difficulty: All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select 
                className="select select-sm select-bordered bg-base-100 border-white/10 hover:border-white/20 transition-colors focus:ring-2 focus:ring-primary/50 font-medium"
                value={filters.tag}
                onChange={(e) => setFilters({...filters, tag: e.target.value})}
              >
                <option value="all">Tags: All</option>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
              </select>
            </div>
            <div className="text-sm font-medium text-base-content/50">
              Showing {sortedProblems.length} problems
            </div>
          </div>

          {/* Data Table */}
          <Table>
            <TableHeader className="bg-base-200/50">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="w-16 text-center">Status</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors font-bold"
                  onClick={() => handleSort('title')}
                >
                  Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="w-32 cursor-pointer hover:text-primary transition-colors font-bold"
                  onClick={() => handleSort('difficulty')}
                >
                  Difficulty {sortConfig.key === 'difficulty' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="w-48 font-bold">Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProblems.length > 0 ? (
                sortedProblems.map((problem, index) => {
                  const isSolved = solvedProblems.some(sp => sp._id === problem._id);
                  return (
                    <TableRow key={problem._id} className="group hover:bg-base-200/50 transition-colors border-white/5 cursor-pointer">
                      <TableCell className="text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <Circle className="w-5 h-5 text-base-content/20 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-base-content/90 group-hover:text-primary transition-colors">
                        <NavLink to={`/problem/${problem._id}`} className="block w-full">
                          <span className="text-base-content/30 mr-3 text-xs font-mono">{String(index + 1).padStart(3, '0')}</span>
                          {problem.title}
                        </NavLink>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            problem.difficulty === 'easy' ? 'success' : 
                            problem.difficulty === 'medium' ? 'warning' : 'destructive'
                          }
                          className="bg-opacity-15 border-transparent capitalize w-20 justify-center"
                        >
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-base-300/50 hover:bg-base-300 capitalize text-xs">
                          {problem.tags}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-base-content/40">
                    No problems found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Homepage;