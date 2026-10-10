# Issue-Tracker: GitHub Portolan

Erzeugt vom Setup der Skills (`/setup-matt-pocock-skills`, Vorlage „GitHub Portolan“), Stand `<tag>`. Nicht von Hand ändern: Die Vorlage liegt im Fork `<fork>`. Nach einem neuen Stand führst du das Setup neu aus.

Anforderungen, Tickets, Karten und Klärungen sind Issues in diesem Repo: `<anforderungs-repo>`. Ein Probe-Repo zum Testen hat dieselbe Datei. Du arbeitest mit `gh`, das Repo ergibt sich aus `git remote -v`. Hat der Klon mehrere Remotes, braucht `gh` einen Standard: einmal `gh repo set-default <anforderungs-repo>`, für ein anderes Repo `GH_REPO=<org>/<repo>` vor jedem Befehl. In `gh api` setzt `gh` die Platzhalter `{owner}` und `{repo}` selbst ein. Die Begriffe stehen in `GLOSSARY.md`.

## Arten von Issues

Ein Issue ist genau eines von:

- **Ticket**: hat einen Issue Type (Fehler, Feature oder Aufgabe).
- **Karte**: hat das Label `wayfinder:map`.
- **Klärung**: hat ein Label `wayfinder:<art>` und ist Sub-Issue einer Karte. Die Arten sind `research`, `prototype`, `grilling` und `task`. `task` ist die Vorarbeit.
- **Anforderung im Eingang**: alles andere.

Ausnahme: Das Sicht-Issue trägt das Label `anforderungs-sicht`. Es ist nie eine Anforderung.

Gibt `zustaendig.sh ablauf` `v2` aus, gilt dazu: Eine Karte wird bei der Übergabe selbst zum **Übergeordneten Ticket**, dem Haupteintrag der Anforderung bis Erledigt (siehe „Übergabe mit Ablauf v2“). Ein Ticket, das Sub-Issue eines Tickets ist, ist ein **Unter-Ticket**: Es hat einen Typ, aber keinen Zustand, steht nicht im Board und erbt Produkt und Projekt vom Haupteintrag. Es gibt genau zwei Ebenen: der Haupteintrag, darunter Klärungen und Unter-Tickets. Ein Unter-Ticket hat nie eigene Sub-Issues.

## Block der Auswertung

Die Auswertung schreibt in jedes Issue mit einem nächsten Schritt einen Block an den Anfang des Texts: den Kasten „Nächster Schritt“, auf einer Karte darunter den Entscheidungsbaum. Er steht zwischen zwei Markern, jeder auf einer eigenen Zeile:

```
<!-- naechster-schritt:anfang -->
…
<!-- naechster-schritt:ende -->
```

- Nur ein Block ganz am Anfang zählt, davor stehen höchstens Leerzeilen. Er ist die Ausnahme für den Anfang des Texts: Er darf vor `## Anforderung` einer Karte und vor `## Question` einer Klärung stehen.
- Was den Anfang des Texts liest, übergeht ihn, etwa bei der ersten Zeile „Eingebracht von …“. Ziel, Notizen und Entscheidungen einer Karte liest du aus ihren Abschnitten darunter, nicht aus dem Block.
- Mit Ablauf `v2` steht er nie an einem Unter-Ticket. Was dort ansteht, nennt der Kasten des Haupteintrags, samt dem Fortschritt der Unter-Tickets.
- Den Block schreibt nur die Auswertung. Schreibst du einen Text, etwa mit `/wayfinder`, `/to-spec` oder `/to-tickets`, lässt du ihn Zeichen für Zeichen stehen, auch wenn er veraltet wirkt. Du änderst, verschiebst und entfernst ihn nicht und setzt nichts davor. Hole den Text dafür direkt vor dem Schreiben neu.

## Labels

