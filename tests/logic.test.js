// Controleert de finishtabel, de foute meerkeuze-opties, de bust-regels en de vraagselectie.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.slice(html.indexOf('/*LOGIC-START*/'), html.indexOf('/*LOGIC-END*/'));
const L = new Function(code + ';return {ROUTES,minDarts,isBogey,check,makeMC,throwEval,pickQuestions,parseRoute,keyOf};')();
const errors = [];

const bogeys = [];
for (let s = 51; s <= 170; s++) if (L.isBogey(s)) bogeys.push(s);
if (bogeys.join(',') !== '159,162,163,165,166,168,169') errors.push('Geen-finishes kloppen niet: ' + bogeys);

for (let s = 51; s <= 170; s++) {
  const r = L.ROUTES[s];
  if (L.isBogey(s)) { if (r) errors.push('Route bij geen-finish ' + s); continue; }
  if (!r) { errors.push('Route ontbreekt: ' + s); continue; }
  const rt = L.parseRoute(r);
  if (!L.check(rt, s).ok) errors.push('Route klopt niet: ' + s + ' ' + r);
  if (rt.length !== L.minDarts[s]) errors.push('Route ' + s + ' gebruikt niet het minste aantal pijlen');
}

for (let s = 51; s <= 170; s++) {
  for (let t = 0; t < 200; t++) {
    const o = L.makeMC(s);
    if (o.length !== 4) { errors.push('Niet 4 opties bij ' + s); break; }
    if (o.filter(x => x.ok).length !== 1) { errors.push('Niet precies 1 goed antwoord bij ' + s); break; }
    const labels = o.map(x => x.kind === 'geen' ? 'GEEN' : L.keyOf(x.route));
    if (new Set(labels).size !== 4) { errors.push('Dubbele opties bij ' + s); break; }
    for (const x of o) {
      if (x.kind === 'geen') { if (x.ok !== L.isBogey(s)) errors.push('Geen-finish-optie fout bij ' + s); }
      else if (L.check(x.route, s).ok !== x.ok) errors.push('Optie verkeerd beoordeeld bij ' + s + ': ' + L.keyOf(x.route));
    }
  }
}

const P = L.parseRoute;
const cases = [
  [121, 'T20 T11 D14', true], [121, 'T20 T20 1', false], [100, '20 T20 D10', true],
  [170, 'T20 T20 Bull', true], [60, '20 20 20', false], [41, 'T20', false],
  [169, 'T20', false], [61, 'T20', false], [99, 'T20', null], [61, '20', null]
];
for (const [s, r, exp] of cases) {
  const ev = L.throwEval(s, P(r));
  const got = ev.done ? ev.ok : null;
  if (got !== exp) errors.push('Telling ' + s + ' ' + r + ': verwacht ' + exp + ', kreeg ' + got);
}

for (const range of ['51-100', '101-140', '141-170', 'alles']) {
  for (const c of [10, 20]) {
    for (let t = 0; t < 100; t++) {
      const q = L.pickQuestions(range, c, {});
      if (q.length !== c || new Set(q).size !== c) errors.push('Vraagselectie ' + range + ' ' + c);
    }
  }
}

if (errors.length) { console.error(errors.slice(0, 30).join('\n')); process.exit(1); }
console.log('Logica: alles klopt (' + Object.keys(L.ROUTES).length + ' finishes)');
