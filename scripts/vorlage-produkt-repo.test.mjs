// Ticket #416 (Spec 7 im Review der Stufe 1), seit #437 nur noch v2: Die Vorlagen „GitHub Portolan“
// und „GitHub Portolan, Produkt-Repo“ beschreiben nur den Ablauf v2. Den Schalter `ablauf` lesen sie nicht mehr.
// Unter-Tickets und die neun Zustände gelten immer.
// Aufruf aus der Wurzel: node --test scripts/*.test.mjs

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ORDNER = "../skills/engineering/setup-matt-pocock-skills/";
const lies = (datei) => readFileSync(new URL(`${ORDNER}${datei}`, import.meta.url), "utf8");
const PRODUKT = lies("issue-tracker-github-portolan-produkt.md");
const TRACKER = lies("issue-tracker-github-portolan.md");

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

describe("Vorlagen „GitHub Portolan“ nur mit Ablauf v2", () => {
  for (const [name, text] of [["GitHub Portolan", TRACKER], ["GitHub Portolan, Produkt-Repo", PRODUKT]]) {
    test(`„${name}“ kennt keinen Schalter und keinen Ablauf v1`, () => {
      const treffer = text.split("\n").filter((z) => /\bv1\b|\bv2\b|zustaendig\.sh ablauf|\.ablauf\b|Ablauf `v/.test(z));
      assert.deepEqual(treffer, [], `Reste des Schalters:\n${treffer.join("\n")}`);
    });
  }

  test("das Produkt-Repo nennt die neun Zustände", () => {
    const neun = "Eingang, In Klärung, Wartet auf Freigabe, Backlog, Bereit, In Arbeit, Review, Erledigt, Verworfen";
    const zustaende = bloecke(PRODUKT).find((b) => b.includes("**Zustände**"));
    assert.ok(zustaende, "Absatz **Zustände** fehlt");
    assert.ok(zustaende.includes(neun), "die neun Zustände fehlen");
  });

  // Code-Review #384, Befund 4: Kein Merge schließt ein Ticket, Erledigt setzt und schließt nur ein Mensch.
  test("immer Refs, nie Closes, auch am Ticket ohne Haupteintrag; Review dort nach dem Pull Request", () => {
    const pr = bloecke(PRODUKT).find((b) => b.includes("endet immer mit `Refs"));
    assert.ok(pr, "Regel „immer Refs“ fehlt");
    assert.match(pr, /nie mit `Closes`/);
    assert.match(pr, /auch an einem Ticket ohne Haupteintrag/);
    const review = bloecke(PRODUKT).find((b) => b.startsWith("6. **Review**"));
    assert.match(review, /Am Ticket ohne Haupteintrag setzt du „Review“, sobald sein Pull Request steht/);
  });

  test("das Produkt-Repo erkennt Unter-Tickets am übergeordneten Ticket", () => {
    const unter = bloecke(PRODUKT).find((b) => b.startsWith("**Unter-Ticket**"));
    assert.ok(unter, "Absatz **Unter-Ticket** fehlt");
    assert.match(unter, /\/parent/);
    assert.match(unter, /kommt nie ins Board/);
  });
});
