import React from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Wallet, LogOut, ArrowRightLeft, CreditCard, Coins, ChevronRight } from 'lucide-react';
import { EXCHANGE_RATE } from '../constants';

export const Profile: React.FC = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 pt-10 text-white rounded-b-[2rem] shadow-xl">
        <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/30">
                {user.phoneNumber.slice(-2)}
            </div>
            <div className="ml-4">
                <h1 className="text-xl font-bold">{user.phoneNumber}</h1>
                <p className="text-sm opacity-80">ID: {user.id.toUpperCase()}</p>
            </div>
            <button onClick={logout} className="ml-auto bg-white/10 p-2 rounded-full hover:bg-white/20">
                <LogOut size={18} />
            </button>
        </div>

        {/* Main Balance Card */}
        <div className="bg-white text-gray-800 p-5 rounded-2xl shadow-lg mb-4">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Main Balance (Cash)</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">${user.mainBalance.toFixed(2)}</h2>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <CreditCard size={20} />
                </div>
            </div>
            <div className="flex gap-3 mt-4">
                <button 
                    onClick={() => navigate('/topup')}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold shadow-md active:scale-95 transition-transform"
                >
                    Top Up
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform">
                    Withdraw
                </button>
            </div>
        </div>
      </div>

      <div className="p-4 -mt-6">
        {/* Shopping Balance & Points Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-bold uppercase">Shopping Bal</span>
                    <Wallet size={16} className="text-purple-500" />
                </div>
                <div className="mt-3">
                    <span className="text-2xl font-bold text-gray-900">${user.shoppingBalance.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">From Points</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Coins size={80} />
                </div>
                <div className="flex justify-between items-start z-10">
                    <span className="text-xs text-gray-500 font-bold uppercase">Reward Points</span>
                    <Coins size={16} className="text-orange-500" />
                </div>
                <div className="mt-3 z-10">
                    <span className="text-2xl font-bold text-gray-900">{user.pointBalance}</span>
                </div>
                 <p className="text-[10px] text-gray-400 mt-1 z-10">Rate: {EXCHANGE_RATE}pts = $1</p>
            </div>
        </div>

        {/* Actions List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between active:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mr-3">
                        <ArrowRightLeft size={18} />
                    </div>
                    <span className="font-medium text-sm">Exchange Points</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </div>
             <div className="p-4 border-b border-gray-100 flex items-center justify-between active:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600 mr-3">
                        <Wallet size={18} />
                    </div>
                    <span className="font-medium text-sm">Transaction History</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </div>
        </div>
      </div>
    </div>
  );
};