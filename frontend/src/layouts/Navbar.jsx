import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 mr-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* Optional Search bar can go here */}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-6 w-px bg-gray-300"></div>

        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
            <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold border border-primary-200 flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="ml-2 p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
          title="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
