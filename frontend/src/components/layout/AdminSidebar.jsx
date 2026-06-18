import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Code2, BookOpen, ClipboardList, FileText,
  Trophy, BarChart3, Megaphone, Bot, Settings, LogOut
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../authSlice";

const navItems = [
  { id: "problems", label: "Problems", icon: Code2 },
  { id: "students", label: "Students", icon: Users },
  { id: "sheets", label: "Sheets", icon: BookOpen },
  { id: "quizzes", label: "Quizzes", icon: ClipboardList },
  { id: "exams", label: "Exams", icon: FileText },
  { id: "contests", label: "Contests", icon: Trophy },
  { id: "leaderboards", label: "Leaderboards", icon: BarChart3 },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "ai-monitoring", label: "AI Monitoring", icon: Bot },
  { id: "settings", label: "Settings", icon: Settings },
];

// Activity is missing from lucide imports in original, adding fallback
import { Activity } from "lucide-react";

function AdminSidebar({ activeSection, setActiveSection }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="w-64 bg-black border-r border-base-300 flex flex-col h-full overflow-y-auto shrink-0">
      <div className="p-4 border-b border-base-300 flex items-center gap-2 sticky top-0 bg-black z-10">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Code2 size={16} className="text-primary-content" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight text-base-content leading-none">Code-Here</h1>
          <p className="text-[10px] text-base-content/50 mt-1 uppercase tracking-wider font-semibold">Admin Portal</p>
        </div>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
              activeSection === item.id
                ? "bg-primary text-primary-content shadow-md shadow-primary/20 font-medium"
                : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
            }`}
          >
            <item.icon size={16} className={activeSection === item.id ? "text-primary-content" : "text-base-content/50 group-hover:text-base-content"} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-base-300">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-error hover:bg-error/10 rounded-lg transition-colors">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
