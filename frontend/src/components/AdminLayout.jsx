import { Outlet, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black font-sans flex flex-col relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="px-8 py-4 border-b border-base-content/10 bg-base-200/30 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 rounded-lg hover:bg-base-200 text-base-content/70 hover:text-base-content transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
