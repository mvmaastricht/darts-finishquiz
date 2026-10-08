# Darts finishquiz

Een quiz om dartscores van 51 tot 170 te leren uitgooien. De hele quiz staat in `index.html`. Er is geen build-stap. Met het manifest, de iconen en `sw.js` werkt hij ook als app op je telefoon, zonder internet.

**Online:** https://mvmaastricht.github.io/darts-finishquiz/

## Wat zit erin

- **Meerkeuze:** kies de goede route uit vier. De foute opties zijn altijd echt fout, met uitleg waarom.
- **Zelf gooien:** tik je pijlen in. Elke route die klopt telt als goed. Bust werkt zoals in het echt.
- **Op het bord:** mik met je vinger of muis op een dartbord. Met spreiding aan landt je pijl niet altijd waar je mikt. Dan tellen je keuzes, niet je geluk.
- **Finishkaart:** houdt per score bij of je hem laatst goed of fout had. Met "Mijn fouten" oefen je alleen die scores.
- Scores zonder finish (159, 162, 163, 165, 166, 168, 169) komen ook voor. Dan is "Geen finish mogelijk" het goede antwoord.

Voortgang wordt alleen in de browser van de speler bewaard (localStorage). Er gaat niets naar een server.

## Als app op je telefoon

- **iPhone:** open de link in Safari, tik op Deel en kies Zet op beginscherm.
- **Android en Chrome op de computer:** op de startpagina staat een knop Installeren. Of kies in het browsermenu App installeren.

Na de eerste keer openen staat de quiz in de cache en werkt hij ook zonder internet. Een nieuwe versie komt binnen zodra je weer online bent. Pas je de bestanden aan die offline moeten werken? Verhoog dan het versienummer `CACHE` in `sw.js`.

## Routes

De standaardroutes komen uit een gangbare finishtabel. Waar meer routes mogelijk zijn, gebruikt de quiz de route met de minste pijlen (110 is T20 Bull). Bij zelf gooien en op het bord telt elke geldige route als goed.

## Lokaal openen

Open `index.html` in een browser. Voor de app-functies (offline, installeren) heb je een webserver nodig, bijvoorbeeld:

```
python3 -m http.server
```

en ga dan naar http://localhost:8000.

## Testen

Met Node.js geïnstalleerd:

```
npm test
```

De tests lezen de logica uit `index.html` en controleren onder andere:

- dat alle 113 finishes kloppen en zo min mogelijk pijlen gebruiken;
- dat elke meerkeuzevraag precies één goed antwoord heeft;
- de regels voor bust en geen finish;
- de herkenning van vakken op het getekende bord en de spreiding;
- het manifest, de iconen en de bestanden die offline beschikbaar moeten zijn.

## Bestanden

- `index.html`: de quiz.
- `manifest.webmanifest` en `icons/`: naam en iconen van de app.
- `sw.js`: zorgt dat de quiz offline werkt.
- `tests/`: controles op de rekenregels, het bord en de app-bestanden.

## Aanpassen

- Routes: het object `ROUTES` in `index.html`.
- Spreiding: `SIGMA` (in millimeters, standaard 9).
- Kleuren en lettertypes: de variabelen bovenaan in de `<style>`.
