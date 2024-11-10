// components/Guide.js
import React from 'react';

const Guide = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">User Guide</h2>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-blue-600">Withdrawal Requirements</h3>
          <p className="text-sm text-gray-700 mt-2">
            To withdraw balance, reach <span className="font-medium text-blue-700">Level 40</span> and have at least 
            <span className="font-medium text-blue-700"> 2 referrals</span>.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-blue-600">Leveling Up</h3>
          <p className="text-sm text-gray-700 mt-2">
            Participate in activities to earn points and progress through levels for rewards.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-blue-600">Referral Program</h3>
          <p className="text-sm text-gray-700 mt-2">
            Invite friends with your unique code. Each referral increases your rewards.
          </p>
        </div>

        <button
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          onClick={() => alert("Got it!")}
        >
          Got It!
        </button>
      </div>
    </div>
  );
};

export default Guide;