| Label | Bedeutung | Setzt | Entfernt |
|---|---|---|---|
| `wayfinder:map` | Karte | Weiche-Bestätigung | `/to-tickets` bei der Übergabe (nur Ablauf `v2`) |
| `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, `wayfinder:task` | Klärung mit ihrer Art; `task` ist die Vorarbeit | `/wayfinder` | – |
| `weiche:vorschlag` | Weiche vorgeschlagen, wartet auf Bestätigung | Weiche-Vorschlag | Weiche-Bestätigung |
| `agent:runde` | An diesem Issue laufen Grilling-Runden; bewusst anders als die Art `wayfinder:grilling` | Weiche-Bestätigung (nur Ablauf `v1`), Auswertung, Mensch | Grilling-Runde beim Ergebnis, lokale Session beim Umschalten auf live |
| `agent:laeuft` | Der Agent hat eine Klärung übernommen (Claim) | Auswertung beim Start | Research-Lauf beim Abschluss; ein Mensch für einen Neustart |
| `freigabe:wartet` | Karte wartet auf Freigabe | treibende Person nach dem Spec | Freigabe-Vermerk |
| `stoerungsverdacht` | Weiche vermutet eine Störung | Weiche-Vorschlag | – |
| `anforderungs-sicht` | das angepinnte Sicht-Issue | Einrichtung | – |

Triage-Labels wie `needs-triage` oder `ready-for-agent` gibt es hier nicht. Die Weiche ersetzt `/triage`. Verlangt ein Skill ein Triage-Label, setzt du keins. Lege keine Labels an, die nicht in dieser Tabelle stehen.

## Skripte

`zustaendig.sh` und `board.sh` gehören zum Werkzeug im Repo `<werkzeug>`. Der Text unten nennt sie nur beim Namen. Lokal liegen sie im Klon von portolan neben diesem Klon, unter `../portolan/.github/scripts/`. Die Einstellungs-Datei findet `zustaendig.sh` im Klon, aus dem du es aufrufst: `../portolan/.github/scripts/zustaendig.sh rolle Kundenbetreuung`. Was `board.sh` braucht, steht unter „Board“.

- Nennt die Umgebung `PORTOLAN` einen anderen Pfad zum Klon von portolan, setzt du ihn statt `../portolan` ein.
- Fehlt `../portolan`, hat dieser Klon aber noch `.github/scripts/zustaendig.sh`, ist das Werkzeug noch nicht umgezogen. Dann rufst du `.github/scripts/<skript>` auf.
- Fehlt beides, sagst du der Person: „Der Klon von portolan fehlt. Lege ihn einmal neben diesem Klon an: `gh repo clone <werkzeug> ../portolan`.“ Danach rufst du das Skript erneut.
- In GitHub Actions liegen beide unter `.github/scripts/` im Arbeitsverzeichnis, den Arbeitsbereich setzt der Workflow. Dort rufst du sie so auf, wie der Prompt sie nennt.

## Personen

- **Eingetragene Person einer Klärung**: der Assignee. Eine Klärung hat höchstens eine. Eine Research-Klärung ohne Assignee gehört dem Agent. Ein Bot kann nicht Assignee sein.
- **Treibende Hauptentwickler:in**: der Assignee der Karte. Mit Ablauf `v2` bleibt sie nach der Übergabe als Assignee am Haupteintrag, bis er Erledigt ist.
- **Einbringende Person**: die Autor:in des Issues. Bei Mail-Eingang ist es die Person aus der ersten Zeile „Eingebracht von @<login> per Mail am <Datum>“. Ein Block der Auswertung davor zählt nicht.
- **Gefragte Person einer Grilling-Runde**: die eine Erwähnung in der ersten Zeile jedes Runden-Kommentars.
  - An einer Klärung ist das die eingetragene Person, ohne Assignee mit Zugriff die treibende Person. Fehlt auch sie, trägt die Auswertung beim Start die erste Hauptentwickler:in der Zuständigkeit der Karte ein.
  - An einem Ticket ist es die Person aus der Zeile „Gefragte Person: …“ der Weiche: die einbringende Person, wenn sie zum Team gehört, sonst die erste Kundenbetreuung von Produkt oder Projekt. Nennt die Bestätigung der Weiche jemand anderen, gilt diese Person.
  - **Live oder asynchron**: Gibt `zustaendig.sh ablauf` `v2` aus, wird die gefragte Person so gegrillt, wie `zustaendig.sh grilling <login>` sagt: `live` in einer lokalen Session (siehe „Grilling-Session lokal“), `asynchron` als Grilling-Runde in GitHub Actions. Dann setzt die Auswertung `agent:runde` an einer frei gewordenen Grilling-Klärung und an einem Ticket mit Grilling nur bei `asynchron`, die Weiche-Bestätigung setzt es nicht mehr. Bei `live` nennt der Kasten der Person die lokale Session mit Befehl. Bei `v1` gilt alles hier wie bisher.
  - Antwortet die gefragte Person 5 Werktage nicht, holt die Auswertung die nächste Person der Reihenfolge dazu (**Vertretung**), per Kommentar mit Erwähnung. Die Frist beginnt je Vertretung neu. Die erste Antwort der gefragten Person oder einer erwähnten Vertretung zählt, und wer zuerst antwortet, ist ab dann gefragt. Am Ende der Reihenfolge erwähnt die Auswertung einmal alle Hauptentwickler:innen.
- Rollen und Zuständigkeiten stehen in der Einstellungs-Datei `einstellungen.json`. Du liest sie nur über `zustaendig.sh` (siehe „Skripte“), nie die Datei selbst. Aufbau und Pflege stehen in der README unter „Einstellungs-Datei“, die Hilfe im Kopf des Skripts.
  - `zustaendig.sh rolle <Rolle>` gibt die Logins einer Rolle aus, durch Komma getrennt. Rollen sind `Hauptentwickler:in` und `Kundenbetreuung`.
  - `zustaendig.sh team <login>` gibt `ja` aus, wenn die Person in der Zuordnung steht, sonst `nein`.
  - `zustaendig.sh wer [<Schwerpunkt>] [Produkt=<Produkt>] [Projekt=<Projekt>] [--hauptentwickler]` gibt die Reihenfolge der Zuständigkeit als eine Zeile JSON aus. Die erste Person ist `reihenfolge[0]`. Nennt `hinweise` etwas, sagst du es der Person.
  - `zustaendig.sh grilling <login>` gibt `live` oder `asynchron` aus, `zustaendig.sh ablauf` den Schalter `v1` oder `v2`, `zustaendig.sh arbeitsbereich` Org, Repo, Board und Bot des Arbeitsbereichs.
  - Nennt die Repo-Variable `EINSTELLUNGEN` eine andere Datei (`gh variable get EINSTELLUNGEN`, etwa im Probe-Repo), setzt du sie lokal vor den Befehl: `EINSTELLUNGEN=<datei> ../portolan/.github/scripts/zustaendig.sh …`. Fehlt `EINSTELLUNGEN`, gilt noch die alte Repo-Variable `ZUORDNUNG`, solange sie gesetzt ist. Dann setzt du `ZUORDNUNG=<datei>` statt `EINSTELLUNGEN=<datei>`.

## Board

- Tickets und Karten stehen im Org-Board, das die Repo-Variable `BOARD` nennt (`gh variable get BOARD`, dieselbe Nummer wie `board` in der Einstellungs-Datei). Im Text heißt die Nummer `<board>`. Klärungen kommen nie ins Board, mit Ablauf `v2` auch Unter-Tickets nicht: Im Board stehen nur Haupteinträge. Das Board nimmt nichts von selbst auf.
- Der Zustand steht im eingebauten Feld Status. Dazu kommen die Felder Produkt und Projekt. Ihre Auswahlwerte liest du aus dem Board (`gh project field-list <board> --owner <org>`). Eine zweite Liste gibt es nicht.
- Ab Bereit: Bereit und Erledigt setzt ein Mensch. In Arbeit und Review setzt die lokale Session, die im Repo des Produkts am Ticket arbeitet, nach der Vorlage „GitHub Portolan, Produkt-Repo“. Die eingebauten Workflows des Boards bleiben aus, weil „Item closed“ auch verworfene Einträge auf Erledigt setzen würde.
- Ins Board: `gh project item-add <board> --owner <org> --url <issue-url>`, dann die Felder mit `gh project item-edit`.
- Einfacher geht es mit `board.sh` (siehe „Skripte“). Es prüft die Werte, bevor es schreibt, und nimmt auch einen eindeutigen Teil eines Namens, etwa die Kennung eines Projekts.
  - `board.sh setze <n> Zustand=Backlog Produkt=<Produkt> Projekt=<Projekt>` nimmt das Issue ins Board auf und setzt die Felder. `board.sh zeige <n>` zeigt sie, `board.sh felder` die Auswahlwerte.
  - Lokal braucht es die Umgebung `BOARD` (`gh variable get BOARD`) und `GITHUB_REPOSITORY`, etwa `BOARD=<board> GITHUB_REPOSITORY=<anforderungs-repo> ../portolan/.github/scripts/board.sh zeige 10`.

## Grundbefehle

- **Issue anlegen**: `gh issue create --title "..." --body-file <datei>`, mit Label nach den Arten oben. Ein neues Issue ohne Label und ohne Typ ist eine Anforderung und startet die Weiche. Ein Kommentar daran stößt sie neu an, solange es weder Label noch Typ hat.
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
  - Der ursprüngliche Text der Anforderung bleibt unverändert als Abschnitt `## Anforderung` am Anfang des Karten-Texts. Davor steht höchstens der Block der Auswertung. Darunter folgen die Abschnitte der Karte aus `/wayfinder`: `## Destination`, `## Notes`, `## Decisions so far`, `## Not yet specified`, `## Out of scope`.
  - Hole den Text mit `gh issue view <karte> --json body --jq .body` und schreibe ihn mit `gh issue edit <karte> --body-file <datei>`. Der Block der Auswertung bleibt dabei Zeichen für Zeichen stehen.
