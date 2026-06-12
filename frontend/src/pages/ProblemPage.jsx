import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';

const langMap = {
        cpp: 'C++',
        java: 'Java',
        javascript: 'JavaScript'
};


const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let {problemId}  = useParams();

  

  const { handleSubmit } = useForm();

 useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
       
        
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;

        setProblem(response.data);
        
        setCode(initialCode);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
        const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code:code,
        language: selectedLanguage
      });

       setSubmitResult(response.data);
       setLoading(false);
       setActiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-base-300 overflow-hidden font-sans">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex flex-col border-r border-white/5 bg-base-100/40 backdrop-blur-md">
        {/* Left Tabs */}
        <div className="tabs tabs-bordered bg-base-200/60 px-4 pt-2 border-b border-white/5 shadow-sm sticky top-0 z-10">
          <button 
            className={`tab tab-lg transition-all ${activeLeftTab === 'description' ? 'tab-active font-bold text-primary border-primary' : 'hover:text-base-content/80'}`}
            onClick={() => setActiveLeftTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab tab-lg transition-all ${activeLeftTab === 'editorial' ? 'tab-active font-bold text-primary border-primary' : 'hover:text-base-content/80'}`}
            onClick={() => setActiveLeftTab('editorial')}
          >
            Editorial
          </button>
          <button 
            className={`tab tab-lg transition-all ${activeLeftTab === 'solutions' ? 'tab-active font-bold text-primary border-primary' : 'hover:text-base-content/80'}`}
            onClick={() => setActiveLeftTab('solutions')}
          >
            Solutions
          </button>
          <button 
            className={`tab tab-lg transition-all ${activeLeftTab === 'submissions' ? 'tab-active font-bold text-primary border-primary' : 'hover:text-base-content/80'}`}
            onClick={() => setActiveLeftTab('submissions')}
          >
            Submissions
          </button>
          <button 
            className={`tab tab-lg transition-all ${activeLeftTab === 'chatAI' ? 'tab-active font-bold text-primary border-primary' : 'hover:text-base-content/80'}`}
            onClick={() => setActiveLeftTab('chatAI')}
          >
            ChatAI
          </button>
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {problem && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeLeftTab === 'description' && (
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight">{problem.title}</h1>
                    <div className={`badge badge-outline py-3 px-4 font-semibold ${getDifficultyColor(problem.difficulty).replace('text-', 'border-').replace('500', '500/50')} ${getDifficultyColor(problem.difficulty)} bg-base-200/50`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div className="badge badge-primary badge-outline py-3 px-4 font-semibold bg-primary/10 border-primary/30">{problem.tags}</div>
                  </div>

                  <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-base-300/50 prose-pre:border prose-pre:border-white/5">
                    <div className="whitespace-pre-wrap text-[15px] leading-loose text-base-content/90">
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Examples
                    </h3>
                    <div className="space-y-6">
                      {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className="bg-base-200/50 border border-white/5 p-6 rounded-2xl shadow-sm hover:border-white/10 transition-colors">
                          <h4 className="font-bold mb-4 text-base-content/80 tracking-wide uppercase text-sm">Example {index + 1}</h4>
                          <div className="space-y-4 text-[15px] font-mono">
                            <div className="flex flex-col gap-1"><strong className="text-base-content/60 select-none">Input:</strong> <span className="bg-base-300/50 px-3 py-2 rounded-lg border border-white/5">{example.input}</span></div>
                            <div className="flex flex-col gap-1"><strong className="text-base-content/60 select-none">Output:</strong> <span className="bg-base-300/50 px-3 py-2 rounded-lg border border-white/5">{example.output}</span></div>
                            {example.explanation && (
                                <div className="flex flex-col gap-1 mt-2 font-sans"><strong className="text-base-content/60 select-none">Explanation:</strong> <span className="text-base-content/80">{example.explanation}</span></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-extrabold mb-6">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed bg-base-200/30 p-6 rounded-2xl border border-white/5">
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                  </div>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-2xl font-extrabold mb-6">Solutions</h2>
                  <div className="space-y-8">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className="border border-white/10 rounded-2xl overflow-hidden shadow-lg bg-base-200/30">
                        <div className="bg-base-300/80 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                          <h3 className="font-bold text-lg">{problem?.title}</h3>
                          <span className="badge badge-primary">{solution?.language}</span>
                        </div>
                        <div className="p-0">
                          <pre className="bg-transparent p-6 text-[15px] overflow-x-auto m-0">
                            <code className="text-base-content/90 font-mono">{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || <div className="text-center py-20 bg-base-200/30 rounded-2xl border border-dashed border-white/10"><p className="text-base-content/50 text-lg">Solutions will be available after you solve the problem.</p></div>}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-2xl font-extrabold mb-6">My Submissions</h2>
                  <div className="bg-base-200/30 rounded-2xl border border-white/5 p-2">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div className="prose prose-invert max-w-none h-full flex flex-col">
                  <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI Assistant</span>
                  </h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed flex-1 bg-base-200/30 rounded-2xl border border-white/5 overflow-hidden">
                    <ChatAi problem={problem}></ChatAi>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex flex-col bg-[#1e1e1e]">
        {/* Right Tabs */}
        <div className="tabs tabs-bordered bg-[#252526] px-2 pt-2 border-b border-[#3c3c3c] shadow-md z-10">
          <button 
            className={`tab tab-lg transition-all ${activeRightTab === 'code' ? 'tab-active font-bold text-white border-primary' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveRightTab('code')}
          >
            Code
          </button>
          <button 
            className={`tab tab-lg transition-all ${activeRightTab === 'testcase' ? 'tab-active font-bold text-white border-primary' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveRightTab('testcase')}
          >
            Console
          </button>
          <button 
            className={`tab tab-lg transition-all ${activeRightTab === 'result' ? 'tab-active font-bold text-white border-primary' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveRightTab('result')}
          >
            Result
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col h-full">
              {/* Language Selector */}
              <div className="flex justify-between items-center px-4 py-2 bg-[#1e1e1e] border-b border-[#3c3c3c]">
                <div className="flex gap-1 bg-[#2d2d2d] p-1 rounded-lg">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedLanguage === lang ? 'bg-[#3e3e42] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-[#333333]'}`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 w-full h-full relative">
                <Editor
                  height="100%"
                  width="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    fontSize: 15,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 4,
                    renderLineHighlight: 'all',
                    selectOnLineNumbers: true,
                    roundedSelection: true,
                    readOnly: false,
                    cursorStyle: 'line',
                    cursorBlinking: 'smooth',
                    mouseWheelZoom: true,
                    padding: { top: 16 },
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-[#252526] border-t border-[#3c3c3c] flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.2)] z-10">
                <div className="flex gap-3">
                  <button 
                    className="btn btn-ghost btn-sm text-gray-400 hover:text-white transition-colors"
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M4 15V9a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
                    </svg>
                    Console
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    className={`btn px-8 rounded-full border-none bg-[#3c3c3c] hover:bg-[#4d4d4d] text-white shadow-sm transition-all hover:shadow-md ${loading ? 'loading' : ''}`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn px-8 rounded-full border-none bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-8 overflow-y-auto bg-[#1e1e1e] text-gray-300">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M4 15V9a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
                </svg>
                Console Results
              </h3>
              {runResult ? (
                <div className={`p-6 rounded-2xl border ${runResult.success ? 'bg-green-900/10 border-green-500/20' : 'bg-red-900/10 border-red-500/20'} mb-6`}>
                  <div>
                    {runResult.success ? (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h4 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Accepted
                        </h4>
                        <div className="flex gap-6 mt-4 text-sm bg-black/20 p-3 rounded-lg w-fit border border-white/5">
                          <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase tracking-wider">Runtime</span><span className="font-mono text-gray-200">{runResult.runtime+" sec"}</span></div>
                          <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase tracking-wider">Memory</span><span className="font-mono text-gray-200">{runResult.memory+" KB"}</span></div>
                        </div>
                        
                        <div className="mt-8 space-y-4">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="bg-[#2d2d2d] border border-[#3c3c3c] p-5 rounded-xl text-sm shadow-sm">
                              <h5 className="font-semibold text-gray-400 mb-4 uppercase tracking-wider text-xs">Test Case {i + 1}</h5>
                              <div className="font-mono space-y-4">
                                <div><strong className="text-gray-500 block mb-1">Input</strong> <div className="bg-[#1e1e1e] p-2 rounded border border-[#3c3c3c] break-all">{tc.stdin}</div></div>
                                <div><strong className="text-gray-500 block mb-1">Expected Output</strong> <div className="bg-[#1e1e1e] p-2 rounded border border-[#3c3c3c] break-all">{tc.expected_output}</div></div>
                                <div><strong className="text-gray-500 block mb-1">Your Output</strong> <div className="bg-[#1e1e1e] p-2 rounded border border-[#3c3c3c] break-all">{tc.stdout}</div></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h4 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Wrong Answer
                        </h4>
                        <div className="mt-8 space-y-4">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className={`bg-[#2d2d2d] border ${tc.status_id==3 ? 'border-[#3c3c3c]' : 'border-red-500/30'} p-5 rounded-xl text-sm shadow-sm`}>
                              <div className="flex justify-between items-center mb-4">
                                <h5 className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Test Case {i + 1}</h5>
                                <div className={`px-2 py-1 rounded text-xs font-bold ${tc.status_id==3 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                  {tc.status_id==3 ? 'Passed' : 'Failed'}
                                </div>
                              </div>
                              <div className="font-mono space-y-4">
                                <div><strong className="text-gray-500 block mb-1">Input</strong> <div className="bg-[#1e1e1e] p-2 rounded border border-[#3c3c3c] break-all">{tc.stdin}</div></div>
                                <div><strong className="text-gray-500 block mb-1">Expected Output</strong> <div className="bg-[#1e1e1e] p-2 rounded border border-[#3c3c3c] break-all">{tc.expected_output}</div></div>
                                <div><strong className="text-gray-500 block mb-1">Your Output</strong> <div className="bg-[#1e1e1e] p-2 rounded border border-[#3c3c3c] break-all">{tc.stdout}</div></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60%] text-gray-500 space-y-4 opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <p className="text-lg">Run your code to see console output here.</p>
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-8 overflow-y-auto bg-[#1e1e1e] text-gray-300">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Evaluation Results
              </h3>
              {submitResult ? (
                <div className={`p-8 rounded-3xl border shadow-xl ${submitResult.accepted ? 'bg-gradient-to-br from-green-900/20 to-[#1e1e1e] border-green-500/30' : 'bg-gradient-to-br from-red-900/20 to-[#1e1e1e] border-red-500/30'}`}>
                  <div>
                    {submitResult.accepted ? (
                      <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/30">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-12 h-12 text-green-400">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="font-black text-4xl text-green-400 mb-2 tracking-tight">Accepted</h4>
                        <p className="text-gray-400 mb-8 text-lg">Your solution successfully passed all tests!</p>
                        
                        <div className="grid grid-cols-3 gap-4 w-full">
                          <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                            <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Test Cases</span>
                            <span className="text-2xl font-mono text-white">{submitResult.passedTestCases}<span className="text-gray-500 text-lg">/{submitResult.totalTestCases}</span></span>
                          </div>
                          <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                            <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Runtime</span>
                            <span className="text-2xl font-mono text-white">{submitResult.runtime}<span className="text-gray-500 text-lg ml-1">s</span></span>
                          </div>
                          <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                            <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Memory</span>
                            <span className="text-2xl font-mono text-white">{submitResult.memory}<span className="text-gray-500 text-lg ml-1">KB</span></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
                         <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-12 h-12 text-red-400">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="font-black text-3xl text-red-400 mb-2">{submitResult.error}</h4>
                        <p className="text-gray-400 mb-8">Your solution failed on some hidden test cases.</p>
                        
                        <div className="bg-black/30 p-6 rounded-xl border border-white/5 w-full">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 font-medium">Test Cases Passed</span>
                            <span className="font-mono text-white font-bold">{submitResult.passedTestCases} / {submitResult.totalTestCases}</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2.5 mt-4 overflow-hidden">
                            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(submitResult.passedTestCases / submitResult.totalTestCases) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60%] text-gray-500 space-y-4 opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  <p className="text-lg">Submit your code to see final evaluation results here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;