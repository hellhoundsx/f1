/*
  # Seed Data for F1 Voting League

  1. Data Seeding
    - Teams - Current F1 teams
    - Drivers - Current F1 drivers with their teams
    - Races - 2025 F1 calendar (sample data)
*/

-- Insert teams
INSERT INTO teams (name) VALUES
('Red Bull Racing'),
('Mercedes'),
('Ferrari'),
('McLaren'),
('Aston Martin'),
('Alpine'),
('Williams'),
('RB'),
('Haas F1 Team'),
('Sauber');

-- Insert drivers (with team references)
INSERT INTO drivers (name, team_id, number)
SELECT 'Max Verstappen', id, 1 FROM teams WHERE name = 'Red Bull Racing';

INSERT INTO drivers (name, team_id, number)
SELECT 'Sergio Perez', id, 11 FROM teams WHERE name = 'Red Bull Racing';

INSERT INTO drivers (name, team_id, number)
SELECT 'Lewis Hamilton', id, 44 FROM teams WHERE name = 'Mercedes';

INSERT INTO drivers (name, team_id, number)
SELECT 'George Russell', id, 63 FROM teams WHERE name = 'Mercedes';

INSERT INTO drivers (name, team_id, number)
SELECT 'Charles Leclerc', id, 16 FROM teams WHERE name = 'Ferrari';

INSERT INTO drivers (name, team_id, number)
SELECT 'Carlos Sainz', id, 55 FROM teams WHERE name = 'Ferrari';

INSERT INTO drivers (name, team_id, number)
SELECT 'Lando Norris', id, 4 FROM teams WHERE name = 'McLaren';

INSERT INTO drivers (name, team_id, number)
SELECT 'Oscar Piastri', id, 81 FROM teams WHERE name = 'McLaren';

INSERT INTO drivers (name, team_id, number)
SELECT 'Fernando Alonso', id, 14 FROM teams WHERE name = 'Aston Martin';

INSERT INTO drivers (name, team_id, number)
SELECT 'Lance Stroll', id, 18 FROM teams WHERE name = 'Aston Martin';

INSERT INTO drivers (name, team_id, number)
SELECT 'Pierre Gasly', id, 10 FROM teams WHERE name = 'Alpine';

INSERT INTO drivers (name, team_id, number)
SELECT 'Esteban Ocon', id, 31 FROM teams WHERE name = 'Alpine';

INSERT INTO drivers (name, team_id, number)
SELECT 'Alex Albon', id, 23 FROM teams WHERE name = 'Williams';

INSERT INTO drivers (name, team_id, number)
SELECT 'Logan Sargeant', id, 2 FROM teams WHERE name = 'Williams';

INSERT INTO drivers (name, team_id, number)
SELECT 'Yuki Tsunoda', id, 22 FROM teams WHERE name = 'RB';

INSERT INTO drivers (name, team_id, number)
SELECT 'Daniel Ricciardo', id, 3 FROM teams WHERE name = 'RB';

INSERT INTO drivers (name, team_id, number)
SELECT 'Nico Hulkenberg', id, 27 FROM teams WHERE name = 'Haas F1 Team';

INSERT INTO drivers (name, team_id, number)
SELECT 'Kevin Magnussen', id, 20 FROM teams WHERE name = 'Haas F1 Team';

INSERT INTO drivers (name, team_id, number)
SELECT 'Valtteri Bottas', id, 77 FROM teams WHERE name = 'Sauber';

INSERT INTO drivers (name, team_id, number)
SELECT 'Zhou Guanyu', id, 24 FROM teams WHERE name = 'Sauber';

-- Insert races (2025 calendar - sample data)
INSERT INTO races (name, location, date, is_sprint_weekend) VALUES
('Bahrain Grand Prix', 'Sakhir', '2025-03-02 15:00:00+00', false),
('Saudi Arabian Grand Prix', 'Jeddah', '2025-03-09 18:00:00+00', false),
('Australian Grand Prix', 'Melbourne', '2025-03-23 06:00:00+00', true),
('Japanese Grand Prix', 'Suzuka', '2025-04-06 06:00:00+00', false),
('Chinese Grand Prix', 'Shanghai', '2025-04-20 08:00:00+00', true),
('Miami Grand Prix', 'Miami', '2025-05-04 20:00:00+00', true),
('Emilia Romagna Grand Prix', 'Imola', '2025-05-18 14:00:00+00', false),
('Monaco Grand Prix', 'Monte Carlo', '2025-05-25 14:00:00+00', false),
('Canadian Grand Prix', 'Montreal', '2025-06-08 19:00:00+00', false),
('Spanish Grand Prix', 'Barcelona', '2025-06-22 14:00:00+00', false),
('Austrian Grand Prix', 'Spielberg', '2025-06-29 14:00:00+00', true),
('British Grand Prix', 'Silverstone', '2025-07-06 14:00:00+00', false),
('Hungarian Grand Prix', 'Budapest', '2025-07-27 14:00:00+00', false),
('Belgian Grand Prix', 'Spa-Francorchamps', '2025-08-03 14:00:00+00', false),
('Dutch Grand Prix', 'Zandvoort', '2025-08-24 14:00:00+00', false),
('Italian Grand Prix', 'Monza', '2025-08-31 14:00:00+00', false),
('Azerbaijan Grand Prix', 'Baku', '2025-09-14 12:00:00+00', false),
('Singapore Grand Prix', 'Singapore', '2025-09-21 13:00:00+00', false),
('United States Grand Prix', 'Austin', '2025-10-19 19:00:00+00', true),
('Mexico City Grand Prix', 'Mexico City', '2025-10-26 20:00:00+00', false),
('São Paulo Grand Prix', 'São Paulo', '2025-11-09 18:00:00+00', true),
('Las Vegas Grand Prix', 'Las Vegas', '2025-11-23 06:00:00+00', false),
('Qatar Grand Prix', 'Lusail', '2025-12-07 15:00:00+00', true),
('Abu Dhabi Grand Prix', 'Yas Marina', '2025-12-14 13:00:00+00', false);

-- Update past races for demo purposes (first two races)
UPDATE races 
SET status = 'RACE_COMPLETED', has_red_flag = false
WHERE name IN ('Bahrain Grand Prix', 'Saudi Arabian Grand Prix');