import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Edit3, Target, Flame, Zap, 
  CheckCircle, Calendar
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/layout/Navbar';
import axiosClient from '../../utils/axiosClient';

const HeatmapCell = ({ cellData }) => {
  const colors = [
    'bg-[#2d2d2d]', 
    'bg-[#0e4429]', 
    'bg-[#006d32]', 
    'bg-[#26a641]', 
    'bg-[#39d353]'
  ];
  if (!cellData) {
    return <div className="w-3 h-3 rounded-[2px] bg-transparent pointer-events-none" />;
  }
  const { level, date, count } = cellData;
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const tooltipText = `${count} submissions on ${dateStr}`;

  return (
    <div className="relative group">
      <div className={`w-3 h-3 rounded-[2px] ${colors[level] || colors[0]} transition-all duration-300 hover:ring-2 hover:ring-white/50 cursor-pointer`} />
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
        {tooltipText}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-gray-800" />
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ 
    streak: 0, 
    heatmap: [],
    totalStats: { all: 0, easy: 0, medium: 0, hard: 0 },
    solvedStats: { all: 0, easy: 0, medium: 0, hard: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, probsRes] = await Promise.all([
          axiosClient.get('/dashboard/stats'),
          axiosClient.get('/problem/getAllProblem')
        ]);
        
        const backendStats = statsRes.data;
        const allProbs = probsRes.data || [];
        const solvedIds = user?.problemSolved || [];
        
        const tStats = {
          all: allProbs.length,
          easy: allProbs.filter(p => p.difficulty === 'easy').length,
          medium: allProbs.filter(p => p.difficulty === 'medium').length,
          hard: allProbs.filter(p => p.difficulty === 'hard').length
        };
        
        const sStats = {
          all: solvedIds.length,
          easy: allProbs.filter(p => p.difficulty === 'easy' && solvedIds.includes(p._id)).length,
          medium: allProbs.filter(p => p.difficulty === 'medium' && solvedIds.includes(p._id)).length,
          hard: allProbs.filter(p => p.difficulty === 'hard' && solvedIds.includes(p._id)).length
        };
        
        setStats({
          streak: backendStats.streak || 0,
          heatmap: backendStats.heatmap || [],
          totalStats: tStats,
          solvedStats: sStats
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const totalSolved = user?.problemSolved?.length || 0;

  const renderCircularStats = () => {
    const total = stats.totalStats?.all || 1;
    const solved = stats.solvedStats?.all || 0;
    
    const easyPct = (stats.solvedStats?.easy || 0) / total;
    const medPct = (stats.solvedStats?.medium || 0) / total;
    const hardPct = (stats.solvedStats?.hard || 0) / total;
    
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    
    const easyDash = easyPct * circumference;
    const medDash = medPct * circumference;
    const hardDash = hardPct * circumference;
    
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full">
        {/* Circle */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg width="180" height="180" className="transform -rotate-90 drop-shadow-xl">
            {/* Background track */}
            <circle cx="90" cy="90" r={radius} stroke="#3d3d3d" strokeWidth="4" fill="transparent" />
            
            {/* Hard (Red) */}
            <circle cx="90" cy="90" r={radius} stroke="#ef4743" strokeWidth="6" fill="transparent" 
              strokeDasharray={`${hardDash} ${circumference}`} 
              strokeDashoffset={-(easyDash + medDash)} 
              strokeLinecap="round" className="transition-all duration-1000" />
            
            {/* Medium (Yellow) */}
            <circle cx="90" cy="90" r={radius} stroke="#ffc01e" strokeWidth="6" fill="transparent" 
              strokeDasharray={`${medDash} ${circumference}`} 
              strokeDashoffset={-easyDash} 
              strokeLinecap="round" className="transition-all duration-1000" />
            
            {/* Easy (Teal) */}
            <circle cx="90" cy="90" r={radius} stroke="#00b8a3" strokeWidth="6" fill="transparent" 
              strokeDasharray={`${easyDash} ${circumference}`} 
              strokeDashoffset={0} 
              strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center w-full h-full pb-2">
            <div className="text-4xl font-normal text-white flex items-baseline tracking-tight">
              {solved}
              <span className="text-sm font-normal text-slate-400 tracking-normal ml-1">/{stats.totalStats?.all || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Solved
            </div>
            <div className="absolute bottom-4 text-xs text-slate-400 font-medium">
              0 Attempting
            </div>
          </div>
        </div>
        
        {/* Difficulty Blocks */}
        <div className="flex flex-col gap-3 w-40">
          <div className="bg-[#2d2d2d] rounded-lg px-4 py-2.5 flex flex-col items-center border border-white/5">
            <div className="text-[#00b8a3] text-sm font-semibold tracking-wide">Easy</div>
            <div className="text-white text-sm font-semibold mt-0.5">
              {stats.solvedStats?.easy || 0}<span className="text-slate-400 text-xs font-medium ml-1">/{stats.totalStats?.easy || 0}</span>
            </div>
          </div>
          <div className="bg-[#2d2d2d] rounded-lg px-4 py-2.5 flex flex-col items-center border border-white/5">
            <div className="text-[#ffc01e] text-sm font-semibold tracking-wide">Med.</div>
            <div className="text-white text-sm font-semibold mt-0.5">
              {stats.solvedStats?.medium || 0}<span className="text-slate-400 text-xs font-medium ml-1">/{stats.totalStats?.medium || 0}</span>
            </div>
          </div>
          <div className="bg-[#2d2d2d] rounded-lg px-4 py-2.5 flex flex-col items-center border border-white/5">
            <div className="text-[#ef4743] text-sm font-semibold tracking-wide">Hard</div>
            <div className="text-white text-sm font-semibold mt-0.5">
              {stats.solvedStats?.hard || 0}<span className="text-slate-400 text-xs font-medium ml-1">/{stats.totalStats?.hard || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getHeatmapMonths = () => {
    const counts = {};
    if (stats.heatmap && stats.heatmap.length > 0) {
      stats.heatmap.forEach(h => { counts[h.date] = h.count; });
    }
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let currentDate = new Date(today);
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    
    const months = [];
    let currentMonthObj = null;
    let currentCol = 0;
    
    while (currentDate <= today) {
      const offset = currentDate.getTimezoneOffset() * 60000;
      const localDate = new Date(currentDate.getTime() - offset);
      const dateStr = localDate.toISOString().split('T')[0];
      
      const count = counts[dateStr] || 0;
      let level = 0;
      if (count > 0) level = 1;
      if (count >= 2) level = 2;
      if (count >= 4) level = 3;
      if (count >= 6) level = 4;
      
      const monthIdx = currentDate.getMonth();
      const monthName = currentDate.toLocaleString('default', { month: 'short' });
      const dayOfWeek = currentDate.getDay(); // 0-6
      
      if (!currentMonthObj || currentMonthObj.monthIdx !== monthIdx) {
        if (currentMonthObj) months.push(currentMonthObj);
        currentMonthObj = { monthIdx, name: monthName, columns: [] };
        currentCol = 0;
      }
      
      if (!currentMonthObj.columns[currentCol]) {
        currentMonthObj.columns[currentCol] = Array(7).fill(null);
      }
      
      currentMonthObj.columns[currentCol][dayOfWeek] = { level, date: new Date(currentDate), count };
      
      if (dayOfWeek === 6) currentCol++;
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (currentMonthObj) months.push(currentMonthObj);
    return months;
  };

  const heatmapMonths = getHeatmapMonths();
  const totalSubmissions = stats.heatmap ? stats.heatmap.reduce((acc, curr) => acc + curr.count, 0) : 0;

  return (
    <div className="flex flex-col min-h-[100dvh] font-sans bg-black">
      <Navbar />
      <div className="flex-1 pt-16 overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 relative z-10">
          
          {/* PROFILE HEADER */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-0.5 shadow-xl shadow-primary/20">
                    <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center text-3xl font-black text-white">
                      {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-lg border-2 border-[#111] flex items-center gap-1 shadow-lg">
                    <Flame className="w-3 h-3" /> {stats.streak}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">{user?.firstName} {user?.lastName}</h1>
                  <p className="text-slate-400 font-medium flex items-center gap-2 mt-1">
                    <GraduationCap className="w-4 h-4" /> {user?.role === 'admin' ? 'Administrator' : 'Student'} • ID: {user?._id?.slice(-6).toUpperCase() || 'NEW'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 rounded-xl text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* First Card - Problems Solved with Circular Stats */}
            <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-3xl p-6 flex items-center">
              {renderCircularStats()}
            </div>
            
            {/* Second and Third Cards - Streaks */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <div className="bg-[#111] border border-white/5 rounded-3xl p-6 flex-1 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white/5 text-amber-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-400">Current Streak</span>
                </div>
                <div className="text-4xl font-black text-white mt-4">{stats.streak}</div>
              </div>
              
              <div className="bg-[#111] border border-white/5 rounded-3xl p-6 flex-1 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white/5 text-amber-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-400">Longest Streak</span>
                </div>
                <div className="text-4xl font-black text-white mt-4">{stats.streak}</div>
              </div>
            </div>
          </div>

          {/* HEATMAP */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {totalSubmissions} submissions in the past one year
              </h2>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <span>Total active days: {stats.heatmap ? stats.heatmap.filter(h => h.count > 0).length : 0}</span>
                <span>Max streak: {stats.streak}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto pb-8 pt-10 custom-scrollbar">
              <div className="flex gap-3 min-w-max">
                {heatmapMonths.map((month, mIdx) => (
                  <div key={mIdx} className="flex gap-1 relative">
                    {month.columns.map((colData, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1">
                        {colData.map((cell, rowIdx) => (
                          <HeatmapCell key={`${mIdx}-${colIdx}-${rowIdx}`} cellData={cell} />
                        ))}
                      </div>
                    ))}
                    {/* Month label at the bottom */}
                    <span className="absolute -bottom-6 left-0 text-[10px] text-slate-400 whitespace-nowrap">
                      {month.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 ml-auto">
                <span>Less</span>
                <HeatmapCell cellData={{level: 0, date: new Date(), count: 0}} />
                <HeatmapCell cellData={{level: 1, date: new Date(), count: 1}} />
                <HeatmapCell cellData={{level: 2, date: new Date(), count: 2}} />
                <HeatmapCell cellData={{level: 3, date: new Date(), count: 4}} />
                <HeatmapCell cellData={{level: 4, date: new Date(), count: 6}} />
                <span>More</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
