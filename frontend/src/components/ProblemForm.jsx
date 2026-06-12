// src/components/ProblemForm.jsx

import React from 'react';
import { useFieldArray } from 'react-hook-form';

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
      {/* Basic Information Card */}
      <div className="card bg-base-100 shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Title</span></label>
            <input
              {...register('title')}
              className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
            />
            {errors.title && <span className="text-error">{errors.title.message}</span>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Description</span></label>
            <textarea
              {...register('description')}
              className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
            />
            {errors.description && <span className="text-error">{errors.description.message}</span>}
          </div>

          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label"><span className="label-text">Difficulty</span></label>
              <select {...register('difficulty')} className={`select select-bordered ${errors.difficulty ? 'select-error' : ''}`}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-control w-1/2">
              <label className="label"><span className="label-text">Tag</span></label>
              <select {...register('tags')} className={`select select-bordered ${errors.tags ? 'select-error' : ''}`}>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Card */}
      <div className="card bg-base-100 shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
        
        {/* Visible Test Cases */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Visible Test Cases</h3>
            <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-primary">
              Add Visible Case
            </button>
          </div>
          {visibleFields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-lg space-y-2">
              <div className="flex justify-end">
                <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-error">Remove</button>
              </div>
              <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full" />
              <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full" />
              <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className="textarea textarea-bordered w-full" />
            </div>
          ))}
        </div>

        {/* Hidden Test Cases */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Hidden Test Cases</h3>
            <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-primary">
              Add Hidden Case
            </button>
          </div>
          {hiddenFields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-lg space-y-2">
              <div className="flex justify-end">
                <button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-error">Remove</button>
              </div>
              <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full" />
              <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Code Templates Card */}
      <div className="card bg-base-100 shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
        <div className="space-y-6">
          {['C++', 'Java', 'JavaScript'].map((lang, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{lang}</h3>
              <div className="form-control">
                <label className="label"><span className="label-text">Initial Code</span></label>
                <textarea {...register(`startCode.${index}.initialCode`)} className="textarea textarea-bordered font-mono h-24" rows={6} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Reference Solution</span></label>
                <textarea {...register(`referenceSolution.${index}.completeCode`)} className="textarea textarea-bordered font-mono h-24" rows={6} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        {isUpdating ? 'Update Problem' : 'Create Problem'}
      </button>
    </form>
  );
}

export default ProblemForm;