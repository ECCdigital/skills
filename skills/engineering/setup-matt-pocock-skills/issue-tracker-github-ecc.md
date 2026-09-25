# Issue-Tracker: GitHub ECC

Erzeugt vom Setup der ECC-Fassung (`/setup-matt-pocock-skills`, Vorlage „GitHub ECC“), Stand `<tag>`. Nicht von Hand ändern: Die Vorlage liegt im Fork `ECCdigital/skills`. Nach einem neuen Stand führst du das Setup neu aus.

Anforderungen, Tickets, Karten und Klärungen sind Issues in diesem Repo: `ECCdigital/tickets`, zum Testen `ECCdigital/tickets-probe`. Du arbeitest mit `gh`, das Repo ergibt sich aus `git remote -v`. In `gh api` setzt `gh` die Platzhalter `{owner}` und `{repo}` selbst ein. Die Begriffe stehen in `CONTEXT.md`.

## Arten von Issues

Ein Issue ist genau eines von:

- **Ticket**: hat einen Issue Type (Fehler, Feature oder Aufgabe).
- **Karte**: hat das Label `wayfinder:map`.
- **Klärung**: hat ein Label `wayfinder:<art>` und ist Sub-Issue einer Karte. Die Arten sind `research`, `prototype`, `grilling` und `task`. `task` ist die Vorarbeit.
- **Anforderung im Eingang**: alles andere.

Ausnahme: Das Sicht-Issue trägt das Label `anforderungs-sicht`. Es ist nie eine Anforderung.

## Labels

| Label | Bedeutung | Setzt | Entfernt |
|---|---|---|---|
| `wayfinder:map` | Karte | Weiche-Bestätigung | – |
| `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, `wayfinder:task` | Klärung mit ihrer Art; `task` ist die Vorarbeit | `/wayfinder` | – |
| `weiche:vorschlag` | Weiche vorgeschlagen, wartet auf Bestätigung | Weiche-Vorschlag | Weiche-Bestätigung |
| `agent:runde` | An diesem Issue laufen Grilling-Runden; bewusst anders als die Art `wayfinder:grilling` | Weiche-Bestätigung, Auswertung, Mensch | Grilling-Runde beim Ergebnis |
| `agent:laeuft` | Der Agent hat eine Klärung übernommen (Claim) | Auswertung beim Start | Research-Lauf beim Abschluss; ein Mensch für einen Neustart |
| `freigabe:wartet` | Karte wartet auf Freigabe | treibende Person nach dem Spec | Freigabe-Vermerk |
| `stoerungsverdacht` | Weiche vermutet eine Störung | Weiche-Vorschlag | – |
| `anforderungs-sicht` | das angepinnte Sicht-Issue | Einrichtung | – |

Triage-Labels wie `needs-triage` oder `ready-for-agent` gibt es hier nicht. Die Weiche ersetzt `/triage`. Verlangt ein Skill ein Triage-Label, setzt du keins. Lege keine Labels an, die nicht in dieser Tabelle stehen.

## Personen

- **Eingetragene Person einer Klärung**: der Assignee. Eine Klärung hat höchstens eine. Eine Research-Klärung ohne Assignee gehört dem Agent. Ein Bot kann nicht Assignee sein.
- **Treibende Hauptentwickler:in**: der Assignee der Karte.
- **Einbringende Person**: die Autor:in des Issues. Bei Mail-Eingang ist es die Person aus der ersten Zeile „Eingebracht von @<login> per Mail am <Datum>“.
- **Gefragte Person einer Grilling-Runde**: die eine Erwähnung in der ersten Zeile jedes Runden-Kommentars.
  - An einer Klärung ist das die eingetragene Person, ohne Assignee die treibende Person.
  - An einem Ticket ist es die einbringende Person, sofern die Bestätigung der Weiche niemand anderen nennt.
- Die Logins der Rollen stehen als Repo-Variablen `HAUPTENTWICKLER`, `KUNDENBETREUUNG` und `BETRIEB` (`gh variable get <name>`).

## Board Arbeit

- Tickets und Karten stehen im Org-Board, das die Repo-Variable `BOARD` nennt: für `tickets` Nr. 11 „Arbeit“, für `tickets-probe` Nr. 12 „Arbeit (Probe)“. Klärungen kommen nie ins Board. Das Board nimmt nichts von selbst auf.
- Der Zustand steht im eingebauten Feld Status. Dazu kommen die Felder Produkt und Projekt. Ihre Auswahlwerte liest du aus dem Board (`gh project field-list <board> --owner ECCdigital`). Eine zweite Liste gibt es nicht.
- Ins Board: `gh project item-add <board> --owner ECCdigital --url <issue-url>`, dann die Felder mit `gh project item-edit`.

## Grundbefehle

- **Issue anlegen**: `gh issue create --title "..." --body-file <datei>`, mit Label oder Issue Type nach den Arten oben. Ein neues Issue ohne Label und ohne Typ ist eine Anforderung und startet die Weiche.
- **Issue lesen**: `gh issue view <n> --comments`. Labels, Assignees und Typ mit `--json labels,assignees,issueType`.
- **Issues auflisten**: `gh issue list --state open --json number,title,labels,assignees`, gefiltert mit `--label`, `--state` oder `--search`.
- **Kommentieren**: `gh issue comment <n> --body-file <datei>`.
- **Labels**: `gh issue edit <n> --add-label "..."` und `--remove-label "..."`.
- **Schließen**: `gh issue close <n> --reason completed` oder `--reason "not planned"`, bei Bedarf mit `--comment "..."`.

## Pull requests as a triage surface

**PRs as a request surface: no.** Anforderungen kommen nur als Issues herein.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Wayfinding operations

Used by `/wayfinder`. In seiner Sprache ist die map die Karte, ein ticket eine Klärung und der driving dev die treibende Hauptentwickler:in. Die Karte ist ein Issue mit `wayfinder:map`, ihre Klärungen sind Sub-Issues.

- **Map aus einer Anforderung** (der Normalfall): Die Weiche hat das Issue schon zur Karte gemacht, mit `wayfinder:map`, der treibenden Person als Assignee und im Board. Du legst kein neues Issue an.
  - Der ursprüngliche Text der Anforderung bleibt unverändert als Abschnitt `## Anforderung` am Anfang des Karten-Texts. Darunter folgen die Abschnitte der Karte aus `/wayfinder`: `## Destination`, `## Notes`, `## Decisions so far`, `## Not yet specified`, `## Out of scope`.
  - Hole den Text mit `gh issue view <karte> --json body --jq .body` und schreibe ihn mit `gh issue edit <karte> --body-file <datei>`.
