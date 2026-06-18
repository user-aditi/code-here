import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Code2, PanelLeft, Play, Upload, Sparkles, Timer, Flame, ChevronDown, User, Settings, LogOut, CheckCircle, Clock, X, Lightbulb, ChevronRight, ChevronLeft, ChevronUp, TerminalSquare, Plus, Video, RotateCcw, RefreshCw, Send, Search, List, FileText, BookOpen, CheckSquare } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, addProblemSolved } from "../authSlice";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript',
  python: 'Python'
};

const getLanguageForMonaco = (lang) => {
  switch (lang) {
    case 'javascript': return 'javascript';
    case 'java': return 'java';
    case 'cpp': return 'cpp';
    case 'python': return 'python';
    default: return 'javascript';
  }
};

const DiffBadge = ({ d }) => (
  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${d === "easy" ? "bg-green-500/15 text-green-400 border border-green-500/20" :
      d === "medium" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" :
        "bg-red-500/15 text-red-400 border border-red-500/20"
    }`}>{d}</span>
);

export default function ProblemPage() {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('testcases');
  const [runState, setRunState] = useState("idle"); // idle | running | passed | failed
  const [submitState, setSubmitState] = useState("idle");
  const [aiOpen, setAiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openHints, setOpenHints] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [allProblems, setAllProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const aiPanelRef = useRef(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let t;
    if (isTimerRunning) {
      t = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => clearInterval(t);
  }, [isTimerRunning]);

  useEffect(() => {
    const fetchAllProblems = async () => {
      try {
        const response = await axiosClient.get("/problem/getAllProblem");
        if (response.data?.problems) {
          setAllProblems(response.data.problems);
        } else if (Array.isArray(response.data)) {
          setAllProblems(response.data);
        }
      } catch (error) {
        console.error('Error fetching all problems:', error);
      }
    };
    fetchAllProblems();
  }, []);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const p = response.data;
        setProblem(p);
        const startCodeObj = p.startCode?.find(sc => sc.language === langMap[selectedLanguage]) || p.startCode[0];
        setCode(startCodeObj?.initialCode || '');
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const startCodeObj = problem.startCode?.find(sc => sc.language === langMap[selectedLanguage]) || problem.startCode[0];
      if (startCodeObj) setCode(startCodeObj.initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleRun = async () => {
    setRunState("running");
    setActiveLeftTab("results");
    if (leftCollapsed) { leftPanelRef.current?.resize(45); setLeftCollapsed(false); }
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
      setRunState(response.data.success ? "passed" : "failed");
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({ success: false, error: 'Internal server error' });
      setRunState("failed");
    }
  };

  const handleSubmitCode = async () => {
    setSubmitState("running");
    setActiveLeftTab("results");
    if (leftCollapsed) { leftPanelRef.current?.resize(45); setLeftCollapsed(false); }
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      setSubmitResult(response.data);
      setSubmitState("passed");
      if (response.data.accepted) {
        dispatch(addProblemSolved(problemId));
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({ accepted: false, error: 'Internal server error' });
      setSubmitState("failed");
    }
  };

  if (loading && !problem) {
    return <div className="flex justify-center items-center min-h-screen bg-[#0d1117]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  if (!problem) return null;

  const lineCount = code.split("\n").length;

  return (
    <div className="flex flex-col h-[100dvh] text-slate-300 font-sans" style={{ background: "#000000" }}>
      {/* ── Workspace Header ── */}
      <header className="flex items-center justify-between px-3 border-b border-white/10 shrink-0" style={{ height: "44px", background: "#0a0a0a" }}>
        <div className="flex items-center gap-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold text-white hidden md:block">Code-Here</span>
          </Link>
          <div className="w-px h-4 bg-white/10 mx-0.5" />
          <Link to="/problems" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Problems</span>
          </Link>
          <div className="flex items-center gap-0.5 ml-1">
            <button
              onClick={() => {
                if (allProblems.length > 0) {
                  const currentIndex = allProblems.findIndex(p => p._id === problemId);
                  const prevIndex = (currentIndex - 1 + allProblems.length) % allProblems.length;
                  navigate(`/problem/${allProblems[prevIndex]._id}`);
                }
              }}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (allProblems.length > 0) {
                  const currentIndex = allProblems.findIndex(p => p._id === problemId);
                  const nextIndex = (currentIndex + 1) % allProblems.length;
                  navigate(`/problem/${allProblems[nextIndex]._id}`);
                }
              }}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => setDrawerOpen(!drawerOpen)} className="p-1 ml-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          <span className="text-xs font-semibold text-white max-w-[200px] truncate">{problem.title}</span>
          <DiffBadge d={problem.difficulty} />
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={handleRun} disabled={runState === 'running'} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white hover:bg-white/10 transition-colors">
            {runState === 'running' ? <span className="loading loading-spinner loading-xs"></span> : <Play className="w-3 h-3 text-green-400" />}
            Run
          </button>
          <button onClick={handleSubmitCode} disabled={submitState === 'running'} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-lg text-xs font-medium text-white hover:bg-primary/90 transition-colors">
            {submitState === 'running' ? <span className="loading loading-spinner loading-xs"></span> : <Upload className="w-3 h-3" />}
            Submit
          </button>
          <div className="w-px h-4 bg-white/10 mx-0.5" />
          <button onClick={() => setAiOpen(!aiOpen)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiOpen ? "bg-purple-500/15 text-purple-400 border border-purple-500/30" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:block">AI</span>
          </button>
          <div className="w-px h-4 bg-white/10 mx-0.5" />
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5">
            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="hover:text-white transition-colors">
              {isTimerRunning ? <span className="w-2.5 h-2.5 bg-red-400 block rounded-[2px]" /> : <Play className="w-3.5 h-3.5 text-green-400" />}
            </button>
            <Timer className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <span className="text-xs font-mono text-white">{fmt(elapsed)}</span>
          </div>
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-1 p-0.5 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                 {user?.firstName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 bg-[#161B22] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {[
                  { icon: User, label: "Profile", path: "/profile" },
                  { icon: Settings, label: "Settings", path: "/settings" },
                ].map(({ icon: Icon, label, path }) => (
                  <Link key={label} to={path} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Icon className="w-3.5 h-3.5" />{label}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => { dispatch(logoutUser()); navigate("/login"); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />Log Out
                </button>
              </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Problem Drawer Overlay ── */}
      {drawerOpen && (
        <div className="absolute top-[44px] left-0 w-80 h-[calc(100vh-44px)] bg-[#1e1e1e] border-r border-white/10 z-50 overflow-y-auto flex flex-col shadow-2xl">
          <div className="p-3 border-b border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>All Problems</span>
              <button onClick={() => setDrawerOpen(false)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2d2d2d] border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col">
            {allProblems.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => (
              <Link
                key={p._id}
                to={`/problem/${p._id}`}
                onClick={() => setDrawerOpen(false)}
                className={`px-4 py-3 text-xs border-b border-white/5 transition-colors ${p._id === problemId ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="font-medium truncate">{p.title}</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${p.difficulty === "easy" ? "bg-green-500/15 text-green-400" :
                      p.difficulty === "medium" ? "bg-amber-500/15 text-amber-400" :
                        "bg-red-500/15 text-red-400"
                    }`}>{p.difficulty}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Main workspace ── */}
      <div className="flex flex-1 overflow-hidden relative p-2 gap-2 bg-[#000000]">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel */}
          <ResizablePanel
            ref={leftPanelRef}
            defaultSize={45}
            minSize={15}
            collapsible={true}
            collapsedSize={4}
            onCollapse={() => setLeftCollapsed(true)}
            onExpand={() => setLeftCollapsed(false)}
            className="flex flex-col relative"
          >
            {leftCollapsed ? (
              <div className="w-full h-full flex flex-col items-center py-4 bg-[#161616] rounded-xl border border-white/10 cursor-pointer hover:bg-[#1f1f1f] transition-colors overflow-hidden" onClick={() => { leftPanelRef.current?.resize(45); setLeftCollapsed(false); }}>
                <button className="mb-6 p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center gap-4 mt-4 w-full">
                  {[
                    { id: 'description', label: 'Description', icon: FileText },
                    { id: 'editorial', label: 'Editorial', icon: BookOpen },
                    { id: 'solutions', label: 'Solutions', icon: Lightbulb },
                    { id: 'submissions', label: 'Submissions', icon: Clock },
                    { id: 'results', label: 'Results', icon: TerminalSquare }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={(e) => { e.stopPropagation(); setActiveLeftTab(id); leftPanelRef.current?.resize(45); setLeftCollapsed(false); }}
                      className={`flex flex-col items-center gap-1.5 transition-colors group p-2 rounded-lg hover:bg-white/5 ${activeLeftTab === id ? 'text-white' : 'text-slate-500'}`}
                    >
                      <Icon className="w-4 h-4 group-hover:text-white transition-colors" />
                      <span
                        className="text-[10px] font-medium tracking-widest uppercase group-hover:text-white transition-colors"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col bg-[#161616] rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center border-b border-white/10 shrink-0 overflow-x-auto bg-[#1a1a1a] px-2">
                  {[
                    { id: 'description', label: 'Description' },
                    { id: 'editorial', label: 'Editorial' },
                    { id: 'solutions', label: 'Solutions' },
                    { id: 'submissions', label: 'Submissions' },
                    { id: 'results', label: 'Results' }
                  ].map(({ id, label }) => (
                    <button key={id} onClick={() => setActiveLeftTab(id)} className={`shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeLeftTab === id ? 'text-white border-white' : 'text-slate-400 border-transparent hover:text-white'}`}>
                      {id === 'results' && (runState === 'running' || submitState === 'running') ? (
                        <span className="flex items-center gap-1">{label} <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" /></span>
                      ) : label}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center pr-1 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); leftPanelRef.current?.resize(4); setLeftCollapsed(true); }} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 text-sm custom-scrollbar">
                  {activeLeftTab === 'description' && (
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        <DiffBadge d={problem.difficulty} />
                        {problem.acceptanceRate && <span className="text-xs text-slate-400">{problem.acceptanceRate}% acceptance</span>}
                      </div>
                      <div className="prose prose-invert max-w-none prose-p:leading-relaxed text-slate-300 text-[13px]">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                          {problem.description}
                        </ReactMarkdown>
                      </div>
                      <div className="mt-6 space-y-4">
                        {problem.visibleTestCases?.map((ex, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs font-semibold text-slate-400 mb-2">Example {i + 1}</p>
                            <div className="font-mono text-xs space-y-1">
                              <p><span className="text-slate-500">Input: </span><span className="text-slate-300">{ex.input}</span></p>
                              <p><span className="text-slate-500">Output: </span><span className="text-green-400">{ex.output}</span></p>
                              {ex.explanation && <p className="text-slate-400 font-sans mt-2">Explanation: {ex.explanation}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                      {problem.tags && problem.tags.length > 0 && (
                        <div className="mt-6 mb-5">
                          <p className="text-sm font-semibold text-white mb-2">Tags</p>
                          <div className="flex flex-wrap gap-1.5">
                            {problem.tags.map((t) => (
                              <span key={t} className="text-xs px-2 py-1 bg-white/5 text-slate-400 rounded-lg">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeLeftTab === 'editorial' && (
                    <div>
                      {problem.secureUrl ? <Editorial secureUrl={problem.secureUrl} /> : <p className="text-slate-400">No video editorial available yet.</p>}
                    </div>
                  )}
                  {activeLeftTab === 'solutions' && (
                    <div className="space-y-4">
                      {problem.referenceSolution?.map((sol, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-semibold text-primary">{sol.language}</span>
                          </div>
                          <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto">{sol.completeCode}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeLeftTab === 'submissions' && (
                    <SubmissionHistory problemId={problemId} />
                  )}
                  {activeLeftTab === 'results' && (
                    <div>
                      {runState === 'idle' && submitState === 'idle' && (
                        <div className="text-center py-8 text-slate-500"><p className="text-xs">Run your code to see results</p></div>
                      )}
                      {(runState === 'running' || submitState === 'running') && (
                        <div className="text-center py-8 text-slate-400"><span className="loading loading-spinner text-primary"></span><p className="text-xs mt-2">Executing...</p></div>
                      )}
                      {runResult && runState !== 'running' && (
                        <div>
                          <div className={`p-4 rounded-xl border mb-6 ${runResult.success ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <h4 className={`text-sm font-bold flex items-center gap-2 ${runResult.success ? 'text-green-400' : 'text-red-400'}`}>
                              {runResult.success ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              {runResult.success ? 'Accepted' : 'Wrong Answer / Error'}
                            </h4>
                            {runResult.success && <div className="flex gap-4 mt-2 text-[10px] text-slate-400 font-mono"><span>Runtime: {runResult.runtime}s</span><span>Mem: {runResult.memory}KB</span></div>}
                          </div>
                          <div className="space-y-3">
                            {runResult.testCases?.map((tc, i) => (
                              <div key={i} className={`bg-[#2d2d2d] border ${tc.status_id === 3 ? 'border-white/10' : 'border-red-500/30'} p-3 rounded-lg text-sm`}>
                                <h5 className="font-semibold text-slate-400 text-[10px] uppercase mb-2">Case {i + 1} {tc.status_id === 3 ? <span className="text-green-400 ml-2">Pass</span> : <span className="text-red-400 ml-2">Fail</span>}</h5>
                                <div className="flex flex-row gap-4 font-mono text-xs">
                                  <div className="flex-1">
                                    <strong className="text-slate-500 block mb-1 text-[10px] uppercase">Input</strong>
                                    <div className="bg-[#1e1e1e] p-2 rounded whitespace-pre-wrap">{tc.stdin}</div>
                                  </div>
                                  <div className="w-px bg-white/10" />
                                  <div className="flex-1">
                                    <strong className="text-slate-500 block mb-1 text-[10px] uppercase">Output</strong>
                                    <div className="bg-[#1e1e1e] p-2 rounded whitespace-pre-wrap">{tc.stdout || 'N/A'}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {submitResult && submitState !== 'running' && (
                        <div className={`p-6 rounded-2xl border ${submitResult.accepted ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} text-center`}>
                          <h4 className={`text-xl font-black mb-2 ${submitResult.accepted ? 'text-green-400' : 'text-red-400'}`}>
                            {submitResult.accepted ? 'Accepted' : submitResult.error || 'Failed'}
                          </h4>
                          <p className="text-xs text-slate-400 mb-4 font-mono">Passed: {submitResult.passedTestCases} / {submitResult.totalTestCases}</p>
                          {submitResult.accepted && (
                            <div className="flex justify-center gap-4 text-xs font-mono text-slate-300">
                              <span>Runtime: {submitResult.runtime}s</span>
                              <span>Mem: {submitResult.memory}KB</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </ResizablePanel>

          <ResizableHandle className="w-[4px] bg-transparent hover:bg-white/20 transition-colors cursor-col-resize" />

          {/* Right Panel (Editor + Console) */}
          <ResizablePanel defaultSize={55} className="flex flex-col relative">
            <ResizablePanelGroup direction="vertical" className="flex-col">
              {/* Editor */}
              <ResizablePanel defaultSize={60} minSize={20} className="flex flex-col relative min-h-0">
                <div className="w-full h-full flex flex-col bg-[#161616] rounded-xl border border-white/10 overflow-hidden min-h-0">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 shrink-0 bg-[#1a1a1a]">
                    <div className="relative">
                      <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="appearance-none bg-[#1a1a1a] border border-[#333] rounded-lg pl-3 pr-8 py-1.5 text-[13px] font-medium text-white focus:outline-none focus:border-primary/60 cursor-pointer shadow-sm hover:bg-[#222] transition-colors">
                        {['javascript', 'java', 'cpp', 'python'].map((l) => (
                          <option key={l} value={l} className="bg-[#0a0a0a] text-white py-1">{l === 'cpp' ? 'C++' : l.charAt(0).toUpperCase() + l.slice(1)}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <button onClick={() => {
                        const init = problem.startCode?.find(sc => sc.language === langMap[selectedLanguage])?.initialCode;
                        if (init) setCode(init);
                      }} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" title="Reset Code">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 w-full relative bg-[#161616] min-h-0">
                    <Editor
                      height="100%"
                      width="100%"
                      language={getLanguageForMonaco(selectedLanguage)}
                      value={code}
                      onChange={setCode}
                      theme="vs-dark"
                      options={{
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: true,
                        tabSize: 4,
                        wordWrap: 'on',
                        padding: { top: 16 },
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3 px-3 py-1 shrink-0 border-t border-white/10" style={{ background: "#1a1a1a", height: "24px" }}>
                    <span className="text-[10px] text-slate-400">{selectedLanguage}</span>
                    <span className="text-[10px] text-slate-500">• Ln {lineCount}</span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500">Auto-saved</span>
                  </div>
                </div>
              </ResizablePanel>

              {/* <ResizableHandle className="h-[4px] bg-transparent hover:bg-white/20 transition-colors cursor-row-resize" /> */}

              <ResizableHandle className="h-[4px] w-full flex items-center justify-center bg-transparent hover:bg-white/20 transition-colors cursor-row-resize [&>div]:rotate-90" />
              {/* Console */}
              <ResizablePanel
                ref={rightPanelRef}
                defaultSize={40}
                minSize={15}
                collapsible={true}
                collapsedSize={6}
                onCollapse={() => setRightCollapsed(true)}
                onExpand={() => setRightCollapsed(false)}
                className="flex flex-col relative"
              >
                {rightCollapsed ? (
                  <div className="w-full h-full flex items-center px-4 bg-[#161616] rounded-xl border border-white/10 cursor-pointer hover:bg-[#1f1f1f] transition-colors overflow-hidden" onClick={() => { rightPanelRef.current?.resize(40); setRightCollapsed(false); }}>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
                        <CheckSquare className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs font-semibold">Testcase</span>
                      </div>
                    </div>
                    <button className="p-1.5 ml-auto hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <ChevronUp className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col bg-[#161616] rounded-xl border border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 shrink-0 px-2 bg-[#1a1a1a]" style={{ cursor: rightCollapsed ? 'pointer' : 'default' }} onClick={() => { if (rightCollapsed) { rightPanelRef.current?.expand(); setRightCollapsed(false); } }}>
                      <div className="flex">
                        {[
                          { id: 'testcases', label: 'Test Cases' }
                        ].map(({ id, label }) => (
                          <button key={id} onClick={(e) => { e.stopPropagation(); setActiveRightTab(id); rightPanelRef.current?.expand(); setRightCollapsed(false); }} className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeRightTab === id && !rightCollapsed ? 'text-white border-white' : 'text-slate-400 border-transparent hover:text-white'}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center pr-2">
                        <button onClick={(e) => { e.stopPropagation(); rightPanelRef.current?.resize(6); setRightCollapsed(true); }} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                          <ChevronDown className={`w-4 h-4 transition-transform ${rightCollapsed ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                      {activeRightTab === 'testcases' && (
                        <div className="space-y-3">
                          {problem.visibleTestCases?.map((tc, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-3 flex flex-col gap-3">
                              <p className="text-xs font-semibold text-slate-400">Case {i + 1}</p>
                              <div className="flex flex-row gap-4">
                                <div className="flex-1">
                                  <strong className="text-slate-500 block mb-1 text-[10px] uppercase">Input</strong>
                                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-[#1e1e1e] p-2 rounded">{tc.input}</pre>
                                </div>
                                <div className="w-px bg-white/10" />
                                <div className="flex-1">
                                  <strong className="text-slate-500 block mb-1 text-[10px] uppercase">Expected Output</strong>
                                  <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap bg-[#1e1e1e] p-2 rounded">{tc.output}</pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* AI Panel */}
          {aiOpen && (
            <>
              <ResizableHandle className="w-[4px] bg-transparent hover:bg-white/20 transition-colors cursor-col-resize" />
              <ResizablePanel
                ref={aiPanelRef}
                defaultSize={25}
                minSize={20}
                collapsible={true}
                collapsedSize={4}
                onCollapse={() => setAiCollapsed(true)}
                onExpand={() => setAiCollapsed(false)}
                className="flex flex-col relative"
              >
                {aiCollapsed ? (
                  <div className="w-full h-full flex flex-col items-center py-4 bg-[#161616] rounded-xl border border-purple-500/20 cursor-pointer hover:bg-[#1f1f1f] transition-colors overflow-hidden" onClick={() => { aiPanelRef.current?.resize(30); setAiCollapsed(false); }}>
                    <button className="mb-6 p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col items-center gap-6 mt-4">
                      <span
                        className="text-[10px] font-medium text-purple-400 tracking-widest uppercase"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                      >
                        AI ASSISTANT
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col bg-[#161616] rounded-xl border border-purple-500/30 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0 bg-[#1a1a1a]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-semibold text-white">AI Assistant</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); aiPanelRef.current?.collapse(); setAiCollapsed(true); }} className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setAiOpen(false)} className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <ChatAi problem={problem} />
                    </div>
                  </div>
                )}
              </ResizablePanel>
            </>
          )}

        </ResizablePanelGroup>
      </div>
    </div>
  );
}