- **Map ohne Anforderung** (Ausnahme): `gh issue create --label wayfinder:map --assignee @me`, dann ins Board mit Zustand Backlog, Produkt und Projekt.
- **Child ticket (Klärung)**: `gh issue create --title "..." --label wayfinder:<art> --parent <karte> --body-file <datei>`. Der Text beginnt mit `## Question`. Später setzt die Auswertung ihren Block davor.
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
    - Ausnahme mit Ablauf `v2` (`zustaendig.sh ablauf`): Bist du die gefragte Person der Klärung (eingetragen, ohne Assignee die treibende Person) und sagt `zustaendig.sh grilling <du>` `live`, nimmst du sie. Die Auswertung setzt dann kein `agent:runde`, die Klärung wartet auf deine lokale Session. Bei `asynchron` nennst du sie wie oben.
- **Claim**: Ein Mensch trägt sich als Assignee ein, falls noch niemand eingetragen ist: `gh issue edit <n> --add-assignee @me`, als erste Schreibaktion. Ist er schon eingetragen, gehört ihm die Klärung bereits. Der Agent claimt per Label `agent:laeuft`, weil ein Bot nicht Assignee sein kann.
- **Research beim Kartieren**: Research-Klärungen ohne Assignee startet der Agent in GitHub Actions, sobald sie frei sind. Er legt die Befunde auf einen Branch `research/<name>` in diesem Repo. Eine lokale Session startet für sie keine Subagents. Will die treibende Person eine Research selbst lösen, trägt sie sich vorher als Assignee ein.
- **Grilling-Runden**: Das Label `agent:runde` startet asynchrone Grilling-Runden des Agents. Eine Klärung mit `agent:runde` nimmt keine lokale Session. Eine Grilling-Klärung, die blockiert war, bekommt das Label von der Auswertung, sobald ihr letzter Blocker geschlossen ist. Auch sie nimmst du nicht, siehe Frontier query.
  - Ausnahme: Die Person nennt dir genau diese Klärung und will sie live klären. Das ist ein **Umschalten auf live**, und die lokale Session gewinnt. Entferne zuerst das Label (`gh issue edit <n> --remove-label agent:runde`), dann grillst du. Offene Runden und ihre Antworten im Thread liest du vorher und setzt dort an. Die Auswertung setzt das Label danach nie mehr von selbst. Umgekehrt startet `agent:runde` von Hand jederzeit Runden, auch bei `live`.
