
import fs from 'fs';

const FILE = 'src/lib/local-data.js';

let content = fs.readFileSync(FILE, 'utf8');

// Fix Audio Paths
// Pattern: .../audio-tapes/module-X/... -> /modules/module-X-audio/...
content = content.replace(
  /https:\/\/mgujzfobtdqargxdnaai\.supabase\.co\/storage\/v1\/object\/public\/audio-tapes\/module-(\d+)/g,
  '/modules/module-$1-audio'
);

// Fix Image Paths
// Pattern: .../exercise-displays/module-X/... -> /modules/module-X-images/...
content = content.replace(
  /https:\/\/mgujzfobtdqargxdnaai\.supabase\.co\/storage\/v1\/object\/public\/exercise-displays\/module-(\d+)/g,
  '/modules/module-$1-images'
);

fs.writeFileSync(FILE, content);
console.log('Fixed paths in local-data.js');
