import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRaceStore } from '../stores/raceStore';
import { useLeaderboardStore } from '../stores/leaderboardStore';
import { useAuthStore } from '../stores/authStore';
import { Calendar, Trophy, Flag, AlertTriangle, Clock, MapPin } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { upcomingRaces, pastRaces, fetchRaces, loading: racesLoading } = useRaceStore();
  const { users, fetchLeaderboard, loading: leaderboardLoading } = useLeaderboardStore();
  const { user } = useAuthStore();
  const [timeUntilNextRace, setTimeUntilNextRace] = useState<string>('');
  
  useEffect(() => {
    fetchRaces();
    fetchLeaderboard();
  }, [fetchRaces, fetchLeaderboard]);
  
  const nextRace = upcomingRaces[0];
  const topUsers = users.slice(0, 5);
  const lastRace = pastRaces.length > 0 ? pastRaces[pastRaces.length - 1] : null;
  
  // Find current user in leaderboard
  const currentUserStats = users.find(u => u.id === user?.id);
  const currentUserRank = currentUserStats ? users.findIndex(u => u.id === user?.id) + 1 : null;
  
  useEffect(() => {
    if (nextRace) {
      const interval = setInterval(() => {
        const now = new Date();
        const raceDate = new Date(nextRace.date);
        const diff = raceDate.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeUntilNextRace('Race day!');
          clearInterval(interval);
          return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeUntilNextRace(`${days}d ${hours}h ${minutes}m`);
      }, 60000); // Update every minute
      
      // Initial calculation
      const now = new Date();
      const raceDate = new Date(nextRace.date);
      const diff = raceDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeUntilNextRace('Race day!');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeUntilNextRace(`${days}d ${hours}h ${minutes}m`);
      }
      
      return () => clearInterval(interval);
    }
  }, [nextRace]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to F1 Voting League</h1>
        <p className="text-red-100">
          Make your predictions for upcoming races and compete with other F1 fans!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Race Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Next Race
            </h3>
          </div>
          
          <div className="p-6">
            {racesLoading ? (
              <p className="text-gray-500">Loading next race...</p>
            ) : nextRace ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{nextRace.name}</h4>
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {nextRace.location}
                    </p>
                  </div>
                  <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    {nextRace.isSprintWeekend ? 'Sprint Weekend' : 'Standard Weekend'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-gray-700">
                    <p className="font-medium">{formatDate(nextRace.date)}</p>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-600" />
                    <span className="text-sm font-medium">{timeUntilNextRace}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link 
                    to={`/races/${nextRace.id}`}
                    className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Make Predictions
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">No upcoming races scheduled.</p>
            )}
          </div>
        </div>
        
        {/* Your Stats Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Your Stats
            </h3>
          </div>
          
          <div className="p-6">
            {leaderboardLoading ? (
              <p className="text-gray-500">Loading your stats...</p>
            ) : currentUserStats ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center px-4 py-2 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Current Rank</p>
                    <p className="text-2xl font-bold text-red-600">#{currentUserRank}</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-red-600">{currentUserStats.totalPoints}</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Correct Positions</p>
                    <p className="text-2xl font-bold text-red-600">{currentUserStats.correctPositions}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Team Points:</span>
                    <span className="font-medium">{currentUserStats.teamPoints}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Qualifying Points:</span>
                    <span className="font-medium">{currentUserStats.qualifyingPoints}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link 
                    to="/profile"
                    className="block w-full bg-gray-100 text-gray-800 text-center py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    View Full Stats
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-700">No stats available yet.</p>
                <p className="text-gray-500 text-sm mt-1">Make predictions for upcoming races to start earning points!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Leaderboard Preview */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Leaderboard Top 5
          </h3>
        </div>
        
        <div className="p-6">
          {leaderboardLoading ? (
            <p className="text-gray-500">Loading leaderboard...</p>
          ) : topUsers.length > 0 ? (
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
                      Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Correct Positions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topUsers.map((user, index) => (
                    <tr key={user.id} className={user.id === currentUserStats?.id ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.totalPoints}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.correctPositions}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-700">No leaderboard data available yet.</p>
          )}
          
          <div className="mt-4">
            <Link 
              to="/leaderboard"
              className="text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              View Full Leaderboard
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Last Race Results */}
      {lastRace && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Flag className="w-5 h-5 mr-2" />
              Last Race Results
            </h3>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-800">{lastRace.name}</h4>
                <p className="text-gray-600">{formatDate(lastRace.date)}</p>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                {lastRace.status === 'RACE_COMPLETED' ? 'Completed' : 'Qualifying Completed'}
              </div>
            </div>
            
            <div className="mt-4">
              <Link 
                to={`/races/${lastRace.id}`}
                className="text-red-600 hover:text-red-800 font-medium flex items-center"
              >
                View Results
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Upcoming Races Preview */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Races
          </h3>
          <Link 
            to="/races/upcoming"
            className="text-white text-sm hover:underline"
          >
            View All
          </Link>
        </div>
        
        <div className="p-6">
          {racesLoading ? (
            <p className="text-gray-500">Loading races...</p>
          ) : upcomingRaces.length > 0 ? (
            <div className="space-y-4">
              {upcomingRaces.slice(0, 3).map((race) => (
                <div key={race.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-800">{race.name}</h4>
                    <p className="text-sm text-gray-600">{formatDate(race.date)}</p>
                  </div>
                  <Link 
                    to={`/races/${race.id}`}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">No upcoming races scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;