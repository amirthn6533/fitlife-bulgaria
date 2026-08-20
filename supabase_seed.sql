-- ============================================================================
-- FitLife Bulgaria — Database Seed Data
-- Run this in the Supabase SQL Editor after running supabase_schema.sql
-- ============================================================================

-- 1. EXERCISES CATALOG
INSERT INTO public.exercises (name, name_bg, muscle_group, icon, default_sets, default_reps, default_weight_kg)
VALUES
  -- Chest
  ('Bench Press', 'Вдигане от лег', 'chest', '🏋️', 4, 10, 60),
  ('Incline Dumbbell Press', 'Полулег с дъмбели', 'chest', '🏋️', 3, 12, 22),
  ('Cable Flyes', 'Флайс на скрипец', 'chest', '💪', 3, 15, 15),
  ('Chest Dips', 'Кофички за гърди', 'chest', '💪', 3, 12, 0),
  
  -- Back
  ('Deadlift', 'Мъртва тяга', 'back', '🏋️', 4, 8, 100),
  ('Pull-Ups', 'Набирания', 'back', '🧗', 4, 10, 0),
  ('Barbell Row', 'Гребане с щанга', 'back', '🏋️', 3, 12, 60),
  ('Lat Pulldown', 'Придърпване на скрипец', 'back', '💪', 3, 12, 50),
  
  -- Legs
  ('Squat', 'Клек с щанга', 'legs', '🦵', 4, 10, 80),
  ('Leg Press', 'Лег преса', 'legs', '🦵', 3, 12, 120),
  ('Romanian Deadlift', 'Румънска тяга', 'legs', '🦵', 3, 10, 60),
  ('Leg Curl', 'Бедрено сгъване', 'legs', '🦵', 3, 15, 35),
  
  -- Shoulders
  ('Overhead Press', 'Раменна преса', 'shoulders', '🏔️', 4, 10, 40),
  ('Lateral Raises', 'Разтваряне встрани', 'shoulders', '🏔️', 4, 15, 10),
  ('Face Pulls', 'Фейспул', 'shoulders', '🏔️', 3, 15, 20),
  
  -- Arms
  ('Barbell Curl', 'Сгъване с щанга за бицепс', 'arms', '💪', 4, 10, 30),
  ('Tricep Dips', 'Кофички за трицепс', 'arms', '💪', 3, 12, 0),
  ('Hammer Curl', 'Чуково сгъване', 'arms', '💪', 3, 12, 14),
  ('Skull Crushers', 'Френско разгъване', 'arms', '💪', 3, 12, 25),
  
  -- Core
  ('Plank', 'Планк', 'core', '🧘', 3, 60, 0),
  ('Hanging Leg Raises', 'Повдигане на крака от вис', 'core', '🧘', 3, 15, 0),
  ('Ab Wheel Rollout', 'Колело за корем', 'core', '🧘', 3, 12, 0)
ON CONFLICT DO NOTHING;

-- 2. SOFIA FITNESS LOCATIONS
INSERT INTO public.fitness_locations (name, address_bg, address_en, category, lat, lng, rating, icon, distance_text)
VALUES
  ('Pulse Fitness Lozenets', 'бул. Черни Връх 47, София', '47 Cherni Vrah Blvd, Sofia', 'gym', 42.6685, 23.3236, 4.8, '🏋️', '0.8 km'),
  ('Next Level Gym Vitosha', 'ул. Витоша 120, София', '120 Vitosha St, Sofia', 'gym', 42.6841, 23.3195, 4.6, '🏋️', '1.2 km'),
  ('Protein Bar Sofia', 'бул. Витоша 65, София', '65 Vitosha Blvd, Sofia', 'protein', 42.6912, 23.3204, 4.7, '🥤', '0.5 km'),
  ('GNC Paradise Center', 'Paradise Center, ет. 1', 'Paradise Center, Floor 1', 'protein', 42.6582, 23.3150, 4.4, '🥤', '2.1 km'),
  ('Borisova Gradina Park Loop', '3.2 км маршрут за бягане', '3.2km running loop', 'running', 42.6853, 23.3402, 4.9, '🏃', '1.5 km'),
  ('South Park Loop', '2.8 км маршрут', '2.8km running path', 'running', 42.6689, 23.3090, 4.7, '🏃', '0.9 km'),
  ('Walltopia Climbing', 'ул. Околовръстен път, София', 'Okolovrasten pat St, Sofia', 'climbing', 42.6636, 23.3768, 4.8, '🧗', '4.2 km'),
  ('Vitosha Rock Routes', 'Природни скални стени', 'Natural rock walls', 'climbing', 42.6391, 23.2427, 4.9, '🧗', '12 km')
ON CONFLICT DO NOTHING;

-- 3. GLOBAL CHALLENGES
INSERT INTO public.challenges (title, description, emoji, type, is_wagered, stake_amount, currency, prize_pool, start_date, end_date, status)
VALUES
  ('Fastest 5K Run', 'Завърши най-бързото 5K бягане в София за този месец.', '🏃', 'running', true, 20.00, 'BGN', 360.00, NOW(), NOW() + INTERVAL '10 days', 'active'),
  ('100kg Squat Club', 'Докажи че клякаш 100кг с перфектна форма.', '🦵', 'lifting', true, 0.05, 'SOL', 1.70, NOW(), NOW() + INTERVAL '14 days', 'active'),
  ('30-Day Streak War', 'Не пропускай нито един ден от тренировъчния план!', '🔥', 'streak', false, 0.00, 'BGN', 0.00, NOW(), NOW() + INTERVAL '22 days', 'active'),
  ('100 Pushups Daily', '100 лицеви опори всеки ден в рамките на 3 седмици.', '💪', 'strength', false, 0.00, 'BGN', 0.00, NOW(), NOW() + INTERVAL '18 days', 'active'),
  ('Marathon in a Month', 'Пробягай общо 42.2 км в рамките на един календарен месец.', '🏅', 'running', true, 10.00, 'USDT', 270.00, NOW(), NOW() + INTERVAL '25 days', 'active')
ON CONFLICT DO NOTHING;

-- 4. MARKETPLACE DIGITAL PLANS
INSERT INTO public.marketplace_plans (title, description, price, currency, icon, rating)
VALUES
  ('12-Week Muscle Builder', 'Интензивна програма за покачване на чиста мускулна маса с прогресивно натоварване.', 35.00, 'BGN', '💪', 4.9),
  ('Keto Meal Plan', 'Персонализиран кетонен режим с рецепти за всеки ден и точни грамажи.', 25.00, 'BGN', '🥑', 4.8),
  ('Beginner Marathon Plan', '8-седмичен план за подготовка за първия ви полумаратон или 10K.', 30.00, 'BGN', '🏃', 4.7)
ON CONFLICT DO NOTHING;
