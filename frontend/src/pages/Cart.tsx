import React from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 text-sm">Looks like you haven't added anything yet.</p>
        <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-blue-700"
        >
            Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-32">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.productId} className="bg-white p-3 rounded-xl shadow-sm flex gap-3 items-center">
            <img src={item.image} alt={item.productName} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
            
            <div className="flex-1">
              <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{item.productName}</h3>
              <p className="text-blue-600 font-bold mt-1">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex flex-col items-end space-y-2">
                <button onClick={() => removeFromCart(item.productId)} className="text-gray-400 hover:text-red-500 p-1">
                    <Trash2 size={16} />
                </button>
                
                <div className="flex items-center bg-gray-100 rounded-lg">
                    <button 
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button 
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-[70px] left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between mb-4">
            <span className="text-gray-500">Total</span>
            <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
            Checkout
        </button>
      </div>
    </div>
  );
};