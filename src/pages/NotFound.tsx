import React from 'react';
import { Link } from 'react-router-dom';
import { Flag, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 p-6 flex justify-center">
          <div className="text-white text-center">
            <Flag className="h-12 w-12 mx-auto mb-2" />
            <h1 className="text-2xl font-bold">F1 Voting League</h1>
          </div>
        </div>
        
        <div className="p-6 text-center">
          <h2 className="text-6xl font-bold text-gray-800 mb-4">404</h2>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h3>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;