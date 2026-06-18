import React, { useState } from "react";
import { Search, Bell, ChevronDown, User, Settings, LogOut, Code2, Flame, FileCode } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../authSlice";

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const currentPage = location.pathname.split('/')[1] || 'problems';

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 bg-base-100 border-b border-base-300 h-16">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
          <Code2 className="w-4 h-4 text-primary-content" />
        </div>
        <span className="font-bold text-sm hidden sm:block tracking-tight text-base-content">Code-Here</span>
      </Link>

      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
          <input
            className="w-full bg-base-200 border border-base-300 rounded-xl pl-9 pr-4 py-2 text-sm placeholder:text-base-content/50 focus:outline-none focus:border-primary/60 transition-colors"
            placeholder="Search problems, topics..."
          />
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-0.5">
        {[
          { id: "", label: "Problems" },
          { id: "myschool", label: "My School" },
          { id: "contests", label: "Contests" },
          { id: "leaderboard", label: "Leaderboard" }
        ].map((p) => (
          <Link
            key={p.id}
            to={`/${p.id}`}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              (currentPage === p.id || (p.id === "" && currentPage === "problems")) ? "bg-primary/10 text-primary" : "text-base-content/70 hover:text-base-content hover:bg-base-200"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-sm font-bold text-amber-400">{user?.streak || 0}</span>
        </div>
        <button className="relative p-2 rounded-xl text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-base-100" />
        </button>
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-base-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
              {user?.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <ChevronDown className="w-3 h-3 text-base-content/70 hidden sm:block" />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#161B22] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              {[
                { icon: User, label: "Profile", path: "/profile" },
                { icon: Settings, label: "Settings", path: "/settings" },
              ].map(({ icon: Icon, label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Icon className="w-4 h-4" />{label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />Log Out
              </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