- **Resolve**: in dieser Reihenfolge.
  1. Die Antwort ist ein Kommentar, der mit `## Antwort` beginnt.
  2. Eine Zeile unter `## Decisions so far` der Karte: `- [<Titel>](<URL>): <Kurzfazit>`.
  3. Zuletzt `gh issue close <n> --reason completed`.

  Das Schließen kommt zuletzt, wie in den Workflows: Es startet die Auswertung, und die startet frei gewordene Klärungen. Deren Läufe lesen die Karte, also muss die Entscheidung dann schon dort stehen.
- **Out of scope**: Erst eine Zeile unter `## Out of scope` der Karte ergänzen, dann die Klärung mit `--reason "not planned"` schließen. Das Schließen kommt auch hier zuletzt.
- **Karte zu einer Klärung**: `gh api repos/{owner}/{repo}/issues/<n>/parent --jq .number`.
- Läufst du in GitHub Actions, legst du keine Klärungen und keinen Nebel an. Du nennst sie in der Antwort, und die treibende Person entscheidet.

## Grilling-Session lokal

Gilt für jede lokale Session, die einen Menschen grillt: `/wayfinder` an einer Grilling-Klärung, `/to-spec` und `/grilling` an einem Ticket mit Grilling.

- **Fragen mit festen Möglichkeiten** stellst du als Auswahl zum Anklicken mit dem Tool `AskUserQuestion`, die Empfehlung zuerst. Offene Fragen bleiben Text. Das gilt in Claude Code und in T3 Code gleich. T3 Code ist ein optionaler Client, nichts im Ablauf hängt von ihm ab.
- **Ansetzen**: Lies zu Beginn den Thread des Issues. Steht dort ein Kommentar `## Zwischenstand` (der jüngste zählt) oder eine Grilling-Runde mit Antworten, setzt du dort an: Entscheidungen gelten, offene Fragen sind deine ersten Fragen, Code-Fakten schlägst du nicht neu nach. Trägt das Issue `agent:runde`, schalte zuerst auf live um (siehe „Grilling-Runden“ oben).
- **Ticket mit Grilling** (`/grilling #<n>`): Gefragt ist die Person aus der Zeile `Gefragte Person: …` der Weiche. Das Ergebnis ist der Abschnitt `## Definition of Ready` im Issue-Text, in der Form nach dem Typ wie unter „Tickets aus einem Spec“, dazu ein Kommentar mit den Entscheidungen und Code-Fakten. Den Text holst und schreibst du wie beim Kartieren, der Block der Auswertung bleibt stehen. Bereit setzt danach ein Mensch.
- **Zwischenstand**: Endet die Session ohne Ergebnis, weil die Person aufhört, abbricht oder eine Antwort erst später kennt, postest du vor dem Ende genau einen Kommentar an das Issue, an dem du gegrillt hast (die Klärung, die Karte oder Anforderung bei `/to-spec`, das Ticket). Ergebnis heißt: die Antwort einer Klärung, der Spec, die Definition of Ready. Ohne eine einzige neue Entscheidung oder Frage gibt es keinen Zwischenstand. Die erste Zeile ist genau `## Zwischenstand`, an ihr erkennt ihn die Auswertung:

  ```
  ## Zwischenstand

  Live-Session am <TT.MM.JJJJ> mit <Login>, ohne Ergebnis: <ein Satz, warum>.

  ### Entscheidungen

  - <Entscheidung, mit Grund>

  ### Offene Fragen

  - <Frage>, Empfehlung: <Antwort>

  ### Code-Fakten

  - `<Repo>/<Pfad>:<Zeile>`: <Befund in eigenen Worten>
  ```

  Code-Fakten nennen Pfad und Zeilen und den Befund in eigenen Worten, höchstens ein paar Zeilen Code, nie Geheimnisse, Zugangsdaten oder Kundendaten. Leere Abschnitte lässt du weg.
