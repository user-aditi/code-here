import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import ProblemsSidebar from "../../components/user/ProblemsSidebar";
import ProblemsTable from "../../components/user/ProblemsTable";

function ProblemsPage() {
    const [sidebarFilter, setSidebarFilter] = useState("all");

    return (
        <div className="flex flex-col min-h-[100dvh] bg-black">
            <Navbar />
            <div className="flex flex-1 pt-16 overflow-hidden">
                <ProblemsSidebar activeFilter={sidebarFilter} setActiveFilter={setSidebarFilter} />
                <ProblemsTable sidebarFilter={sidebarFilter} />
            </div>
        </div>
    );
}

export default ProblemsPage;
