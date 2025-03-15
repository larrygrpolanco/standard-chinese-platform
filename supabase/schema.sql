-- supabase/schema.sql
-- ===============================
-- ENUMS
-- ===============================
CREATE TYPE module_type AS ENUM ('core', 'optional', 'resource');
COMMENT ON TYPE module_type IS 'Type of module: core (main curriculum), optional, or resource';

CREATE TYPE tape_type AS ENUM ('review', 'workbook', 'test');
COMMENT ON TYPE tape_type IS 'Type of audio tape: review (dialogue review), workbook (exercise), or test';

CREATE TYPE exercise_type AS ENUM ('comprehension', 'production');
COMMENT ON TYPE exercise_type IS 'Type of exercise: comprehension (listening/understanding) or production (speaking/writing)';

CREATE TYPE question_type AS ENUM ('multiple_choice', 'short_answer', 'table_row');
COMMENT ON TYPE question_type IS 'Type of question: multiple_choice (predefined options), short_answer (text input), or table_row (table-based input)';

-- ===============================
-- TABLES
-- ===============================

-- Modules table (top level course organization)
CREATE TABLE public.modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  module_type module_type NOT NULL DEFAULT 'core',
  order_num INTEGER NOT NULL
);
COMMENT ON TABLE public.modules IS 'Top-level course organization (9 core modules, plus optional and resource modules)';
COMMENT ON COLUMN public.modules.title IS 'Module title';
COMMENT ON COLUMN public.modules.description IS 'Optional module description';
COMMENT ON COLUMN public.modules.module_type IS 'Type: core, optional, or resource';
COMMENT ON COLUMN public.modules.order_num IS 'Sequence order within module type';

-- Units table (sections within modules)
CREATE TABLE public.units (
  id SERIAL PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_num INTEGER NOT NULL,
  UNIQUE (module_id, order_num)
);
COMMENT ON TABLE public.units IS 'Units within modules (typically 4-9 units per module)';
COMMENT ON COLUMN public.units.module_id IS 'Reference to parent module';
COMMENT ON COLUMN public.units.title IS 'Unit title';
COMMENT ON COLUMN public.units.description IS 'Optional unit description';
COMMENT ON COLUMN public.units.order_num IS 'Sequence order within module';

-- Vocabulary table
CREATE TABLE public.vocabulary (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  chinese_simplified TEXT NOT NULL,
  chinese_traditional TEXT,  
  pinyin TEXT NOT NULL,
  english TEXT NOT NULL,
  order_num INTEGER NOT NULL
);
COMMENT ON TABLE public.vocabulary IS 'Vocabulary words for each unit';
COMMENT ON COLUMN public.vocabulary.unit_id IS 'Reference to parent unit';
COMMENT ON COLUMN public.vocabulary.chinese_simplified IS 'Word in simplified Chinese characters';
COMMENT ON COLUMN public.vocabulary.chinese_traditional IS 'Optional word in traditional Chinese characters';
COMMENT ON COLUMN public.vocabulary.pinyin IS 'Pinyin romanization with tone marks';
COMMENT ON COLUMN public.vocabulary.english IS 'English translation';
COMMENT ON COLUMN public.vocabulary.order_num IS 'Sequence order within unit';

-- Tapes table (audio recordings)
CREATE TABLE public.tapes (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tape_type tape_type NOT NULL,
  audio_file TEXT,
  order_num INTEGER NOT NULL,
  UNIQUE (unit_id, title)
);
COMMENT ON TABLE public.tapes IS 'Audio recordings for each unit (review tapes and workbook exercise tapes)';
COMMENT ON COLUMN public.tapes.unit_id IS 'Reference to parent unit';
COMMENT ON COLUMN public.tapes.title IS 'Tape title (e.g., "C-1", "P-2 Exercise 3")';
COMMENT ON COLUMN public.tapes.tape_type IS 'Type: review or workbook';
COMMENT ON COLUMN public.tapes.audio_file IS 'URL to audio file in storage';
COMMENT ON COLUMN public.tapes.order_num IS 'Sequence order within unit';

