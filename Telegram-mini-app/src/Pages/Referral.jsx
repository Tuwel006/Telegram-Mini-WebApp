// components/Referral.js
import React from 'react';
import { FaCopy, FaShareAlt } from 'react-icons/fa';

const Referral = () => {
  const telegramBotUrl = "https://t.me/@tarbocoin_bot?start=referral_code"; // Replace with your bot's URL

  const handleCopy = () => {
    navigator.clipboard.writeText(telegramBotUrl);
    alert("Bot link copied to clipboard!");
  };

  const handleShare = () => {
    // Open the Telegram URL with a "share" intent on mobile devices
    window.open(telegramBotUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 bg-gray-800">
    <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 w-full max-w-xs mx-auto mt-6">
      <h2 className="text-lg font-semibold text-blue-600 mb-2 text-center">Invite Friends</h2>
      
      {/* Display Telegram bot URL */}
      <div className="flex items-center bg-gray-100 p-2 rounded-md mb-4 w-full">
        <input 
          type="text" 
          value={telegramBotUrl} 
          readOnly 
          className="flex-grow text-sm text-gray-700 bg-transparent outline-none"
        />
        <button onClick={handleCopy} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaCopy />
        </button>
      </div>

      {/* Referral Button */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md w-full font-medium hover:bg-blue-700 transition"
      >
        <FaShareAlt className="mr-2" /> Share Referral Link
      </button>
    </div>
    </div>
  );
};

export default Referral;
