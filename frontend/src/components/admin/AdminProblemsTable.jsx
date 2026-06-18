import React, { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import { Link } from "react-router-dom";
import { Search, Edit2, Trash2, Video, Plus, Code2 } from "lucide-react";

function AdminProblemsTable() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/problem/getAllProblem");
      if (Array.isArray(data)) {
        setProblems(data);
      } else if (data && data.problemData) {
        setProblems(data.problemData);
      }
    } catch (error) {
      console.error("Failed to fetch problems", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await axiosClient.delete(`/problem/delete/${id}`);
        fetchProblems(); // refresh list
      } catch (error) {
        alert("Failed to delete problem");
      }
    }
  };

  const filtered = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = diffFilter === "all" || p.difficulty === diffFilter;
    return matchesSearch && matchesDiff;
  });

  const getDifficultyColor = (diff) => {
    if (diff === 'easy') return 'text-green-500 border-green-500/20 bg-green-500/10';
    if (diff === 'medium') return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
    return 'text-red-500 border-red-500/20 bg-red-500/10';
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-black">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-base-content tracking-tight">Problems</h1>
          <p className="text-sm text-base-content/60 mt-1">Manage platform coding challenges</p>
        </div>
        <Link 
          to="/admin-legacy/create" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={16} />
          Create Problem
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-full bg-base-200 border border-base-300 rounded-lg pl-9 pr-3 py-2 text-sm text-base-content focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
        <select
          value={diffFilter}
          onChange={e => setDiffFilter(e.target.value)}
          className="bg-base-200 border border-base-300 rounded-lg px-4 py-2 text-sm text-base-content focus:outline-none focus:border-primary transition-all cursor-pointer"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-base-content/50">Loading problems...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-base-200/50">
              <tr className="border-b border-white/10">
                <th className="w-16 px-4 py-3 text-left text-xs font-semibold text-base-content/50 uppercase tracking-wider">No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider hidden sm:table-cell">Difficulty</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider hidden md:table-cell">Tags</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={p._id} className={`border-b border-white/5 hover:bg-base-200/50 transition-colors group ${idx % 2 === 1 ? "bg-base-200/20" : ""}`}>
                  <td className="px-4 py-4 text-left text-sm text-base-content/50 font-mono">
                    {p.problemNumber || idx + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/50 border border-base-300">
                        <Code2 size={14} />
                      </div>
                      <p className="font-semibold text-white">{p.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${getDifficultyColor(p.difficulty)}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(p.tags) ? p.tags.map(tag => (
                        <span key={tag} className="text-xs text-base-content/60 capitalize bg-base-200 px-2 py-1 rounded-md border border-base-300">
                          {tag}
                        </span>
                      )) : (
                        <span className="text-xs text-base-content/60 capitalize bg-base-200 px-2 py-1 rounded-md border border-base-300">
                          {p.tags || "None"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <Link 
                        to={`/problem/${p._id}`}
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-success transition-colors border border-transparent hover:border-base-300" 
                        title="View Problem"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </Link>
                      <Link 
                        to={`/admin-legacy/upload/${p._id}`}
                        className="p-2 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-info transition-colors border border-transparent hover:border-base-300" 
                        title="Upload Video"
                      >
                        <Video size={16} />
                      </Link>
                      <Link 
                        to={`/admin-legacy/update/${p._id}`}
                        className="p-2 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-primary transition-colors border border-transparent hover:border-base-300" 
                        title="Edit Problem"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(p._id)}
                        className="p-2 rounded-lg hover:bg-error/10 text-base-content/60 hover:text-error transition-colors border border-transparent hover:border-error/20" 
                        title="Delete Problem"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-base-content/50">No problems found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminProblemsTable;