-- Reference list (dialogues)
CREATE TABLE public.reference_list (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,  
  chinese_simplified TEXT NOT NULL,
  chinese_traditional TEXT,
  pinyin TEXT NOT NULL,
  english TEXT NOT NULL,
  notes TEXT,
  order_num INTEGER NOT NULL,
  UNIQUE (unit_id, number)
);
COMMENT ON TABLE public.reference_list IS 'Reference dialogues for each unit';
COMMENT ON COLUMN public.reference_list.unit_id IS 'Reference to parent unit';
COMMENT ON COLUMN public.reference_list.number IS 'Reference number in textbook';
COMMENT ON COLUMN public.reference_list.chinese_simplified IS 'Dialogue in simplified Chinese';
COMMENT ON COLUMN public.reference_list.chinese_traditional IS 'Optional dialogue in traditional Chinese';
COMMENT ON COLUMN public.reference_list.pinyin IS 'Pinyin romanization with tone marks';
COMMENT ON COLUMN public.reference_list.english IS 'English translation';
COMMENT ON COLUMN public.reference_list.notes IS 'Optional contextual notes';
COMMENT ON COLUMN public.reference_list.order_num IS 'Sequence order within unit, usually same as number';

-- Exercises table
CREATE TABLE public.exercises (
  id SERIAL PRIMARY KEY,
  tape_id INTEGER NOT NULL REFERENCES public.tapes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exercise_type exercise_type NOT NULL,
  instructions TEXT,
  display_url TEXT,
  order_num INTEGER NOT NULL,
  UNIQUE (tape_id, order_num)
);
COMMENT ON TABLE public.exercises IS 'Language exercises tied to specific workbook tapes';
COMMENT ON COLUMN public.exercises.tape_id IS 'Reference to parent tape';
COMMENT ON COLUMN public.exercises.title IS 'Descriptive exercise title';
COMMENT ON COLUMN public.exercises.exercise_type IS 'Type: comprehension or production';
COMMENT ON COLUMN public.exercises.instructions IS 'Text instructions for the exercise';
COMMENT ON COLUMN public.exercises.display_url IS 'Optional URL to image display used in exercise';
COMMENT ON COLUMN public.exercises.order_num IS 'Sequence order within tape';

-- Exercise questions table
CREATE TABLE public.exercise_questions (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  options TEXT,
  order_num INTEGER NOT NULL,
  UNIQUE (exercise_id, order_num)
);
COMMENT ON TABLE public.exercise_questions IS 'Individual questions within exercises';
COMMENT ON COLUMN public.exercise_questions.exercise_id IS 'Reference to parent exercise';
COMMENT ON COLUMN public.exercise_questions.question_text IS 'The question text';
COMMENT ON COLUMN public.exercise_questions.question_type IS 'Type: multiple_choice, short_answer, or table_row';
COMMENT ON COLUMN public.exercise_questions.options IS 'For multiple_choice: "Option 1|Option 2|Option 3"';
COMMENT ON COLUMN public.exercise_questions.order_num IS 'Sequence order within exercise';

-- ===============================
-- INDEXES
-- ===============================
CREATE INDEX idx_units_module_id ON public.units (module_id);
CREATE INDEX idx_vocabulary_unit_id ON public.vocabulary (unit_id);
CREATE INDEX idx_tapes_unit_id ON public.tapes (unit_id);
CREATE INDEX idx_reference_list_unit_id ON public.reference_list (unit_id);
CREATE INDEX idx_exercises_tape_id ON public.exercises (tape_id);
CREATE INDEX idx_exercise_questions_exercise_id ON public.exercise_questions (exercise_id);

-- ===============================
-- SECURITY
-- ===============================
-- Enable Row Level Security
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_questions ENABLE ROW LEVEL SECURITY;

-- Add public read-only policies
CREATE POLICY "Public read-only access" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.units FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.tapes FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.reference_list FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.exercises FOR SELECT USING (true);
CREATE POLICY "Public read-only access" ON public.exercise_questions FOR SELECT USING (true);


-- User progress tracking
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id INTEGER NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, unit_id)
);

-- User preferences for RWP personalization
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  full_name TEXT,
  
  -- Basic learning info
  learning_level TEXT, 
  learning_goals TEXT[],
  
  -- JSON fields for flexible storage
  personal_context JSONB, -- general user information
  module_responses JSONB, -- structured by module_id
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id)
);

-- RWP generated content storage
CREATE TABLE public.rwp_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id INTEGER NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, unit_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rwp_content ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_progress
CREATE POLICY "Users can read their own progress" 
  ON public.user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON public.user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for user_preferences
CREATE POLICY "Users can read their own progress" 
  ON public.user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON public.user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

  -- RLS policies for rwp_content
CREATE POLICY "Users can read their own progress" 
  ON public.rwp_content FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.rwp_content FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON public.rwp_content FOR UPDATE 
  USING (auth.uid() = user_id);

