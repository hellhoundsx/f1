import React, { useEffect } from 'react';
import { useLeaderboardStore } from '../stores/leaderboardStore';
import { useAuthStore } from '../stores/authStore';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { users, fetchLeaderboard, loading, error } = useLeaderboardStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  
  // Find current user in leaderboard
  const currentUserRank = user ? users.findIndex(u => u.id === user.id) + 1 : null;
  
  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Medal className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="text-gray-600 font-medium">{position}</span>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Trophy className="w-6 h-6 mr-2" />
            F1 Voting League Standings
          </h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              Error loading leaderboard: {error}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No leaderboard data available yet.</p>
              <p className="text-sm text-gray-500 mt-1">
                Make predictions for upcoming races to start earning points!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Correct Positions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qualifying Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`${
                        user.id === currentUserRank ? 'bg-red-50' : 
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getMedalIcon(index + 1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {user.id === currentUserRank && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{user.totalPoints}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.correctPositions}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.teamPoints}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.qualifyingPoints}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Scoring System</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg text-gray-800 mb-3">Race Predictions</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>Correct P1:</span>
                  <span className="font-medium">25 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Correct P2:</span>
                  <span className="font-medium">18 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Correct P3:</span>
                  <span className="font-medium">15 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Correct P4:</span>
                  <span className="font-medium">12 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Correct P5:</span>
                  <span className="font-medium">10 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Correct P6:</span>
                  <span className="font-medium">8 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Correct P7:</span>
                  <span className="font-medium">6 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Correct P8:</span>
                  <span className="font-medium">4 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Correct P9:</span>
                  <span className="font-medium">2 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Correct P10:</span>
                  <span className="font-medium">1 point</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg text-gray-800 mb-3">Other Points</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>Correct Red Flag Prediction:</span>
                  <span className="font-medium">+50 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Incorrect Red Flag Prediction:</span>
                  <span className="font-medium">-50 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Weekend Winner (1st):</span>
                  <span className="font-medium">+20 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Weekend Winner (2nd):</span>
                  <span className="font-medium">+15 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Weekend Winner (3rd):</span>
                  <span className="font-medium">+10 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Best Team Prediction:</span>
                  <span className="font-medium">+15 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Second Team Prediction:</span>
                  <span className="font-medium">+10 points</span>
                </li>
                <li className="flex justify-between">
                  <span>Qualifying (Standard):</span>
                  <span className="font-medium">Top 3 positions</span>
                </li>
                <li className="flex justify-between">
                  <span>Qualifying (Sprint):</span>
                  <span className="font-medium">Top 7 positions</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-lg text-gray-800 mb-2">Tiebreaker Rules</h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Number of correct positions within the top 10 race finishers</li>
              <li>Points from the Best Team prediction</li>
              <li>Qualifying points</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;