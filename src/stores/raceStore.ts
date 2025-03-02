import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Race {
  id: string;
  name: string;
  location: string;
  date: string;
  isSprintWeekend: boolean;
  hasRedFlag?: boolean;
  status: 'UPCOMING' | 'QUALIFYING_COMPLETED' | 'RACE_COMPLETED';
}

interface RaceState {
  races: Race[];
  upcomingRaces: Race[];
  pastRaces: Race[];
  currentRace: Race | null;
  loading: boolean;
  error: string | null;
  fetchRaces: () => Promise<void>;
  fetchRaceById: (id: string) => Promise<void>;
}

export const useRaceStore = create<RaceState>((set, get) => ({
  races: [],
  upcomingRaces: [],
  pastRaces: [],
  currentRace: null,
  loading: false,
  error: null,
  
  fetchRaces: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('races')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      const races = data as Race[];
      const now = new Date();
      
      const upcomingRaces = races.filter(race => new Date(race.date) > now);
      const pastRaces = races.filter(race => new Date(race.date) <= now);
      
      set({ 
        races,
        upcomingRaces,
        pastRaces,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        loading: false 
      });
    }
  },
  
  fetchRaceById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('races')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ 
        currentRace: data as Race,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        loading: false 
      });
    }
  },
}));