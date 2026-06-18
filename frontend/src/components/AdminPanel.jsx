import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import ProblemForm from './ProblemForm';

// Zod schema matching the problem schema
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

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      tags: [],
      startCode: [
        { language: 'C++', initialCode: '', driverCode: '' },
        { language: 'Java', initialCode: '', driverCode: '' },
        { language: 'JavaScript', initialCode: '', driverCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/admin');
    } catch (error) {
      if (error.response?.data?.details) {
        alert(`Error: ${error.response.data.message}\nDetails: ${error.response.data.details.stderr || error.response.data.details.compile_output || "Wrong Answer"}`);
      } else {
        alert(`Error: ${error.response?.data?.message || error.response?.data || error.message}`);
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      
      <ProblemForm 
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        trigger={trigger}
        isUpdating={false}
        isSubmitting={isSubmitting}
        isDirty={isDirty}
      />
    </div>
  );
}

export default AdminPanel;