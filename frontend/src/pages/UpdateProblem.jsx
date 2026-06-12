// src/pages/UpdateProblem.jsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import ProblemForm from '../components/ProblemForm'; // Import the reusable form

// Zod schema matching the one in AdminPanel
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().min(1) })),
  hiddenTestCases: z.array(z.object({ input: z.string().min(1), output: z.string().min(1) })),
  startCode: z.array(z.object({ language: z.enum(['C++', 'Java', 'JavaScript']), initialCode: z.string().min(1) })),
  referenceSolution: z.array(z.object({ language: z.enum(['C++', 'Java', 'JavaScript']), completeCode: z.string().min(1) })),
});

function UpdateProblem() {
  const { id } = useParams(); // Get problem ID from URL
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset, // Use reset to populate form
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
  });

  // Fetch problem data on component mount
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/problem/problemById/${id}`);
        // Populate the form with the fetched data
        reset(response.data);
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
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>
      <ProblemForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        control={control}
        errors={errors}
        isUpdating={true}
      />
    </div>
  );
}

export default UpdateProblem;