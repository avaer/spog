const fs = require('fs');
const childProcess = require('child_process');

function spog(file, args = [], opts = {}, logFile = null) {
  const cp = childProcess.spawn(file, args, opts);
  if (logFile) {
    const ws = fs.createWriteStream(logFile);
    cp.stdout.pipe(ws);
    cp.stderr.pipe(ws, {end: false});
  }
  return cp;
}

module.exports = spog;

if (require.main === module) {
  if (process.argv.length >= 4) {
    const logFile = process.argv[2];
    const bin = process.argv[3];
    const args = process.argv.slice(4);
    spog(bin, args, {}, logFile);
  } else {
    console.warn('usage: node index.js [log.txt] [bin] <args>');
    process.exit(1);
  }
}
