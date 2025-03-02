/*
  # Initial Schema Setup for F1 Voting League

  1. New Tables
    - `users` - Stores user information
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `total_points` (integer)
      - `correct_positions` (integer)
      - `team_points` (integer)
      - `qualifying_points` (integer)
    
    - `races` - Stores race information
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `date` (timestamp)
      - `is_sprint_weekend` (boolean)
      - `has_red_flag` (boolean)
      - `status` (enum: UPCOMING, QUALIFYING_COMPLETED, RACE_COMPLETED)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `teams` - Stores F1 team information
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `drivers` - Stores F1 driver information
      - `id` (uuid, primary key)
      - `name` (text)
      - `team_id` (uuid, foreign key to teams)
      - `number` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `predictions` - Stores user predictions for races
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `race_id` (uuid, foreign key to races)
      - `red_flag_prediction` (boolean)
      - `points` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `qualifying_predictions` - Stores qualifying predictions
      - `id` (uuid, primary key)
      - `prediction_id` (uuid, foreign key to predictions)
      - `driver_id` (uuid, foreign key to drivers)
      - `position` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `race_predictions` - Stores race predictions
      - `id` (uuid, primary key)
      - `prediction_id` (uuid, foreign key to predictions)
      - `driver_id` (uuid, foreign key to drivers)
      - `position` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `team_predictions` - Stores team predictions
      - `id` (uuid, primary key)
      - `prediction_id` (uuid, foreign key to predictions)
      - `team_id` (uuid, foreign key to teams)
      - `position` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `qualifying_results` - Stores qualifying results
      - `id` (uuid, primary key)
      - `race_id` (uuid, foreign key to races)
      - `driver_id` (uuid, foreign key to drivers)
      - `position` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `race_results` - Stores race results
      - `id` (uuid, primary key)
      - `race_id` (uuid, foreign key to races)
      - `driver_id` (uuid, foreign key to drivers)
      - `position` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read and write their own data
    - Add policies for public access to certain tables (teams, drivers, races, results)
*/

-- Create race status enum
CREATE TYPE race_status AS ENUM ('UPCOMING', 'QUALIFYING_COMPLETED', 'RACE_COMPLETED');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  total_points INTEGER DEFAULT 0,
  correct_positions INTEGER DEFAULT 0,
  team_points INTEGER DEFAULT 0,
  qualifying_points INTEGER DEFAULT 0
);

-- Create races table
CREATE TABLE IF NOT EXISTS races (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  is_sprint_weekend BOOLEAN DEFAULT false,
  has_red_flag BOOLEAN,
  status race_status DEFAULT 'UPCOMING',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id),
  number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  race_id UUID NOT NULL REFERENCES races(id),
  red_flag_prediction BOOLEAN DEFAULT false,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, race_id)
);

-- Create qualifying predictions table
CREATE TABLE IF NOT EXISTS qualifying_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES predictions(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(prediction_id, position),
  UNIQUE(prediction_id, driver_id)
);

-- Create race predictions table
CREATE TABLE IF NOT EXISTS race_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES predictions(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(prediction_id, position),
  UNIQUE(prediction_id, driver_id)
);

-- Create team predictions table
CREATE TABLE IF NOT EXISTS team_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES predictions(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(prediction_id, position)
);

-- Create qualifying results table
CREATE TABLE IF NOT EXISTS qualifying_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id UUID NOT NULL REFERENCES races(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(race_id, position),
  UNIQUE(race_id, driver_id)
);

-- Create race results table
CREATE TABLE IF NOT EXISTS race_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id UUID NOT NULL REFERENCES races(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(race_id, position),
  UNIQUE(race_id, driver_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE races ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualifying_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualifying_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can view their own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Races policies (public read)
CREATE POLICY "Anyone can view races" 
  ON races FOR SELECT 
  TO authenticated 
  USING (true);

-- Teams policies (public read)
CREATE POLICY "Anyone can view teams" 
  ON teams FOR SELECT 
  TO authenticated 
  USING (true);

-- Drivers policies (public read)
CREATE POLICY "Anyone can view drivers" 
  ON drivers FOR SELECT 
  TO authenticated 
  USING (true);

-- Predictions policies
CREATE POLICY "Users can view their own predictions" 
  ON predictions FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own predictions" 
  ON predictions FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own predictions" 
  ON predictions FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Qualifying predictions policies
CREATE POLICY "Users can view their qualifying predictions" 
  ON qualifying_predictions FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their qualifying predictions" 
  ON qualifying_predictions FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their qualifying predictions" 
  ON qualifying_predictions FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their qualifying predictions" 
  ON qualifying_predictions FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

-- Race predictions policies
CREATE POLICY "Users can view their race predictions" 
  ON race_predictions FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their race predictions" 
  ON race_predictions FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their race predictions" 
  ON race_predictions FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their race predictions" 
  ON race_predictions FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

-- Team predictions policies
CREATE POLICY "Users can view their team predictions" 
  ON team_predictions FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their team predictions" 
  ON team_predictions FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their team predictions" 
  ON team_predictions FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their team predictions" 
  ON team_predictions FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.id = prediction_id AND p.user_id = auth.uid()
  ));

-- Qualifying results policies (public read)
CREATE POLICY "Anyone can view qualifying results" 
  ON qualifying_results FOR SELECT 
  TO authenticated 
  USING (true);

-- Race results policies (public read)
CREATE POLICY "Anyone can view race results" 
  ON race_results FOR SELECT 
  TO authenticated 
  USING (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_races_updated_at
  BEFORE UPDATE ON races
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
  BEFORE UPDATE ON predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qualifying_predictions_updated_at
  BEFORE UPDATE ON qualifying_predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_race_predictions_updated_at
  BEFORE UPDATE ON race_predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_predictions_updated_at
  BEFORE UPDATE ON team_predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qualifying_results_updated_at
  BEFORE UPDATE ON qualifying_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_race_results_updated_at
  BEFORE UPDATE ON race_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();