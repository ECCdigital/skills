// Ticket #411: Wächter gegen feste Namen von ECC im Fork der Skills. Die Skills sind die Fassung für
// Portolan ohne Bezug zu einer Firma. Was einem Arbeitsbereich gehört, setzt das Setup aus seiner Einstellungs-Datei ein.
// Aufruf aus der Wurzel: node --test scripts/feste-namen.test.mjs

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { funde, pruefeRepo } from "./feste-namen.mjs";

const WURZEL = fileURLToPath(new URL("..", import.meta.url));

/** Wo ein Name stehen darf. Neue Ausnahmen nur mit Grund und so eng wie möglich. */
const AUSNAHMEN = [
  { pfad: "scripts/feste-namen.mjs", grund: "Der Wächter selbst nennt die Namen als Muster." },
  { pfad: "scripts/feste-namen.test.mjs", grund: "Der Test des Wächters prüft die Muster an Beispielen." },
  {
    pfad: "PORTOLAN.md",
    erlaubt: ["ECCdigital/skills"],
    grund: "Die Adresse dieses Forks: Von dort installiert jede Firma das Plugin und dorthin gehen Pull Requests.",
  },
];

describe("Wächter gegen feste Namen von ECC im Fork der Skills", () => {
  test("kein fester Name außerhalb der Ausnahmen", () => {
    const zeilen = pruefeRepo(WURZEL, AUSNAHMEN);
    assert.deepEqual(zeilen, [], `Feste Namen von ECC gefunden. Platzhalter nehmen, die das Setup einsetzt:\n${zeilen.join("\n")}`);
  });

  test("jede Ausnahme gibt es noch, und jede hat einen Grund", () => {
    for (const a of AUSNAHMEN) {
      assert.ok(existsSync(join(WURZEL, a.pfad)), `Ausnahme ${a.pfad} gibt es nicht mehr. Zeile streichen.`);
      assert.ok(a.grund?.length > 10, `Ausnahme ${a.pfad} ohne Grund`);
    }
  });

  test("findet die Namen, die in den Vorlagen standen", () => {
    for (const [text, was] of [
      ["Issues in `ECCdigital/tickets`", "Org von ECC"],
      ["etwa die MOCO-Kennung", "MOCO"],
      ["etwa einem von Biletado", "Produkt von ECC"],
      ["für `tickets` Nr. 11 „Arbeit“, Board 12", "Nummer eines Boards von ECC"],
      ["als ECC Agent in GitHub Actions", "alter Bot-Login oder App von ECC"],
    ]) {
      assert.ok(funde(text).some((f) => f.was === was), `${text}: ${was} nicht gefunden`);
    }
  });
});
