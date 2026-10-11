# Setup mit der Vorlage „GitHub Portolan“

Portolan-Ergänzung zu diesem Skill. Sie gilt, wenn in Abschnitt A „GitHub Portolan“ gewählt ist, und ergänzt die Schritte des Setups, statt sie zu ersetzen. Die Vorlage nennt keinen Namen einer Firma: Org, Anforderungs-Repo, das Repo des Werkzeugs und den Fork der Skills setzt du aus dem Repo und seiner Einstellungs-Datei ein. Die Vorlage gibt es in zwei Fassungen. Welche du vorschlägst, entscheidet die Wurzel des Repos:

- **GitHub Portolan** für ein Anforderungs-Repo, erkennbar an einer Einstellungs-Datei `einstellungen*.json` an der Wurzel: Anforderungen, Tickets, Karten und Klärungen sind Issues im Repo selbst. Es gelten die Abschnitte 1 bis 4.
- **GitHub Portolan, Produkt-Repo** für jedes andere Repo, an dem Tickets eines Anforderungs-Repos umgesetzt werden: Es enthält Code eines Produkts, seine Tickets liegen im Anforderungs-Repo. Es gilt nur der Abschnitt „Produkt-Repo“ unten.

## 1. Erkunden

Zusätzlich zu Schritt 1 des Setups:

- `gh --version`: Lokale Kanten brauchen `gh` ab 2.94. Ist es älter, sag es.
- `.claude/skills/README.md`: der Stand der Skills (Tag `<name>-<n>`), den der Sync ins Repo gebracht hat, und der Fork, aus dem er kommt (der Link in der Zeile „schreibt nur der Sync … aus [<fork>]“). Fehlt die Datei, nimm den Stand aus `.claude-plugin/plugin.json` des installierten Plugins (Version `<Matts Version>-<name>.<n>` heißt Stand `<name>-<n>`) und den Fork aus `claude plugin marketplace list`, und sag es.
- Den **Kopf der Einstellungs-Datei**: `../portolan/.github/scripts/zustaendig.sh arbeitsbereich` aus der Wurzel des Klons. Daraus `org` und `anforderungsRepo`. Fehlt der Klon von portolan, liest du beide aus `einstellungen.json` (oder der Datei, die die Repo-Variable `EINSTELLUNGEN` nennt). Stimmt `anforderungsRepo` nicht mit `gh repo view --json nameWithOwner` überein, ist es die Datei eines anderen Repos: sag es und frag.
- Das **Repo des Werkzeugs**: `werkzeug_repo` im dünnen Aufrufer `.github/workflows/weiche.yml`. Fehlt er, frag die Person.
- `CONTEXT.md` oder `CONTEXT-MAP.md` an der Wurzel: So hieß das Glossar früher, die Skills suchen nur noch `GLOSSARY.md` und `GLOSSARY-MAP.md`. Liegt noch eine alte Datei da, sag der Person, sie per Pull Request mit `git mv` umzubenennen, samt der Verweise im Repo.

## 2. Fragen

- **Abschnitt A**: Empfiehl „GitHub Portolan“.
- **Abschnitt B** entfällt, auch wenn `triage` installiert ist. Die Weiche ersetzt `/triage`, Triage-Labels gibt es nicht. Du schreibst kein `docs/agents/triage-labels.md` und keinen Unterblock „Triage labels“.
- **Abschnitt C**: single-context, ohne Frage.

## 3. Schreiben

Nach der Bestätigung des Entwurfs (Schritt 3 des Setups):

- `docs/agents/issue-tracker.md` aus [issue-tracker-github-portolan.md](./issue-tracker-github-portolan.md). Ersetze nur diese Platzhalter durch die Werte aus der Erkundung: `<tag>` (Stand), `<fork>` (Fork der Skills), `<org>`, `<anforderungs-repo>` (`anforderungsRepo`, org/name) und `<werkzeug>` (Repo des Werkzeugs, org/name). Sonst übernimmst du die Vorlage wörtlich. Andere Platzhalter wie `<karte>`, `<board>` oder `{owner}` bleiben stehen, sie gelten beim Lesen.
- `docs/agents/domain.md` aus [domain.md](./domain.md), wörtlich.
- Die Datei aus Schritt 4 ist `CLAUDE.md`. Fehlt sie, legst du sie an, ohne zu fragen. Sie beginnt dann mit `# Anforderungen und Tickets` und dem Satz „Sprache in Issues, Kommentaren und Commits: Deutsch, mit den Begriffen aus `GLOSSARY.md`.“ Ein `AGENTS.md` legst du nicht an.
- Der Block `## Agent skills` lautet so, mit `<fork>` wie oben eingesetzt:

  ```markdown
  ## Agent skills

  ### Issue tracker

  GitHub Portolan: Anforderungen, Tickets, Karten und Klärungen sind Issues in diesem Repo, über `gh`. See `docs/agents/issue-tracker.md`.

  ### Domain docs

  Single-context: one `GLOSSARY.md` plus `docs/adr/` at the root. See `docs/agents/domain.md`.

  ### Skills im Repo

  `.claude/skills/` schreibt nur der Sync aus `<fork>`, per Pull Request. Den Stand nennt `.claude/skills/README.md`. Dort änderst du nie etwas von Hand.
  ```

- Nach dem Block folgt der Abschnitt `## Laufen in GitHub Actions` aus [claude-md-github-actions.md](./claude-md-github-actions.md), wörtlich. Gibt es ihn schon, ersetzt du ihn.
- In `.claude/settings.json` steht unter `permissions.deny` der Eintrag `Edit(/.claude/skills/**)`. So ändert kein Agent `.claude/skills` von Hand. Andere Einträge der Datei bleiben.
- Mehr schreibt das Setup nicht: in `CLAUDE.md` nur die Blöcke `## Agent skills` und `## Laufen in GitHub Actions`, in `.claude/settings.json` nur die Deny-Regel. Alles andere in beiden Dateien bleibt Zeichen für Zeichen. Regeln, die nur dieses Repo braucht, etwa zu seinen Workflows, stehen in eigenen Abschnitten der `CLAUDE.md` nach diesen Blöcken oder als weitere Einträge in `.claude/settings.json`. So übersteht ein neues Setup sie.

## 4. Abschluss

Nenne den Stand (`<name>-<n>`), aus dem die Dateien stammen, und die eingesetzten Werte. Committen und pushen macht die Person nach den Regeln des Repos.

## Produkt-Repo

Gilt statt der Abschnitte 1 bis 4 für die Fassung „GitHub Portolan, Produkt-Repo“. In einem Produkt-Repo arbeitet eine lokale Session an Tickets aus dem Anforderungs-Repo: übernehmen, Zustand im Board, Branch, Pull Request. Agent-Läufe in GitHub Actions und `.claude/skills` gibt es dort nicht.

### Erkunden

Zusätzlich zu Schritt 1 des Setups:

- Den Stand nimmst du aus `.claude-plugin/plugin.json` des installierten Plugins. Die Datei liegt drei Ordner über dem Ordner dieses Skills. Ihre Version `<Matts Version>-<name>.<n>` heißt Stand `<name>-<n>`.
- Das **Anforderungs-Repo**: Frag die Person, in welchem Repo die Tickets dieses Repos liegen (org/name). Schlag ein Repo derselben Org vor, wenn du eins mit Einstellungs-Datei kennst. Prüfe es: `gh api repos/<anforderungs-repo>/contents/einstellungen.json --jq .name`. Fehlt die Datei dort, ist es kein Anforderungs-Repo: sag es und frag erneut.
- `CONTEXT.md` oder `CONTEXT-MAP.md` an der Wurzel: wie in Abschnitt 1.
- `gh auth status`: Fehlt dem Token der Scope `project`, sag der Person `gh auth refresh -s project`. Ohne ihn setzt keine Session den Zustand im Board.
- Standard-Branch: `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`. Nennt die Doku des Repos einen anderen Branch für neue Arbeit, etwa `develop`, sag der Person: `Closes` im Pull Request schließt das Ticket nur beim Merge in den Standard-Branch.

### Fragen

- **Abschnitt A**: Empfiehl „GitHub Portolan, Produkt-Repo“.
- **Abschnitt B** entfällt wie oben.
- **Abschnitt C** läuft wie im Setup.

### Schreiben

Nach der Bestätigung des Entwurfs:

- `docs/agents/issue-tracker.md` aus [issue-tracker-github-portolan-produkt.md](./issue-tracker-github-portolan-produkt.md). Ersetze nur `<tag>` durch den Stand, `<fork>` durch den Fork der Skills, `<anforderungs-repo>` durch das Anforderungs-Repo (org/name) und `<org>` durch seine Org. Sonst übernimmst du die Vorlage wörtlich.
- `docs/agents/domain.md` wie in Abschnitt C gewählt.
- Die Datei wählst du wie in Schritt 4 des Setups: `CLAUDE.md`, sonst `AGENTS.md`, fehlen beide, fragst du. Der Block `## Agent skills` lautet so, mit `<anforderungs-repo>` eingesetzt, der Unterblock „Domain docs“ wie in Abschnitt C gewählt:

  ```markdown
  ## Agent skills

  ### Issue tracker

  GitHub Portolan, Produkt-Repo: Tickets liegen als Issues in `<anforderungs-repo>`, nicht hier. Bevor du an einem Ticket arbeitest, etwa mit `/implement <URL>`, lies `docs/agents/issue-tracker.md`: Übernehmen, Zustand im Board, Branch und Pull Request stehen dort.

  ### Domain docs

  Single-context: one `GLOSSARY.md` plus `docs/adr/` at the root. See `docs/agents/domain.md`.
  ```

- Mehr schreibt das Setup nicht: in der Datei nur den Block `## Agent skills`. Einen Abschnitt „Laufen in GitHub Actions“ und die Deny-Regel für `.claude/skills` bekommt ein Produkt-Repo nicht. Alles andere in der Datei bleibt Zeichen für Zeichen.

### Abschluss

Nenne den Stand (`<name>-<n>`), aus dem die Dateien stammen, und das Anforderungs-Repo. Committen und pushen macht die Person nach den Regeln des Repos, meist per Pull Request.
