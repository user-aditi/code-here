import React, { useState, useEffect } from "react";
import { Search, CheckCircle, Circle, Clock, Flame, ChevronDown, Lock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";
import { toggleBookmark } from "../../authSlice";

const TOPICS = [
  "Array", "String", "Hash Table", "Math", "Dynamic Programming", 
  "Sorting", "Greedy", "Graphs", "Trees", "Linked List", 
  "Backtracking", "Stack", "Two Pointers", "Binary Search", 
  "Sliding Window", "Trie"
];

const DiffBadge = ({ d }) => (
  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
    d === "easy" ? "bg-success/15 text-success" :
    d === "medium" ? "bg-warning/15 text-warning" :
    "bg-error/15 text-error"
  }`}>{d.charAt(0).toUpperCase() + d.slice(1)}</span>
);

function ProblemsTable({ sidebarFilter }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sortBy, setSortBy] = useState("Popularity");

  // Sync sidebarFilter to status if applicable
  useEffect(() => {
    if (sidebarFilter === "solved") setStatus("Solved");
    else if (sidebarFilter === "unsolved") setStatus("Unsolved");
    else if (sidebarFilter === "attempted") setStatus("Attempted");
    else setStatus("All");
  }, [sidebarFilter]);

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty, status, selectedTopics, sortBy, sidebarFilter, user?.bookmarkedProblems?.length]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (difficulty !== "All") params.append("difficulty", difficulty);
      if (status !== "All") params.append("status", status);
      if (selectedTopics.length > 0) params.append("tags", selectedTopics.join(","));
      params.append("sortBy", sortBy);

      const res = await axiosClient.get(`/problem/getAllProblem?${params.toString()}`);
      let fetched = res.data || [];
      if (sidebarFilter === "fav" && user?.bookmarkedProblems) {
         fetched = fetched.filter(p => user.bookmarkedProblems.includes(p._id));
      }
      setProblems(fetched);
    } catch (err) {
      console.error(err);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (t) =>
    setSelectedTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const visibleTopics = showMore ? TOPICS : TOPICS.slice(0, 10);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-black">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Problems</h1>
        <p className="text-sm text-base-content/60 mt-1">
          {problems.length} Problems Available
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {visibleTopics.map((name) => (
          <button
            key={name}
            onClick={() => toggleTopic(name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              selectedTopics.includes(name)
                ? "bg-primary/20 text-primary border-primary/40"
                : "bg-base-200 text-base-content/60 border-base-300 hover:text-white"
            }`}
          >
            {name}
          </button>
        ))}
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
        >
          {showMore ? "Show Less ↑" : `+${TOPICS.length - 10} More ↓`}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-base-200 border border-base-300 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-base-content/50 focus:outline-none focus:border-primary/60 transition-colors"
            placeholder="Search problems..."
          />
        </div>
        {[
          { label: "Difficulty", opts: ["All", "Easy", "Medium", "Hard"], val: difficulty, set: setDifficulty },
          { label: "Status", opts: ["All", "Solved", "Unsolved", "Attempted"], val: status, set: setStatus },
          { label: "Sort By", opts: ["Popularity", "Acceptance", "Difficulty", "Newest"], val: sortBy, set: setSortBy },
        ].map(({ label, opts, val, set }) => (
          <div key={label} className="relative">
            <select
              value={val}
              onChange={(e) => set(e.target.value)}
              className="appearance-none bg-base-200 border border-base-300 rounded-xl pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:border-primary/60 cursor-pointer"
            >
              {opts.map((o) => <option key={o} value={o}>{o === "All" ? label : o}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-base-content/50 pointer-events-none" />
          </div>
        ))}
      </div>

      <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-base-200/50">
              <th className="w-16 px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider text-left">No.</th>
              <th className="w-24 px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider text-left">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider text-left">Problem</th>
              <th className="px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider text-left hidden sm:table-cell">Difficulty</th>
              <th className="px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider text-left hidden md:table-cell">Acceptance</th>
              <th className="px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider text-left hidden lg:table-cell">Tags</th>
              <th className="w-12 px-4 py-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-10"><span className="loading loading-spinner text-primary"></span></td></tr>
            ) : problems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-14 text-base-content/50">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No problems match your filters</p>
                </td>
              </tr>
            ) : (
              problems.map((problem, idx) => (
                <tr
                  key={problem._id}
                  className={`border-b border-white/5 hover:bg-base-200/50 transition-colors ${idx % 2 === 1 ? "bg-base-200/20" : ""}`}
                >
                  <td className="px-4 py-3.5 text-left text-sm text-base-content/50 font-mono">
                    {problem.problemNumber || idx + 1}
                  </td>
                  <td className="px-4 py-3.5 text-left">
                    {problem.isSolved ? (
                      <div className="flex items-center gap-1.5 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Solved</span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-base-content/20 ml-2" />
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <Link to={`/problem/${problem._id}`} className="text-sm font-semibold hover:text-primary transition-colors line-clamp-1">
                        {problem.title}
                      </Link>
                      {problem.status === "Premium" && <span className="text-[10px] text-amber-400 font-bold mt-0.5 flex items-center gap-1"><Lock className="w-3 h-3"/> Premium</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell"><DiffBadge d={problem.difficulty} /></td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-sm text-base-content/60">{problem.acceptanceRate || 0}%</td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {problem.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-base-200 rounded-lg text-base-content/60">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button 
                       onClick={() => dispatch(toggleBookmark(problem._id))}
                       className={`p-1.5 rounded-lg transition-colors hover:bg-base-200 ${user?.bookmarkedProblems?.includes(problem._id) ? 'text-amber-400' : 'text-base-content/30 hover:text-base-content/70'}`}
                    >
                      <Star className="w-4 h-4" fill={user?.bookmarkedProblems?.includes(problem._id) ? "currentColor" : "none"} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProblemsTable;
