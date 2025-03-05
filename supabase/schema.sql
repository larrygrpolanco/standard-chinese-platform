-- supabase/schema.sql

-- ENUMS for basic typing
CREATE TYPE module_type AS ENUM ('core', 'optional', 'resource');
CREATE TYPE tape_type AS ENUM ('review', 'workbook', 'test');
CREATE TYPE exercise_type AS ENUM ('listening', 'translation', 'multiple_choice', 'input_required', 'no_input_required');

-- Modules table
CREATE TABLE public.modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  module_type module_type NOT NULL DEFAULT 'core',
  order_num INTEGER NOT NULL
);

-- Units table
CREATE TABLE public.units (
  id SERIAL PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_num INTEGER NOT NULL,
  UNIQUE (module_id, order_num)
);

-- Vocabulary table
CREATE TABLE public.vocabulary (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  chinese_simplified TEXT NOT NULL,
  chinese_traditional TEXT,  -- Optional, only for cases where fonts don't work
  pinyin TEXT NOT NULL,
  english TEXT NOT NULL,
  order_num INTEGER NOT NULL
);

-- Tapes table
CREATE TABLE public.tapes (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tape_type tape_type NOT NULL,
  audio_file TEXT,
  order_num INTEGER NOT NULL,
  UNIQUE (unit_id, title)
);

-- Reference list (dialogues) - moved to unit level instead of tape level
CREATE TABLE public.reference_list (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES public.units(id) ON DELETE CASCADE, -- Changed from tape_id
  number INTEGER NOT NULL,  -- The reference number (1, 2, 3, etc.)
  chinese_simplified TEXT NOT NULL,
  chinese_traditional TEXT,  -- Optional
  pinyin TEXT NOT NULL,
  english TEXT NOT NULL,
  notes TEXT,  -- Optional notes about the dialogue
  order_num INTEGER NOT NULL,
  UNIQUE (unit_id, number)
);

-- Exercises for workbook tapes
CREATE TABLE public.exercises (
  id SERIAL PRIMARY KEY,
  tape_id INTEGER NOT NULL REFERENCES public.tapes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exercise_type exercise_type NOT NULL DEFAULT 'listening',
  instructions TEXT,
  audio_file TEXT,
  has_supporting_material BOOLEAN DEFAULT FALSE,
  supporting_material TEXT,  -- Could be URL to image, table HTML, etc.
  requires_input BOOLEAN DEFAULT FALSE,
  answer_data TEXT, -- JSON or text representation of correct answers if needed
  order_num INTEGER NOT NULL
);

-- Basic indexes
CREATE INDEX idx_units_module_id ON public.units (module_id);
CREATE INDEX idx_tapes_unit_id ON public.tapes (unit_id);
CREATE INDEX idx_vocabulary_unit_id ON public.vocabulary (unit_id);
CREATE INDEX idx_reference_list_unit_id ON public.reference_list (unit_id);
CREATE INDEX idx_exercises_tape_id ON public.exercises (tape_id);

-- Enable Row Level Security with simple policies
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Add public read-only policies
CREATE POLICY "Public read-only access" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.units FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.tapes FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.reference_list FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.exercises FOR SELECT USING (true);