# Issue-Tracker: GitHub ECC

Erzeugt vom Setup der ECC-Fassung (`/setup-matt-pocock-skills`, Vorlage „GitHub ECC“), Stand `<tag>`. Nicht von Hand ändern: Die Vorlage liegt im Fork `ECCdigital/skills`. Nach einem neuen Stand führst du das Setup neu aus.

Anforderungen, Tickets, Karten und Klärungen sind Issues in diesem Repo: `ECCdigital/tickets`, zum Testen `ECCdigital/tickets-probe`. Du arbeitest mit `gh`, das Repo ergibt sich aus `git remote -v`. Hat der Klon mehrere Remotes, braucht `gh` einen Standard: einmal `gh repo set-default ECCdigital/tickets`, für die Probe `GH_REPO=ECCdigital/tickets-probe` vor jedem Befehl. In `gh api` setzt `gh` die Platzhalter `{owner}` und `{repo}` selbst ein. Die Begriffe stehen in `CONTEXT.md`.

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
- Einfacher geht es mit `.github/scripts/board.sh` aus dem Repo. Es prüft die Werte, bevor es schreibt, und nimmt auch einen eindeutigen Teil eines Namens, etwa die MOCO-Kennung.
  - `board.sh setze <n> Zustand=Backlog Produkt=<Produkt> Projekt=<Projekt>` nimmt das Issue ins Board auf und setzt die Felder. `board.sh zeige <n>` zeigt sie, `board.sh felder` die Auswahlwerte.
  - Lokal braucht es die Umgebung `BOARD` (`gh variable get BOARD`) und `GITHUB_REPOSITORY`, etwa `BOARD=12 GITHUB_REPOSITORY=ECCdigital/tickets-probe .github/scripts/board.sh zeige 10`.

## Grundbefehle

- **Issue anlegen**: `gh issue create --title "..." --body-file <datei>`, mit Label nach den Arten oben. Ein neues Issue ohne Label und ohne Typ ist eine Anforderung und startet die Weiche.
- **Ticket anlegen**: mit Issue Type in einem Aufruf: `gh api repos/{owner}/{repo}/issues -f title="..." -F body=@<datei> -f type=<Fehler|Feature|Aufgabe> --jq .number`. Nicht mit `gh issue create --type`: Es setzt den Typ erst in einem zweiten Schritt, und dann startet die Weiche.
- **Issue lesen**: `gh issue view <n> --comments`. Labels, Assignees und Typ mit `--json labels,assignees,issueType`.
- **Issues auflisten**: `gh issue list --state open --json number,title,labels,assignees`, gefiltert mit `--label`, `--state` oder `--search`.
- **Kommentieren**: `gh issue comment <n> --body-file <datei>`.
- **Labels**: `gh issue edit <n> --add-label "..."` und `--remove-label "..."`.
- **Schließen**: `gh issue close <n> --reason completed` oder `--reason "not planned"`, bei Bedarf mit `--comment "..."`.

## Pull requests as a triage surface

**PRs as a request surface: no.** Anforderungen kommen nur als Issues herein.

## When a skill says "publish to the issue tracker"

- `/to-spec`: Der Spec ist ein Kommentar an der Karte. Du legst kein neues Issue an. Siehe „Spec und Tickets aus einer Karte“.
- `/to-tickets`: Tickets aus einem Spec, ebenda.
- Ein Triage-Label wie `ready-for-agent` setzt du nicht, auch wenn der Skill es verlangt.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`. Ist es eine Karte und läuft `/to-spec` oder `/to-tickets`, gilt zuerst „Spec und Tickets aus einer Karte“.

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
  gh api repos/{owner}/{repo}/issues/<karte>/sub_issues --paginate --jq '.[] | select(.state == "open" and .issue_dependencies_summary.blocked_by == 0 and ([.labels[].name] | any(. == "agent:laeuft" or . == "agent:runde") | not)) | {number, title, art: ([.labels[].name | select(startswith("wayfinder:"))] | first), assignee: ([.assignees[].login] | first), blocker: .issue_dependencies_summary.total_blocked_by}'
  ```

  `blocker` zählt alle Blocker der Klärung, auch die geschlossenen.

  - Du nimmst die erste Klärung der Frontier, deren eingetragene Person du bist (`gh api user --jq .login`). Sonst die erste ohne Assignee, die keine Research ist.
  - Klärungen einer anderen eingetragenen Person nennst du, du nimmst sie nicht.
  - Eine Grilling-Klärung mit `blocker` über 0 nimmst du nicht, auch wenn du ihre eingetragene Person bist. Sie war blockiert, und sobald ihr letzter Blocker geschlossen ist, setzt die Auswertung bei ihrem nächsten Lauf von selbst `agent:runde`. Die Auswertung läuft bei jedem geschlossenen Issue und werktags früh. Die Grilling-Runde läuft dann in GitHub Actions. Nähmst du die Klärung lokal, würde die Person zweimal gegrillt, einmal davon in einem bezahlten Lauf. Du nennst sie mit diesem Grund.
    - Ausnahme: `agent:runde` war an ihr schon einmal gesetzt. Die Auswertung setzt es je Klärung nur einmal. Hat ein Mensch es danach entfernt, nimmst du sie wie jede andere Klärung. Prüfen: `gh api repos/{owner}/{repo}/issues/<n>/events --paginate --jq '.[] | select(.event == "labeled" and .label.name == "agent:runde") | .created_at'` gibt dann mindestens eine Zeile aus.
