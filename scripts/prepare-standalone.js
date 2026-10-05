const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const standaloneNext = path.join(root, '.next', 'standalone');

if (fs.existsSync(standaloneNext)) {
  // Copy .next/static -> .next/standalone/.next/static
  const srcStatic = path.join(root, '.next', 'static');
  const destStatic = path.join(standaloneNext, '.next', 'static');
  if (fs.existsSync(srcStatic)) {
    fs.mkdirSync(destStatic, { recursive: true });
    fs.cpSync(srcStatic, destStatic, { recursive: true, force: true });
    console.log('✓ Static assets bundled for Render standalone runtime (.next/static -> standalone/.next/static)');
  }

  // Copy public -> .next/standalone/public
  const srcPublic = path.join(root, 'public');
  const destPublic = path.join(standaloneNext, 'public');
  if (fs.existsSync(srcPublic)) {
    fs.mkdirSync(destPublic, { recursive: true });
    fs.cpSync(srcPublic, destPublic, { recursive: true, force: true });
    console.log('✓ Public assets bundled for Render standalone runtime (public -> standalone/public)');
  }
} else {
  console.log('ℹ Standalone directory not detected, skipping standalone assets sync.');
}
