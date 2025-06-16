// Script to extract all tool usages from neverwinter.nim/nwn_*.nim and write to tool_usages.json
const fs = require('fs');
const path = require('path');

function extractAllUsages(dirPath) {
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.nim') && f.startsWith('nwn_'));
  const usages = [];
  const processedFiles = new Set(); // Track processed files to avoid duplicates
  
  for (const file of files) {
    if (processedFiles.has(file)) continue;
    
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Special handling for concatenated string patterns
    let fullDocContent = '';
    
    // Look for the "let args = DOC" pattern and extract the concatenated string
    const docStartMatch = content.match(/let\s+args\s*=\s*DOC\s+"""/);
    if (docStartMatch) {
      const startIndex = content.indexOf(docStartMatch[0]);
      const afterStart = content.substring(startIndex);
      
      // Find all triple-quoted strings that are part of this concatenation
      const tripleQuotePattern = /"""([\s\S]*?)"""/g;
      let match;
      let parts = [];
      
      while ((match = tripleQuotePattern.exec(afterStart)) !== null) {
        parts.push(match[1]);
        // Stop if we hit a line that doesn't continue the concatenation
        const afterMatch = afterStart.substring(match.index + match[0].length);
        const nextLine = afterMatch.split('\n')[0];
        if (!nextLine.includes('&') && !nextLine.trim().startsWith('&')) {
          break;
        }
      }
      
      if (parts.length > 0) {
        fullDocContent = parts.join('');
      }
    }
    
    // If we didn't find the concatenated pattern, try other patterns
    if (!fullDocContent) {
      const patterns = [
        /const\s+ArgsHelp\s*=\s*"""([\s\S]*?)"""/gm,
        /let\s+args\s*=\s*DOC\s+"""([\s\S]*?)"""/gm,
        /(?:\w+\s*=\s*)?DOC\s+"""([\s\S]*?)"""/gm,
        /\w+\s*=\s*"""([\s\S]*?)"""/gm
      ];
      
      for (const pattern of patterns) {
        pattern.lastIndex = 0; // Reset regex
        let docMatch;
        while ((docMatch = pattern.exec(content)) !== null) {
          const doc = docMatch[1].trim();
          
          // Only process if it contains "Usage:" - this filters out non-help strings
          if (doc.includes('Usage:')) {
            fullDocContent = doc;
            break;
          }
        }
        if (fullDocContent) break;
      }
    }
    
    if (fullDocContent && fullDocContent.includes('Usage:')) {
      let usage = '';
      let options = '';
      let description = '';
      
      // Extract description (everything before "Usage:")
      const descMatch = fullDocContent.match(/^([\s\S]*?)Usage:/m);
      if (descMatch && descMatch[1].trim()) {
        description = descMatch[1].trim();
      }
      
      // Extract Usage section - handle multiple usage lines
      const usageMatch = fullDocContent.match(/Usage:\s*([\s\S]*?)(Options:|$)/m);
      if (usageMatch && usageMatch[1].trim()) {
        usage = usageMatch[1].trim()
          .replace(/\$USAGE/g, '') // Remove placeholder tokens
          .replace(/\n\s*\n/g, '\n') // Clean up extra newlines
          .trim();
      }
      
      // Extract Options section - clean up placeholder tokens
      const optionsMatch = fullDocContent.match(/Options:\s*([\s\S]*)/m);
      if (optionsMatch && optionsMatch[1].trim()) {
        options = optionsMatch[1].trim()
          .replace(/\$OPTRESMAN/g, '') // Remove placeholder token
          .replace(/\$OPT/g, '') // Remove other placeholder token
          .replace(/\n\s*\n/g, '\n') // Clean up extra newlines
          .trim();
      }
      
      // If we still don't have usage, use first line after description
      if (!usage) {
        const lines = fullDocContent.split(/\r?\n/).map(l => l.trim()).filter(l => l);
        const descLines = description ? description.split(/\r?\n/).length : 0;
        usage = lines.length > descLines ? lines[descLines] : '';
      }
      
      usages.push({
        file: file,
        description: description,
        usage: usage,
        options: options,
        doc: fullDocContent // always include the full DOC block for manual review
      });
      processedFiles.add(file);
    } else {
      usages.push({ 
        file: file, 
        description: '',
        usage: '[No DOC block found]', 
        options: '', 
        doc: '' 
      });
      processedFiles.add(file);
    }
  }
  return usages;
}

const nimDir = path.join(__dirname, '../neverwinter.nim');
const usages = extractAllUsages(nimDir);
fs.writeFileSync(path.join(__dirname, 'tool_usages.json'), JSON.stringify(usages, null, 2), 'utf-8');
console.log('tool_usages.json written with', usages.length, 'entries.');
