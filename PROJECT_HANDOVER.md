# Newbury District U11 Girls competition tracker

Season 2026/27. Recovery baseline checked 10 November 2026.

## Production

- [Repository](https://github.com/PJ-4CPO/esfa-girls-national-ko-2026-27) and [live GitHub Pages tracker](https://pj-4cpo.github.io/esfa-girls-national-ko-2026-27/).
- The recovery audit matched the four live HTML pages and four data feeds to [commit ae2ae16 on main](https://github.com/PJ-4CPO/esfa-girls-national-ko-2026-27/commit/ae2ae16f5e50ae2beefcc1fa5354d146d0d2f09a) and its [Pages deployment](https://github.com/PJ-4CPO/esfa-girls-national-ko-2026-27/actions/runs/40952046518). Check the latest deployment for the current production commit when resuming.
- The tracker is static HTML, CSS and JSON. Serve the repository root locally with `python3 -m http.server 8000` and open `http://localhost:8000/`. The existing Newbury Fixtures tab was published in the baseline.
- The historical preview branches diverge from main. Start new review work from the current production base. The original chat, “00 – Newbury District Competitions Website”, is historical reference.

## Competition and data map

Use the [source register and update checklist](research/README.md#source-register) for each results refresh.

| Competition or view | Route and data | Evidence and methodology |
| --- | --- | --- |
| ESFA U11 Girls National Knockout | [Home](index.html) · [data](data.json) | [Official ESFA draw](https://www.schoolsfootball.org/competitions/fixtures/year/2026-2027/946) · [GPSFA cross-check](https://www.gpsfa.com/cups/regional-competitons/) · [provenance](research/national-ko-provenance.json) · [V3 methodology](research/national-ko-v3-methodology.md) |
| Southern Counties Girls’ League | [League](southern-counties-league/index.html) · [data](southern-counties-league/data.json) | [GPSFA girls’ grid and standings](https://www.gpsfa.com/cups/berkshire-league/) · [weekly results](https://www.gpsfa.com/information-board/) · [provenance](research/southern-counties-provenance.json) · [V4 methodology](research/southern-counties-v4-methodology.md) |
| Southern Counties Girls’ League Cup | [League Cup](southern-counties-league-cup/index.html) · [data](southern-counties-league-cup/data.json) | [GPSFA competition page](https://www.gpsfa.com/southern-counties-league-cup/) · [Central & East tournament results](https://leaguehub365.com/c/c3pdPtMzAGeXKzuHSUaH) |
| Southern Counties Girls’ Cup | [Counties Cup](southern-counties-cup/index.html) · [draw data](southern-counties-cup/data.json) · [Newbury fixtures](newbury-fixtures/data.json) | [GPSFA girls’ cup draw](https://www.gpsfa.com/southern-counties-cup/) |
| Newbury Fixtures | [Chronological tab](newbury-fixtures/index.html) · [data](newbury-fixtures/data.json) | Reconcile Newbury entries with the relevant competition source and district schedule. Keep event status and date confidence explicit. |

## Evidence and decisions

| Item | Working position at recovery |
| --- | --- |
| Reigate & Banstead 4–1 Newbury | Use the dedicated girls’ grid and standings. The weekly bulletin prints the boys’ 0–2 score in both sections. Retain the conflict in provenance. |
| Newbury 9–1 St Albans B | The bulletin places this in the Cotswold League. Exclude it from the U11 girls’ tracker. |
| Newbury v Oxford, National KO | ESFA records Newbury 4–3 Oxford City on 3 October at Trinity School. |
| Newbury v Barnet, National KO | ESFA lists 7 November at 10:00 at Trinity School. The result remains unreported. The winner faces Swansea away by the 28 November deadline. |
| Newbury v Oxford, Girls’ Southern Counties Cup | The girls’ draw lists Oxford. Use that draw when checking the district schedule and confirm kick-off and venue separately. |
| League Cup April finals | GPSFA allocates Newbury to the Girls’ Champions Trophy at Woking on 24 April 2027. The allocation formula remains unverified. |

## Backlog and release

1. Check the official ESFA draw for the Barnet outcome and later-round pairings, then recalculate forecasts when the inputs change. Verify the exact ESFA tie rule before treating it as official. Document any modelling assumption for future rounds with an unpublished draw.
2. Check the girls’ grid for new results, then reconcile dates, official standings, remaining pairings and forecasts. Keep the official championship tie-break open until verified.
3. Give fixtures stable identifiers across competition data and the chronological view in a separate change. Preserve the existing routes and neutral branding.
4. Follow the [research verification protocol](research/README.md). Check season, age group, girls’ category, competition and home/away orientation. Record the source, check date, conflicts and date confidence. Keep private reports out of the repository.
5. Review the diff and check all four pages, results, standings and model totals. Obtain approval before merging to the Pages branch. After release, confirm the deployed commit and compare the live pages and feeds with that commit.

## Presentation decision — 21 November 2026

At Paul's request, remove probabilities and predictions from every website tab. Published pages now show fixtures, results, standings, finals allocations and cup progression without title charts, match odds, archived forecasts or model explanations. Historical model inputs and research remain in the repository for reference; do not restore predictions to the website without a new request. The Newbury Fixtures page already contained no predictions. This presentation-only release does not refresh result data. Review further simplification separately after this change.

### Presentation follow-up — 21 November 2026

Remove sources, accuracy, verification and data-status panels from every website tab, including the League Cup verification banner. Preserve source registers and provenance in the repository for future checking. Keep the league points key with the league table. Avoid adding administrative validation panels back to the published pages.

### League counts and fixtures — 21 November 2026

Remove the assumed 42-match season total and progress graphic. Derive 'Recorded league results' directly from the results array. Ten published scores currently reconcile with GPSFA standings, including Reigate & Banstead 2–0 Dacorum (date unpublished). This does not establish completeness of results across the league or other competitions. Display only dated schedule entries and an explicitly postponed fixture; do not generate all possible pairings as upcoming matches. Historical model data remains archived and is not updated by this release. Further district schedule reconciliation remains open.

### Shared progress view — 21 November 2026

Paul wants a consistent progress panel across all five tabs. Shared competition-progress.js/CSS render the latest published National KO draw, the first unresolved Counties Cup round, completed League Cup regional results and next finals stage, and calendar phases for league/Newbury fixtures. Calendar phases are not completion percentages. Earlier National KO rounds are labelled 'Earlier round', never assumed complete merely because a later draw exists. Keep recorded-results counts separate from total games played. No forecasts, fixed league season totals or source/status footers are restored. The National KO introduction no longer references trophy-winning chances. Data is unchanged in this presentation release.

### Progress highlighting — 21 November 2026

Completed stages retain cyan text/lines and show a tick plus 'Completed'. Current stage has a filled cyan marker. Earlier rounds with unresolved results retain cyan with a dashed line and 'Earlier round', avoiding a false completed claim. Future stages stay grey. Removed the literal newline text accidentally displayed above the progress panels.

### Unscored progression policy — 21 November 2026

Paul authorises assumed awarded ties where published next-round progression establishes a winner but no score is published. Display 'Assumed awarded' for an inference, and 'Awarded'/'Forfeit' where explicitly established. Never invent scores or reasons for non-participation. Exclude byes, group/finals qualification and unresolved placeholders. See research/progression-policy.json. National KO now displays advancing teams for six existing forfeits and Newbury’s conceded Barnet tie; Swansea v Newbury and the chronological fixtures are synchronised. All Round Two outcomes are resolved, so progress shows completion. The Swansea match date remains TBC; 28 November is the deadline/expected date. Counties Cup adds Gloucester’s published 2–0 result; other opening ties remain pending. No further eligible awards found. Historical forecasts remain archived.
