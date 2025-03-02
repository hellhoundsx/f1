import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Driver {
  id: string;
  name: string;
  teamId: string;
  number: number;
}

interface Team {
  id: string;
  name: string;
}

interface QualifyingPrediction {
  driverId: string;
  position: number;
}

interface RacePrediction {
  driverId: string;
  position: number;
}

interface TeamPrediction {
  teamId: string;
  position: number; // 1 for Best Team, 2 for Second Team
}

interface Prediction {
  id?: string;
  userId: string;
  raceId: string;
  redFlagPrediction: boolean;
  qualifyingPredictions: QualifyingPrediction[];
  racePredictions: RacePrediction[];
  teamPredictions: TeamPrediction[];
}

interface PredictionState {
  drivers: Driver[];
  teams: Team[];
  currentPrediction: Prediction | null;
  loading: boolean;
  error: string | null;
  fetchDrivers: () => Promise<void>;
  fetchTeams: () => Promise<void>;
  fetchPredictionByRaceId: (raceId: string) => Promise<void>;
  savePrediction: (prediction: Prediction) => Promise<void>;
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  drivers: [],
  teams: [],
  currentPrediction: null,
  loading: false,
  error: null,
  
  fetchDrivers: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('drivers')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        drivers: data as Driver[],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        loading: false 
      });
    }
  },
  
  fetchTeams: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('teams')
        .select('*');
      
      if (error) throw error;
      
      set({ 
        teams: data as Team[],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        loading: false 
      });
    }
  },
  
  fetchPredictionByRaceId: async (raceId) => {
    try {
      set({ loading: true, error: null });
      
      const { data: session } = await supabase.auth.getSession();
      const userId = session.session?.user.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Fetch the main prediction
      const { data: predictionData, error: predictionError } = await supabase
        .from('predictions')
        .select('*')
        .eq('race_id', raceId)
        .eq('user_id', userId)
        .single();
      
      if (predictionError && predictionError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        throw predictionError;
      }
      
      if (!predictionData) {
        // No prediction exists yet
        set({
          currentPrediction: {
            userId,
            raceId,
            redFlagPrediction: false,
            qualifyingPredictions: [],
            racePredictions: [],
            teamPredictions: []
          },
          loading: false
        });
        return;
      }
      
      // Fetch qualifying predictions
      const { data: qualifyingData, error: qualifyingError } = await supabase
        .from('qualifying_predictions')
        .select('*')
        .eq('prediction_id', predictionData.id);
      
      if (qualifyingError) throw qualifyingError;
      
      // Fetch race predictions
      const { data: raceData, error: raceError } = await supabase
        .from('race_predictions')
        .select('*')
        .eq('prediction_id', predictionData.id);
      
      if (raceError) throw raceError;
      
      // Fetch team predictions
      const { data: teamData, error: teamError } = await supabase
        .from('team_predictions')
        .select('*')
        .eq('prediction_id', predictionData.id);
      
      if (teamError) throw teamError;
      
      set({ 
        currentPrediction: {
          id: predictionData.id,
          userId,
          raceId,
          redFlagPrediction: predictionData.redFlagPrediction,
          qualifyingPredictions: qualifyingData as QualifyingPrediction[],
          racePredictions: raceData as RacePrediction[],
          teamPredictions: teamData as TeamPrediction[]
        },
        loading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        loading: false 
      });
    }
  },
  
  savePrediction: async (prediction) => {
    try {
      set({ loading: true, error: null });
      
      // Start a transaction
      const { data: session } = await supabase.auth.getSession();
      const userId = session.session?.user.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Check if prediction exists
      let predictionId = prediction.id;
      
      if (!predictionId) {
        // Create new prediction
        const { data, error } = await supabase
          .from('predictions')
          .insert({
            user_id: userId,
            race_id: prediction.raceId,
            red_flag_prediction: prediction.redFlagPrediction
          })
          .select()
          .single();
        
        if (error) throw error;
        
        predictionId = data.id;
      } else {
        // Update existing prediction
        const { error } = await supabase
          .from('predictions')
          .update({
            red_flag_prediction: prediction.redFlagPrediction
          })
          .eq('id', predictionId);
        
        if (error) throw error;
      }
      
      // Delete existing qualifying predictions
      const { error: deleteQualifyingError } = await supabase
        .from('qualifying_predictions')
        .delete()
        .eq('prediction_id', predictionId);
      
      if (deleteQualifyingError) throw deleteQualifyingError;
      
      // Insert new qualifying predictions
      if (prediction.qualifyingPredictions.length > 0) {
        const qualifyingData = prediction.qualifyingPredictions.map(qp => ({
          prediction_id: predictionId,
          driver_id: qp.driver_id,
          position: qp.position
        }));
        
        const { error: insertQualifyingError } = await supabase
          .from('qualifying_predictions')
          .insert(qualifyingData);
        
        if (insertQualifyingError) throw insertQualifyingError;
      }
      
      // Delete existing race predictions
      const { error: deleteRaceError } = await supabase
        .from('race_predictions')
        .delete()
        .eq('prediction_id', predictionId);
      
      if (deleteRaceError) throw deleteRaceError;
      
      // Insert new race predictions
      if (prediction.racePredictions.length > 0) {
        const raceData = prediction.racePredictions.map(rp => ({
          prediction_id: predictionId,
          driver_id: rp.driver_id,
          position: rp.position
        }));
        
        const { error: insertRaceError } = await supabase
          .from('race_predictions')
          .insert(raceData);
        
        if (insertRaceError) throw insertRaceError;
      }
      
      // Delete existing team predictions
      const { error: deleteTeamError } = await supabase
        .from('team_predictions')
        .delete()
        .eq('prediction_id', predictionId);
      
      if (deleteTeamError) throw deleteTeamError;

console.log(prediction.teamPredictions)
      
      // Insert new team predictions
      if (prediction.teamPredictions.length > 0) {
        const teamData = prediction.teamPredictions.map(tp => ({
          prediction_id: predictionId,
          team_id: tp.team_id,
          position: tp.position
        }));
        
        const { error: insertTeamError } = await supabase
          .from('team_predictions')
          .insert(teamData);
        
        if (insertTeamError) throw insertTeamError;
      }
      
      // Fetch the updated prediction
      await get().fetchPredictionByRaceId(prediction.raceId);
      
      set({ loading: false });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        loading: false 
      });
    }
  }
}));