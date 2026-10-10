// Ticket #416 (Spec 7 im Review der Stufe 1): Die Vorlage „GitHub Portolan, Produkt-Repo“ folgt dem Schalter `ablauf`
// der Einstellungs-Datei im Anforderungs-Repo. Mit `v1` (oder ohne Angabe) bleibt alles wie vor #416: kein Unter-Ticket,
// jedes Ticket hat seinen eigenen Zustand. Nur mit `v2` gibt es Unter-Tickets und die neun Zustände.
// Aufruf aus der Wurzel: node --test scripts/*.test.mjs

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const VORLAGE = readFileSync(
  new URL("../skills/engineering/setup-matt-pocock-skills/issue-tracker-github-portolan-produkt.md", import.meta.url),
  "utf8",
);

/** Absätze und Listenpunkte der Vorlage, je als ein Text. */
function bloecke(text) {
  return text
    .split("\n")
    .reduce((liste, zeile) => {
      const neu = zeile.trim() === "" || /^\s*(?:[-*]|\d+\.)\s/.test(zeile) || /^#/.test(zeile);
      if (neu || liste.length === 0) liste.push(zeile);
      else liste[liste.length - 1] += `\n${zeile}`;
      return liste;
    }, [])
    .map((b) => b.trim())
    .filter(Boolean);
}

describe("Vorlage „GitHub Portolan, Produkt-Repo“ und der Schalter ablauf", () => {
  test("liest den Schalter aus der Einstellungs-Datei des Anforderungs-Repos, ohne Angabe gilt v1", () => {
    assert.match(VORLAGE, /einstellungen\.json/);
    assert.ok(VORLAGE.includes(`.ablauf // "v1"`), "Lesen des Schalters mit Standard v1 fehlt");
  });

  test("nennt mit v2 die neun Zustände und mit v1 die bisherigen sieben", () => {
    const neun = "Eingang, In Klärung, Wartet auf Freigabe, Backlog, Bereit, In Arbeit, Review, Erledigt, Verworfen";
    const sieben = "Eingang, Backlog, Bereit, In Arbeit, Review, Erledigt, Verworfen";
    const zustaende = bloecke(VORLAGE).find((b) => b.includes("**Zustände**"));
    assert.ok(zustaende, "Absatz **Zustände** fehlt");
    assert.match(zustaende, new RegExp(`Ablauf \`v2\`[^\\n]*${neun}`), "Zustände mit v2 fehlen");
    assert.match(zustaende, new RegExp(`Ablauf \`v1\`[^\\n]*${sieben}`), "Zustände mit v1 fehlen");
  });

  // Code-Review #384, Befund 4: Mit v2 schließt kein Merge ein Ticket, Erledigt setzt und schließt nur ein Mensch.
  test("mit v2 immer Refs, auch am Ticket ohne Haupteintrag; Review dort nach dem Pull Request", () => {
    const pr = bloecke(VORLAGE).find((b) => b.includes("Mit Ablauf `v2` endet der Text immer mit `Refs"));
    assert.ok(pr, "Regel „mit v2 immer Refs“ fehlt");
    assert.match(pr, /auch an einem Ticket ohne Haupteintrag/);
    const review = bloecke(VORLAGE).find((b) => b.startsWith("6. **Review**"));
    assert.match(review, /Mit Ablauf `v2` setzt du am Ticket ohne Haupteintrag „Review“, sobald sein Pull Request steht/);
  });

  test("jede Regel zum Unter-Ticket hängt an Ablauf v2", () => {
    const ohne = bloecke(VORLAGE).filter((b) => /Unter-Ticket|\/parent/.test(b) && !b.includes("Ablauf `v2`"));
    assert.deepEqual(ohne, [], `Regeln zum Unter-Ticket ohne Ablauf \`v2\`:\n${ohne.join("\n---\n")}`);
  });
});
