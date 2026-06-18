import React from 'react';
import Navbar from '../components/layout/Navbar';

function ComingSoon() {
  return (
    <div className="flex flex-col h-screen bg-base-100">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6 shadow-sm border border-base-300">
          <span className="text-4xl">🚧</span>
        </div>
        <h1 className="text-3xl font-extrabold text-base-content mb-3 tracking-tight">Coming Soon</h1>
        <p className="text-base-content/60 max-w-md text-sm leading-relaxed">
          We are working hard to bring this feature to life. 
          Stay tuned for updates as we continue to build out the platform.
        </p>
        <button 
          onClick={() => window.history.back()} 
          className="mt-8 btn btn-primary px-8 rounded-full shadow-lg shadow-primary/20"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default ComingSoon;
