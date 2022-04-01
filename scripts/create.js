#!/usr/bin/env node

const { mkdir } = require('fs');

let [extensionName, test] = process.argv.slice(2)
const __TEST__ = test === 'test';
if (!extensionName) {
  throw new Error('extension name is required');
}
extensionName = extensionName.trim().toLowerCase();

const path = require('path');
const cwd = path.resolve(process.cwd(), extensionName);
const copy = require('copy-template-dir');
const vars = {
  extensionName,
  "start": __TEST__ ? "../../scripts/scripts.js start" : "chrome-extension start",
  "build": __TEST__ ? "../../scripts/scripts.js build" : "chrome-extension build"
};
const inDir = path.join(__dirname, '../', 'templates');
const { exec } = require('child_process');

mkdir(extensionName, (err) => {
  if (err) throw err;

  copy(inDir, cwd, vars, (err) => {
    if (err) throw err;
    console.log('✨  Project created successfully');
    console.log('start install dependencies...');

    exec('npm install', { cwd }, (err, out) => {
      if (err) throw err
      console.log(out);
    });
  });
});
