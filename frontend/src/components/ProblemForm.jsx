import React, { useState, useEffect, useRef } from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { ChevronRight, ChevronLeft, Check, Edit3, Save, Code2, Plus, Trash2, TerminalSquare, Info, LayoutTemplate, Server, X } from 'lucide-react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const AVAILABLE_TAGS = [
  "Array", "String", "Hash Table", "Dynamic Programming", "Math", "Sorting",
  "Greedy", "Depth-First Search", "Database", "Breadth-First Search",
  "Binary Search", "Tree", "Matrix", "Two Pointers", "Bit Manipulation",
  "Stack", "Heap (Priority Queue)", "Graph", "Simulation", "Prefix Sum",
  "Sliding Window", "Backtracking", "Linked List", "Trie", "Divide and Conquer"
];

const LANGUAGES = ['C++', 'Java', 'JavaScript'];

function ProblemForm({ handleSubmit, onSubmit, register, control, errors, watch, trigger, isUpdating = false, isSubmitting = false, isDirty = false }) {
  const [step, setStep] = useState(isUpdating ? 4 : 1);
  const [isValidating, setIsValidating] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState('C++');

  const tagContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagContainerRef.current && !tagContainerRef.current.contains(event.target)) {
        setIsTagDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentValues = watch();

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control, name: 'visibleTestCases'
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
    control, name: 'hiddenTestCases'
  });

  const STEPS = [
    { id: 1, label: 'Basic Info' },
    { id: 2, label: 'Test Cases' },
    { id: 3, label: 'Code Templates' },
    { id: 4, label: 'Review & Submit' }
  ];

  const handleNext = async () => {
    setIsValidating(true);
    let fieldsToValidate = [];

    if (step === 1) {
      fieldsToValidate = ['title', 'description', 'difficulty', 'tags'];
    } else if (step === 2) {
      fieldsToValidate = ['visibleTestCases', 'hiddenTestCases'];
    } else if (step === 3) {
      fieldsToValidate = ['startCode', 'referenceSolution'];
    }

    const isValid = await trigger(fieldsToValidate);
    setIsValidating(false);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const renderProgressBar = () => (
    <div className="mb-14 mt-8 max-w-4xl mx-auto px-4">
      <div className="flex justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 z-0 rounded-full"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 z-0 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>

        {STEPS.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${step >= s.id
                ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-110'
                : 'bg-[#111] border-white/10 text-white/40'
              }`}>
              {step > s.id ? <Check size={18} /> : s.id}
            </div>
            <span className={`text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-colors ${step >= s.id ? 'text-blue-400' : 'text-white/30'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
      {renderProgressBar()}

      <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative max-w-5xl mx-auto">

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Info size={20} />
              </div>
              <h3 className="text-2xl font-semibold text-white">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text font-medium text-white/60">Problem Title</span></label>
                <input
                  {...register('title')}
                  className={`input w-full bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-14 rounded-2xl transition-all ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="e.g. Two Sum"
                />
                {errors.title && <span className="text-red-400 text-xs mt-2">{errors.title.message}</span>}
              </div>

              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text font-medium text-white/60">Description (Markdown Supported)</span></label>
                <textarea
                  {...register('description')}
                  className={`textarea w-full bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-48 rounded-2xl p-4 transition-all ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe the problem, constraints, and requirements..."
                />
                {errors.description && <span className="text-red-400 text-xs mt-2">{errors.description.message}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-white/60">Difficulty</span></label>
                <select {...register('difficulty')} className="select w-full bg-white/5 border-white/10 text-white focus:border-blue-500 h-14 rounded-2xl">
                  <option value="easy" className="bg-[#111] text-white">Easy</option>
                  <option value="medium" className="bg-[#111] text-white">Medium</option>
                  <option value="hard" className="bg-[#111] text-white">Hard</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-white/60">Problem Tags</span></label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => {
                    const selectedTags = field.value || [];
                    const toggleTag = (tag) => {
                      if (selectedTags.includes(tag)) {
                        field.onChange(selectedTags.filter(t => t !== tag));
                      } else {
                        field.onChange([...selectedTags, tag]);
                      }
                    };
                    const filteredTags = AVAILABLE_TAGS.filter(t => t.toLowerCase().includes(tagSearch.toLowerCase()));

                    return (
                      <div className="relative w-full" ref={tagContainerRef}>
                        <div
                          className={`min-h-[56px] w-full bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-wrap gap-2 items-center cursor-text transition-all ${isTagDropdownOpen ? 'border-blue-500 ring-1 ring-blue-500 bg-white/10' : ''} ${errors.tags ? 'border-red-500' : ''}`}
                          onClick={() => setIsTagDropdownOpen(true)}
                        >
                          {selectedTags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold flex items-center gap-1 border border-blue-500/20">
                              {tag}
                              <button type="button" className="opacity-60 hover:opacity-100 hover:text-white transition-opacity" onClick={(e) => { e.stopPropagation(); toggleTag(tag); }}>
                                <Trash2 size={12} />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            className="bg-transparent outline-none flex-1 min-w-[120px] text-white text-sm"
                            placeholder={selectedTags.length === 0 ? "Search and select tags..." : ""}
                            value={tagSearch}
                            onChange={(e) => setTagSearch(e.target.value)}
                            onFocus={() => setIsTagDropdownOpen(true)}
                          />
                          {isTagDropdownOpen && (
                            <button type="button" onClick={(e) => { e.stopPropagation(); setIsTagDropdownOpen(false); }} className="p-1 text-white/40 hover:text-white transition-colors ml-auto">
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        {isTagDropdownOpen && (
                          <div className="absolute z-50 mt-2 w-full bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                            <ul className="max-h-60 overflow-y-auto p-2 space-y-1">
                              {filteredTags.length > 0 ? filteredTags.map(tag => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                  <li
                                    key={tag}
                                    className={`px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all flex justify-between items-center ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-white/70 hover:text-white'}`}
                                    onClick={() => { toggleTag(tag); setTagSearch(''); }}
                                  >
                                    {tag}
                                    {isSelected && <Check size={16} />}
                                  </li>
                                )
                              }) : (
                                <li className="px-4 py-3 text-sm text-white/40 text-center">No tags found</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                {errors.tags && <span className="text-red-400 text-xs mt-2">{errors.tags.message}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Test Cases */}
        {step === 2 && (
          <div className="p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <TerminalSquare size={20} />
              </div>
              <h3 className="text-2xl font-semibold text-white">Test Suite</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visible Tests */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white/70 uppercase tracking-widest">Visible Examples</h4>
                  <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-400/10 px-3 py-1.5 rounded-full transition-colors">
                    <Plus size={14} /> Add Example
                  </button>
                </div>

                <div className="space-y-4">
                  {visibleFields.map((field, index) => (
                    <div key={field.id} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-5 transition-all relative">
                      <button type="button" onClick={() => removeVisible(index)} className="absolute top-4 right-4 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={16} />
                      </button>
                      <h5 className="text-xs font-bold text-white/30 mb-4 tracking-wider">EXAMPLE {index + 1}</h5>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] uppercase text-white/40 font-bold mb-1 block">Input</label>
                          <input {...register(`visibleTestCases.${index}.input`)} className="input w-full h-10 bg-black/40 border-0 focus:ring-1 ring-purple-500/50 text-sm font-mono text-purple-200 rounded-xl" placeholder="e.g. nums = [2,7]" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase text-white/40 font-bold mb-1 block">Output</label>
                          <input {...register(`visibleTestCases.${index}.output`)} className="input w-full h-10 bg-black/40 border-0 focus:ring-1 ring-purple-500/50 text-sm font-mono text-purple-200 rounded-xl" placeholder="e.g. [0,1]" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase text-white/40 font-bold mb-1 block">Explanation</label>
                          <textarea {...register(`visibleTestCases.${index}.explanation`)} className="textarea w-full bg-black/40 border-0 focus:ring-1 ring-purple-500/50 text-sm text-white/70 rounded-xl py-2" rows={2} placeholder="Why is this the output?" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Tests */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white/70 uppercase tracking-widest">Hidden Validation</h4>
                  <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 bg-pink-400/10 px-3 py-1.5 rounded-full transition-colors">
                    <Plus size={14} /> Add Hidden
                  </button>
                </div>

                <div className="space-y-3">
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-4 transition-all flex gap-4 items-center">
                      <div className="w-6 h-6 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-xs font-bold text-white/40 shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input {...register(`hiddenTestCases.${index}.input`)} className="input h-10 bg-black/40 border-0 focus:ring-1 ring-pink-500/50 text-sm font-mono text-pink-200 rounded-xl" placeholder="Input" />
                        <input {...register(`hiddenTestCases.${index}.output`)} className="input h-10 bg-black/40 border-0 focus:ring-1 ring-pink-500/50 text-sm font-mono text-pink-200 rounded-xl" placeholder="Expected Output" />
                      </div>
                      <button type="button" onClick={() => removeHidden(index)} className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {(errors.visibleTestCases || errors.hiddenTestCases) && (
              <div className="text-red-400 text-sm font-medium mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">Please ensure all test cases have required inputs and outputs.</div>
            )}
          </div>
        )}

        {/* Step 3: Code Environments */}
        {step === 3 && (
          <div className="p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Code2 size={20} />
              </div>
              <h3 className="text-2xl font-semibold text-white">Code Environments</h3>
            </div>

            <div className="bg-[#0f0f11] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex border-b border-white/5 bg-black/20">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLangTab(lang)}
                    className={`flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-all ${activeLangTab === lang
                        ? 'text-emerald-400 bg-emerald-500/10 border-b-2 border-emerald-400'
                        : 'text-white/40 hover:bg-white/5 hover:text-white/70 border-b-2 border-transparent'
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {LANGUAGES.map((lang, index) => (
                  <div key={lang} className={activeLangTab === lang ? 'block space-y-8' : 'hidden'}>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {/* Driver Code */}
                      <div className="xl:col-span-2 bg-black/60 rounded-2xl border border-white/5 overflow-hidden">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider">
                            <Server size={14} className="text-blue-400" />
                            Hidden Driver Code
                          </div>
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">__USER_CODE__</span>
                        </div>
                        <div className="h-48">
                          <Controller
                            name={`startCode.${index}.driverCode`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="100%"
                                defaultLanguage={lang.toLowerCase() === 'c++' ? 'cpp' : lang.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 14, padding: { top: 16 } }}
                              />
                            )}
                          />
                        </div>
                      </div>

                      {/* Starter Template */}
                      <div className="bg-black/60 rounded-2xl border border-white/5 overflow-hidden">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider">
                          <LayoutTemplate size={14} className="text-emerald-400" />
                          Starter Template
                        </div>
                        <div className="h-64">
                          <Controller
                            name={`startCode.${index}.initialCode`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="100%"
                                defaultLanguage={lang.toLowerCase() === 'c++' ? 'cpp' : lang.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 14, padding: { top: 16 } }}
                              />
                            )}
                          />
                        </div>
                      </div>

                      {/* Reference Solution */}
                      <div className="bg-black/60 rounded-2xl border border-white/5 overflow-hidden">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider">
                          <Check size={14} className="text-green-400" />
                          Reference Solution
                        </div>
                        <div className="h-64">
                          <Controller
                            name={`referenceSolution.${index}.completeCode`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="100%"
                                defaultLanguage={lang.toLowerCase() === 'c++' ? 'cpp' : lang.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 14, padding: { top: 16 } }}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <input type="hidden" value={lang} {...register(`startCode.${index}.language`)} />
                    <input type="hidden" value={lang} {...register(`referenceSolution.${index}.language`)} />
                  </div>
                ))}
              </div>
            </div>
            {(errors.startCode || errors.referenceSolution) && (
              <div className="text-red-400 text-sm font-medium mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">Please ensure all required code fields are filled.</div>
            )}
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">Review Draft</h3>
                <p className="text-sm text-white/40 mt-1">Check your configurations before publishing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Problem Statement & Info */}
              <div
                className="bg-white/5 border border-white/10 rounded-3xl p-8 relative group transition-colors hover:bg-white/[0.07]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-3xl font-bold text-white mb-3">{currentValues.title || 'Untitled Problem'}</h4>
                    <div className="flex gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize bg-black/40 border border-white/5 ${currentValues.difficulty === 'easy' ? 'text-green-400' : currentValues.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {currentValues.difficulty || 'easy'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentValues.tags && currentValues.tags.length > 0 ? currentValues.tags.map(tag => (
                          <span key={tag} className="px-4 py-1.5 rounded-full text-xs font-bold capitalize bg-blue-500/20 text-blue-300 border border-blue-500/20">
                            {tag}
                          </span>
                        )) : (
                          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-black/40 border border-white/5 text-white/40">
                            No tags selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-sm btn-ghost rounded-xl text-white/40 hover:text-white">
                    <Edit3 size={14} /> Edit Info
                  </button>
                </div>

                <div className="prose prose-invert max-w-none w-full p-6 bg-black/40 rounded-2xl border border-white/5">
                  {currentValues.description ? (
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {currentValues.description}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-white/40 italic">No description provided.</p>
                  )}
                </div>
              </div>

              {/* Test Cases */}
              <div
                className="bg-white/5 border border-white/10 rounded-3xl p-8 relative group transition-colors hover:bg-white/[0.07]"
              >
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2"><TerminalSquare size={20} className="text-purple-400" /> Test Suite</h4>
                  <button type="button" onClick={() => setStep(2)} className="btn btn-sm btn-ghost rounded-xl text-white/40 hover:text-white">
                    <Edit3 size={14} /> Edit Tests
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">Visible Examples</h5>
                    <div className="space-y-4">
                      {currentValues.visibleTestCases?.length > 0 ? currentValues.visibleTestCases.map((tc, idx) => (
                        <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-4">
                          <p className="text-xs font-mono text-white/50 mb-1">Input</p>
                          <pre className="text-sm text-white bg-[#111] p-2 rounded-lg mb-3 overflow-x-auto">{tc.input || ' '}</pre>
                          <p className="text-xs font-mono text-white/50 mb-1">Output</p>
                          <pre className="text-sm text-green-400 bg-[#111] p-2 rounded-lg mb-3 overflow-x-auto">{tc.output || ' '}</pre>
                          <p className="text-xs font-mono text-white/50 mb-1">Explanation</p>
                          <p className="text-sm text-white/80">{tc.explanation || 'None'}</p>
                        </div>
                      )) : <p className="text-white/40 text-sm">No visible test cases.</p>}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-pink-400 uppercase tracking-widest mb-4">Hidden Validation</h5>
                    <div className="space-y-4">
                      {currentValues.hiddenTestCases?.length > 0 ? currentValues.hiddenTestCases.map((tc, idx) => (
                        <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-mono text-white/50 mb-1">Input</p>
                              <pre className="text-sm text-white bg-[#111] p-2 rounded-lg overflow-x-auto">{tc.input || ' '}</pre>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-mono text-white/50 mb-1">Expected</p>
                              <pre className="text-sm text-green-400 bg-[#111] p-2 rounded-lg overflow-x-auto">{tc.output || ' '}</pre>
                            </div>
                          </div>
                        </div>
                      )) : <p className="text-white/40 text-sm">No hidden test cases.</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Templates Summary */}
              <div
                className="bg-white/5 border border-white/10 rounded-3xl p-8 relative group transition-colors hover:bg-white/[0.07]"
              >
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2"><Code2 size={20} className="text-emerald-400" /> Code Environments</h4>
                  <button type="button" onClick={() => setStep(3)} className="btn btn-sm btn-ghost rounded-xl text-white/40 hover:text-white">
                    <Edit3 size={14} /> Edit Code
                  </button>
                </div>

                <div className="space-y-8">
                  {LANGUAGES.map((lang, idx) => {
                    const sc = currentValues.startCode?.[idx];
                    const ref = currentValues.referenceSolution?.[idx];
                    return (
                      <div key={lang} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="bg-white/5 px-4 py-3 border-b border-white/5 font-bold text-emerald-400 tracking-wider">
                          {lang} Environment
                        </div>
                        <div className="p-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
                          <div className="xl:col-span-3">
                            <p className="text-xs font-mono text-blue-400 mb-2 uppercase flex items-center gap-1"><Server size={12} /> Driver Code</p>
                            <pre className="text-xs text-white/70 bg-[#111] p-3 rounded-xl overflow-x-auto max-h-48 border border-white/5">{sc?.driverCode || '// Empty'}</pre>
                          </div>
                          <div className="xl:col-span-1">
                            <p className="text-xs font-mono text-emerald-400 mb-2 uppercase flex items-center gap-1"><LayoutTemplate size={12} /> Starter Template</p>
                            <pre className="text-xs text-white/70 bg-[#111] p-3 rounded-xl overflow-x-auto max-h-48 border border-white/5">{sc?.initialCode || '// Empty'}</pre>
                          </div>
                          <div className="xl:col-span-2">
                            <p className="text-xs font-mono text-green-400 mb-2 uppercase flex items-center gap-1"><Check size={12} /> Reference Solution</p>
                            <pre className="text-xs text-white/70 bg-[#111] p-3 rounded-xl overflow-x-auto max-h-48 border border-white/5">{ref?.completeCode || '// Empty'}</pre>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Nav */}
        <div className="px-8 py-5 border-t border-white/5 bg-black/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="btn btn-ghost rounded-xl text-white/60 hover:text-white"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
          ) : <div></div>}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isValidating}
              className="btn btn-primary rounded-xl px-8 font-bold"
            >
              Next Step
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || (isUpdating && !isDirty)}
              className="btn bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 border-0 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><span className="loading loading-spinner loading-sm"></span> Publishing...</>
              ) : (
                <><Save size={18} /> {isUpdating ? 'Update' : 'Publish'} Problem</>
              )}
            </button>
          )}
        </div>

      </div>
    </form>
  );
}

export default ProblemForm;