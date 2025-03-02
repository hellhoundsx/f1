import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Trophy, Calendar, Home, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { session, user, initialize, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">F1 Voting League</h1>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li>
              <Link 
                to="/" 
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 ${
                  location.pathname === '/' ? 'bg-red-50 text-red-600 border-r-4 border-red-600' : ''
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/leaderboard" 
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 ${
                  location.pathname === '/leaderboard' ? 'bg-red-50 text-red-600 border-r-4 border-red-600' : ''
                }`}
              >
                <Trophy className="w-5 h-5 mr-3" />
                Leaderboard
              </Link>
            </li>
            <li>
              <Link 
                to="/races/upcoming" 
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 ${
                  location.pathname === '/races/upcoming' ? 'bg-red-50 text-red-600 border-r-4 border-red-600' : ''
                }`}
              >
                <Calendar className="w-5 h-5 mr-3" />
                Upcoming Races
              </Link>
            </li>
            <li>
              <Link 
                to="/races/past" 
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 ${
                  location.pathname === '/races/past' ? 'bg-red-50 text-red-600 border-r-4 border-red-600' : ''
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-3" />
                Past Races
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 ${
                  location.pathname === '/profile' ? 'bg-red-50 text-red-600 border-r-4 border-red-600' : ''
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {location.pathname === '/' && 'Dashboard'}
                {location.pathname === '/leaderboard' && 'Leaderboard'}
                {location.pathname === '/races/upcoming' && 'Upcoming Races'}
                {location.pathname === '/races/past' && 'Past Races'}
                {location.pathname === '/profile' && 'Profile'}
                {location.pathname.startsWith('/races/') && location.pathname !== '/races/upcoming' && location.pathname !== '/races/past' && 'Race Details'}
              </h2>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{user.user_metadata.name || user.email}</span>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;