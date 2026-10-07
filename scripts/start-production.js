const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const standaloneServer = path.join(root, '.next', 'standalone', 'server.js');

// Ensure HOSTNAME binds to all network interfaces for Render proxy routing
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
process.env.PORT = process.env.PORT || '10000';

if (fs.existsSync(standaloneServer)) {
  console.log(`🚀 [Render] Starting PGOS Standalone Server on ${process.env.HOSTNAME}:${process.env.PORT}...`);
  const child = spawn(process.execPath, [standaloneServer], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code) => process.exit(code || 0));
  child.on('error', (err) => {
    console.error('Failed to start standalone server:', err);
    process.exit(1);
  });
} else {
  console.log(`⚡ [Render] Starting PGOS via standard Next CLI on ${process.env.HOSTNAME}:${process.env.PORT}...`);
  const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextBin, 'start', '-H', process.env.HOSTNAME, '-p', process.env.PORT], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code) => process.exit(code || 0));
  child.on('error', (err) => {
    console.error('Failed to start next server:', err);
    process.exit(1);
  });
}
