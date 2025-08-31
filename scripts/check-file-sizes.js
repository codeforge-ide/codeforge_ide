#!/usr/bin/env node

/**
 * File Size Checker Script for CodeForge IDE
 * Enforces radical modularity principles by checking file sizes
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MAX_FILE_SIZES = {
  '.tsx': 200,
  '.ts': 200,
  '.js': 200,
  '.jsx': 200,
  '.test.tsx': 300,
  '.test.ts': 300,
  '.spec.tsx': 300,
  '.spec.ts': 300,
  '.css': 250,
  '.scss': 250,
  '.md': 500,
};

const IGNORED_DIRECTORIES = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.next',
  '.vscode',
  'src-tauri/target',
  'coverage',
];

const IGNORED_FILES = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'tsconfig.json',
  'vite.config.ts',
  'vitest.config.ts',
  '.eslintrc.json',
  '.prettierrc.json',
];

/**
 * Count lines in a file (excluding blank lines and comments)
 */
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let totalLines = 0;
    let codeLines = 0;
    let commentLines = 0;
    let blankLines = 0;

    for (const line of lines) {
      totalLines++;
      const trimmed = line.trim();

      if (trimmed === '') {
        blankLines++;
      } else if (
        trimmed.startsWith('//') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('*/') ||
        trimmed.startsWith('#')
      ) {
        commentLines++;
      } else {
        codeLines++;
      }
    }

    return { totalLines, codeLines, commentLines, blankLines };
  } catch (error) {
    console.warn(`Could not read file ${filePath}: ${error.message}`);
    return { totalLines: 0, codeLines: 0, commentLines: 0, blankLines: 0 };
  }
}

/**
 * Get the appropriate size limit for a file
 */
function getSizeLimit(filePath) {
  const fileName = path.basename(filePath);

  // Check for test files first
  if (fileName.includes('.test.') || fileName.includes('.spec.')) {
    const testExt = Object.keys(MAX_FILE_SIZES).find(ext =>
      ext.startsWith('.test.') || ext.startsWith('.spec.')
    );
    if (testExt && fileName.endsWith(testExt.replace(/\.(test|spec)\./, '.'))) {
      return MAX_FILE_SIZES[testExt];
    }
    return 300; // Default for test files
  }

  // Check regular file extensions
  for (const [ext, limit] of Object.entries(MAX_FILE_SIZES)) {
    if (fileName.endsWith(ext) && !ext.includes('test') && !ext.includes('spec')) {
      return limit;
    }
  }

  return null; // No limit for unknown file types
}

/**
 * Check if a directory should be ignored
 */
function shouldIgnoreDirectory(dirPath) {
  const dirName = path.basename(dirPath);
  return IGNORED_DIRECTORIES.some(ignored =>
    dirName === ignored || dirPath.includes(ignored)
  );
}

/**
 * Check if a file should be ignored
 */
function shouldIgnoreFile(filePath) {
  const fileName = path.basename(filePath);
  return IGNORED_FILES.includes(fileName);
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(dirPath, results = []) {
  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        if (!shouldIgnoreDirectory(itemPath)) {
          scanDirectory(itemPath, results);
        }
      } else if (stats.isFile()) {
        if (!shouldIgnoreFile(itemPath)) {
          results.push(itemPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Could not scan directory ${dirPath}: ${error.message}`);
  }

  return results;
}

/**
 * Format file size report
 */
function formatReport(violations, totalFiles, largestFiles) {
  console.log('\n📏 CodeForge File Size Report');
  console.log('═'.repeat(50));

  if (violations.length === 0) {
    console.log('✅ All files are within size limits!');
  } else {
    console.log(`❌ Found ${violations.length} file(s) exceeding size limits:`);
    console.log();

    violations.forEach(violation => {
      const { filePath, lines, limit, percentage } = violation;
      const relativePath = path.relative(process.cwd(), filePath);

      console.log(`  ${relativePath}`);
      console.log(`    Lines: ${lines.totalLines} (limit: ${limit})`);
      console.log(`    Code: ${lines.codeLines}, Comments: ${lines.commentLines}, Blank: ${lines.blankLines}`);
      console.log(`    Exceeds by: ${percentage}%`);
      console.log();
    });
  }

  console.log(`📊 Summary:`);
  console.log(`   Total files checked: ${totalFiles}`);
  console.log(`   Files over limit: ${violations.length}`);
  console.log(`   Compliance rate: ${((totalFiles - violations.length) / totalFiles * 100).toFixed(1)}%`);

  if (largestFiles.length > 0) {
    console.log('\n📈 Largest files:');
    largestFiles.slice(0, 5).forEach((file, index) => {
      const relativePath = path.relative(process.cwd(), file.path);
      console.log(`   ${index + 1}. ${relativePath} (${file.lines} lines)`);
    });
  }

  console.log();
}

/**
 * Main execution
 */
function main() {
  const startTime = Date.now();
  const srcPath = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcPath)) {
    console.error('❌ src directory not found');
    process.exit(1);
  }

  console.log('🔍 Scanning files for size violations...');

  const files = scanDirectory(srcPath);
  const violations = [];
  const largestFiles = [];
  let totalFiles = 0;

  for (const filePath of files) {
    const sizeLimit = getSizeLimit(filePath);
    if (!sizeLimit) continue; // Skip files without size limits

    totalFiles++;
    const lines = countLines(filePath);
    largestFiles.push({ path: filePath, lines: lines.totalLines });

    if (lines.totalLines > sizeLimit) {
      const percentage = Math.round(((lines.totalLines - sizeLimit) / sizeLimit) * 100);
      violations.push({
        filePath,
        lines,
        limit: sizeLimit,
        percentage,
      });
    }
  }

  // Sort largest files by line count
  largestFiles.sort((a, b) => b.lines - a.lines);

  // Sort violations by severity (percentage over limit)
  violations.sort((a, b) => b.percentage - a.percentage);

  formatReport(violations, totalFiles, largestFiles);

  const duration = Date.now() - startTime;
  console.log(`⏱️ Scan completed in ${duration}ms`);

  // Exit with error code if violations found
  if (violations.length > 0) {
    console.log('\n💡 Tips for reducing file size:');
    console.log('   • Extract utility functions to separate files');
    console.log('   • Split large components into smaller ones');
    console.log('   • Move type definitions to .types.ts files');
    console.log('   • Extract constants to .constants.ts files');
    console.log('   • Use composition over large monolithic components');
    console.log();

    process.exit(1);
  }

  console.log('🎉 All files comply with modularity principles!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  countLines,
  getSizeLimit,
  scanDirectory,
  shouldIgnoreDirectory,
  shouldIgnoreFile,
};
