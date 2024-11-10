// components/Overlay.js
import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';

function Overlay() {
    const {  telegramID, continueDay } = useContext(UserContext);
    
    const closeOverlay = async () => {
        await axios.post(`${process.env.REACT_APP_SERVER_URL}dailyReward-claim`, { telegramID });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gradient-to-r from-blue-50 to-purple-100 p-8 rounded-xl shadow-xl border border-gray-200 max-w-sm w-full transform transition-all duration-300 ease-in-out">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Day {continueDay} Check-In
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    Keep up the streak! Collect your daily reward for Day {continueDay}.
                </p>
                <button 
                    onClick={closeOverlay} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-200 ease-in-out w-full"
                >
                    Collect Reward
                </button>
            </div>
        </div>
    );
}

export default Overlay;
