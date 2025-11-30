import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, ShoppingBag, Flame } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  
  const product = products.find(p => p.id === id);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      {/* Nav */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Image */}
      <div className="aspect-square bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-5 -mt-6 bg-white rounded-t-3xl relative z-0">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-gray-500 font-medium">{product.nameKm}</p>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            </div>
        </div>

        <div className="inline-flex items-center bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-semibold mb-6 border border-orange-100">
            <Flame size={16} className="mr-1.5" />
            Earn {product.basisPoints * 0.5} Points per item
        </div>

        <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
            </p>
        </div>

        <div className="mb-6">
            <h3 className="font-semibold mb-2">Category</h3>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                {product.category}
            </span>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe z-50">
        <button 
            onClick={() => {
                addToCart(product, 1);
                navigate('/cart');
            }}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
            <ShoppingBag size={20} />
            <span>Add to Cart - ${product.price.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};