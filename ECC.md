# ECC-Fassung von Matt Pococks Skills

Dieser Fork ist die einzige Quelle der Skills für ECC Digital (ADR 0002 im Repo `ECCdigital/tickets`). Alle nutzen dieselbe Fassung: zentral in `tickets` über `.claude/skills`, lokal als Marketplace. Marvin pflegt den Fork und übernimmt Matts Updates bewusst.

## Was ECC-eigen ist

Matts Skill-Dateien bleiben unverändert, damit Übernahmen ohne Konflikte gehen. Die ECC-Ergänzungen liegen im Setup-Skill `skills/engineering/setup-matt-pocock-skills/`:

- `issue-tracker-github-ecc.md`: die Tracker-Vorlage „GitHub ECC“. Der Abschnitt „Spec und Tickets aus einer Karte“ ist noch ein Platzhalter. Dort kommen Spec, Freigabe und Tickets aus einem Spec hinein.
- `claude-md-github-actions.md`: der Baustein „Laufen in GitHub Actions“ für die `CLAUDE.md` des Repos.
- `ecc-setup.md`: wie das Setup die Vorlage anwendet (Werte einsetzen, keine Triage-Labels, `CLAUDE.md`, Deny-Regel).
- `SKILL.md`: zwei Zeilen, die „GitHub ECC“ anbieten. Sonst ist die Datei Matts Stand.

Dazu kommt, was der Fork selbst braucht:

- `.github/workflows/ecc-sync.yml`: der Sync.
- `.claude-plugin/plugin.json`: nur `version`, siehe Tags.
- `.claude-plugin/marketplace.json`: nur `name` (`ecc`) und `description`.
- `ECC.md`: diese Datei.
- Matts Workflow `release.yml` ist im Fork abgeschaltet (`gh workflow disable release.yml`). Die Datei bleibt unverändert.

Alles andere ist Matts Stand. Prüfen: `git diff --stat upstream main`.

## Stände und Tags

- `main` ist die freigegebene ECC-Fassung. Nach jedem Merge nach `main` folgt ein Tag.
- Jeder Stand ist ein Tag `ecc-<n>`, fortlaufend ab `ecc-1`. Das Schema kollidiert weder mit Matts Tags (`v1.2.3`, `mattpocock-skills@1.0.0`) noch mit der Konvention `<plugin>--v<version>` von Claude Code.
- Die Plugin-Version in `.claude-plugin/plugin.json` ist `<Matts Version>-ecc.<n>`, etwa `1.2.3-ecc.1`. Claude Code aktualisiert eine lokale Installation nur, wenn sich diese Version ändert.

Einen neuen Stand freigeben:

1. Die Änderung kommt per Pull Request nach `main`. Derselbe Pull Request setzt in `.claude-plugin/plugin.json` `version` auf `<Matts Version>-ecc.<n>`.
2. Nach dem Merge: `git tag -a ecc-<n> -m "ECC-Fassung ecc-<n>: <was>"` auf `main`, dann `git push origin ecc-<n>`.
3. Der Workflow `ecc-sync` öffnet je einen Pull Request in `tickets-probe` und `tickets`. Er bricht ab, wenn Tag und Version nicht zusammenpassen.
4. In `tickets-probe` mergen. Sagt der Pull Request, dass sich der Setup-Skill geändert hat, dort das Setup neu ausführen: `/setup-matt-pocock-skills`, Vorlage „GitHub ECC“. Dann den Abnahme-Durchlauf fahren.
5. Danach in `tickets` mergen und dort ebenso das Setup neu ausführen. Die Ausgabe des Setups ist in beiden Repos gleich.
6. Lokal aktualisieren, siehe unten.

Einen Sync wiederholen: `gh workflow run ecc-sync.yml -R ECCdigital/skills -f tag=ecc-<n>`. Ein schon offener Pull Request wird aktualisiert, statt doppelt aufzugehen.

Der Fork ist öffentlich. Seine Actions-Läufe kosten deshalb keine Minuten aus dem Kontingent der Org.

## Der Sync

- Auslöser: ein Tag `ecc-*`, oder von Hand mit einem vorhandenen Tag.
- Er erzeugt ein Token der App „ECC Agent“ aus den Secrets `ECC_AGENT_APP_ID` und `ECC_AGENT_PRIVATE_KEY` dieses Repos.
- Je Ziel-Repo legt er einen Branch `skills/ecc-<n>` an und ersetzt `.claude/skills` ganz durch die ausgewählten Skills des Tags. `.claude/skills/README.md` nennt Tag, Commit, Plugin-Version und Skills.
- Der Pull Request vermerkt den Tag, verlinkt die Änderungen seit dem letzten Stand und sagt, ob das Setup neu laufen muss.
- Noch offene Sync-Pull-Requests eines älteren Tags schließt er mit Verweis auf den neuen. In `tickets` ist also immer höchstens einer offen.

### Auswahl für `.claude/skills`

Die Liste steht als `SKILLS` im Workflow. Sie enthält, was der Ablauf in `tickets` braucht:

| Skill | Wofür |
|---|---|
| `wayfinder` | Kartieren, lokal. Research-Läufe in Actions arbeiten nach ihm. |
| `grilling`, `domain-modeling` | Grilling-Runden in Actions. `/wayfinder` ruft beide. |
| `research` | Research-Klärungen in Actions. `/wayfinder` ruft ihn. |
| `prototype` | Prototyp-Klärungen, lokal. `/wayfinder` ruft ihn. |
| `to-spec`, `to-tickets` | Ende einer Karte, lokal in `tickets`. |
| `setup-matt-pocock-skills` | Das Setup läuft aus dem Stand des Repos. So passen `CLAUDE.md` und `docs/agents/` zum synchronisierten Tag. |

Nicht dabei sind `triage`, weil die Weiche ihn ersetzt, und die Skills für die Umsetzung (`tdd`, `code-review` und so weiter). Die haben alle lokal über das Plugin. Eine andere Auswahl heißt: Liste im Workflow ändern, dann neuer Tag.

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
- Konflikte sind nur an den ECC-Stellen möglich: die zwei Zeilen in `SKILL.md` des Setup-Skills, `version` in `plugin.json` und `name` in `marketplace.json`. Die ECC-Zeilen bleiben. Die Version setzt der nächste Tag.
- Danach einen neuen Stand freigeben, wie oben.

## Lokal installieren

Pro Rechner gibt es genau eine Fassung, nämlich diese:

```bash
claude plugin uninstall mattpocock-skills@claude-plugins-official
claude plugin marketplace add ECCdigital/skills
claude plugin install mattpocock-skills@ecc
```

- Die Kopien von skills.sh entfernen: die Ordner von Matts Skills in `~/.agents/skills`, ihre Symlinks in `~/.claude/skills` und ihre Einträge in `~/.agents/.skill-lock.json`. Skills aus anderen Quellen bleiben.
- Prüfen: `claude plugin list` zeigt `mattpocock-skills@ecc` und keinen anderen Eintrag von Matts Skills.
- Aktualisieren: `claude plugin marketplace update ecc`, dann `claude plugin update mattpocock-skills@ecc`, dann Claude Code neu starten. Automatisch geht das nur, wenn unter `/plugin`, Marketplaces, für `ecc` „Enable auto-update“ an ist.
- In `tickets` und `tickets-probe` lädt Claude Code zusätzlich die Skills aus `.claude/skills`. Nach dem Merge des Syncs ist das derselbe Stand wie im Plugin, solange beide auf demselben Tag stehen.
