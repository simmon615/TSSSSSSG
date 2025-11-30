import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Send, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useStore();
  const navigate = useNavigate();
  
  // Simulate fetching start_param from TG
  const [referrerId, setReferrerId] = useState('ADMIN001'); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }
    if (!referrerId) {
      setError('Referrer ID is mandatory for registration');
      return;
    }
    // Simulate backend validation logic
    if (referrerId.length < 3) {
      setError('Invalid Referrer ID');
      return;
    }
    
    login(phoneNumber, referrerId);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col justify-center px-6 text-white">
      <div className="mb-8 text-center">
        <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <Lock size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome</h1>
        <p className="opacity-80">Cambodia Social E-Commerce</p>
      </div>

      <form onSubmit={handleLogin} className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</label>
          <div className="flex">
            <span className="bg-gray-100 border border-gray-300 rounded-l-lg px-3 flex items-center text-gray-500">+855</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="flex-1 border border-gray-300 border-l-0 rounded-r-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12 345 678"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Invited By (Code)</label>
          <input
            type="text"
            value={referrerId}
            onChange={e => setReferrerId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Referral Code"
          />
          <p className="text-[10px] text-gray-400 mt-1">* Invitation code is required to join.</p>
        </div>

        {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <span>Get Started</span>
          <Send size={18} />
        </button>
      </form>
      
      <p className="mt-8 text-center text-xs opacity-60">
        By continuing, you agree to our Terms & Conditions.
      </p>
    </div>
  );
};