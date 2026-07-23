import React, { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminProblemsTable from "../../components/admin/AdminProblemsTable";

// Coming soon placeholder
const ComingSoon = ({ title }) => (
  <div className="p-8 flex flex-col items-center justify-center h-full text-center">
    <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">🚧</span>
    </div>
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-base-content/60">This feature is currently under development.</p>
  </div>
);

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("problems");

  const renderContent = () => {
    switch (activeSection) {
      case "students": return <ComingSoon title="Student Management" />;
      case "problems": return <AdminProblemsTable />;
      case "analytics": return <ComingSoon title="Advanced Analytics" />;
      default: return <ComingSoon title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} />;
    }
  };

  return (
    <div className="flex h-[100dvh] bg-black overflow-hidden font-sans">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
