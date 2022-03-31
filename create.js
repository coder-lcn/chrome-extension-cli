#!/usr/bin/env node

let extensionName = process.argv.slice(2)[0]
if (!extensionName) {
  throw new Error('extension name is required');
}
extensionName = extensionName.trim().toLowerCase();

const cwd = process.cwd();
const copy = require('copy-template-dir');
const path = require('path');
const vars = { extensionName };
const inDir = path.join(__dirname, 'templates');
const { exec } = require('child_process');

copy(inDir, cwd, vars, (err) => {
  if (err) throw err
  console.log('✨  Project created successfully');
  console.log('start install dependencies...');

  exec('npm install', { cwd }, (err, out) => {
    if (err) throw err
    console.log(out);
  });
});
