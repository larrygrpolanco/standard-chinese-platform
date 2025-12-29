
import fs from 'fs';

const FILE = 'src/lib/local-data.js';

let content = fs.readFileSync(FILE, 'utf8');

// Replace literal "\n" (backslash-n) which appears as "\\n" in the stringified content
// with the escape sequence "\n" (backslash-n) which appears as "\n" in the file.
// In the file string content: we likely see double backslashes.
// Current file: ... "description": "Text\\nText" ...
// Desired file: ... "description": "Text\nText" ...

// We want to replace the sequence of characters (backslash + backslash + n) with (backslash + n)
// In regex: /\\\\n/g matches \\n
content = content.replace(/\\\\n/g, '\\n');

fs.writeFileSync(FILE, content);
console.log('Fixed newlines in local-data.js');
