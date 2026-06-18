import React, { useEffect, useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, RefreshCw, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import axiosClient from "../../utils/axiosClient";

function Stat({ label, value, trend, accent = false }) {
  return (
    <div className="rounded-lg border border-base-300 p-5 bg-base-100 flex flex-col gap-3">
      <p className="text-xs font-medium text-base-content/50 uppercase tracking-widest">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <p className={`text-2xl font-semibold font-mono tracking-tight ${accent ? "text-primary" : "text-base-content"}`}>{value}</p>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-mono mb-0.5 ${trend >= 0 ? "text-success" : "text-error"}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}

function OverviewPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/overview");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) return <div className="p-8 text-center"><span className="loading loading-spinner text-primary"></span></div>;
  if (!data) return <div className="p-8">Error loading data.</div>;

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full bg-base-200/50">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-base-content tracking-tight">Overview</h1>
          <p className="text-sm text-base-content/60 mt-0.5">Platform activity summary</p>
        </div>
        <button onClick={fetchOverview} className="btn btn-sm btn-ghost"><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Students" value={data.totalStudents} trend={4.2} />
        <Stat label="Active Today" value={data.activeToday} trend={12.7} accent />
        <Stat label="Total Problems" value={data.totalProblems} />
        <Stat label="Total Submissions" value={data.totalSubmissions} trend={8.1} />
      </div>

      <div className="bg-base-100 border border-base-300 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-base-content">Daily Activity</p>
            <p className="text-xs text-base-content/50 mt-0.5">Last 7 days</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.dailyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: "#5f6280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#5f6280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="students" name="Active Students" stroke="#6366f1" strokeWidth={2} fillOpacity={0.2} fill="#6366f1" />
            <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#06b6d4" strokeWidth={2} fillOpacity={0.2} fill="#06b6d4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default OverviewPanel;
