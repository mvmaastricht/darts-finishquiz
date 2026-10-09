// Controleert de rekenvragen: het antwoord klopt, er is precies één goed antwoord en elke fout krijgt uitleg.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.slice(html.indexOf('/*LOGIC-START*/'), html.indexOf('/*LOGIC-END*/'));
const L = new Function(code + ';return {makeCalcQ,diagnose,optLabel,val,sumOf};')();
const errors = [];
const types = ['tri', 'dub', 'terug', 'beurt', 'rest', 'mix'];
const seenKinds = {};

for (const type of types) {
  for (let i = 0; i < 1500; i++) {
    const q = L.makeCalcQ(type, null, null);
    seenKinds[q.type] = (seenKinds[q.type] || 0) + 1;
    const tag = type + ' ' + q.short;
    // het antwoord zelf narekenen
    let expect;
    if (q.type === 'tri') expect = 3 * q.n;
    else if (q.type === 'dub') expect = 2 * q.n;
    else if (q.type === 'terug') { expect = q.n; if (q.m * q.answer !== q.value) errors.push('Terugzoeken klopt niet: ' + tag); }
    else if (q.type === 'beurt') expect = L.sumOf(q.darts);
    else if (q.type === 'rest') { expect = q.start - L.sumOf(q.darts); if (expect < 2) errors.push('Rest te klein: ' + tag); }
    if (q.answer !== expect) errors.push('Verkeerd antwoord: ' + tag + ' gaf ' + q.answer + ', moet ' + expect);
    // opties
    if (q.opts.length !== 4) errors.push('Niet 4 opties: ' + tag);
    if (q.opts.filter(o => o.ok).length !== 1) errors.push('Niet precies 1 goed: ' + tag);
    if (new Set(q.opts.map(o => o.v)).size !== 4) errors.push('Dubbele opties: ' + tag);
    for (const o of q.opts) {
      if (!(o.v > 0)) errors.push('Optie niet positief: ' + tag);
      if (q.maxV && o.v > q.maxV) errors.push('Optie bestaat niet op het bord: ' + tag + ' ' + o.v);
      if (o.ok !== (o.v === q.answer)) errors.push('Optie verkeerd gemarkeerd: ' + tag);
      if (!o.ok && !o.why) errors.push('Geen uitleg bij fout antwoord: ' + tag);
      if (!o.ok && L.diagnose(q, o.v) !== o.why && !o.why.startsWith('Net mis')) errors.push('Uitleg wijkt af: ' + tag);
    }
    if (!q.explain.length || q.explain.some(l => !l)) errors.push('Geen uitwerking: ' + tag);
    if (!q.ask || !q.ask.sub) errors.push('Geen vraag: ' + tag);
    if (errors.length > 20) break;
  }
}
for (const k of ['tri', 'dub', 'terug', 'beurt', 'rest']) if (!seenKinds[k]) errors.push('Soort komt nooit voor: ' + k);

// een paar vaste gevallen
const tri = L.makeCalcQ('tri', k => (k === 'T17' ? 1e6 : 0.000001), null);
if (tri.n === 17) {
  if (L.diagnose(tri, 34) !== 'Dat is dubbel 17 (2 × 17). Een triple is keer 3.') errors.push('Diagnose T17 = 34 klopt niet');
  if (tri.explain[0] !== 'T17 = 3 × 17. Splits 17 in 10 en 7. 3 × 10 = 30 en 3 × 7 = 21. Samen 51.') errors.push('Uitwerking T17 klopt niet: ' + tri.explain[0]);
}

if (errors.length) { console.error(errors.slice(0, 25).join('\n')); process.exit(1); }
console.log('Rekenen: alles klopt (' + Object.entries(seenKinds).map(([k, v]) => k + ' ' + v).join(', ') + ')');
