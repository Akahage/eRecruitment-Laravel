import React from 'react';

const CandidateStatus = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Candidate Application Status</h1>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-green-100 text-green-800 font-semibold">
            ✅ Status: Application Received
          </div>
          <div className="p-4 rounded-lg bg-blue-100 text-blue-800">
            📅 Submitted on: April 30, 2025
          </div>
          <div className="p-4 rounded-lg bg-yellow-100 text-yellow-800">
            ⏳ Next Step: Interview Scheduling
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateStatus;