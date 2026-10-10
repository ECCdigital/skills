# Fassung von Matt Pococks Skills für Portolan

Dieser Fork ist die Quelle der Skills für Portolan, für jede Firma gleich. Er nennt keine Firma: Was einem Arbeitsbereich gehört (Org, Anforderungs-Repo, Board, Bot), setzt das Setup aus dem Repo und seiner Einstellungs-Datei ein (#411). Ein Arbeitsbereich nutzt die Skills zentral in seinem Anforderungs-Repo über `.claude/skills`, lokal als Marketplace. Gepflegt wird der Fork von ECC Digital, Matts Updates übernimmt eine Person bewusst.

## Was Portolan-eigen ist

Matts Skill-Dateien bleiben bis auf wenige markierte Zeilen unverändert, damit Übernahmen ohne Konflikte gehen. Die Portolan-Ergänzungen liegen in zwei Skills. Die erste ist der Setup-Skill `skills/engineering/setup-matt-pocock-skills/`:

- `issue-tracker-github-portolan.md`: die Tracker-Vorlage „GitHub Portolan“, mit Kartieren, Spec, Freigabe und Tickets aus einem Spec. Platzhalter wie `<anforderungs-repo>` und `<werkzeug>` setzt das Setup ein.
- `issue-tracker-github-portolan-produkt.md`: die Fassung für Produkt-Repos. Tickets liegen im Anforderungs-Repo, eine lokale Session übernimmt sie, setzt den Zustand im Board und schließt sie über den Pull Request. Siehe „Produkt-Repos“.
- `claude-md-github-actions.md`: der Baustein „Laufen in GitHub Actions“ für die `CLAUDE.md` des Repos.
- `portolan-setup.md`: wie das Setup die Vorlage anwendet (Werte aus Repo und Einstellungs-Datei einsetzen, keine Triage-Labels, `CLAUDE.md`, Deny-Regel), im Anforderungs-Repo und in Produkt-Repos.
- `SKILL.md`: zwei Zeilen, die „GitHub Portolan“ anbieten. Sonst ist die Datei Matts Stand.

Die zweite ist `skills/engineering/implement/`: das Review als frischer Subagent. Lokal gelten damit dieselben Gates wie für den Agent, niemand bescheinigt sich die Prüfung selbst.

- `review.md`: Ablauf, Fehlversuch und Auftrag an den Review-Subagent, der nur meldet. Seine Kriterien sind die des Review-Agents der Umsetzung durch den Agent.
- `SKILL.md`: Statt Matts Zeile mit `code-review` vor dem Commit zeigt eine Zeile nach dem Commit auf `review.md`. Der Review-Subagent ruft `code-review` selbst.

Dazu kommt, was der Fork selbst braucht:

- `.claude-plugin/plugin.json`: nur `version`, siehe Tags.
- `.claude-plugin/marketplace.json`: nur `name` und `description`. Der Name ist der Name des Marketplace bei der Installation (`mattpocock-skills@ecc`) und steckt im Tag-Schema (`ecc-<n>`). Beide bleiben bewusst (#411): Ein neuer Name hieße Neuinstallation auf jedem Rechner. Der Wächter erlaubt sie als enge Ausnahme, nur in diesen Schreibweisen.
- `PORTOLAN.md`: diese Datei.
- `scripts/feste-namen.mjs` und `scripts/feste-namen.test.mjs`: der Wächter gegen feste Namen von ECC Digital, wie in portolan. `.github/workflows/feste-namen.yml` lässt ihn an jedem Pull Request und an jedem Push auf `main` und `v2/**` laufen, ohne Secrets.
- `scripts/vorlage-produkt-repo.test.mjs`: prüft, dass die Vorlage „GitHub Portolan, Produkt-Repo“ dem Schalter `ablauf` folgt, Unter-Tickets nur mit `v2` (#416). `feste-namen.yml` führt alle Tests unter `scripts/` aus: `node --test scripts/*.test.mjs`.
- Matts Workflows `release.yml`, `needs-info.yml` und `triage-label.yml` sind im Fork abgeschaltet (`gh workflow disable <datei>`). Die Dateien bleiben unverändert. Issues sind im Fork aus.

Alles andere ist Matts Stand. Prüfen: `git diff --stat upstream main`.

Den Sync hat der Fork nicht. Er ist ein Workflow des Werkzeugs (`skills-sync.yml` in portolan), aufgerufen aus dem Probe-Repo eines Arbeitsbereichs, siehe „Der Sync“.

## Stände und Tags

- `main` ist die freigegebene Fassung. Nach jedem Merge nach `main` folgt ein Tag.
- Jeder Stand ist ein Tag `ecc-<n>`, `<n>` fortlaufend ab 1. Das Schema kollidiert weder mit Matts Tags (`v1.2.3`, `mattpocock-skills@1.0.0`) noch mit der Konvention `<plugin>--v<version>` von Claude Code.
- Die Plugin-Version in `.claude-plugin/plugin.json` ist `<Matts Version>-ecc.<n>`. Claude Code aktualisiert eine lokale Installation nur, wenn sich diese Version ändert.

Einen neuen Stand freigeben:

1. Die Änderung kommt per Pull Request nach `main`. Derselbe Pull Request setzt in `.claude-plugin/plugin.json` `version` auf `<Matts Version>-ecc.<n>`.
2. Nach dem Merge: `git tag -a ecc-<n> -m "Fassung ecc-<n>: <was>"` auf `main`, dann `git push origin ecc-<n>`.
3. Den Sync starten, je Arbeitsbereich aus seinem Probe-Repo: `gh workflow run skills-sync.yml -R <org>/<probe> -f tag=ecc-<n>`. Er öffnet je einen Pull Request in seinen Zielen (Probe- und Anforderungs-Repo). Er bricht ab, wenn der Tag nicht auf `main` liegt oder Tag und Version nicht zusammenpassen. Den Lauf zeigt `gh run list -R <org>/<probe> --workflow skills-sync.yml`.
4. Im Probe-Repo mergen. Sagt der Pull Request, dass sich der Setup-Skill geändert hat, dort das Setup neu ausführen: `/setup-matt-pocock-skills`, Vorlage „GitHub Portolan“. Dann den Abnahme-Durchlauf fahren.
5. Danach im Anforderungs-Repo mergen und dort ebenso das Setup neu ausführen. Die Ausgabe des Setups unterscheidet sich nur in den eingesetzten Werten.
   - Ändert sich `issue-tracker-github-portolan-produkt.md`, das Setup in den eingerichteten Produkt-Repos neu ausführen. Dorthin kommt kein Sync.
6. Lokal aktualisieren, siehe unten.

Einen Sync wiederholen: derselbe Befehl. Ein schon offener Pull Request wird aktualisiert, statt doppelt aufzugehen.

## Der Sync

Der Sync ist der Workflow `skills-sync.yml` des Werkzeugs portolan. Ihn ruft ein dünner Aufrufer im Probe-Repo eines Arbeitsbereichs, mit dem Fork (`fork`), den Zielen (`ziele`) und dem Tag. Das Anforderungs-Repo hat dieselbe Datei, dort läuft er aber nicht: Das `if` des Aufrufers prüft `github.repository`.

Warum nicht im Fork: Der Fork ist öffentlich. Hätte er die Secrets einer App, könnte jeder mit Schreibrecht dort über einen Workflow den privaten Schlüssel in öffentliche Logs bringen. Mit dem Schlüssel erreicht man Inhalte, Issues und Pull Requests der Anforderungs-Repos und schreibt in die Boards der Org. Deshalb hat der Fork keine Secrets, und keine App eines Arbeitsbereichs ist dort installiert.

- Auslöser: nur von Hand, mit `-f tag=ecc-<n>`. Ohne Tag nimmt er den neuesten Tag `ecc-<n>` des Forks. Einen Zeitplan gibt es nicht, weil jeder Lauf Actions-Minuten der Org kostet, rund eine.
- Er liest den Fork ohne Zugangsdaten, noch bevor er ein Token erzeugt. Er prüft:
  - Der Tag passt genau zum Schema `ecc-<n>`.
  - Der Commit des Tags liegt auf `main` des Forks.
  - `.claude-plugin/plugin.json` hat dort die Version `<Matts Version>-ecc.<n>`.
  - Danach gilt dieser Commit, nicht mehr der Tag.
- Er erzeugt ein Token der App des Arbeitsbereichs aus den Secrets `AGENT_APP_ID` und `AGENT_PRIVATE_KEY` des Probe-Repos. Das Token gilt nur für die Ziele und nur für Contents und Pull Requests. Die App hat kein Recht `workflows`, deshalb ändert der Pull Request nur `.claude/skills`.
- Je Ziel-Repo legt er einen Branch `skills/ecc-<n>` an und ersetzt `.claude/skills` ganz durch die ausgewählten Skills des Tags. `.claude/skills/README.md` nennt Tag, Commit, Plugin-Version und Skills. Gibt es den Branch schon, setzt er einen Commit darauf.
- Der Pull Request vermerkt den Tag, verlinkt die Änderungen seit dem letzten Stand und sagt, ob das Setup neu laufen muss.
- Noch offene Sync-Pull-Requests eines älteren Tags schließt er mit Verweis auf den neuen: nur Branches `skills/ecc-<n>` des Bots mit kleinerem `<n>` als der neue Tag. Solange man Tags in ihrer Reihenfolge synchronisiert, ist je Ziel also höchstens einer offen.

### Auswahl für `.claude/skills`

Die Liste steht als `SKILLS` im Sync-Workflow in portolan. Sie enthält, was der Ablauf im Anforderungs-Repo braucht:

| Skill | Wofür |
|---|---|
| `wayfinder` | Kartieren, lokal. Research-Läufe in Actions arbeiten nach ihm. |
| `grilling`, `domain-modeling` | Grilling-Runden in Actions. `/wayfinder` ruft beide. |
| `research` | Research-Klärungen in Actions. `/wayfinder` ruft ihn. |
| `prototype` | Prototyp-Klärungen, lokal. `/wayfinder` ruft ihn. |
| `to-spec`, `to-tickets` | Ende einer Karte, lokal im Anforderungs-Repo. |
| `setup-matt-pocock-skills` | Das Setup läuft aus dem Stand des Repos. So passen `CLAUDE.md` und `docs/agents/` zum synchronisierten Tag. |

Nicht dabei sind `triage`, weil die Weiche ihn ersetzt, und die Skills für die Umsetzung (`tdd`, `code-review` und so weiter). Die haben alle lokal über das Plugin. Eine andere Auswahl heißt: Liste im Workflow in portolan ändern, dann den Sync mit dem aktuellen Tag neu starten.

### `.claude/skills` schreibt nur der Sync

In den Ziel-Repos ändert niemand `.claude/skills` von Hand. Das steht an drei Stellen:

- `.claude/skills/README.md`, geschrieben vom Sync;
- der Unterblock „Skills im Repo“ in `CLAUDE.md`, geschrieben vom Setup;
- die Deny-Regel `Edit(/.claude/skills/**)` in `.claude/settings.json`, geschrieben vom Setup. Sie hält Agents davon ab, lokal wie in Actions.

## Matts Änderungen übernehmen

Der Branch `upstream` ist Matts `main`. Matts Änderungen kommen über ihn per Pull Request nach `main`:

```bash
git fetch https://github.com/mattpocock/skills.git main
git push origin FETCH_HEAD:refs/heads/upstream
gh pr create -R ECCdigital/skills --base main --head upstream --title "Matts Stand übernehmen"
```

- Mergen mit Merge-Commit, nicht mit Squash, damit die nächste Übernahme sauber bleibt.
- Konflikte sind nur an den Portolan-Stellen möglich: die zwei Zeilen in `SKILL.md` des Setup-Skills, die Zeile zum Review in `SKILL.md` von `implement`, `version` in `plugin.json` und `name` in `marketplace.json`. Die Portolan-Zeilen bleiben. Die Version setzt der nächste Tag.
- Danach einen neuen Stand freigeben, wie oben.

Hebt Matt seine Version, gibt es immer einen Konflikt in `plugin.json`. Den nicht im Pull Request von `upstream` lösen: GitHub würde dabei `main` in `upstream` mergen, und `upstream` wäre nicht mehr Matts `main`. Stattdessen `upstream` wie oben pushen, dann lokal:

```bash
git switch -c matt/<Matts Version> origin/main
git merge --no-ff origin/upstream
```

- Im Konflikt `version` auf `<Matts Version>-ecc.<n>` setzen. Der Pull Request dieses Branches gibt damit zugleich den neuen Stand frei.
- `git diff --stat origin/upstream HEAD` zeigt danach nur die Dateien aus „Was Portolan-eigen ist“.
- Bringt Matt neue Workflows mit, sie nach dem Merge abschalten wie `release.yml` und oben eintragen.

## Produkt-Repos

In einem Repo mit Code eines Produkts bearbeitet eine lokale Session Tickets aus dem Anforderungs-Repo. Dafür braucht das Repo einmal das Setup mit der Fassung „GitHub Portolan, Produkt-Repo“:

1. Diese Fassung ist lokal installiert, siehe unten, und `gh` hat den Scope `project`: `gh auth refresh -s project`.
2. Im Produkt-Repo `claude` starten, dann `/setup-matt-pocock-skills`, Vorlage „GitHub Portolan, Produkt-Repo“. Das Setup fragt nach dem Anforderungs-Repo und schreibt `docs/agents/issue-tracker.md`, `docs/agents/domain.md` und den Block `## Agent skills` in `CLAUDE.md` (oder `AGENTS.md`).
3. Das Ergebnis per Pull Request nach den Regeln des Repos committen.

Danach startet man die Arbeit an einem Ticket mit `/implement <URL des Tickets>`. `/implement` selbst kennt den Tracker nicht. Der Block in `CLAUDE.md` schickt die Session zu `docs/agents/issue-tracker.md`, und dort stehen Übernehmen, Zustand, Branch `<n>-<stichwort>` und `Closes <anforderungs-repo>#<n>` im Pull Request.

Den Zustand setzt die Session mit `gh project item-add`, `gh project field-list` und `gh project item-edit`, nicht mit `board.sh`:

- `board.sh` liegt nur im Werkzeug portolan. Aus einem Produkt-Repo bräuchte es dessen Klon an einem bekannten Pfad, auf aktuellem Stand und auf `main`. Der Pfad ist auf jedem Rechner anders, und liegt der Klon auf einem anderen Branch, liefe ein ungeprüfter Stand des Skripts.
- Ein Skript aus dem Netz in eine Shell zu leiten, kommt nicht in Frage.
- Die `gh`-Befehle brauchen nur den Scope `project`, sind in jedem Permission-Prompt lesbar und ändern genau ein Feld an genau einem Eintrag.
- Sie prüfen die Werte nicht wie `board.sh`. Das braucht es hier nicht, weil die Session nur Status auf „In Arbeit“ oder „Review“ setzt.

Welche Produkt-Repos das Setup bekommen, entscheidet jede Firma selbst.

## Lokal installieren

Pro Rechner gibt es genau eine Fassung, nämlich diese:

```bash
claude plugin uninstall mattpocock-skills@claude-plugins-official
claude plugin marketplace add ECCdigital/skills
claude plugin install mattpocock-skills@ecc
```

- Die Kopien von skills.sh entfernen: die Ordner von Matts Skills in `~/.agents/skills`, ihre Symlinks in `~/.claude/skills` und ihre Einträge in `~/.agents/.skill-lock.json`. Skills aus anderen Quellen bleiben.
- Prüfen: `claude plugin list` zeigt `mattpocock-skills@ecc` und keinen anderen Eintrag von Matts Skills.
- Aktualisieren: `claude plugin marketplace update ecc`, dann `claude plugin update mattpocock-skills@ecc`, dann Claude Code neu starten. Automatisch geht das nur, wenn unter `/plugin`, Marketplaces, für diesen Marketplace „Enable auto-update“ an ist.
- Im Anforderungs-Repo und im Probe-Repo lädt Claude Code zusätzlich die Skills aus `.claude/skills`. Nach dem Merge des Syncs ist das derselbe Stand wie im Plugin, solange beide auf demselben Tag stehen.
