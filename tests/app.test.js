// Controleert de app-onderdelen: manifest, iconen en de bestanden die offline beschikbaar moeten zijn.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const errors = [];

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
for (const key of ['name', 'short_name', 'start_url', 'display', 'icons']) if (!manifest[key]) errors.push('Manifest mist ' + key);
function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.toString('ascii', 1, 4) !== 'PNG') return null;
  return b.readUInt32BE(16) + 'x' + b.readUInt32BE(20);
}
for (const icon of manifest.icons) {
  const f = path.join(root, icon.src);
  if (!fs.existsSync(f)) { errors.push('Icoon ontbreekt: ' + icon.src); continue; }
  if (pngSize(f) !== icon.sizes) errors.push('Icoon heeft verkeerde maat: ' + icon.src);
}
if (!manifest.icons.some(i => i.purpose === 'maskable')) errors.push('Geen maskable icoon');

const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const core = JSON.parse(sw.slice(sw.indexOf('['), sw.indexOf(']') + 1).replace(/'/g, '"'));
for (const f of core) if (f !== './' && !fs.existsSync(path.join(root, f))) errors.push('Offline bestand ontbreekt: ' + f);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const needle of ['rel="manifest"', 'rel="apple-touch-icon"', "register('sw.js')"]) if (!html.includes(needle)) errors.push('index.html mist ' + needle);

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('App: manifest, iconen en offline bestanden kloppen');
