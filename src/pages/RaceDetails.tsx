import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRaceStore } from '../stores/raceStore';
import { usePredictionStore } from '../stores/predictionStore';
import { useAuthStore } from '../stores/authStore';
import { 
  Calendar, MapPin, Clock, Flag, AlertTriangle, 
  Save, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

interface DriverOption {
  id: string;
  name: string;
  team: string;
  number: number;
}

interface TeamOption {
  id: string;
  name: string;
}

const RaceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentRace, fetchRaceById, loading: raceLoading } = useRaceStore();
  const { 
    drivers, teams, currentPrediction, 
    fetchDrivers, fetchTeams, fetchPredictionByRaceId, savePrediction,
    loading: predictionLoading, error 
  } = usePredictionStore();
  const { user } = useAuthStore();
  
  const [qualifyingPredictions, setQualifyingPredictions] = useState<{ driverId: string; position: number }[]>([]);
  const [racePredictions, setRacePredictions] = useState<{ driverId: string; position: number }[]>([]);
  const [teamPredictions, setTeamPredictions] = useState<{ teamId: string; position: number }[]>([]);
  const [redFlagPrediction, setRedFlagPrediction] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [driverOptions, setDriverOptions] = useState<DriverOption[]>([]);
  
  useEffect(() => {
    if (id) {
      fetchRaceById(id);
      fetchPredictionByRaceId(id);
      fetchDrivers();
      fetchTeams();
    }
  }, [id, fetchRaceById, fetchPredictionByRaceId, fetchDrivers, fetchTeams]);
  
  useEffect(() => {
    if (drivers.length > 0 && teams.length > 0) {
      const options = drivers.map(driver => {
        const team = teams.find(t => t.id === driver.team_id);
        return {
          id: driver.id,
          name: driver.name,
          team: team ? team.name : 'Unknown Team',
          number: driver.number
        };
      });
      setDriverOptions(options);
    }
  }, [drivers, teams]);
  
  useEffect(() => {
    if (currentPrediction) {
      setQualifyingPredictions(currentPrediction.qualifyingPredictions);
      setRacePredictions(currentPrediction.racePredictions);
      setTeamPredictions(currentPrediction.teamPredictions);
      setRedFlagPrediction(currentPrediction.redFlagPrediction);
    }
  }, [currentPrediction]);
  
  useEffect(() => {
    setRacePredictions(driverOptions.map((driver, i) => ({ driver_id: driver.id, position: i })).slice(0, 10));
    setQualifyingPredictions(driverOptions.map((driver, i) => ({ driver_id: driver.id, position: i })).slice(0, 3));
  }, [driverOptions, currentPrediction]);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getTimeUntil = (dateString: string) => {
    if (!dateString) return '';
    const now = new Date();
    const raceDate = new Date(dateString);
    const diff = raceDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Race day!';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
  };
  
  const handleQualifyingChange = (position: number, driverId: string) => {
    // Remove driver from any other position
    const filtered = qualifyingPredictions.filter(p => p.driver_id !== driverId && p.position !== position);
    
    // Add the new prediction
    setQualifyingPredictions([...filtered, { driver_id: driverId, position }]);
  };
  
  const handleRaceChange = (position: number, driverId: string) => {
    // Remove driver from any other position
    const filtered = racePredictions.filter(p => p.driver_id !== driverId && p.position !== position);
    
    // Add the new prediction
    setRacePredictions([...filtered, { driver_id: driverId, position }]);
  };
  
  const handleTeamChange = (position: number, teamId: string) => {
    // Remove team from any other position
    const filtered = teamPredictions.filter(p => p.team_id !== teamId && p.position !== position);

    // Add the new prediction
    setTeamPredictions([...filtered, { team_id: teamId, position }]);
  };
  
  const handleSavePrediction = async () => {
    if (!id || !user) return;
    
    setIsSaving(true);
    
    try {
      await savePrediction({
        userId: user.id,
        raceId: id,
        redFlagPrediction,
        qualifyingPredictions,
        racePredictions,
        teamPredictions,
        id: currentPrediction?.id
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving prediction:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const isPredictionComplete = () => {
    const qualCount = currentRace?.isSprintWeekend ? 7 : 3;
    const raceCount = 10;
    const teamCount = 2;
    
    return (
      qualifyingPredictions.length === qualCount &&
      racePredictions.length === raceCount &&
      teamPredictions.length === teamCount
    );
  };
  
  const isPredictionLocked = () => {
    if (!currentRace) return true;
    
    const now = new Date();
    const raceDate = new Date(currentRace.date);
    
    // Lock predictions 1 hour before race time
    const lockTime = new Date(raceDate.getTime() - (60 * 60 * 1000));
    
    return now >= lockTime || currentRace.status !== 'UPCOMING';
  };
  
  const getDriverById = (id: string) => {
    return driverOptions.find(d => d.id === id);
  };
  
  const getTeamById = (id: string) => {
    return teams.find(t => t.id === id);
  };
  
  if (raceLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (!currentRace) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        Race not found
      </div>
    );
  }
  
  const locked = isPredictionLocked();
  
  return (
    <div className="space-y-6">
      {/* Race Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">{currentRace.name}</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {currentRace.location}
              </p>
              <p className="text-gray-600 flex items-center mt-2">
                <Calendar className="w-5 h-5 mr-2" />
                {formatDate(currentRace.date)}
              </p>
              <p className="text-gray-600 flex items-center mt-2">
                <Clock className="w-5 h-5 mr-2" />
                {formatTime(currentRace.date)}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
              <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {currentRace.isSprintWeekend ? 'Sprint Weekend' : 'Standard Weekend'}
              </div>
              
              <div className="mt-2 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {currentRace.status === 'UPCOMING' ? getTimeUntil(currentRace.date) : 'Completed'}
              </div>
              
              <div className="mt-2 text-sm font-medium">
                {currentRace.status === 'UPCOMING' ? (
                  <span className="text-green-600">Predictions Open</span>
                ) : (
                  <span className="text-red-600">Predictions Closed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Prediction Form */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading prediction data: {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Flag className="w-5 h-5 mr-2" />
              Your Predictions
            </h3>
            
            {locked ? (
              <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Predictions Locked
              </div>
            ) : (
              <button
                onClick={handleSavePrediction}
                disabled={isSaving || !isPredictionComplete()}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  isSaving || !isPredictionComplete()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-red-600 hover:bg-red-50'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 mr-2"></div>
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Predictions
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="p-6">
            {predictionLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Qualifying Predictions */ }
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4">
                    {currentRace.isSprintWeekend ? 'Sprint Race Predictions' : 'Qualifying Predictions'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: currentRace.isSprintWeekend ? 7 : 3 }).map((_, index) => {

                return (
                      <div key={`qual-${index}`} className="border border-gray-200 rounded-md p-4">
                        <div className="font-medium text-gray-700 mb-2">Position {index + 1}</div>
                        <select
                          value={qualifyingPredictions.find(p => p.position === index + 1)?.driver_id || ''}
                          onChange={(e) => handleQualifyingChange(index + 1, e.target.value)}
                          disabled={locked}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="">Select Driver</option>
                          {driverOptions.map(driver => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name} ({driver.team})
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                    })}
                  </div>
                </div>
                
                {/* Race Predictions */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Race Predictions</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={`race-${index}`} className="border border-gray-200 rounded-md p-4">
                        <div className="font-medium text-gray-700 mb-2">Position {index + 1}</div>
                        <select
                          value={racePredictions.find(p => p.position === index + 1)?.driver_id || ''}
                          onChange={(e) => handleRaceChange(index + 1, e.target.value)}
                          disabled={locked}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="">Select Driver</option>
                          {driverOptions.map(driver => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name} ({driver.team})
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Team Predictions */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Team Predictions</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="font-medium text-gray-700 mb-2">Best Team</div>
                      <select
                        value={teamPredictions.find(p => p.position === 1)?.team_id || ''}
                        onChange={(e) => handleTeamChange(1, e.target.value)}
                        disabled={locked}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="">Select Team</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="font-medium text-gray-700 mb-2">Second Team</div>
                      <select
                        value={teamPredictions.find(p => p.position === 2)?.team_id || ''}
                        onChange={(e) => handleTeamChange(2, e.target.value)}
                        disabled={locked}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="">Select Team</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Red Flag Prediction */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Red Flag Prediction</h4>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="red-flag"
                          type="checkbox"
                          checked={redFlagPrediction}
                          onChange={(e) => setRedFlagPrediction(e.target.checked)}
                          disabled={locked}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="red-flag" className="font-medium text-gray-700">
                          I predict there will be a red flag during this race
                        </label>
                        <p className="text-gray-500">
                          +50 points if correct, -50 points if incorrect
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Prediction Summary */}
                {!isPredictionComplete() && !locked && (
                  <div className="bg-yellow-50 p-4 rounded-md flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-yellow-700 font-medium">Your prediction is incomplete</p>
                      <p className="text-yellow-600 text-sm mt-1">
                        Please make selections for all positions to save your prediction.
                      </p>
                    </div>
                  </div>
                )}
                
                {locked && currentRace.status !== 'UPCOMING' && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Your Prediction Summary</h4>
                    
                    <div className="space-y-6">
                      {/* Qualifying Summary */}
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">
                          {currentRace.isSprintWeekend ? 'Sprint Race Predictions' : 'Qualifying Predictions'}
                        </h5>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {qualifyingPredictions.sort((a, b) => a.position - b.position).map((pred) => {
                              const driver = getDriverById(pred.driverId);
                              return (
                                <div key={`qual-summary-${pred.position}`} className="flex items-center">
                                  <div className="w-8 h-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center font-bold mr-3">
                                    {pred.position}
                                  </div>
                                  <div>
                                    <div className="font-medium">{driver?.name || 'Unknown Driver'}</div>
                                    <div className="text-sm text-gray-500">{driver?.team || 'Unknown Team'}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Race Summary */}
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Race Predictions</h5>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {racePredictions.sort((a, b) => a.position - b.position).map((pred) => {
                              const driver = getDriverById(pred.driverId);
                              return (
                                <div key={`race-summary-${pred.position}`} className="flex items-center">
                                  <div className="w-8 h-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center font-bold mr-3">
                                    {pred.position}
                                  </div>
                                  <div>
                                    <div className="font-medium">{driver?.name || 'Unknown Driver'}</div>
                                    <div className="text-sm text-gray-500">{driver?.team || 'Unknown Team'}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Team Summary */}
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Team Predictions</h5>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teamPredictions.sort((a, b) => a.position - b.position).map((pred) => {
                              const team = getTeamById(pred.team_id);
                              return (
                                <div key={`team-summary-${pred.position}`} className="flex items-center">
                                  <div className="w-8 h-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center font-bold mr-3">
                                    {pred.position}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {pred.position === 1 ? 'Best Team:' : 'Second Team:'}
                                    </div>
                                    <div className="text-lg">{team?.name || 'Unknown Team'}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Red Flag Summary */}
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Red Flag Prediction</h5>
                        <div className="bg-gray-50 p-4 rounded-md flex items-center">
                          {redFlagPrediction ? (
                            <>
                              <div className="w-8 h-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center font-bold mr-3">
                                <Flag className="w-5 h-5" />
                              </div>
                              <div className="font-medium">You predicted a red flag for this race</div>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold mr-3">
                                <XCircle className="w-5 h-5" />
                              </div>
                              <div className="font-medium">You predicted no red flag for this race</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceDetails;