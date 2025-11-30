import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';

export const TopUp: React.FC = () => {
  const { requestTopUp } = useStore();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !file) return;

    // Simulate file reading for proof
    const reader = new FileReader();
    reader.onloadend = () => {
      requestTopUp(parseFloat(amount), reader.result as string);
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    };
    reader.readAsDataURL(file);
  };

  if (success) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Request Submitted</h2>
            <p className="text-gray-500">Your top-up request is under review. Please wait for Admin approval.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 p-4 text-white sticky top-0">
         <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4"><ArrowLeft /></button>
            <h1 className="font-bold">Top Up Balance</h1>
         </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Bank Info Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-600">
            <h3 className="font-bold text-gray-800 mb-2">Official Bank Account</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-mono font-bold">ABA Bank</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Account Name:</span>
                    <span className="font-mono font-bold">CAMBODIA SHOP CO LTD</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-mono font-bold text-blue-600 text-lg">001 234 567</span>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-lg font-bold"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Receipt</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required
                    />
                    {file ? (
                        <div className="text-center">
                            <CheckCircle className="mx-auto mb-2 text-green-500" />
                            <span className="text-gray-900 font-medium text-sm">{file.name}</span>
                        </div>
                    ) : (
                        <>
                            <Upload className="mb-2" />
                            <span className="text-xs">Tap to upload screenshot</span>
                        </>
                    )}
                </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700">
                Submit Request
            </button>
        </form>
      </div>
    </div>
  );
};