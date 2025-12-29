
import fs from 'fs';
import path from 'path';

const BACKUP_FILE = 'supabase/db_cluster-01-06-2025@21-26-55.backup';
const OUTPUT_FILE = 'src/lib/local-data.js';

function parseCopyData(content, tableName, columns) {
  const startMarker = `COPY public.${tableName} (${columns.join(', ')}) FROM stdin;`;
  const startIndex = content.indexOf(startMarker);
  
  if (startIndex === -1) {
    console.warn(`Could not find data for table ${tableName}`);
    return [];
  }
  
  const dataStart = startIndex + startMarker.length;
  // stored as lines until "\."
  const endIndex = content.indexOf('\n\\.', dataStart);
  
  if (endIndex === -1) {
     console.warn(`Could not find end of data for table ${tableName}`);
     return [];
  }
  
  const dataBlock = content.substring(dataStart, endIndex).trim();
  if (!dataBlock) return [];
  
  const lines = dataBlock.split('\n');
  return lines.map(line => {
    const values = line.split('\t');
    const obj = {};
    columns.forEach((col, i) => {
      let val = values[i];
      if (val === '\\N') val = null;
      // Is it a number?
      if (col === 'id' || col.endsWith('_id') || col === 'order_num' || col === 'number') {
        val = val !== null ? parseInt(val, 10) : null;
      }
      obj[col] = val;
    });
    return obj;
  });
}

const fileContent = fs.readFileSync(BACKUP_FILE, 'utf8');

// Define tables and columns based on grep headers
const tables = [
  { 
    name: 'modules', 
    columns: ['id', 'title', 'description', 'module_type', 'order_num'] 
  },
  { 
    name: 'units', 
    columns: ['id', 'module_id', 'title', 'description', 'order_num'] 
  },
  {
    name: 'vocabulary',
    columns: ['id', 'unit_id', 'chinese_simplified', 'chinese_traditional', 'pinyin', 'english', 'order_num']
  },
  {
    name: 'tapes',
    columns: ['id', 'unit_id', 'title', 'tape_type', 'audio_file', 'order_num']
  },
  {
    name: 'reference_list',
    columns: ['id', 'unit_id', 'number', 'chinese_simplified', 'chinese_traditional', 'pinyin', 'english', 'notes', 'order_num']
  },
  {
    name: 'exercises',
    columns: ['id', 'tape_id', 'title', 'exercise_type', 'instructions', 'display_url', 'order_num']
  },
  {
    name: 'exercise_questions',
    columns: ['id', 'exercise_id', 'question_text', 'question_type', 'options', 'order_num']
  }
];

const db = {};

// Parse all data first
tables.forEach(t => {
  db[t.name] = parseCopyData(fileContent, t.name, t.columns);
  console.log(`Parsed ${db[t.name].length} rows for ${t.name}`);
});

// Logic to filter for Module 1 and 2
// Assuming modules are titled "Module 1", "Module 2" or order_num 1, 2.
// Let's filter by order_num 1 and 2 to be safe, or just check IDs.
const keptModules = db.modules.filter(m => m.order_num <= 2); // Keep first 2 modules
const keptModuleIds = new Set(keptModules.map(m => m.id));

const keptUnits = db.units.filter(u => keptModuleIds.has(u.module_id));
const keptUnitIds = new Set(keptUnits.map(u => u.id));

const keptVocab = db.vocabulary.filter(v => keptUnitIds.has(v.unit_id));
const keptTapes = db.tapes.filter(t => keptUnitIds.has(t.unit_id));
const keptTapeIds = new Set(keptTapes.map(t => t.id));
const keptRefList = db.reference_list.filter(r => keptUnitIds.has(r.unit_id));

const keptExercises = db.exercises.filter(e => keptTapeIds.has(e.tape_id));
const keptExerciseIds = new Set(keptExercises.map(e => e.id));

const keptQuestions = db.exercise_questions.filter(q => keptExerciseIds.has(q.exercise_id));

const finalData = {
  modules: keptModules,
  units: keptUnits,
  vocabulary: keptVocab,
  tapes: keptTapes,
  reference_list: keptRefList,
  exercises: keptExercises,
  exercise_questions: keptQuestions
};

console.log('Filtered Data Summary:');
Object.keys(finalData).forEach(k => {
  console.log(`${k}: ${finalData[k].length}`);
});

const outputContent = `export const DB = ${JSON.stringify(finalData, null, 2)};`;

fs.writeFileSync(OUTPUT_FILE, outputContent);
console.log(`Saved to ${OUTPUT_FILE}`);
