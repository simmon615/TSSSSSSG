import React from 'react';
import { useStore } from '../store';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export const Orders: React.FC = () => {
  const { orders, confirmReceipt } = useStore();

  const getStatusIcon = (status: string) => {
    switch(status) {
        case 'Pending': return <Clock size={16} className="text-yellow-500" />;
        case 'ToShip': return <Package size={16} className="text-blue-500" />;
        case 'Shipped': return <Truck size={16} className="text-purple-500" />;
        case 'Completed': return <CheckCircle size={16} className="text-green-500" />;
        default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
            No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
            {orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center text-xs">
                        <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1 font-medium bg-white px-2 py-1 rounded border">
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                        </div>
                    </div>
                    
                    <div className="p-4">
                        {order.items.map(item => (
                            <div key={item.productId} className="flex gap-3 mb-3 last:mb-0">
                                <img src={item.image} className="w-14 h-14 rounded-md bg-gray-100 object-cover" />
                                <div>
                                    <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
                                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                        <div>
                             <p className="text-xs text-gray-500">Total Amount</p>
                             <p className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                        </div>
                        
                        {order.status === 'Shipped' && (
                            <button 
                                onClick={() => confirmReceipt(order.id)}
                                className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold"
                            >
                                Confirm Receipt
                            </button>
                        )}
                         {order.status === 'ToShip' && (
                            <span className="text-xs text-gray-400 italic">Processing...</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};