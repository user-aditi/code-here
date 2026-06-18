import React, { useState } from "react";
import { Star, List, CheckCircle, Circle, Clock } from "lucide-react";
import { useSelector } from "react-redux";

function ProblemsSidebar({ activeFilter, setActiveFilter }) {
  const { user } = useSelector((state) => state.auth);

  const [totalProblems, setTotalProblems] = useState(0);

  React.useEffect(() => {
    import("../../utils/axiosClient").then(({ default: axiosClient }) => {
      axiosClient.get("/problem/getAllProblem").then((res) => {
        const data = res.data.problems || res.data;
        if (Array.isArray(data)) setTotalProblems(data.length);
      }).catch(() => {});
    });
  }, []);

  return (
    <aside className="shrink-0 overflow-y-auto border-r border-base-300 py-5 px-3 w-60 bg-black">
      <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider px-3 mb-3">My Problems</p>
      {[
        { icon: List, label: "All Problems", count: totalProblems || "—", id: "all" },
        { icon: Star, label: "Bookmarked", count: user?.bookmarkedProblems?.length || 0, id: "fav" },
        { icon: CheckCircle, label: "Solved", count: user?.problemSolved?.length || 0, id: "solved" },
        { icon: Circle, label: "Unsolved", count: totalProblems ? Math.max(0, totalProblems - (user?.problemSolved?.length || 0)) : "—", id: "unsolved" },
        { icon: Clock, label: "Attempted", count: user?.problemSolved?.length || 0, id: "attempted" },
      ].map(({ icon: Icon, label, count, id }) => (
        <button
          key={id}
          onClick={() => setActiveFilter(id)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm mb-0.5 transition-colors ${
            activeFilter === id ? "bg-primary/10 text-primary" : "text-base-content/70 hover:text-base-content hover:bg-base-200/60"
          }`}
        >
          <div className="flex items-center gap-2.5"><Icon className="w-4 h-4" />{label}</div>
          <span className="text-xs">{count}</span>
        </button>
      ))}

    </aside>
  );
}

export default ProblemsSidebar;
