import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

function ProblemForm({ handleSubmit, onSubmit, register, control, errors, isUpdating = false }) {
  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-1">
        
        {/* Basic Information */}
        <AccordionItem value="item-1" className="bg-base-100/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-lg">
          <AccordionTrigger className="px-6 hover:bg-base-200/50 data-[state=open]:bg-base-200/50 transition-colors">
            <div className="flex flex-col items-start text-left">
              <h2 className="text-xl font-semibold text-base-content/90">Basic Information</h2>
              <p className="text-xs text-base-content/50 font-normal mt-1">Title, description, and difficulty settings</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-4 space-y-5">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Title</span></label>
              <input
                {...register('title')}
                className={`input input-bordered bg-base-200/50 focus:bg-base-200 transition-colors ${errors.title ? 'input-error' : 'border-white/10'}`}
                placeholder="e.g. Two Sum"
              />
              {errors.title && <span className="text-error text-sm mt-1">{errors.title.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Description</span></label>
              <textarea
                {...register('description')}
                className={`textarea textarea-bordered bg-base-200/50 focus:bg-base-200 transition-colors h-40 ${errors.description ? 'textarea-error' : 'border-white/10'}`}
                placeholder="Markdown is supported..."
              />
              {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="form-control w-full md:w-1/2">
                <label className="label"><span className="label-text font-medium">Difficulty</span></label>
                <select {...register('difficulty')} className={`select select-bordered bg-base-200/50 focus:bg-base-200 transition-colors ${errors.difficulty ? 'select-error' : 'border-white/10'}`}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="form-control w-full md:w-1/2">
                <label className="label"><span className="label-text font-medium">Tag</span></label>
                <select {...register('tags')} className={`select select-bordered bg-base-200/50 focus:bg-base-200 transition-colors ${errors.tags ? 'select-error' : 'border-white/10'}`}>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Test Cases */}
        <AccordionItem value="item-2" className="bg-base-100/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-lg">
          <AccordionTrigger className="px-6 hover:bg-base-200/50 data-[state=open]:bg-base-200/50 transition-colors">
            <div className="flex flex-col items-start text-left">
              <h2 className="text-xl font-semibold text-base-content/90">Test Cases</h2>
              <p className="text-xs text-base-content/50 font-normal mt-1">Visible examples and hidden validation cases</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-4">
            
            {/* Visible Test Cases */}
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="font-semibold text-primary">Visible Test Cases</h3>
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-outline btn-primary rounded-lg border-primary/30">
                  + Add Visible Case
                </button>
              </div>
              
              <div className="grid gap-4">
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="bg-base-200/30 border border-white/5 p-5 rounded-xl space-y-3 relative group">
                    <button type="button" onClick={() => removeVisible(index)} className="absolute top-4 right-4 text-error/60 hover:text-error transition-colors bg-error/10 hover:bg-error/20 p-1.5 rounded-md opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                    
                    <h4 className="text-xs uppercase tracking-wider text-base-content/40 font-bold mb-2">Example {index + 1}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input (e.g. nums = [2,7,11,15], target = 9)" className="input input-sm input-bordered bg-base-100 font-mono text-sm border-white/10 w-full" />
                      </div>
                      <div className="form-control">
                        <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output (e.g. [0,1])" className="input input-sm input-bordered bg-base-100 font-mono text-sm border-white/10 w-full" />
                      </div>
                    </div>
                    <div className="form-control">
                      <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation (Optional)" className="textarea textarea-sm textarea-bordered bg-base-100 border-white/10 w-full" rows={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Test Cases */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="font-semibold text-secondary">Hidden Test Cases</h3>
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-outline btn-secondary rounded-lg border-secondary/30">
                  + Add Hidden Case
                </button>
              </div>
              
              <div className="grid gap-4">
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="bg-base-200/30 border border-white/5 p-4 rounded-xl space-y-3 relative group flex items-start gap-4">
                    <span className="text-xs font-mono text-base-content/30 mt-2">{index + 1}</span>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-sm input-bordered bg-base-100 font-mono text-sm border-white/10 w-full" />
                      <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Expected Output" className="input input-sm input-bordered bg-base-100 font-mono text-sm border-white/10 w-full" />
                    </div>
                    <button type="button" onClick={() => removeHidden(index)} className="mt-1 text-error/60 hover:text-error transition-colors p-1 rounded-md opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* Code Templates */}
        <AccordionItem value="item-3" className="bg-base-100/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-lg">
          <AccordionTrigger className="px-6 hover:bg-base-200/50 data-[state=open]:bg-base-200/50 transition-colors">
            <div className="flex flex-col items-start text-left">
              <h2 className="text-xl font-semibold text-base-content/90">Code Templates</h2>
              <p className="text-xs text-base-content/50 font-normal mt-1">Starting snippets and reference solutions</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-4">
            <div className="space-y-8">
              {['C++', 'Java', 'JavaScript'].map((lang, index) => (
                <div key={index} className="space-y-3 bg-base-200/30 p-5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <h3 className="font-bold tracking-wide">{lang}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label py-1"><span className="label-text text-xs uppercase tracking-wider text-base-content/60">Initial Code Template</span></label>
                      <textarea {...register(`startCode.${index}.initialCode`)} className="textarea textarea-bordered bg-[#1e1e1e] text-gray-300 font-mono text-sm h-32 border-white/10" spellCheck="false" />
                    </div>
                    <div className="form-control">
                      <label className="label py-1"><span className="label-text text-xs uppercase tracking-wider text-base-content/60">Reference Solution</span></label>
                      <textarea {...register(`referenceSolution.${index}.completeCode`)} className="textarea textarea-bordered bg-[#1e1e1e] text-green-400/80 font-mono text-sm h-32 border-white/10" spellCheck="false" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end pt-4 pb-12">
        <button type="submit" className="btn btn-primary px-10 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all text-lg font-bold">
          {isUpdating ? 'Update Problem' : 'Create Problem'}
        </button>
      </div>
    </form>
  );
}

export default ProblemForm;