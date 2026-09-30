# Setup mit der Vorlage „GitHub ECC“

ECC-Ergänzung zu diesem Skill. Sie gilt, wenn in Abschnitt A „GitHub ECC“ gewählt ist, und ergänzt die Schritte des Setups, statt sie zu ersetzen. Die Vorlage gibt es in zwei Fassungen. Welche du vorschlägst, entscheidet `git remote -v`:

- **GitHub ECC** für `ECCdigital/tickets` und `ECCdigital/tickets-probe`: Anforderungen, Tickets, Karten und Klärungen sind Issues im Repo selbst. Es gelten die Abschnitte 1 bis 4.
- **GitHub ECC, Produkt-Repo** für jedes andere Repo in `ECCdigital`: Es enthält Code eines Produkts, seine Tickets liegen in `ECCdigital/tickets`. Es gilt nur der Abschnitt „Produkt-Repo“ unten.

## 1. Erkunden

Zusätzlich zu Schritt 1 des Setups:

- `gh --version`: Lokale Kanten brauchen `gh` ab 2.94. Ist es älter, sag es.
- `.claude/skills/README.md`: der Stand der ECC-Fassung (Tag `ecc-<n>`), den der Sync ins Repo gebracht hat. Fehlt die Datei, nimm den Stand aus `.claude-plugin/plugin.json` des installierten Plugins und sag es.
- `CONTEXT.md` oder `CONTEXT-MAP.md` an der Wurzel: So hieß das Glossar vor `ecc-7`, die Skills suchen nur noch `GLOSSARY.md` und `GLOSSARY-MAP.md`. Liegt noch eine alte Datei da, sag der Person, sie per Pull Request mit `git mv` umzubenennen, samt der Verweise im Repo.

## 2. Fragen

- **Abschnitt A**: Empfiehl „GitHub ECC“.
- **Abschnitt B** entfällt, auch wenn `triage` installiert ist. Die Weiche ersetzt `/triage`, Triage-Labels gibt es nicht. Du schreibst kein `docs/agents/triage-labels.md` und keinen Unterblock „Triage labels“.
- **Abschnitt C**: single-context, ohne Frage.

## 3. Schreiben

Nach der Bestätigung des Entwurfs (Schritt 3 des Setups):

- `docs/agents/issue-tracker.md` aus [issue-tracker-github-ecc.md](./issue-tracker-github-ecc.md). Ersetze nur `<tag>` durch den Stand aus der Erkundung. Sonst übernimmst du die Vorlage wörtlich. Andere Platzhalter wie `<karte>` oder `{owner}` bleiben stehen, sie gelten beim Lesen.
- `docs/agents/domain.md` aus [domain.md](./domain.md), wörtlich.
- Die Datei aus Schritt 4 ist `CLAUDE.md`. Fehlt sie, legst du sie an, ohne zu fragen. Sie beginnt dann mit `# Anforderungen und Tickets von ECC Digital` und dem Satz „Sprache in Issues, Kommentaren und Commits: Deutsch, mit den Begriffen aus `GLOSSARY.md`.“ Ein `AGENTS.md` legst du nicht an.
- Der Block `## Agent skills` lautet so:

  ```markdown
  ## Agent skills

  ### Issue tracker

  GitHub ECC: Anforderungen, Tickets, Karten und Klärungen sind Issues in diesem Repo, über `gh`. See `docs/agents/issue-tracker.md`.

  ### Domain docs

  Single-context: one `GLOSSARY.md` plus `docs/adr/` at the root. See `docs/agents/domain.md`.

  ### Skills im Repo

  `.claude/skills/` schreibt nur der Sync aus `ECCdigital/skills`, per Pull Request. Den Stand nennt `.claude/skills/README.md`. Dort änderst du nie etwas von Hand.
  ```

