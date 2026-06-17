import { NavLink, Outlet, useNavigate } from 'react-router';
import { LayoutDashboard, PlusCircle, Edit, Trash2, Video, LogOut, Home } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../authSlice';

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, route: '/admin', end: true },
    { title: 'Create Problem', icon: PlusCircle, route: '/admin/create' },
    { title: 'Update Problem', icon: Edit, route: '/admin/update' },
    { title: 'Delete Problem', icon: Trash2, route: '/admin/delete' },
    { title: 'Video Management', icon: Video, route: '/admin/video' },
  ];

  return (
    <div className="min-h-screen flex bg-base-300 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-base-100/50 border-r border-white/5 backdrop-blur-md flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-bold text-white text-lg leading-none">A</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Admin Portal</h2>
              <p className="text-xs text-base-content/50">code-here</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.route}
              to={item.route}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-sm' 
                    : 'text-base-content/70 hover:bg-base-200/50 hover:text-base-content hover:border-white/5 border border-transparent'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 space-y-2">
          <NavLink 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base-content/70 hover:bg-base-200/50 hover:text-base-content transition-all"
          >
            <Home size={18} />
            <span>Back to Main</span>
          </NavLink>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error/80 hover:bg-error/10 hover:text-error transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen custom-scrollbar relative">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
