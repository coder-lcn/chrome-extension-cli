#!/usr/bin/env node

let [scriptName, debug] = process.argv.slice(2);
process.env.debug = debug === 'debug';

if (!scriptName) {
  throw new Error('script name is required');
}

const cwd = process.cwd();
const path = require('path');
const srouce = path.resolve(cwd, 'src');
const { exec } = require('child_process');
const filterLog = require('./filterLog');

process.env.source = srouce
process.env.buildDir = path.resolve(cwd, 'dist');
process.env.cwd = cwd;

switch (scriptName) {
  case 'start': {
    process.env.NODE_ENV = 'development';
    const pc = exec('npm start', { cwd: __dirname }, err => {
      err && console.log(err);
    });
    pc.stdout.on('data', filterLog);
    pc.stdout.on('error', console.error);
  }
    break;
  case 'build': {
    process.env.NODE_ENV = 'production';
    const pc = exec('npm run build', { cwd: __dirname }, err => {
      err && console.log(err);
    });
    pc.stdout.on('data', filterLog);
    pc.stdout.on('error', console.error);
  }
    break;
  default:
    break;
}
