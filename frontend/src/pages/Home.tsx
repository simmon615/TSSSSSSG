import React, { useMemo } from 'react';
import { useStore } from '../store';
import { Search, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const { products, searchQuery, setSearchQuery, addToCart } = useStore();
  const navigate = useNavigate();

  // Fuzzy Search Logic (Case insensitive, matches Name or Khmer Name)
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const lowerQ = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQ) || 
      p.nameKm.includes(lowerQ) ||
      p.category.toLowerCase().includes(lowerQ)
    );
  }, [products, searchQuery]);

  return (
    <div className="pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white shadow-sm px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Banner Area */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-lg bg-gray-900 aspect-video relative group">
        <img src="https://picsum.photos/800/450" alt="Banner" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
            </div>
        </div>
        <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-bold">New Arrival: Premium Jasmine Rice</h3>
            <p className="text-xs opacity-90">Watch introduction video</p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-lg mb-4 text-gray-800">Recommended</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div 
                className="aspect-square bg-gray-100 relative"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {/* Cashback Badge */}
                <div className="absolute top-2 left-2 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center shadow-sm">
                  <Flame size={10} className="mr-1" fill="currentColor" />
                   Cashback {product.basisPoints * 0.5} Pts
                </div>
              </div>
              
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.nameKm}</p>
                
                <div className="mt-auto flex justify-between items-center">
                  <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(product, 1)}
                    className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                No products found.
            </div>
        )}
      </div>
    </div>
  );
};