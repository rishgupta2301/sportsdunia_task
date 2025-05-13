import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Menu, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  User
} from 'lucide-react';
import { RootState } from '../../store/store';
import { toggleTheme, toggleSidebar } from '../../store/slices/uiSlice';
import useAuth from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { theme, currentView } = useSelector((state: RootState) => state.ui);
  const { user, logout } = useAuth();
  
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };
  
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleToggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
            
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentView === 'dashboard' && 'Dashboard'}
              {currentView === 'news' && 'News Feed'}
              {currentView === 'payouts' && 'Payout Management'}
              {currentView === 'analytics' && 'Analytics'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-72 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Search..."
              />
            </div>
            
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white relative">
              <Bell size={22} />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary-500"></span>
            </button>
            
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-600">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;