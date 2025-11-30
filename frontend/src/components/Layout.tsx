import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, User, ListOrdered } from 'lucide-react';
import { useStore } from '../store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useStore(s => s.cart.reduce((a, b) => a + b.quantity, 0));

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: ListOrdered, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Me', path: '/profile' },
  ];

  const hideNavPaths = ['/login', '/checkout', '/topup'];
  const showNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </main>

      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 pb-safe flex justify-between items-center z-50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div className="relative">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge ? (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};