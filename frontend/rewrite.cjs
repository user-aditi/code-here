const fs = require('fs');
let code = fs.readFileSync('src/pages/ProblemPage.jsx', 'utf8');

const startIdx = code.indexOf('      {/* ── Main workspace ── */}');
const layout = `      {/* ── Main workspace ── */}
      <div className="flex flex-1 overflow-hidden relative p-2 gap-2 bg-[#000000]">
        <ResizablePanelGroup direction="horizontal" className="gap-2">
          {/* Left Panel */}
          <ResizablePanel 
            defaultSize={45} 
            minSize={15} 
            collapsible={true} 
            collapsedSize={4}
            onCollapse={() => setLeftCollapsed(true)}
            onExpand={() => setLeftCollapsed(false)}
            className="flex flex-col relative transition-all duration-300" 
          >
            {leftCollapsed ? (
              <div className="w-full h-full flex flex-col items-center py-4 bg-[#161616] rounded-xl border border-white/10">
                <button onClick={() => setLeftCollapsed(false)} className="mb-6 p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center gap-6 mt-4">
                  {[
                    { id: 'description', label: 'Description' },
                    { id: 'editorial', label: 'Editorial' },
                    { id: 'solutions', label: 'Solutions' },
                    { id: 'submissions', label: 'Submissions' }
                  ].map(({ id, label }) => (
                    <button 
                      key={id} 
                      onClick={() => { setActiveLeftTab(id); setLeftCollapsed(false); }} 
                      className="text-[10px] font-medium text-slate-500 hover:text-white transition-colors tracking-widest uppercase"
                      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                      {label}
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
                    { id: 'submissions', label: 'Submissions' }
                  ].map(({ id, label }) => (
                    <button key={id} onClick={() => setActiveLeftTab(id)} className={\`shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap \${activeLeftTab === id ? 'text-white border-white' : 'text-slate-400 border-transparent hover:text-white'}\`}>
                      {label}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center pr-1">
                    <button onClick={() => setLeftCollapsed(true)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
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
                      <div className="prose prose-invert max-w-none prose-p:leading-relaxed text-slate-300 text-[13px] whitespace-pre-wrap">
                        {problem.description}
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
                </div>
              </div>
            )}
          </ResizablePanel>

          <ResizableHandle className="w-1.5 bg-transparent cursor-col-resize" />

          {/* Right Panel (Editor + Console) */}
          <ResizablePanel defaultSize={55} className="flex flex-col relative">
            <ResizablePanelGroup direction="vertical" className="gap-2">
              {/* Editor */}
              <ResizablePanel defaultSize={60} minSize={20} className="flex flex-col relative">
                <div className="w-full h-full flex flex-col bg-[#161616] rounded-xl border border-white/10 overflow-hidden">
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
                          if(init) setCode(init);
                      }} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" title="Reset Code">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 w-full h-full relative bg-[#161616]">
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
                        scrollBeyondLastLine: false,
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

              <ResizableHandle className="h-1.5 bg-transparent cursor-row-resize" />

              {/* Console */}
              <ResizablePanel defaultSize={40} minSize={10} collapsible={true} collapsedSize={6} className="flex flex-col relative">
                <div className="w-full h-full flex flex-col bg-[#161616] rounded-xl border border-white/10 overflow-hidden">
                  <div className="flex items-center border-b border-white/10 shrink-0 px-2 bg-[#1a1a1a]">
                    {[
                      { id: 'testcases', label: 'Test Cases' },
                      { id: 'results', label: 'Results' },
                    ].map(({ id, label }) => (
                      <button key={id} onClick={() => setActiveRightTab(id)} className={\`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap \${activeRightTab === id ? 'text-white border-white' : 'text-slate-400 border-transparent hover:text-white'}\`}>
                        {id === 'results' && (runState === 'running' || submitState === 'running') ? (
                          <span className="flex items-center gap-1">{label} <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" /></span>
                        ) : label}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {activeRightTab === 'testcases' && (
                      <div className="space-y-3">
                        {problem.visibleTestCases?.map((tc, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-3">
                            <p className="text-xs font-semibold text-slate-400 mb-2">Case {i + 1}</p>
                            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap mb-2">{tc.input}</pre>
                            <p className="text-xs text-slate-400">Expected: <span className="text-green-400">{tc.output}</span></p>
                          </div>
                        ))}
                      </div>
                    )}
                    {activeRightTab === 'results' && (
                      <div>
                        {runState === 'idle' && submitState === 'idle' && (
                          <div className="text-center py-8 text-slate-500"><p className="text-xs">Run your code to see results</p></div>
                        )}
                        {(runState === 'running' || submitState === 'running') && (
                          <div className="text-center py-8 text-slate-400"><span className="loading loading-spinner text-primary"></span><p className="text-xs mt-2">Executing...</p></div>
                        )}
                        {runResult && runState !== 'running' && (
                          <div>
                            <div className={\`p-4 rounded-xl border mb-6 \${runResult.success ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}\`}>
                              <h4 className={\`text-sm font-bold flex items-center gap-2 \${runResult.success ? 'text-green-400' : 'text-red-400'}\`}>
                                {runResult.success ? <CheckCircle className="w-4 h-4"/> : <X className="w-4 h-4" />}
                                {runResult.success ? 'Accepted' : 'Wrong Answer / Error'}
                              </h4>
                              {runResult.success && <div className="flex gap-4 mt-2 text-[10px] text-slate-400 font-mono"><span>Runtime: {runResult.runtime}s</span><span>Mem: {runResult.memory}KB</span></div>}
                            </div>
                            <div className="space-y-3">
                              {runResult.testCases?.map((tc, i) => (
                                <div key={i} className={\`bg-[#2d2d2d] border \${tc.status_id===3 ? 'border-white/10' : 'border-red-500/30'} p-3 rounded-lg text-sm\`}>
                                  <h5 className="font-semibold text-slate-400 text-[10px] uppercase mb-2">Case {i+1} {tc.status_id===3 ? <span className="text-green-400 ml-2">Pass</span> : <span className="text-red-400 ml-2">Fail</span>}</h5>
                                  <div className="font-mono text-xs space-y-2">
                                    <div><strong className="text-slate-500 block">Input</strong> <div className="bg-[#1e1e1e] p-1.5 rounded">{tc.stdin}</div></div>
                                    <div><strong className="text-slate-500 block">Output</strong> <div className="bg-[#1e1e1e] p-1.5 rounded">{tc.stdout || 'N/A'}</div></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {submitResult && submitState !== 'running' && (
                          <div className={\`p-6 rounded-2xl border \${submitResult.accepted ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} text-center\`}>
                            <h4 className={\`text-xl font-black mb-2 \${submitResult.accepted ? 'text-green-400' : 'text-red-400'}\`}>
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
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* AI Panel */}
          {aiOpen && (
            <>
              <ResizableHandle className="w-1.5 bg-transparent cursor-col-resize" />
              <ResizablePanel defaultSize={25} minSize={20} className="flex flex-col relative">
                <div className="w-full h-full flex flex-col bg-[#161616] rounded-xl border border-purple-500/30 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0 bg-[#1a1a1a]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs font-semibold text-white">AI Assistant</span>
                    </div>
                    <button onClick={() => setAiOpen(false)} className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <ChatAi problem={problem} />
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}

        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
`;

const newCode = code.slice(0, startIdx) + layout;
fs.writeFileSync('src/pages/ProblemPage.jsx', newCode);
console.log('Layout replaced');