- **Frist**: Der Zwischenstand zählt als Bewegung. Liegt eine Grilling-Session 5 Werktage ohne Ergebnis und ohne Zwischenstand, holt die Auswertung die nächste Person der Reihenfolge dazu, wie an einer Grilling-Runde.

## Spec und Tickets aus einer Karte

Ist auf einer Karte nichts mehr zu entscheiden, zieht die treibende Hauptentwickler:in lokal `/to-spec` und danach `/to-tickets`. In GitHub Actions läuft beides nie. Die Karte ist die Anforderung selbst. Nennt die Person keine Karte, fragst du nach ihrer Nummer.

Den Karten-Text holst und schreibst du wie beim Kartieren. Du ergänzt nur Zeilen. Der übrige Text bleibt Zeichen für Zeichen, auch HTML-Kommentare wie `<!-- … -->` und der Block der Auswertung am Anfang.

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
  1. Poste an der Karte die Anfrage an die erste Kundenbetreuung der Karte. Produkt und Projekt der Karte zeigt `board.sh zeige <karte>`. Die Person ist `reihenfolge[0]` aus `zustaendig.sh wer Kundenbetreuung Produkt=<Produkt> Projekt=<Projekt>`. Hat die Karte kein Projekt, lässt du `Projekt=` weg. Nur diese Person bekommt ein @. Ist `reihenfolge` leer, erwähnst du alle aus `zustaendig.sh rolle Kundenbetreuung`. Reagiert die Person 5 Werktage nicht, holt die Auswertung die nächste Kundenbetreuung der Karte dazu. Nach der ersten Reaktion, auch einem Zwischenstand wie „Angebot ist raus“, wartet die Karte ohne Frist:

     ```
     **Freigabe angefragt**: @<login> bitte ein Angebot auf Grundlage des [Spec](<URL des Spec>).
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
- Steht unter `## Notes` schon eine Zeile `- Tickets:`, gibt es die Tickets schon. Du legst keine an und entwirfst keinen Zuschnitt. Du nennst die Tickets aus der Zeile und machst weiter mit „Karte übergeben“, mit Ablauf `v2` mit „Übergabe mit Ablauf v2“ ab dem ersten Schritt, der fehlt. Ist die Karte schon geschlossen, sagst du das und endest.
- Mit Ablauf `v2`: Hat das Issue schon einen Typ und kein `wayfinder:map`, ist es schon Haupteintrag. Du sagst das, nennst seine Unter-Tickets (`gh api repos/{owner}/{repo}/issues/<n>/sub_issues --jq '.[] | "#\(.number) \(.title)"'`) und endest.
- Steht unter `## Notes` weder eine Freigabe noch „Keine Freigabe nötig“, klärst du das zuerst wie unter „Freigabe“.
- Grundlage ist der Spec, den `## Notes` verlinkt.