- **Claim**: Ein Mensch trägt sich als Assignee ein, falls noch niemand eingetragen ist: `gh issue edit <n> --add-assignee @me`, als erste Schreibaktion. Ist er schon eingetragen, gehört ihm die Klärung bereits. Der Agent claimt per Label `agent:laeuft`, weil ein Bot nicht Assignee sein kann.
- **Research beim Kartieren**: Research-Klärungen ohne Assignee startet der Agent in GitHub Actions, sobald sie frei sind. Er legt die Befunde auf einen Branch `research/<name>` in diesem Repo. Eine lokale Session startet für sie keine Subagents. Will die treibende Person eine Research selbst lösen, trägt sie sich vorher als Assignee ein.
- **Grilling-Runden**: Das Label `agent:runde` startet asynchrone Grilling-Runden des Agents. Eine Klärung mit `agent:runde` nimmt keine lokale Session. Eine Grilling-Klärung, die blockiert war, bekommt das Label von der Auswertung, sobald ihr letzter Blocker geschlossen ist. Auch sie nimmst du nicht, siehe Frontier query.
- **Resolve**: in dieser Reihenfolge.
  1. Die Antwort ist ein Kommentar, der mit `## Antwort` beginnt.
  2. Eine Zeile unter `## Decisions so far` der Karte: `- [<Titel>](<URL>): <Kurzfazit>`.
  3. Zuletzt `gh issue close <n> --reason completed`.

  Das Schließen kommt zuletzt, wie in den Workflows: Es startet die Auswertung, und die startet frei gewordene Klärungen. Deren Läufe lesen die Karte, also muss die Entscheidung dann schon dort stehen.
- **Out of scope**: Erst eine Zeile unter `## Out of scope` der Karte ergänzen, dann die Klärung mit `--reason "not planned"` schließen. Das Schließen kommt auch hier zuletzt.
- **Karte zu einer Klärung**: `gh api repos/{owner}/{repo}/issues/<n>/parent --jq .number`.
- Läufst du in GitHub Actions, legst du keine Klärungen und keinen Nebel an. Du nennst sie in der Antwort, und die treibende Person entscheidet.

## Spec und Tickets aus einer Karte

Ist auf einer Karte nichts mehr zu entscheiden, zieht die treibende Hauptentwickler:in lokal `/to-spec` und danach `/to-tickets`. In GitHub Actions läuft beides nie. Die Karte ist die Anforderung selbst. Nennt die Person keine Karte, fragst du nach ihrer Nummer.

Den Karten-Text holst und schreibst du wie beim Kartieren. Du ergänzt nur Zeilen. Der übrige Text bleibt Zeichen für Zeichen, auch HTML-Kommentare wie `<!-- … -->`.

### Spec

- Hat die Karte noch offene Klärungen oder Punkte unter `## Not yet specified`, nennst du sie und fragst, ob die Person trotzdem einen Spec will.
- Der Spec ist ein Kommentar an der Karte. Seine erste Zeile ist `## Spec`, danach folgt die Vorlage aus `/to-spec`.
- Anlegen: `gh issue comment <karte> --body-file <datei>`. Die Ausgabe ist die URL des Kommentars.
- Dann ergänzt du unter `## Notes` der Karte die Zeile `- Spec: <URL>`.
- Ändert sich der Spec, bearbeitest du denselben Kommentar: `gh api --method PATCH repos/{owner}/{repo}/issues/comments/<id> -F body=@<datei>`. Die `<id>` ist die Zahl nach `#issuecomment-` in der URL. So bleibt der Link gültig. Nach einer Freigabe änderst du ihn nur, wenn die Person es ausdrücklich will, denn das Angebot beruht auf ihm.

### Freigabe

Nach dem Spec fragst du die Person: Deckt ein laufendes Projekt die Anforderung? Ein Projekt an der Karte reicht dafür nicht, sein Auftrag muss die Anforderung umfassen.

