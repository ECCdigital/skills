// Wächter gegen feste Namen von ECC (#411): Portolan läuft für jede Firma nur mit ihrer Einstellungs-Datei. Darum steht
// in Code, Prompts, Workflows, Skills, Doku und Testdaten kein Name, der ECC gehört: die Org, die Domain, MOCO, Biletado
// und andere Produkte, Logins, der alte Bot-Login und die Nummern der Boards. Testdaten nehmen die erfundene
// Musterfirma. Wer einen Namen braucht, liest ihn aus der Einstellungs-Datei (zustaendig.sh arbeitsbereich).
//
// Gleich in portolan (test/feste-namen.mjs dort), mit eigenen Ausnahmen. Nur diese Datei und ihr Test nennen die Namen,
// als Muster. Ändert sich eine Datei, ändert sich die andere mit.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Die festen Namen: je ein Muster, ohne Rücksicht auf Groß- und Kleinschreibung, mit dem, was es ist. */
export const NAMEN = [
  { was: "Org von ECC", muster: /ECCdigital/gi },
  { was: "Domain von ECC", muster: /ecc-digital\.de|e-c-crew\.de/gi },
  { was: "MOCO", muster: /\bMOCO\b/gi },
  { was: "Kennung aus MOCO", muster: /\bP-K\d{3,5}-\d{4}-\d{3}\b/gi },
  { was: "Produkt von ECC", muster: /biletado|smart-city-booking|smart city|\bonework\b|\bIBuS\b|\bSHIBB\b/gi },
  { was: "Login bei ECC", muster: /Marvin-Anders|NickiECC|lennardscheffler|frederikbernard|\becc-probe-[a-z]+/gi },
  { was: "alter Bot-Login oder App von ECC", muster: /ecc-agent|\bECC[ _]AGENT/gi },
  // Nummern 11 und 12 der Boards von ECC, als Board-Nummer geschrieben: „Board 11“, "board": 12, BOARD=11,
  // BOARD: "12", Board Nr. 11, projects/12, gh project item-add 11, nr=12.
  {
    was: "Nummer eines Boards von ECC",
    muster: /\bboard\b["']?\s*[:=]?\s*["']?(?:nr\.?\s*)?1[12]\b|projects\/1[12]\b|\bproject\s+(?:item-add|item-edit|item-list|field-list|view)\s+1[12]\b|\bnr=1[12]\b/gi,
  },
];

/**
 * Wo ein Name stehen darf: Pfad (genau oder als Ordner mit / am Ende) und Grund. erlaubt: nur diese Namen und nur in
 * dieser Form, etwa die Adresse des Werkzeugs in der Doku. Ohne erlaubt gilt die Ausnahme für alle Namen.
 */
export function ausnahme(pfad, liste) {
  return liste.find((a) => (a.pfad.endsWith("/") ? pfad.startsWith(a.pfad) : pfad === a.pfad));
}

/** Funde in einem Text: [{ zeile, was, text }]. erlaubt: Texte, die als Treffer nicht zählen (genau so geschrieben). */
export function funde(text, { erlaubt = [] } = {}) {
  const liste = [];
  const zeilen = text.split("\n");
  zeilen.forEach((inhalt, i) => {
    let rest = inhalt;
    for (const e of erlaubt) rest = rest.split(e).join(" ".repeat(e.length));
    for (const { was, muster } of NAMEN) {
      for (const m of rest.matchAll(muster)) liste.push({ zeile: i + 1, was, text: m[0] });
    }
  });
  return liste;
}

/** Alle Dateien des Repos unter wurzel, die git kennt, ohne Binärdateien. */
export function dateien(wurzel) {
  return execFileSync("git", ["ls-files", "-z"], { cwd: wurzel, encoding: "utf8" })
    .split("\0")
    .filter(Boolean)
    .filter((p) => !/\.(png|jpe?g|gif|ico|pdf|woff2?|ttf|otf|zip|gz)$/i.test(p));
}

/** Prüft das Repo: Funde außerhalb der Ausnahmen als Zeilen „pfad:zeile: was „text““. */
export function pruefeRepo(wurzel, ausnahmen) {
  const zeilen = [];
  for (const pfad of dateien(wurzel)) {
    const a = ausnahme(pfad, ausnahmen);
    if (a && !a.erlaubt) continue;
    let text;
    try {
      text = readFileSync(join(wurzel, pfad), "utf8");
    } catch {
      continue; // gelöscht, aber noch im Index
    }
    for (const f of funde(text, { erlaubt: a?.erlaubt ?? [] })) zeilen.push(`${pfad}:${f.zeile}: ${f.was} „${f.text}“`);
  }
  return zeilen;
}
