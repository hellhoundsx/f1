import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRaceStore } from '../stores/raceStore';
import { Flag, MapPin, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';

const PastRaces: React.FC = () => {
  const { pastRaces, fetchRaces, loading, error } = useRaceStore();
  
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
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Flag className="w-6 h-6 mr-2" />
            Past Races
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
          ) : pastRaces.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No past races available.</p>
              <p className="text-sm text-gray-500 mt-1">
                Check back after the first race of the season.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastRaces.map((race) => (
                <div 
                  key={race.id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{race.name}</h3>
                        <p className="text-gray-600 flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {race.location}
                        </p>
                        <p className="text-gray-500 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(race.date)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          {race.status === 'RACE_COMPLETED' ? 'Completed' : 'Qualifying Completed'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {race.isSprintWeekend ? 'Sprint Weekend' : 'Standard Weekend'}
                        {race.hasRedFlag !== null && (
                          <span className={`ml-3 ${race.hasRedFlag ? 'text-red-600' : 'text-green-600'}`}>
                            {race.hasRedFlag ? 'Red Flag' : 'No Red Flag'}
                          </span>
                        )}
                      </div>
                      <Link 
                        to={`/races/${race.id}`}
                        className="flex items-center text-red-600 hover:text-red-800 font-medium"
                      >
                        View Results
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </Link>
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

export default PastRaces;