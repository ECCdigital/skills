# Setup mit der Vorlage „GitHub ECC“

ECC-Ergänzung zu diesem Skill. Sie gilt, wenn in Abschnitt A „GitHub ECC“ gewählt ist, und ergänzt die Schritte des Setups, statt sie zu ersetzen. Schlage die Vorlage vor, wenn ein `git remote` auf `ECCdigital/tickets` oder `ECCdigital/tickets-probe` zeigt.

## 1. Erkunden

Zusätzlich zu Schritt 1 des Setups:

- `gh --version`: Lokale Kanten brauchen `gh` ab 2.94. Ist es älter, sag es.
- `.claude/skills/README.md`: der Stand der ECC-Fassung (Tag `ecc-<n>`), den der Sync ins Repo gebracht hat. Fehlt die Datei, nimm den Stand aus `.claude-plugin/plugin.json` des installierten Plugins und sag es.

## 2. Fragen

- **Abschnitt A**: Empfiehl „GitHub ECC“.
- **Abschnitt B** entfällt, auch wenn `triage` installiert ist. Die Weiche ersetzt `/triage`, Triage-Labels gibt es nicht. Du schreibst kein `docs/agents/triage-labels.md` und keinen Unterblock „Triage labels“.
- **Abschnitt C**: single-context, ohne Frage.

## 3. Schreiben

Nach der Bestätigung des Entwurfs (Schritt 3 des Setups):

- `docs/agents/issue-tracker.md` aus [issue-tracker-github-ecc.md](./issue-tracker-github-ecc.md). Ersetze nur `<tag>` durch den Stand aus der Erkundung. Sonst übernimmst du die Vorlage wörtlich. Andere Platzhalter wie `<karte>` oder `{owner}` bleiben stehen, sie gelten beim Lesen.
- `docs/agents/domain.md` aus [domain.md](./domain.md), wörtlich.
- Die Datei aus Schritt 4 ist `CLAUDE.md`. Fehlt sie, legst du sie an, ohne zu fragen. Sie beginnt dann mit `# Anforderungen und Tickets von ECC Digital` und dem Satz „Sprache in Issues, Kommentaren und Commits: Deutsch, mit den Begriffen aus `CONTEXT.md`.“ Ein `AGENTS.md` legst du nicht an.
- Der Block `## Agent skills` lautet so:

  ```markdown
  ## Agent skills

  ### Issue tracker

  GitHub ECC: Anforderungen, Tickets, Karten und Klärungen sind Issues in diesem Repo, über `gh`. See `docs/agents/issue-tracker.md`.

  ### Domain docs

  Single-context: one `CONTEXT.md` plus `docs/adr/` at the root. See `docs/agents/domain.md`.

  ### Skills im Repo

  `.claude/skills/` schreibt nur der Sync aus `ECCdigital/skills`, per Pull Request. Den Stand nennt `.claude/skills/README.md`. Dort änderst du nie etwas von Hand.
  ```

- Nach dem Block folgt der Abschnitt `## Laufen in GitHub Actions` aus [claude-md-github-actions.md](./claude-md-github-actions.md), wörtlich. Gibt es ihn schon, ersetzt du ihn.
- In `.claude/settings.json` steht unter `permissions.deny` der Eintrag `Edit(/.claude/skills/**)`. So ändert kein Agent `.claude/skills` von Hand. Andere Einträge der Datei bleiben.

## 4. Abschluss

Nenne den Stand (`ecc-<n>`), aus dem die Dateien stammen. Committen und pushen macht die Person nach den Regeln des Repos.
