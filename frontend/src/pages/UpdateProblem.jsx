// src/pages/UpdateProblem.jsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import ProblemForm from '../components/ProblemForm'; // Import the reusable form

const LANGUAGES = ['C++', 'Java', 'JavaScript'];

// Zod schema matching the one in AdminPanel
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required'),
      driverCode: z.string().optional()
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function UpdateProblem() {
  const { id } = useParams(); // Get problem ID from URL
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset, // Use reset to populate form
    watch,
    trigger,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(problemSchema),
  });

  // Fetch problem data on component mount
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/problem/problemById/${id}`);
        const data = response.data;
        
        // Align arrays to match the UI tab order (C++, Java, JavaScript)
        const alignedStartCode = LANGUAGES.map(lang => {
          const found = data.startCode?.find(s => s.language === lang);
          return found || { language: lang, initialCode: '', driverCode: '' };
        });
        
        const alignedReferenceSolution = LANGUAGES.map(lang => {
          const found = data.referenceSolution?.find(s => s.language === lang);
          return found || { language: lang, completeCode: '' };
        });

        data.startCode = alignedStartCode;
        data.referenceSolution = alignedReferenceSolution;

        // Populate the form with the fetched data
        reset(data);
      } catch (error) {
        alert('Failed to fetch problem data.');
        console.error(error);
      }
    };
    fetchProblem();
  }, [id, reset]);

  // Handle the form submission for updating
  const onSubmit = async (data) => {
    try {
      await axiosClient.put(`/problem/update/${id}`, data);
      alert('Problem updated successfully!');
      navigate('/'); // Or navigate to the admin problems list
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

//   console.log('Form Errors:', errors);
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6 text-white">Update Problem</h1>
      <ProblemForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        trigger={trigger}
        isUpdating={true}
        isSubmitting={isSubmitting}
        isDirty={isDirty}
      />
    </div>
  );
}

export default UpdateProblem;