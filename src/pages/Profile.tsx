import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLeaderboardStore } from '../stores/leaderboardStore';
import { useRaceStore } from '../stores/raceStore';
import { User, Trophy, Calendar, Flag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { users, fetchLeaderboard } = useLeaderboardStore();
  const { upcomingRaces, pastRaces, fetchRaces } = useRaceStore();
  const [userStats, setUserStats] = useState<any>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  useEffect(() => {
    fetchLeaderboard();
    fetchRaces();
  }, [fetchLeaderboard, fetchRaces]);
  
  useEffect(() => {
    if (user && users.length > 0) {
      const stats = users.find(u => u.id === user.id);
      const rank = stats ? users.findIndex(u => u.id === user.id) + 1 : null;
      
      setUserStats(stats);
      setUserRank(rank);
    }
  }, [user, users]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <User className="w-6 h-6 mr-2" />
            Your Profile
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-3xl font-bold mb-4 md:mb-0 md:mr-6">
              {user?.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {user?.user_metadata?.name || 'F1 Fan'}
              </h3>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {user?.created_at ? formatDate(user.created_at) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Your Stats
          </h3>
        </div>
        
        <div className="p-6">
          {!userStats ? (
            <div className="text-center py-4">
              <p className="text-gray-600">No stats available yet.</p>
              <p className="text-sm text-gray-500 mt-1">
                Make predictions for upcoming races to start earning points!
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Current Rank</p>
                  <p className="text-3xl font-bold text-red-600">#{userRank}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-3xl font-bold text-red-600">{userStats.totalPoints}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Correct Positions</p>
                  <p className="text-3xl font-bold text-red-600">{userStats.correctPositions}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Qualifying Points</p>
                  <p className="text-3xl font-bold text-red-600">{userStats.qualifyingPoints}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-lg text-gray-800 mb-4">Detailed Statistics</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Points Breakdown</h5>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Race Points:</span>
                        <span className="font-medium">{userStats.totalPoints - userStats.teamPoints - userStats.qualifyingPoints}</span>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Team Points:</span>
                        <span className="font-medium">{userStats.teamPoints}</span>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Qualifying Points:</span>
                        <span className="font-medium">{userStats.qualifyingPoints}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Performance</h5>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Correct Positions:</span>
                        <span className="font-medium">{userStats.correctPositions}</span>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Average Points per Race:</span>
                        <span className="font-medium">
                          {pastRaces.length > 0 
                            ? Math.round(userStats.totalPoints / pastRaces.length) 
                            : 0}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Next Race */}
      {upcomingRaces.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Next Race
            </h3>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-gray-800">{upcomingRaces[0].name}</h4>
                <p className="text-gray-600">{formatDate(upcomingRaces[0].date)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {upcomingRaces[0].isSprintWeekend ? 'Sprint Weekend' : 'Standard Weekend'}
                </p>
              </div>
              
              <Link 
                to={`/races/${upcomingRaces[0].id}`}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Make Predictions
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Predictions */}
      {pastRaces.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Flag className="w-5 h-5 mr-2" />
              Recent Races
            </h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {pastRaces.slice(0, 3).map((race) => (
                <div key={race.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-800">{race.name}</h4>
                    <p className="text-sm text-gray-600">{formatDate(race.date)}</p>
                  </div>
                  <Link 
                    to={`/races/${race.id}`}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    View Results
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
            
            {pastRaces.length > 3 && (
              <div className="mt-4 text-center">
                <Link 
                  to="/races/past"
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  View All Past Races
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Settings
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Email</h4>
              <p className="text-gray-800">{user?.email}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Name</h4>
              <p className="text-gray-800">{user?.user_metadata?.name || 'Not set'}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                className="text-red-600 hover:text-red-800 font-medium"
                onClick={() => alert('This feature is not implemented yet.')}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;