import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  DollarSign, 
  BarChart, 
  LogOut, 
  X 
} from 'lucide-react';
import { RootState } from '../../store/store';
import { toggleSidebar, setCurrentView } from '../../store/slices/uiSlice';
import useAuth from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { logout } = useAuth();
  
  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar());
    }
  };
  
  const navItems = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={22} />, 
      view: 'dashboard' 
    },
    { 
      path: '/news', 
      name: 'News Feed', 
      icon: <Newspaper size={22} />, 
      view: 'news' 
    },
    { 
      path: '/payouts', 
      name: 'Payouts', 
      icon: <DollarSign size={22} />, 
      view: 'payouts' 
    },
    { 
      path: '/analytics', 
      name: 'Analytics', 
      icon: <BarChart size={22} />, 
      view: 'analytics' 
    },
  ];
  
  const handleNavigation = (view: string) => {
    dispatch(setCurrentView(view));
    handleCloseSidebar();
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}
      
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-soft transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-md flex items-center justify-center">
                <Newspaper size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">NewsAdmin</h2>
            </div>
            
            <button
              onClick={handleCloseSidebar}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => handleNavigation(item.view)}
                    className={`flex items-center p-3 text-base font-medium rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex w-full items-center p-3 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut size={22} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;