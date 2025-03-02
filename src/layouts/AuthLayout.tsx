import React from 'react';
import { Outlet } from 'react-router-dom';
import { Flag } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 p-6 flex justify-center">
          <div className="text-white text-center">
            <Flag className="h-12 w-12 mx-auto mb-2" />
            <h1 className="text-2xl font-bold">F1 Voting League</h1>
            <p className="text-red-100">Predict, Vote, Win!</p>
          </div>
        </div>
        
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;