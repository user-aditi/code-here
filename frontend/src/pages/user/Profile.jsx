import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Share2, Download, Edit3, Target, Award, Flame, Zap, 
  Trophy, BookOpen, Clock, Activity, CheckCircle, XCircle, ChevronRight,
  TrendingUp, Calendar, Lock
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/layout/Navbar';
import axiosClient from '../../utils/axiosClient';

const HeatmapCell = ({ activeLevel }) => {
  const colors = [
    'bg-white/5', 
    'bg-primary/40', 
    'bg-primary/70', 
    'bg-primary', 
    'bg-primary shadow-[0_0_8px_rgba(var(--p),0.8)]'
  ];
  return (
    <div className={`w-3 h-3 rounded-[2px] ${colors[activeLevel] || colors[0]} transition-all duration-300 hover:ring-2 hover:ring-white/50 cursor-pointer`} />
  );
};

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ streak: 0, heatmap: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalSolved = user?.problemSolved?.length || 0;

  // Mock data for impressive UI
  const contestRating = user?.rating || 1200;
  const schoolRank = 12;
  const longestStreak = Math.max(stats.streak, 32);
  const totalSubmissions = totalSolved * 3 + 14;
  const acceptanceRate = 68.4;

  const quickStats = [
    { icon: CheckCircle, label: "Problems Solved", value: totalSolved, color: "text-green-400", trend: "+5 this week" },
    { icon: Trophy, label: "Contest Rating", value: contestRating, color: "text-purple-400", trend: "Top 15%" },
    { icon: Flame, label: "Current Streak", value: stats.streak, color: "text-amber-400", trend: "🔥 Active" },
    { icon: Zap, label: "Longest Streak", value: longestStreak, color: "text-amber-500", trend: "Personal Best" },
    { icon: Target, label: "School Rank", value: `#${schoolRank}`, color: "text-primary", trend: "Up 3 spots" },
    { icon: Award, label: "Exams Completed", value: 4, color: "text-blue-400", trend: "1 pending" },
    { icon: Activity, label: "Acceptance Rate", value: `${acceptanceRate}%`, color: "text-emerald-400", trend: "Healthy" },
    { icon: Clock, label: "Total Submissions", value: totalSubmissions, color: "text-slate-300", trend: "Active" },
  ];

  const topics = [
    { name: "Arrays", percent: 85, color: "bg-green-500", label: "Strong" },
    { name: "Strings", percent: 78, color: "bg-green-500", label: "Strong" },
    { name: "Hash Tables", percent: 65, color: "bg-yellow-500", label: "Moderate" },
    { name: "Trees", percent: 50, color: "bg-yellow-500", label: "Moderate" },
    { name: "Dynamic Programming", percent: 25, color: "bg-red-500", label: "Weak" },
    { name: "Graphs", percent: 15, color: "bg-red-500", label: "Weak" },
  ];

  const achievements = [
    { title: "First Blood", desc: "Solved 1st problem", date: "Jan 12", locked: false },
    { title: "30 Day Streak", desc: "Coded for 30 consecutive days", date: "Feb 14", locked: false },
    { title: "Graph Master", desc: "Solve 50 Graph problems", date: "—", locked: true },
    { title: "Contest Winner", desc: "Rank 1 in Weekly Contest", date: "—", locked: true },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] font-sans bg-black">
      <Navbar />
      <div className="flex-1 pt-16 overflow-y-auto custom-scrollbar relative">
        {/* Background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
          
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
                    <GraduationCap className="w-4 h-4" /> {user?.studentClass || 'Student'} • ID: {user?._id?.slice(-6).toUpperCase() || 'NEW'}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full">School Rank #{schoolRank}</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-xs font-bold rounded-full">Top 15% Global</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 rounded-xl text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] font-medium text-slate-500 mb-1">{stat.trend}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* HEATMAP */}
              <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" /> Coding Activity
                  </h2>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span>{totalSubmissions} submissions in the last year</span>
                  </div>
                </div>
                
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                  <div className="flex gap-1 min-w-max">
                    {Array.from({ length: 52 }).map((_, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, rowIdx) => {
                          // Simple mock distribution for impressive look
                          const active = Math.random() > 0.6;
                          const level = active ? Math.floor(Math.random() * 4) + 1 : 0;
                          return <HeatmapCell key={rowIdx} activeLevel={level} />;
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                  <div className="flex gap-6 text-xs text-slate-400">
                    <div>Most Active Day: <span className="text-white font-medium">Sunday</span></div>
                    <div>Daily Avg: <span className="text-white font-medium">2.4 problems</span></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Less</span>
                    <HeatmapCell activeLevel={0} />
                    <HeatmapCell activeLevel={1} />
                    <HeatmapCell activeLevel={2} />
                    <HeatmapCell activeLevel={3} />
                    <HeatmapCell activeLevel={4} />
                    <span>More</span>
                  </div>
                </div>
              </div>

              {/* CONTINUE LEARNING */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Continue Learning
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#161616] to-[#111] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-300 tracking-wider uppercase">Current Sheet</div>
                      <span className="text-xs font-mono text-primary">64%</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Coming Soon</h3>
                    <p className="text-xs text-slate-400 mb-4">Sheets and curriculums are under development.</p>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[64%]" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#161616] to-[#111] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/50 transition-all cursor-pointer">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-300 tracking-wider uppercase">Current Exam</div>
                      <span className="text-xs font-mono text-purple-400">Upcoming</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Coming Soon</h3>
                    <p className="text-xs text-slate-400 mb-4">Exam modules will be available shortly.</p>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full w-[15%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* TIMELINE / HISTORY */}
              <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                  {[
                    { type: "Solve", title: "Solved Two Sum", time: "2 hours ago", icon: CheckCircle, color: "text-green-400 bg-green-400/10 border-green-400/20" },
                    { type: "Streak", title: "Achieved 24 Day Streak", time: "Yesterday", icon: Flame, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
                    { type: "Contest", title: "Participated in Weekly Contest 104", time: "3 days ago", icon: Trophy, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" }
                  ].map((act, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] ${act.color} relative z-10`}>
                        <act.icon className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#161616] border border-white/5 p-4 rounded-xl shadow-lg hover:border-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{act.type}</span>
                          <span className="text-[10px] font-medium text-slate-500">{act.time}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-200">{act.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              
              {/* TOPIC MASTERY */}
              <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white mb-6">Topic Mastery</h2>
                <div className="space-y-5">
                  {topics.map((t) => (
                    <div key={t.name}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-300">{t.name}</span>
                        <span className="text-slate-500 font-mono">{t.percent}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WEAK TOPICS / RECOMMENDATIONS */}
              <div className="bg-gradient-to-b from-[#111] to-red-500/5 border border-white/5 rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white mb-2">Focus Areas</h2>
                <p className="text-xs text-slate-400 mb-6">We recommend practicing these topics to improve your contest rating.</p>
                <div className="space-y-3">
                  {topics.filter(t => t.percent < 40).map((t) => (
                    <div key={t.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div>
                        <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{t.name}</div>
                        <div className="text-[10px] text-red-400 font-medium">{t.percent}% success rate</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ACHIEVEMENTS */}
              <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white mb-6">Achievements</h2>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((ach) => (
                    <div key={ach.title} className={`p-4 rounded-xl border ${ach.locked ? 'bg-white/5 border-white/5 opacity-50' : 'bg-gradient-to-br from-amber-500/10 to-[#111] border-amber-500/20'}`}>
                      <div className="flex justify-between items-start mb-2">
                        {ach.locked ? <Lock className="w-5 h-5 text-slate-500" /> : <Award className="w-5 h-5 text-amber-400" />}
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1">{ach.title}</h3>
                      <p className="text-[9px] text-slate-400 leading-tight">{ach.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
