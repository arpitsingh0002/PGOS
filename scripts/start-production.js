const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const port = process.env.PORT || '10000';
const host = process.env.HOSTNAME || '0.0.0.0';

console.log(`🚀 [Render] Starting Next.js Production Server on ${host}:${port}...`);
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const child = spawn(process.execPath, [nextBin, 'start', '-H', host, '-p', port], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code || 0));
child.on('error', (err) => {
  console.error('Failed to start Next server:', err);
  process.exit(1);
});
