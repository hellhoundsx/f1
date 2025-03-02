import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface LeaderboardUser {
  id: string;
  name: string;
  totalPoints: number;
  correctPositions: number; // Tiebreaker 1
  teamPoints: number; // Tiebreaker 2
  qualifyingPoints: number; // Tiebreaker 3
}

interface LeaderboardState {
  users: LeaderboardUser[];
  loading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  users: [],
  loading: false,
  error: null,
  
  fetchLeaderboard: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('users')
        .select('id, name, total_points, correct_positions, team_points, qualifying_points')
        .order('total_points', { ascending: false })
        .order('correct_positions', { ascending: false })
        .order('team_points', { ascending: false })
        .order('qualifying_points', { ascending: false });
      
      if (error) throw error;
      
      set({ 
        users: data as LeaderboardUser[],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        loading: false 
      });
    }
  }
}));