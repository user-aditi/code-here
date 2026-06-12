// src/pages/UpdateProblemList.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';

function UpdateProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axiosClient.get('/problem/getAllProblem');
        setProblems(response.data);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading problems...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Select a Problem to Update</h1>
      <div className="overflow-x-auto">
        <table className="table w-full bg-base-100 shadow-lg">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(problem => (
              <tr key={problem._id} className="hover">
                <td>{problem.title}</td>
                <td className="capitalize">{problem.difficulty}</td>
                <td className="capitalize">{problem.tags}</td>
                <td>
                  <Link to={`/admin/update/${problem._id}`} className="btn btn-sm btn-warning">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpdateProblemList;