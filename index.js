const stream = require('stream');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const console = require('console');

const mkdirp = require('mkdirp');

function spawnLog(file, args = [], opts = {}, logFile = null) {
  const cp = childProcess.spawn(file, args, opts);
  if (logFile) {
    const ws = fs.createWriteStream(logFile);
    cp.stdout.pipe(ws);
    cp.stderr.pipe(ws, {end: false});
  }
  return cp;
}
function createConsole(logFile) {
  mkdirp.sync(path.dirname(logFile));
  const ws = fs.createWriteStream(logFile);

  const stdout = new stream.PassThrough();
  stdout.pipe(process.stdout);
  stdout.pipe(ws);
  const stderr = new stream.PassThrough();
  stderr.pipe(process.stderr);
  stderr.pipe(ws, {end: false});

  return new console.Console(stdout, stderr);
}

module.exports = {
  spawnLog,
  createConsole,
};

if (require.main === module) {
  if (process.argv.length >= 4) {
    const logFile = process.argv[2];
    const bin = process.argv[3];
    const args = process.argv.slice(4);
    spawnLog(bin, args, {}, logFile);
  } else {
    console.warn('usage: node index.js [log.txt] [bin] <args>');
    process.exit(1);
  }
}