- **Ja**: Du ergänzt unter `## Notes` die Zeile `- Keine Freigabe nötig: <Projekt> deckt die Anforderung.` Weiter mit `/to-tickets`.
- **Nein**: Die Karte wartet auf Freigabe. Der Spec ist die Grundlage des Angebots.
  1. Poste an der Karte die Anfrage. Die Logins der Kundenbetreuung liefert `gh variable get KUNDENBETREUUNG`, jedes bekommt ein @:

     ```
     **Freigabe angefragt**: @<login> @<login> bitte ein Angebot auf Grundlage des [Spec](<URL des Spec>).
     Kein laufendes Projekt deckt diese Anforderung. Vermerkt hier als Kommentar die Freigabe, etwa „Freigabe: Angebot <Nummer> angenommen“, oder die Absage mit Grund.
     ```

  2. Erst danach: `gh issue edit <karte> --add-label freigabe:wartet`. In dieser Reihenfolge startet die Anfrage keinen Freigabe-Vermerk.

Solange die Karte `freigabe:wartet` trägt, startet jeder Kommentar eines Menschen an ihr den **Freigabe-Vermerk** in GitHub Actions. Er liest den Kommentar:

- **Freigabe**: Er ergänzt unter `## Notes` die Zeile `- Freigabe am <TT.MM.JJJJ> von <login>: <Bezug> ([Kommentar](<URL>))`. Dann entfernt er `freigabe:wartet` und erwähnt die treibende Person, damit sie `/to-tickets` zieht.
- **Absage**: Er begründet sie in einem Kommentar und erwähnt die treibende Person. Dann entfernt er `freigabe:wartet`, setzt im Board Zustand Verworfen und schließt die Karte als nicht geplant.
- **Sonst**: eine knappe Antwort. Das Label bleibt.

Das Label entfernt nur der Freigabe-Vermerk, nie eine lokale Session. Hat die Person die Freigabe nur mündlich erfahren, schreibt sie sie mit Bezug als Kommentar an die Karte. Deckt doch ein laufendes Projekt die Anforderung, schreibt sie das mit dem Projekt als Kommentar. Der Freigabe-Vermerk behandelt es wie eine Freigabe.

### Tickets aus einem Spec

Prüfe zuerst, bevor du einen Zuschnitt entwirfst:

- Trägt die Karte `freigabe:wartet`, legst du keine Tickets an und entwirfst keinen Zuschnitt. Du sagst: „Karte #<n> wartet auf Freigabe. Tickets entstehen erst nach dem Freigabe-Vermerk.“ Dann endest du.
- Steht unter `## Notes` weder eine Freigabe noch „Keine Freigabe nötig“, klärst du das zuerst wie unter „Freigabe“.
- Grundlage ist der Spec, den `## Notes` verlinkt.

Nach dem bestätigten Zuschnitt legst du die Tickets in der Reihenfolge der Abhängigkeiten an, Blocker zuerst:

- Jedes Ticket bekommt einen Issue Type im selben Aufruf, wie unter „Ticket anlegen“.
- Kein Label, kein Assignee, kein `--parent`. Tickets sind keine Sub-Issues der Karte. Ein Triage-Label bekommen sie nicht, denn Bereit setzt ein Mensch.
- Ins Board mit Zustand Backlog und dem Produkt und Projekt der Karte: die Werte mit `board.sh zeige <karte>`, dann `board.sh setze <n> Zustand=Backlog Produkt=<Produkt> Projekt=<Projekt>`. Hat die Karte kein Projekt, lässt du `Projekt=` weg.
- Blockiert-von-Kanten sind nativ. Du setzt sie, wenn alle Tickets angelegt sind: `gh issue edit <n> --add-blocked-by <nummern>`.
- Der Text folgt dieser Form statt der `<issue-template>` aus `/to-tickets`:

  ```
  ## Herkunft

  Karte #<karte>, [Spec](<URL des Spec>)

  ## Was entsteht

  <das Verhalten von Ende zu Ende, aus Sicht der Nutzer:innen>

  ## Definition of Ready

  <je nach Typ wie in `CONTEXT.md`. Fehler: **Schritte zum Reproduzieren** und **Erwartetes Verhalten**. Feature: **Ziel** in einem Satz und **Akzeptanzkriterien** als Liste mit `- [ ]`. Aufgabe: **Ergebnis** in einem Satz.>

  ## Blockiert von

  - #<n>, oder „Nichts, kann sofort starten.“
  ```

### Karte übergeben

Die Karte ist kein Parent der Tickets. Sind alle Tickets angelegt, schließt die treibende Person sie. Frag vorher kurz, dann:

1. Kommentar an der Karte:

   ```
   **Karte übergeben**
   Spec: <URL des Spec>
   Tickets:
   - #<n> <Titel>
   ```

2. `board.sh setze <karte> Zustand=Erledigt`.
3. `gh issue close <karte> --reason completed`.

Die Anforderung ist dann in der Phase Übergeben.
