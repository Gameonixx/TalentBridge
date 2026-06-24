import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  Bell,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  // Define nav links based on role
  const getNavLinks = () => {
    switch(user.role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Job Board', path: '/student/jobs', icon: Briefcase },
          { name: 'My Applications', path: '/student/applications', icon: FileText },
          { name: 'Profile', path: '/student/profile', icon: Users },
        ];
      case 'recruiter':
        return [
          { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
          { name: 'My Postings', path: '/recruiter/jobs', icon: Briefcase },
          { name: 'Applicants', path: '/recruiter/applicants', icon: Users },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Manage Users', path: '/admin/users', icon: Users },
          { name: 'System Settings', path: '/admin/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar component */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-surface border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
          <Link to={`/${user.role}/dashboard`} className="text-xl font-bold text-gray-900 tracking-tight" onClick={() => setIsOpen && setIsOpen(false)}>
            Talent<span className="text-primary-600">Bridge</span>
          </Link>
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <link.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <NavLink
          to={`/${user.role}/settings`}
          onClick={() => setIsOpen && setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
          Settings
        </NavLink>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
