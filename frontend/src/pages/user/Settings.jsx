import React from 'react';
import Navbar from '../../components/layout/Navbar';

export default function Settings() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="bg-[#161616] border border-white/10 rounded-xl p-6">
          <p className="text-slate-400">Settings page content coming soon.</p>
        </div>
      </div>
    </div>
  );
}
