## Laufen in GitHub Actions

Oft läufst du ohne Menschen im Terminal: als ECC Agent in GitHub Actions, ausgelöst von einem Issue-Ereignis. Dann gilt:

- Das Issue samt Thread ist das Gedächtnis. Zwischen den Läufen gibt es keine Session. Lies zu Beginn jedes Laufs `gh issue view <n> --comments`.
- Was ein Mensch lesen soll, steht in genau einem Kommentar (`gh issue comment`). Nichts steht nur im Log.
- Dateien im Repo änderst du nur, wenn der Prompt es verlangt.
- Wartest du auf eine Antwort, endest du. Die Antwort startet den nächsten Lauf.
- Subagents (Tool `Agent`) startest du nur im Vordergrund (`run_in_background: false`) und wartest auf ihr Ergebnis. Sobald du endest, endet der Lauf, und ein Hintergrund-Agent stirbt mit. Das gilt auch, wenn ein Skill einen Hintergrund-Agent verlangt.
- `gh` und `git` rufst du einzeln auf: ohne `cd`, ohne `;`, `&&`, `|` und `$(…)`. Freigegeben sind nur Befehle, die mit `gh` oder `git` beginnen. Das Arbeitsverzeichnis ist schon die Repo-Wurzel.
- Vorschläge fürs Glossar nennst du im Kommentar. `CONTEXT.md` und die ADRs änderst du nicht.
- Du bist ein Bot und kannst nicht Assignee sein. Eine Klärung übernimmst du per Label `agent:laeuft`, siehe `docs/agents/issue-tracker.md`.
