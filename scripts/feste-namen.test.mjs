// Ticket #411: Wächter gegen feste Namen von ECC im Fork der Skills. Die Skills sind die Fassung für
// Portolan ohne Bezug zu einer Firma. Was einem Arbeitsbereich gehört, setzt das Setup aus seiner Einstellungs-Datei ein.
// Aufruf aus der Wurzel: node --test scripts/feste-namen.test.mjs

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ausnahme, dateien, funde, pruefeRepo } from "./feste-namen.mjs";

const WURZEL = fileURLToPath(new URL("..", import.meta.url));

/** Wo ein Name stehen darf. Neue Ausnahmen nur mit Grund und so eng wie möglich. */
const AUSNAHMEN = [
  { pfad: "scripts/feste-namen.mjs", grund: "Der Wächter selbst nennt die Namen als Muster." },
  { pfad: "scripts/feste-namen.test.mjs", grund: "Der Test des Wächters prüft die Muster an Beispielen." },
  // Release-Namen und Marketplace-Name bleiben bewusst (#411): Ein neuer Name hieße Neuinstallation auf jedem Rechner.
  // Erlaubt sind nur genau ihre Schreibweisen: Tag ecc-<n> (auch im Branch skills/ecc-<n>), Version <Matts Version>-ecc.<n>,
  // Marketplace ecc in "name": "ecc", mattpocock-skills@ecc und marketplace update ecc.
  {
    pfad: "PORTOLAN.md",
    erlaubt: ["ECCdigital/skills", "mattpocock-skills@ecc", "marketplace update ecc", "ecc-<n>", "-ecc.<n>"],
    grund:
      "Die Adresse dieses Forks: Von dort installiert jede Firma das Plugin und dorthin gehen Pull Requests. Dazu Tags, " +
      "Version und Marketplace, wie die Anleitung sie nennt.",
  },
  {
    pfad: ".claude-plugin/marketplace.json",
    erlaubt: ['"name": "ecc"'],
    grund: "Der Name des Marketplace, unter dem jeder Rechner das Plugin installiert hat (mattpocock-skills@ecc).",
  },
  {
    pfad: ".claude-plugin/plugin.json",
    erlaubt: ["-ecc."],
    grund: "Die Version <Matts Version>-ecc.<n> des Stands, die der Sync gegen den Tag ecc-<n> prüft.",
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
      ["organization(login: $o) { projectV2(number: 12) {", "Nummer eines Boards von ECC"],
      ["gh project item-list --owner x --number 11", "Nummer eines Boards von ECC"],
      ["Marketplace ecc, Tag ecc-10", "ECC als Name"],
      ["Wächter gegen feste Namen von ECC", "ECC als Name"],
      ["Marvin prüft, Nicki fragt", "Vorname eines Logins bei ECC"],
      ["lennard und Frederik", "Vorname eines Logins bei ECC"],
    ]) {
      assert.ok(funde(text).some((f) => f.was === was), `${text}: ${was} nicht gefunden`);
    }
  });

  test("ein Treffer zählt einmal, auch wenn zwei Muster ihn fassen", () => {
    assert.deepEqual(funde("Autor ecc-agent").map((f) => f.was), ["alter Bot-Login oder App von ECC"]);
    assert.deepEqual(funde("an ecc-probe-betrieb").map((f) => f.was), ["Login bei ECC"]);
  });

  test("jede Ausnahme ohne erlaubte Texte hat noch einen Treffer, sonst ist sie zu weit", () => {
    const alle = dateien(WURZEL);
    for (const a of AUSNAHMEN.filter((x) => !x.erlaubt && !x.pfad.startsWith("scripts/feste-namen"))) {
      const treffer = alle.filter((p) => ausnahme(p, [a])).some((p) => funde(readFileSync(join(WURZEL, p), "utf8")).length);
      assert.ok(treffer, `Ausnahme ${a.pfad} ohne Treffer. Zeile streichen.`);
    }
  });

  test("erlaubt Release- und Marketplace-Namen nur in ihren Schreibweisen und nur in ihren Dateien", () => {
    const anleitung = ausnahme("PORTOLAN.md", AUSNAHMEN).erlaubt;
    for (const text of [
      "git tag -a ecc-<n>, Branch skills/ecc-<n>, Version <Matts Version>-ecc.<n>",
      "claude plugin install mattpocock-skills@ecc, claude plugin marketplace update ecc",
    ]) {
      assert.deepEqual(funde(text, { erlaubt: anleitung }), [], text);
    }
    for (const text of ["Tag ecc-10", "Branch ecc/matt-1.2.3", "von ECC gepflegt", "für `ecc` an"]) {
      assert.equal(funde(text, { erlaubt: anleitung }).length, 1, text);
    }
    assert.deepEqual(funde('  "name": "ecc",', { erlaubt: ausnahme(".claude-plugin/marketplace.json", AUSNAHMEN).erlaubt }), []);
    assert.deepEqual(funde('  "version": "1.3.1-ecc.10",', { erlaubt: ausnahme(".claude-plugin/plugin.json", AUSNAHMEN).erlaubt }), []);
    assert.equal(funde('"name": "ecc"', { erlaubt: anleitung }).length, 1);
    assert.equal(ausnahme("skills/engineering/setup-matt-pocock-skills/portolan-setup.md", AUSNAHMEN), undefined);
  });

  test("lässt Erfundenes, ECC Digital als Herausgeber und andere Zahlen stehen", () => {
    for (const text of [
      "musterfirma/tickets, Max-Muster, muster-agent",
      "Gepflegt von ECC Digital",
      "Board 21, BOARD=7, Dashboard 12, projectV2(number: $nr), --number 7",
      "Decke, ecchymose, Marvins-Weg",
    ]) {
      assert.deepEqual(funde(text), [], text);
    }
  });
});