Mit Ablauf `v2` gehört zum Zuschnitt der Issue Type des Haupteintrags (Fehler, Feature oder Aufgabe), den du vorschlägst und die Person bestätigt. Es gibt genau zwei Ebenen: Ist ein Ticket zu groß, teilst du es in zwei Tickets unter derselben Karte, nie in Tickets darunter. Verlangt die Person Tickets unter einem Ticket, schlägst du das Teilen vor. Mehr als 100 Tickets an einer Karte nimmt GitHub nicht. Wären es so viele, sagst du das: Die Anforderung gehört an der Weiche geteilt.

Nach dem bestätigten Zuschnitt legst du die Tickets in der Reihenfolge der Abhängigkeiten an, Blocker zuerst:

- Jedes Ticket bekommt einen Issue Type im selben Aufruf, wie unter „Ticket anlegen“.
- Kein Label, kein Assignee. Ein Triage-Label bekommen sie nicht, denn Bereit setzt ein Mensch.
- Mit Ablauf `v1`: kein `--parent`. Tickets sind keine Sub-Issues der Karte.
- Mit Ablauf `v2`: Jedes Ticket wird gleich nach dem Anlegen Sub-Issue der Karte, ein Unter-Ticket. Das geht der Regel aus `/to-tickets` vor, das übergeordnete Issue nicht zu ändern.
  1. Anlegen mit Typ, Nummer und Id ausgeben: `gh api repos/{owner}/{repo}/issues -f title="..." -F body=@<datei> -f type=<Fehler|Feature|Aufgabe> --jq '"\(.number) \(.id)"'`.
  2. An die Karte hängen: `gh api --method POST repos/{owner}/{repo}/issues/<karte>/sub_issues -F sub_issue_id=<id>`. Die `<id>` ist die zweite Zahl aus 1, nicht die Nummer.
  3. Nie ein Ticket an ein anderes Ticket hängen und nie `--parent <ticket>`.
