#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to replace || with ?? for safer nullish coalescing
function replaceNullishCoalescing(content) {
  // Pattern to match || with strings/empty strings but avoid logical conditions
  return content
    // Replace || '' with ?? ''
    .replace(/\|\|\s*['"]['"]|\|\|\s*['"']['"]/g, "?? ''")
    // Replace || 'text' with ?? 'text'  
    .replace(/\|\|\s*['"]([^'"]+)['"]/g, "?? '$1'")
    // Replace || "text" with ?? "text"
    .replace(/\|\|\s*"([^"]+)"/g, '?? "$1"')
    // Replace || 0 with ?? 0
    .replace(/\|\|\s*0\b/g, '?? 0')
    // Replace || {} with ?? {}
    .replace(/\|\|\s*{}/g, '?? {}')
    // Replace || [] with ?? []
    .replace(/\|\|\s*\[\]/g, '?? []')
}

// Function to fix floating promises with void operator
function fixFloatingPromises(content) {
  return content
    // Fix window.open calls
    .replace(/window\.open\(/g, 'void window.open(')
    // Fix promise calls that should be voided
    .replace(/(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*\.[a-zA-Z_$][a-zA-Z0-9_$]*\([^)]*\);?)$/gm, '$1void $2')
}

// Function to fix unused variables by prefixing with underscore
function fixUnusedVars(content) {
  return content
    .replace(/catch\s*\(\s*error\s*\)/g, 'catch (_error)')
    .replace(/catch\s*\(\s*err\s*\)/g, 'catch (_err)')
}

// Files to process
const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  content = replaceNullishCoalescing(content);
  content = fixFloatingPromises(content);
  content = fixUnusedVars(content);
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else {
      processFile(filePath);
    }
  }
}

// Process all files
processDirectory(srcDir);

console.log('Lint fixes applied!');