- **Map ohne Anforderung** (Ausnahme): `gh issue create --label wayfinder:map --assignee @me`, dann ins Board mit Zustand Backlog, Produkt und Projekt.
- **Child ticket (Klärung)**: `gh issue create --title "..." --label wayfinder:<art> --parent <karte> --body-file <datei>`. Der Text beginnt mit `## Question`.
  - Höchstens eine eingetragene Person, mit `--assignee <login>`. Eine Research-Klärung ohne Assignee übernimmt der Agent.
  - Klärungen bekommen keinen Issue Type und kommen nie ins Board.
- **Blocking**: native Abhängigkeiten, im zweiten Durchgang: `gh issue edit <n> --add-blocked-by <nummern>`. Lokale Kanten brauchen `gh` ab 2.94, prüfe mit `gh --version`.
  - Ein Blocker ist eine Klärung oder eine ganze andere Karte. Die Kante zeigt dann auf das Issue der anderen Karte.
  - Ohne `gh` 2.94: `gh api --method POST repos/{owner}/{repo}/issues/<n>/dependencies/blocked_by -F issue_id=<id>`. Die `<id>` ist die Datenbank-Id des Blockers aus `gh api repos/{owner}/{repo}/issues/<blocker> --jq .id`, nicht die Nummer.
  - Frei ist eine Klärung, wenn jeder Blocker geschlossen ist.
- **Frontier query**: über die Sub-Issues-API und `issue_dependencies_summary`, nie über die Suche. `parent-issue:` liefert für die Org immer eine leere Liste. Frontier heißt: offen, ohne offenen Blocker, ohne `agent:laeuft` und ohne `agent:runde`. Die Reihenfolge der Sub-Issues ist die Reihenfolge der Karte.

  ```bash
  gh api repos/{owner}/{repo}/issues/<karte>/sub_issues --paginate --jq '.[] | select(.state == "open" and .issue_dependencies_summary.blocked_by == 0 and ([.labels[].name] | any(. == "agent:laeuft" or . == "agent:runde") | not)) | {number, title, art: ([.labels[].name | select(startswith("wayfinder:"))] | first), assignee: ([.assignees[].login] | first)}'
  ```

  - Du nimmst die erste Klärung der Frontier, deren eingetragene Person du bist (`gh api user --jq .login`). Sonst die erste ohne Assignee, die keine Research ist.
  - Klärungen einer anderen eingetragenen Person nennst du, du nimmst sie nicht.
- **Claim**: Ein Mensch trägt sich als Assignee ein, falls noch niemand eingetragen ist: `gh issue edit <n> --add-assignee @me`, als erste Schreibaktion. Ist er schon eingetragen, gehört ihm die Klärung bereits. Der Agent claimt per Label `agent:laeuft`, weil ein Bot nicht Assignee sein kann.
- **Research beim Kartieren**: Research-Klärungen ohne Assignee startet der Agent in GitHub Actions, sobald sie frei sind. Er legt die Befunde auf einen Branch `research/<name>` in diesem Repo. Eine lokale Session startet für sie keine Subagents. Will die treibende Person eine Research selbst lösen, trägt sie sich vorher als Assignee ein.
- **Grilling-Runden**: Das Label `agent:runde` startet asynchrone Grilling-Runden des Agents. Eine Klärung mit `agent:runde` nimmt keine lokale Session.
- **Resolve**: Die Antwort ist ein Kommentar, der mit `## Antwort` beginnt. Dann `gh issue close <n> --reason completed`. Dann eine Zeile unter `## Decisions so far` der Karte: `- [<Titel>](<URL>): <Kurzfazit>`.
- **Out of scope**: Die Klärung mit `--reason "not planned"` schließen und eine Zeile unter `## Out of scope` der Karte ergänzen.
- **Karte zu einer Klärung**: `gh api repos/{owner}/{repo}/issues/<n>/parent --jq .number`.
- Läufst du in GitHub Actions, legst du keine Klärungen und keinen Nebel an. Du nennst sie in der Antwort, und die treibende Person entscheidet.

## Spec und Tickets aus einer Karte

Noch nicht festgelegt. Dieser Teil folgt mit einem späteren Stand der ECC-Fassung: Spec an der Karte, Freigabe und Tickets aus einem Spec, dazu „When a skill says publish to the issue tracker“. Bis dahin ziehst du an einer Karte weder `/to-spec` noch `/to-tickets`.