- Der Text folgt dieser Form statt der `<issue-template>` aus `/to-tickets`:

  ```
  ## Herkunft

  Karte #<karte>, [Spec](<URL des Spec>)

  ## Was entsteht

  <das Verhalten von Ende zu Ende, aus Sicht der Nutzer:innen>

  ## Definition of Ready

  <je nach Typ wie in `GLOSSARY.md`. Fehler: **Schritte zum Reproduzieren** und **Erwartetes Verhalten**. Feature: **Ziel** in einem Satz und **Akzeptanzkriterien** als Liste mit `- [ ]`. Aufgabe: **Ergebnis** in einem Satz.>

  ## Blockiert von

  - #<n>, oder „Nichts, kann sofort starten.“
  ```

Gleich nach dem Anlegen, noch vor Board und Kanten, ergänzt du unter `## Notes` der Karte die Zeile `- Tickets: #<a>, #<b>, …` mit allen angelegten Tickets in der Reihenfolge des Anlegens. An ihr erkennt die Auswertung, dass die Karte zu übergeben ist, und ein zweiter Aufruf von `/to-tickets` legt keine Dubletten an. Scheitert das Anlegen mittendrin, hörst du auf, schreibst die Zeile mit den Tickets, die es schon gibt, und nennst die fehlenden.

Danach:

- Nur mit Ablauf `v1`, mit `v2` stehen Unter-Tickets nie im Board: Ins Board mit Zustand Backlog und dem Produkt und Projekt der Karte: die Werte mit `board.sh zeige <karte>`, dann `board.sh setze <n> Zustand=Backlog Produkt=<Produkt> Projekt=<Projekt>`. Hat die Karte kein Projekt, lässt du `Projekt=` weg.
- Blockiert-von-Kanten sind nativ. Du setzt sie jetzt, da alle Tickets angelegt sind: `gh issue edit <n> --add-blocked-by <nummern>`.

Mit Ablauf `v2` weiter mit „Übergabe mit Ablauf v2“, sonst mit „Karte übergeben“.

### Karte übergeben

Nur mit Ablauf `v1`. Die Karte ist kein Parent der Tickets. Steht unter `## Notes` die Zeile `- Tickets:`, schließt die treibende Person die Karte. Frag vorher kurz. Sagt sie nein, bleibt die Karte offen, und ein späterer Aufruf von `/to-tickets` übergibt nur. Sonst:

1. Kommentar an der Karte, mit jedem Ticket aus der Zeile `- Tickets:`:

   ```
   **Karte übergeben**
   Spec: <URL des Spec>
   Tickets:
   - #<n> <Titel>
   ```

2. `board.sh setze <karte> Zustand=Erledigt`.
3. `gh issue close <karte> --reason completed`.

Die Anforderung ist dann in der Phase Übergeben.

### Übergabe mit Ablauf v2

Die Karte schließt nicht. Sie wird selbst zum Übergeordneten Ticket, dem Haupteintrag der Anforderung bis Erledigt, mit den Unter-Tickets als Sub-Issues. Du fragst nicht, ob du übergeben sollst: Der bestätigte Zuschnitt ist die Übergabe. Sind alle Unter-Tickets angelegt, die Zeile `- Tickets:` geschrieben und die Kanten gesetzt, in dieser Reihenfolge:

1. Issue Type am Haupteintrag, der aus dem Zuschnitt: `gh api --method PATCH repos/{owner}/{repo}/issues/<karte> -f type=<Fehler|Feature|Aufgabe>`. Erst der Typ, dann das Label: So ist die Karte nie ohne beides eine Anforderung im Eingang.
2. `gh issue edit <karte> --remove-label wayfinder:map`.
3. `board.sh setze <karte> Zustand=Backlog`. Produkt und Projekt bleiben, die Unter-Tickets erben sie.

Kein Kommentar „Karte übergeben“, kein Erledigt, nicht schließen, der Assignee bleibt. Der Haupteintrag steht dann auf Backlog. Bereit setzt eine Hauptentwickler:in am Haupteintrag, nicht an den Unter-Tickets. Eine eigene Definition of Ready braucht er nicht, die tragen seine Unter-Tickets. Scheitert ein Schritt, nennst du ihn. Ein späterer Aufruf von `/to-tickets` macht ab dort weiter.
