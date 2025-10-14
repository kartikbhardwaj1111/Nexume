import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function IndexTest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Nexume - AI Career Platform</h1>
        <p className="text-lg mb-8">Welcome to your AI-powered career acceleration platform</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/ats-checker')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mr-4"
          >
            ATS Checker
          </button>
          
          <button 
            onClick={() => navigate('/resume')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mr-4"
          >
            Resume Builder
          </button>
          
          <button 
            onClick={() => navigate('/career')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Career Path
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mt-8">Powered by Google Gemini AI</p>
      </div>
    </div>
  );
}