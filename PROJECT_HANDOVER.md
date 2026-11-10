# Newbury District U11 Girls competition tracker

Season 2026/27. Recovery baseline checked 10 November 2026.

## Production

- [Repository](https://github.com/PJ-4CPO/esfa-girls-national-ko-2026-27) and [live GitHub Pages tracker](https://pj-4cpo.github.io/esfa-girls-national-ko-2026-27/).
- The recovery audit matched the four live HTML pages and four data feeds to [commit ae2ae16 on main](https://github.com/PJ-4CPO/esfa-girls-national-ko-2026-27/commit/ae2ae16f5e50ae2beefcc1fa5354d146d0d2f09a) and its [Pages deployment](https://github.com/PJ-4CPO/esfa-girls-national-ko-2026-27/actions/runs/40952046518). Check the latest deployment for the current production commit when resuming.
- The tracker is static HTML, CSS and JSON. Serve the repository root locally with `python3 -m http.server 8000` and open `http://localhost:8000/`. The existing Newbury Fixtures tab was published in the baseline.
- The historical preview branches diverge from main. Start new review work from the current production base. The original chat, “00 – Newbury District Competitions Website”, is historical reference.

## Competition and data map

| Competition or view | Route and data | Evidence and methodology |
| --- | --- | --- |
| ESFA U11 Girls National Knockout | [Home](index.html) · [data](data.json) | [GPSFA girls’ draw](https://www.gpsfa.com/cups/regional-competitons/) · [provenance](research/national-ko-provenance.json) · [V3 methodology](research/national-ko-v3-methodology.md) |
| Southern Counties Girls’ League | [League](southern-counties-league/index.html) · [data](southern-counties-league/data.json) | [GPSFA girls’ grid and standings](https://www.gpsfa.com/cups/berkshire-league/) · [weekly results](https://www.gpsfa.com/information-board/) · [provenance](research/southern-counties-provenance.json) · [V4 methodology](research/southern-counties-v4-methodology.md) |
| Southern Counties Girls’ League Cup | [League Cup](southern-counties-league-cup/index.html) · [data](southern-counties-league-cup/data.json) | [GPSFA competition page](https://www.gpsfa.com/southern-counties-league-cup/) · [Central & East tournament results](https://leaguehub365.com/c/c3pdPtMzAGeXKzuHSUaH) |
| Southern Counties Girls’ Cup | Separate knockout draw represented in [Newbury fixtures](newbury-fixtures/data.json) | [GPSFA girls’ cup draw](https://www.gpsfa.com/southern-counties-cup/) |
| Newbury Fixtures | [Chronological tab](newbury-fixtures/index.html) · [data](newbury-fixtures/data.json) | Reconcile Newbury entries with the relevant competition source and district schedule. Keep event status and date confidence explicit. |

## Evidence and decisions

| Item | Working position at recovery |
| --- | --- |
| Reigate & Banstead 4–1 Newbury | Use the dedicated girls’ grid and standings. The weekly bulletin prints the boys’ 0–2 score in both sections. Retain the conflict in provenance. |
| Newbury 9–1 St Albans B | The bulletin places this in the Cotswold League. Exclude it from the U11 girls’ tracker. |
| Newbury v Oxford, National KO | Progression is supported by the Round Two draw. Leave the first-round score blank until an eligible public source supplies it. |
| Newbury v Barnet, National KO | Round Two pairing verified. Replay timing and outcome remain unverified. The published Round Three draw gives Swansea the winner of this tie. |
| Newbury v Oxford, Girls’ Southern Counties Cup | The girls’ draw lists Oxford. Use that draw when checking the district schedule and confirm kick-off and venue separately. |
| League Cup April finals | Newbury finished fourth at Central & East. The comparison projects 11th and Intermediate under assumed allocation bands. Wait for the published allocations and preserve the provisional label. The A/B team policy and missing Wales & West entry remain open. |

## Backlog and release

1. Refresh the National KO results and Round Three pairings, reconcile changed names and progression, then recalculate forecasts. Verify the exact ESFA tie rule before treating it as official. Document any modelling assumption for future rounds with an unpublished draw.
2. Refresh the girls’ league with Gloucester 2–2 Dacorum on 7 November. Reconcile dates, the official standings, remaining pairings and forecasts. Keep the official championship tie-break open until verified.
3. Give fixtures stable identifiers across competition data and the chronological view in a separate change. Preserve all four routes and neutral branding.
4. Follow the [research verification protocol](research/README.md). Check season, age group, girls’ category, competition and home/away orientation. Record the source, check date, conflicts and date confidence. Keep private reports out of the repository.
5. Review the diff and check all four pages, results, standings and model totals. Obtain approval before merging to the Pages branch. After release, confirm the deployed commit and compare the live pages and feeds with that commit.
