import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRaceStore } from '../stores/raceStore';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';

const UpcomingRaces: React.FC = () => {
  const { upcomingRaces, fetchRaces, loading, error } = useRaceStore();
  
  useEffect(() => {
    fetchRaces();
  }, [fetchRaces]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const raceDate = new Date(dateString);
    const diff = raceDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Race day!';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''} away`;
    } else if (days > 7) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} away`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} away`;
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return `${hours} hour${hours > 1 ? 's' : ''} away`;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Upcoming Races
          </h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              Error loading races: {error}
            </div>
          ) : upcomingRaces.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No upcoming races scheduled.</p>
              <p className="text-sm text-gray-500 mt-1">
                Check back later for the updated race calendar.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingRaces.map((race) => (
                <div 
                  key={race.id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 bg-gray-100 p-6 flex flex-col justify-center items-center text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {new Date(race.date).toLocaleDateString('en-US', { day: 'numeric' })}
                      </div>
                      <div className="text-lg text-gray-600">
                        {new Date(race.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(race.date).toLocaleDateString('en-US', { year: 'numeric' })}
                      </div>
                      <div className="mt-3 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {getTimeUntil(race.date)}
                      </div>
                    </div>
                    
                    <div className="md:w-3/4 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{race.name}</h3>
                          <p className="text-gray-600 flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {race.location}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(race.date)}
                          </div>
                        </div>
                        <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                          {race.isSprintWeekend ? 'Sprint Weekend' : 'Standard Weekend'}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {formatDate(race.date)}
                        </div>
                        <Link 
                          to={`/races/${race.id}`}
                          className="flex items-center text-red-600 hover:text-red-800 font-medium"
                        >
                          Make Predictions
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingRaces;