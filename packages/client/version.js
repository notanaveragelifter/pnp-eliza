#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the lerna.json file
const lernaFilePath = path.resolve(__dirname, '../../lerna.json');

try {
  // Check if lerna.json exists
  if (!fs.existsSync(lernaFilePath)) {
    console.error(`Error: ${lernaFilePath} does not exist.`);
    process.exit(1);
  }

  // Check if we have write permissions to the destination directory
  const destDir = path.join(__dirname, 'src/lib');
  try {
    fs.accessSync(destDir, fs.constants.W_OK);
  } catch (error) {
    console.error(`Error: No write permission to src/lib directory.`);
    process.exit(1);
  }

  // Read and parse lerna.json
  const lernaContent = fs.readFileSync(lernaFilePath, 'utf8');
  const lernaJson = JSON.parse(lernaContent);
  const version = lernaJson.version;

  // Check if version was successfully extracted
  if (!version) {
    console.error(`Error: Unable to extract version from ${lernaFilePath}.`);
    process.exit(1);
  }

  // Create or overwrite info.json with the version property
  const infoFilePath = path.join(destDir, 'info.json');
  fs.writeFileSync(infoFilePath, JSON.stringify({ version }, null, 2));

  console.log(`Successfully wrote version ${version} to info.json`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