- Nach dem Block folgt der Abschnitt `## Laufen in GitHub Actions` aus [claude-md-github-actions.md](./claude-md-github-actions.md), wörtlich. Gibt es ihn schon, ersetzt du ihn.
- In `.claude/settings.json` steht unter `permissions.deny` der Eintrag `Edit(/.claude/skills/**)`. So ändert kein Agent `.claude/skills` von Hand. Andere Einträge der Datei bleiben.
- Mehr schreibt das Setup nicht: in `CLAUDE.md` nur die Blöcke `## Agent skills` und `## Laufen in GitHub Actions`, in `.claude/settings.json` nur die Deny-Regel. Alles andere in beiden Dateien bleibt Zeichen für Zeichen. Regeln, die nur dieses Repo braucht, etwa zu seinen Workflows, stehen in eigenen Abschnitten der `CLAUDE.md` nach diesen Blöcken oder als weitere Einträge in `.claude/settings.json`. So übersteht ein neues Setup sie.

## 4. Abschluss

Nenne den Stand (`ecc-<n>`), aus dem die Dateien stammen. Committen und pushen macht die Person nach den Regeln des Repos.

## Produkt-Repo

Gilt statt der Abschnitte 1 bis 4 für die Fassung „GitHub ECC, Produkt-Repo“. In einem Produkt-Repo arbeitet eine lokale Session an Tickets aus `ECCdigital/tickets`: übernehmen, Zustand im Board Arbeit, Branch, Pull Request. Agent-Läufe in GitHub Actions und `.claude/skills` gibt es dort nicht.

### Erkunden

Zusätzlich zu Schritt 1 des Setups:

- Den Stand nimmst du aus `.claude-plugin/plugin.json` des installierten Plugins. Die Datei liegt drei Ordner über dem Ordner dieses Skills. Ihre Version `<Matts Version>-ecc.<n>` heißt Stand `ecc-<n>`.
- `CONTEXT.md` oder `CONTEXT-MAP.md` an der Wurzel: wie in Abschnitt 1.
- `gh auth status`: Fehlt dem Token der Scope `project`, sag der Person `gh auth refresh -s project`. Ohne ihn setzt keine Session den Zustand im Board.
- Standard-Branch: `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`. Nennt die Doku des Repos einen anderen Branch für neue Arbeit, etwa `develop`, sag der Person: `Closes` im Pull Request schließt das Ticket nur beim Merge in den Standard-Branch.

### Fragen

- **Abschnitt A**: Empfiehl „GitHub ECC, Produkt-Repo“.
- **Abschnitt B** entfällt wie oben.
- **Abschnitt C** läuft wie im Setup.

### Schreiben

Nach der Bestätigung des Entwurfs:

- `docs/agents/issue-tracker.md` aus [issue-tracker-github-ecc-produkt.md](./issue-tracker-github-ecc-produkt.md). Ersetze nur `<tag>` durch den Stand. Sonst übernimmst du die Vorlage wörtlich.
- `docs/agents/domain.md` wie in Abschnitt C gewählt.
- Die Datei wählst du wie in Schritt 4 des Setups: `CLAUDE.md`, sonst `AGENTS.md`, fehlen beide, fragst du. Der Block `## Agent skills` lautet so, der Unterblock „Domain docs“ wie in Abschnitt C gewählt:

  ```markdown
  ## Agent skills

  ### Issue tracker

  GitHub ECC, Produkt-Repo: Tickets liegen als Issues in `ECCdigital/tickets`, nicht hier. Bevor du an einem Ticket arbeitest, etwa mit `/implement <URL>`, lies `docs/agents/issue-tracker.md`: Übernehmen, Zustand im Board Arbeit, Branch und Pull Request stehen dort.

  ### Domain docs

  Single-context: one `GLOSSARY.md` plus `docs/adr/` at the root. See `docs/agents/domain.md`.
  ```

- Mehr schreibt das Setup nicht: in der Datei nur den Block `## Agent skills`. Einen Abschnitt „Laufen in GitHub Actions“ und die Deny-Regel für `.claude/skills` bekommt ein Produkt-Repo nicht. Alles andere in der Datei bleibt Zeichen für Zeichen.

### Abschluss

Nenne den Stand (`ecc-<n>`), aus dem die Dateien stammen. Committen und pushen macht die Person nach den Regeln des Repos, meist per Pull Request.
