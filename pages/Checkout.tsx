import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Wallet, AlertCircle, ArrowLeft, LocateFixed } from 'lucide-react';
import { Address } from '../types';

export const Checkout: React.FC = () => {
  const { cart, user, placeOrder, addresses, addAddress } = useStore();
  const navigate = useNavigate();
  
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'MainBalance' | 'ShoppingBalance' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrDetails, setNewAddrDetails] = useState('');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (!user) navigate('/login');
    if (cart.length === 0) navigate('/cart');
    // Pre-select default address
    const defaultAddr = addresses.find(a => a.isDefault);
    if (defaultAddr) setSelectedAddressId(defaultAddr.id);
  }, [user, cart, addresses, navigate]);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
        setNewAddrDetails(`Loc: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      }, (err) => {
        alert("Could not fetch location. Please enter manually.");
      });
    }
  };

  const handleSaveAddress = () => {
    if (!newAddrDetails) return;
    const addr: Address = {
        id: `addr-${Date.now()}`,
        name: user?.phoneNumber || 'User',
        phone: user?.phoneNumber || '',
        details: newAddrDetails,
        lat: coords?.lat,
        lng: coords?.lng,
        isDefault: addresses.length === 0
    };
    addAddress(addr);
    setSelectedAddressId(addr.id);
    setShowAddressForm(false);
  };

  const handleSubmit = async () => {
    if (!selectedAddressId) {
        alert("Please select a shipping address.");
        return;
    }
    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }

    const address = addresses.find(a => a.id === selectedAddressId)!;
    setIsProcessing(true);
    
    // Simulate API delay
    setTimeout(async () => {
        const success = await placeOrder(paymentMethod, address);
        setIsProcessing(false);
        if (success) {
            navigate('/orders');
        }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
       <div className="bg-white p-4 flex items-center sticky top-0 z-20 shadow-sm">
            <button onClick={() => navigate(-1)} className="mr-4"><ArrowLeft size={20}/></button>
            <h1 className="font-bold text-lg">Checkout</h1>
       </div>

       <div className="p-4 space-y-4">
            {/* Address Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h2 className="font-bold mb-3 flex items-center text-sm uppercase text-gray-500">
                    <MapPin size={16} className="mr-2" /> Shipping Address
                </h2>
                
                {addresses.length > 0 && !showAddressForm ? (
                    <div className="space-y-2">
                        {addresses.map(addr => (
                            <div 
                                key={addr.id}
                                onClick={() => setSelectedAddressId(addr.id)}
                                className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            >
                                <p className="text-sm font-medium">{addr.details}</p>
                                {addr.lat && <p className="text-xs text-gray-400 mt-1">GPS Verified</p>}
                            </div>
                        ))}
                        <button onClick={() => setShowAddressForm(true)} className="text-blue-600 text-sm font-medium mt-2">+ Add another address</button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {!showAddressForm && (
                             <button onClick={() => setShowAddressForm(true)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm font-medium">
                                + Add New Address
                            </button>
                        )}
                       
                        {showAddressForm && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex gap-2">
                                    <input 
                                        value={newAddrDetails}
                                        onChange={(e) => setNewAddrDetails(e.target.value)}
                                        placeholder="House No, Street, City..."
                                        className="flex-1 border p-2 rounded-lg text-sm bg-gray-50"
                                    />
                                    <button onClick={handleGetLocation} className="bg-gray-200 p-2 rounded-lg text-gray-600">
                                        <LocateFixed size={20}/>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleSaveAddress} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">Save Address</button>
                                    <button onClick={() => setShowAddressForm(false)} className="px-4 text-gray-500 text-sm">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Payment Section - Mutually Exclusive */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h2 className="font-bold mb-3 flex items-center text-sm uppercase text-gray-500">
                    <CreditCard size={16} className="mr-2" /> Payment Method
                </h2>
                
                <div className="space-y-3">
                    {/* Option 1: Main Balance */}
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${paymentMethod === 'MainBalance' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200'}`}>
                        <div className="flex items-center">
                            <input 
                                type="radio" 
                                name="payment" 
                                className="hidden" 
                                checked={paymentMethod === 'MainBalance'}
                                onChange={() => setPaymentMethod('MainBalance')}
                            />
                            <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${paymentMethod === 'MainBalance' ? 'border-blue-600' : 'border-gray-300'}`}>
                                {paymentMethod === 'MainBalance' && <div className="w-3 h-3 rounded-full bg-blue-600"></div>}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Top-up Balance</p>
                                <p className="text-xs text-gray-500">Use your cash top-up</p>
                            </div>
                        </div>
                        <span className={`font-bold ${user?.mainBalance && user.mainBalance >= total ? 'text-green-600' : 'text-red-500'}`}>
                            ${user?.mainBalance.toFixed(2)}
                        </span>
                    </label>

                    {/* Option 2: Shopping Balance */}
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${paymentMethod === 'ShoppingBalance' ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' : 'border-gray-200'}`}>
                        <div className="flex items-center">
                            <input 
                                type="radio" 
                                name="payment" 
                                className="hidden"
                                checked={paymentMethod === 'ShoppingBalance'}
                                onChange={() => setPaymentMethod('ShoppingBalance')}
                            />
                             <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${paymentMethod === 'ShoppingBalance' ? 'border-purple-600' : 'border-gray-300'}`}>
                                {paymentMethod === 'ShoppingBalance' && <div className="w-3 h-3 rounded-full bg-purple-600"></div>}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Shopping Balance</p>
                                <p className="text-xs text-gray-500">From Point exchange</p>
                            </div>
                        </div>
                        <span className={`font-bold ${user?.shoppingBalance && user.shoppingBalance >= total ? 'text-green-600' : 'text-red-500'}`}>
                            ${user?.shoppingBalance.toFixed(2)}
                        </span>
                    </label>
                </div>
                
                {paymentMethod && (
                     <div className="mt-3 p-2 bg-yellow-50 text-yellow-700 text-xs rounded-lg flex items-start">
                        <AlertCircle size={14} className="mt-0.5 mr-2 flex-shrink-0" />
                        <span>You are paying with {paymentMethod === 'MainBalance' ? 'Top-up Balance' : 'Shopping Balance'}. Mixed payment is not supported.</span>
                     </div>
                )}
            </div>
       </div>

       {/* Submit Bar */}
       <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
            <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500">Order Total</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            <button 
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
            >
                {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>
       </div>
    </div>
  );
};