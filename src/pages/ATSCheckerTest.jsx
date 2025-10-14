import React from 'react';

export default function ATSCheckerTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">ATS Checker</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 mb-4">Upload your resume and job description to get ATS compatibility score.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Resume Text</label>
              <textarea 
                className="w-full h-32 p-3 border rounded-lg"
                placeholder="Paste your resume text here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Description</label>
              <textarea 
                className="w-full h-32 p-3 border rounded-lg"
                placeholder="Paste job description here..."
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Analyze Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}