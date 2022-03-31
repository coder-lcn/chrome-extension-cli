#!/usr/bin/env node

const { mkdir } = require('fs');
let extensionName = process.argv.slice(2)[0]
if (!extensionName) {
  throw new Error('extension name is required');
}
extensionName = extensionName.trim().toLowerCase();

const path = require('path');
const cwd = path.resolve(process.cwd(), extensionName);
const copy = require('copy-template-dir');
const vars = { extensionName };
const inDir = path.join(__dirname, 'templates');
const { exec } = require('child_process');

mkdir(extensionName, (err) => {
  if (err) throw err;

  copy(inDir, cwd, vars, (err) => {
    if (err) throw err
    console.log('✨  Project created successfully');
    console.log('start install dependencies...');

    exec('npm install', { cwd }, (err, out) => {
      if (err) throw err
      console.log(out);
    });
  });
});


