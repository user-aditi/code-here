import React, { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import { Search, Download, User as UserIcon } from "lucide-react";

function AdminStudentsTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axiosClient.get("/admin/students");
        if (data.success) {
          setStudents(data.students);
        }
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 h-full overflow-y-auto bg-black">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-base-content tracking-tight">Students</h1>
          <p className="text-sm text-base-content/60 mt-1">Manage and view registered students</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full bg-base-200 border border-base-300 rounded-lg pl-9 pr-3 py-2 text-sm text-base-content focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-base-content/50">Loading students...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-base-200/50">
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider">Student Info</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider">User ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, idx) => (
                <tr key={student.id} className={`border-b border-white/5 hover:bg-base-200/50 transition-colors ${idx % 2 === 1 ? "bg-base-200/20" : ""}`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {student.name ? student.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{student.name}</p>
                        <p className="text-xs text-base-content/60 mt-0.5">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-base-content/50 font-mono">
                    {student.id}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-base-200 text-xs font-medium text-base-content/70 capitalize border border-base-300">
                      {student.role}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-base-content/50">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminStudentsTable;
