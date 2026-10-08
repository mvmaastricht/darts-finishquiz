# Darts finishquiz

Een quiz om dartscores van 51 tot 170 te leren uitgooien. Alles staat in één bestand: `index.html`. Er is geen build-stap en er zijn geen andere bestanden nodig.

**Online:** https://mvmaastricht.github.io/darts-finishquiz/

## Wat zit erin

- **Meerkeuze:** kies de goede route uit vier. De foute opties zijn altijd echt fout, met uitleg waarom.
- **Zelf gooien:** tik je pijlen in. Elke route die klopt telt als goed. Bust werkt zoals in het echt.
- **Op het bord:** mik met je vinger of muis op een dartbord. Met spreiding aan landt je pijl niet altijd waar je mikt. Dan tellen je keuzes, niet je geluk.
- **Finishkaart:** houdt per score bij of je hem laatst goed of fout had. Met "Mijn fouten" oefen je alleen die scores.
- Scores zonder finish (159, 162, 163, 165, 166, 168, 169) komen ook voor. Dan is "Geen finish mogelijk" het goede antwoord.

Voortgang wordt alleen in de browser van de speler bewaard (localStorage). Er gaat niets naar een server.

## Routes

De standaardroutes komen uit een gangbare finishtabel. Waar meer routes mogelijk zijn, gebruikt de quiz de route met de minste pijlen (110 is T20 Bull). Bij zelf gooien en op het bord telt elke geldige route als goed.

## Lokaal openen

Open `index.html` in een browser. Dat is alles.

## Testen

Met Node.js geïnstalleerd:

```
npm test
```

De tests lezen de logica uit `index.html` en controleren onder andere:

- dat alle 113 finishes kloppen en zo min mogelijk pijlen gebruiken;
- dat elke meerkeuzevraag precies één goed antwoord heeft;
- de regels voor bust en geen finish;
- de herkenning van vakken op het getekende bord en de spreiding.

## Aanpassen

- Routes: het object `ROUTES` in `index.html`.
- Spreiding: `SIGMA` (in millimeters, standaard 9).
- Kleuren en lettertypes: de variabelen bovenaan in de `<style>`.
