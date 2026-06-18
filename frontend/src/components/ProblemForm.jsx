import React, { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { ChevronRight, ChevronLeft, Check, Edit3, Save, Code2 } from 'lucide-react';

function ProblemForm({ handleSubmit, onSubmit, register, control, errors, watch, trigger, isUpdating = false }) {
  const [step, setStep] = useState(isUpdating ? 4 : 1);
  const [isValidating, setIsValidating] = useState(false);

  // Watch values for draft view
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
    <div className="mb-8">
      <div className="flex justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 z-0 rounded-full"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>
        
        {STEPS.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
              step >= s.id 
                ? 'bg-primary border-primary text-primary-content shadow-[0_0_15px_rgba(var(--p),0.4)]' 
                : 'bg-black border-white/20 text-white/40'
            }`}>
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            <span className={`text-xs font-semibold ${step >= s.id ? 'text-primary' : 'text-white/40'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {renderProgressBar()}

      <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-white">Basic Information</h2>
              <p className="text-sm text-base-content/60 mt-1">Set the core details for this problem.</p>
            </div>
            
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold text-white/80 uppercase tracking-wider text-xs">Title</span></label>
              <input
                {...register('title')}
                className={`input input-bordered bg-black/50 text-white focus:bg-black transition-colors border-white/10 focus:border-primary focus:ring-1 focus:ring-primary h-12 rounded-xl ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g. Two Sum"
              />
              {errors.title && <span className="text-error text-xs font-medium mt-2">{errors.title.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-semibold text-white/80 uppercase tracking-wider text-xs">Description (Markdown Supported)</span></label>
              <textarea
                {...register('description')}
                className={`textarea textarea-bordered bg-black/50 text-white focus:bg-black transition-colors border-white/10 focus:border-primary focus:ring-1 focus:ring-primary h-48 rounded-xl ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Write your problem description here..."
              />
              {errors.description && <span className="text-error text-xs font-medium mt-2">{errors.description.message}</span>}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="form-control w-full md:w-1/2">
                <label className="label"><span className="label-text font-semibold text-white/80 uppercase tracking-wider text-xs">Difficulty</span></label>
                <select {...register('difficulty')} className="select select-bordered bg-black/50 text-white focus:bg-black transition-colors border-white/10 focus:border-primary rounded-xl h-12">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="form-control w-full md:w-1/2">
                <label className="label"><span className="label-text font-semibold text-white/80 uppercase tracking-wider text-xs">Tag</span></label>
                <select {...register('tags')} className="select select-bordered bg-black/50 text-white focus:bg-black transition-colors border-white/10 focus:border-primary rounded-xl h-12">
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">Dynamic Programming</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Test Cases */}
        {step === 2 && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-white">Test Cases</h2>
              <p className="text-sm text-base-content/60 mt-1">Provide visible examples and hidden validation cases.</p>
            </div>
            
            {/* Visible Test Cases */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-semibold text-primary">Visible Test Cases (Examples)</h3>
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-outline btn-primary rounded-lg">
                  + Add Example
                </button>
              </div>
              
              <div className="grid gap-4">
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-4 relative group">
                    <button type="button" onClick={() => removeVisible(index)} className="absolute top-4 right-4 text-error/60 hover:text-error bg-error/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                    <h4 className="text-xs uppercase tracking-wider text-base-content/40 font-bold">Example {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input (e.g. nums = [2,7], target = 9)" className="input input-sm h-10 rounded-xl bg-black/60 font-mono text-sm border-white/10 text-white" />
                      </div>
                      <div className="form-control">
                        <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output (e.g. [0,1])" className="input input-sm h-10 rounded-xl bg-black/60 font-mono text-sm border-white/10 text-white" />
                      </div>
                    </div>
                    <div className="form-control">
                      <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation (Optional)" className="textarea textarea-sm rounded-xl bg-black/60 border-white/10 text-white" rows={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Test Cases */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-semibold text-secondary">Hidden Validation Cases</h3>
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-outline btn-secondary rounded-lg">
                  + Add Hidden Case
                </button>
              </div>
              
              <div className="grid gap-3">
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="bg-black/40 border border-white/10 p-4 rounded-xl flex items-start gap-4 relative group">
                    <span className="text-xs font-mono text-white/30 mt-3 font-bold">{index + 1}</span>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-sm h-10 rounded-lg bg-black/60 font-mono text-sm border-white/10 text-white" />
                      <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Expected Output" className="input input-sm h-10 rounded-lg bg-black/60 font-mono text-sm border-white/10 text-white" />
                    </div>
                    <button type="button" onClick={() => removeHidden(index)} className="mt-1 text-error/60 hover:text-error hover:bg-error/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {(errors.visibleTestCases || errors.hiddenTestCases) && (
              <div className="text-error text-sm font-medium">Please ensure all test cases have inputs and outputs.</div>
            )}
          </div>
        )}

        {/* Step 3: Code Templates */}
        {step === 3 && (
          <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-white">Code Templates</h2>
              <p className="text-sm text-base-content/60 mt-1">Provide the starter code and your reference solution for multiple languages.</p>
            </div>
            
            <div className="space-y-8">
              {['C++', 'Java', 'JavaScript'].map((lang, index) => (
                <div key={index} className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Code2 size={16} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-white">{lang}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label"><span className="label-text font-semibold text-white/80 uppercase tracking-wider text-xs">Starter Template</span></label>
                      <textarea {...register(`startCode.${index}.initialCode`)} className="textarea textarea-bordered bg-[#111111] text-gray-300 font-mono text-sm h-40 border-white/10 focus:border-primary rounded-xl" spellCheck="false" placeholder={`class Solution {\n  // your code here\n}`} />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text font-semibold text-white/80 uppercase tracking-wider text-xs">Reference Solution</span></label>
                      <textarea {...register(`referenceSolution.${index}.completeCode`)} className="textarea textarea-bordered bg-[#111111] text-green-400/80 font-mono text-sm h-40 border-white/10 focus:border-secondary rounded-xl" spellCheck="false" placeholder={`class Solution {\n  // working code\n}`} />
                    </div>
                    {/* Hidden fields to ensure language is submitted correctly */}
                    <input type="hidden" value={lang} {...register(`startCode.${index}.language`)} />
                    <input type="hidden" value={lang} {...register(`referenceSolution.${index}.language`)} />
                  </div>
                </div>
              ))}
            </div>
            {(errors.startCode || errors.referenceSolution) && (
              <div className="text-error text-sm font-medium">Please provide code templates for all languages.</div>
            )}
          </div>
        )}

        {/* Step 4: Draft View / Review */}
        {step === 4 && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Review Draft</h2>
                <p className="text-sm text-base-content/60 mt-1">Review your problem details before publishing.</p>
              </div>
              <button type="submit" className="btn btn-primary rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 px-8 font-bold gap-2">
                <Save size={18} />
                {isUpdating ? 'Save Changes' : 'Publish Problem'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Basic Info Summary */}
              <div 
                className="lg:col-span-2 bg-black/40 border border-white/10 rounded-2xl p-6 relative group cursor-pointer transition-colors hover:border-white/20"
                onClick={() => setStep(1)}
              >
                <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-base-200/90 backdrop-blur text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <Edit3 size={16} /> Click to Edit Info
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{currentValues.title || 'Untitled Problem'}</h3>
                <div className="flex gap-2 mb-6">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize bg-base-200 border border-white/10 ${currentValues.difficulty === 'easy' ? 'text-success' : currentValues.difficulty === 'medium' ? 'text-warning' : 'text-error'}`}>
                    {currentValues.difficulty || 'easy'}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold capitalize bg-base-200 border border-white/10 text-white/70">
                    {currentValues.tags || 'none'}
                  </span>
                </div>
                <div className="prose prose-sm prose-invert max-w-none opacity-80 h-32 overflow-hidden relative">
                  {currentValues.description || 'No description provided.'}
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#111111] to-transparent"></div>
                </div>
              </div>

              {/* Test Cases Summary */}
              <div 
                className="bg-black/40 border border-white/10 rounded-2xl p-6 relative group cursor-pointer transition-colors hover:border-white/20"
                onClick={() => setStep(2)}
              >
                <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-base-200/90 backdrop-blur text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <Edit3 size={16} /> Edit Tests
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Test Suite</h3>
                <div className="space-y-4">
                  <div className="bg-base-200/50 p-4 rounded-xl border border-white/5 text-center">
                    <span className="block text-2xl font-bold text-primary">{currentValues.visibleTestCases?.length || 0}</span>
                    <span className="text-xs uppercase tracking-wider text-white/50 font-semibold mt-1 block">Visible Examples</span>
                  </div>
                  <div className="bg-base-200/50 p-4 rounded-xl border border-white/5 text-center">
                    <span className="block text-2xl font-bold text-secondary">{currentValues.hiddenTestCases?.length || 0}</span>
                    <span className="text-xs uppercase tracking-wider text-white/50 font-semibold mt-1 block">Hidden Cases</span>
                  </div>
                </div>
              </div>

              {/* Code Templates Summary */}
              <div 
                className="lg:col-span-3 bg-black/40 border border-white/10 rounded-2xl p-6 relative group cursor-pointer transition-colors hover:border-white/20"
                onClick={() => setStep(3)}
              >
                <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                  <div className="bg-base-200/90 backdrop-blur text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <Edit3 size={16} /> Edit Code Templates
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Code Environments</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentValues.startCode?.map((sc, i) => (
                    <div key={i} className="bg-[#111111] border border-white/10 rounded-xl p-4">
                      <h4 className="font-bold text-white mb-2">{sc.language}</h4>
                      <div className="text-xs font-mono text-white/40 mb-2 truncate">Starter code length: {sc.initialCode?.length || 0} chars</div>
                      <div className="text-xs font-mono text-green-400/60 truncate">Ref solution length: {currentValues.referenceSolution?.[i]?.completeCode?.length || 0} chars</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Nav */}
        <div className="px-8 py-5 border-t border-white/10 bg-black/50 flex items-center justify-between">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={handlePrev}
              className="btn btn-ghost rounded-xl text-white/70 hover:text-white"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
          ) : <div></div>}

          {step < 4 && (
            <button 
              type="button" 
              onClick={handleNext}
              disabled={isValidating}
              className="btn btn-primary rounded-xl px-8"
            >
              Next Step
              <ChevronRight size={18} />
            </button>
          )}
        </div>

      </div>
    </form>
  );
}

export default ProblemForm;