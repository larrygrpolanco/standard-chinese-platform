-- supabase/schema.sql

-- Modules table
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  module_type TEXT NOT NULL, -- 'core', 'optional', 'resource'
  order_num INTEGER NOT NULL
);

-- Units table
CREATE TABLE units (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES modules(id),
  title TEXT NOT NULL,
  description TEXT,
  order_num INTEGER NOT NULL
);

-- Tapes table
CREATE TABLE tapes (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES units(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'comprehension', 'production'
  audio_file TEXT,
  order_num INTEGER NOT NULL
);

-- Tape content table
CREATE TABLE tape_content (
  id SERIAL PRIMARY KEY,
  tape_id INTEGER REFERENCES tapes(id),
  chinese TEXT NOT NULL,
  pinyin TEXT,
  english TEXT,
  order_num INTEGER NOT NULL
);

-- Vocabulary table
CREATE TABLE vocabulary (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES units(id),
  chinese TEXT NOT NULL,
  pinyin TEXT,
  english TEXT NOT NULL
);