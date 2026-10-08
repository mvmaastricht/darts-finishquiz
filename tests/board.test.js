// Controleert het getekende dartbord: elk vak wordt herkend, de omrekening naar echte maten en het mikken.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.slice(html.indexOf('/*LOGIC-START*/'), html.indexOf('/*LOGIC-END*/'));
const L = new Function(code + ';return {regionAtDisp,regionAtReal,centerPoint,toReal,toDisp,scatter,aimCheck,throwEval,label,dart,REAL,parseRoute};')();
const errors = [];

for (const d of L.REAL) {
  const p = L.centerPoint(d);
  if (L.label(L.regionAtDisp(p)) !== L.label(d)) errors.push('Vak op het scherm: ' + L.label(d));
  if (L.label(L.regionAtReal(L.toReal(p))) !== L.label(d)) errors.push('Vak in echte maten: ' + L.label(d));
}
for (let i = 0; i < 500; i++) {
  const p = { x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 };
  const q = L.toDisp(L.toReal(p));
  if (Math.hypot(p.x - q.x, p.y - q.y) > 1e-6) { errors.push('Omrekening scherm en echt klopt niet'); break; }
}
const where = [[{ x: 140, y: 0 }, '6'], [{ x: 0, y: 140 }, '3'], [{ x: -140, y: 0 }, '11'], [{ x: 0, y: -108 }, 'T20'], [{ x: 0, y: -178 }, 'D20'], [{ x: 0, y: -26 }, '25'], [{ x: 3, y: 3 }, 'Bull'], [{ x: 0, y: -205 }, 'Mis']];
for (const [p, want] of where) { const got = L.label(L.regionAtDisp(p)); if (got !== want) errors.push('Positie ' + JSON.stringify(p) + ' gaf ' + got + ', verwacht ' + want); }

const aims = [[121, 'T20', 3, true], [50, 'T20', 3, false], [40, 'D20', 1, true], [40, '20', 1, false], [169, 'T20', 3, false], [60, '20', 2, true]];
for (const [r, t, l, exp] of aims) { if (L.aimCheck(r, L.parseRoute(t)[0], l).ok !== exp) errors.push('Mikken ' + t + ' bij ' + r); }

let hits = 0; const n = 20000; const p = L.centerPoint(L.dart(3, 20));
for (let i = 0; i < n; i++) if (L.label(L.scatter(p).hit) === 'T20') hits++;
const rate = hits / n;
if (rate < 0.2 || rate > 0.45) errors.push('Spreiding onrealistisch: T20 ' + (rate * 100).toFixed(1) + '%');

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Bord: alles klopt (T20 geraakt bij spreiding: ' + (rate * 100).toFixed(1) + '%)');
