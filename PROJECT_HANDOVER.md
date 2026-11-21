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

### Advancement score presentation — 21 November 2026

No-score progression uses a green A in the advancing team's home/away score position and a grey dash in the other slot, with 'Advanced' below. Awarded/forfeit/assumed classification remains as a small secondary label; no numerical score is invented. Applied to National KO, Newbury Fixtures and Counties Cup rendering. Played scores remain numerical. No results or progression changed in this visual release.

### Dates in tournament journeys — 21 November 2026

Show published dates beneath cup rounds. Counties Cup: quarter-finals 6 March 2027, semi-finals/final 15 May 2027 at Oxford City FC (GPSFA girls’ draw rechecked). League Cup: finals and trophies decided 24 April 2027. National KO stores round_dates with early-round play-by deadlines 3 October, 7 November and 28 November; later quarter/semi/final dates are unverified and display Date TBC. ESFA page was inaccessible during this check and GPSFA had no later National KO dates. Never present a play-by deadline as an arranged match date. No change to actual fixtures or results.

### Advancement typography — 21 November 2026

Removed the A badge’s separate 1.55rem/850-weight typography override. It now uses the same .score 1.25rem size, strong weight and inherited line height as numeric scores; green colour and home/away placement retained.

### Compact advancement cards — 21 November 2026

At Paul's request, keep only the green score-style A/dash on no-score advancement cards. Remove the repeated Advanced, award status and concession explanation from the card body. Keep tie identifiers, accessible winner labels and National KO award classification in the title metadata. A short key explains A/dash at the bottom of relevant tabs. Preserve all underlying award evidence and match dates/results. Keep explanations off the cards to avoid excessive height.

### Result colours — 21 November 2026

Newbury Fixtures uses green Win, red Loss, blue Draw and amber Postponed, with text as well as colour. Awarded advancement stays a green A and is not counted as a played win. Scheduled/tentative fixtures use neutral borders. Shared match-outcomes.js/CSS carry the same team colours through National KO, Counties League, League Cup and Counties Cup results: winner green with a tick, losing team red, drawn teams blue with '='. Match cards involving Newbury have an outcome-coloured left edge from Newbury's perspective; other cards identify each team rather than assuming a home-team viewpoint. Numeric scores, award evidence, progression and dates unchanged. Keys appear on the relevant pages.

### White text and outcome edges — 21 November 2026

Paul prefers all team names and scores (including A/dash) in white, with outcome colour restricted to card edges. Competition result cards use the left edge for the home team and right edge for the away team: green winner, red loser, blue both for draw. Remove winner ticks and coloured team/score typography. Preserve accessible winner/loser labels. Newbury Fixtures retains a single left edge reflecting Newbury’s result (green/red/blue), amber postponed and neutral scheduled; score/status text white. Scores, dates, advancement and results unchanged.

### Remove duplicate league document and move keys — 21 November 2026

Fixed an accidental second Counties League document/body and second rendering script appended after the first script. The page now has one header/nav/progress/table/results/upcoming section and one rendering script. Validate the whole HTML document and all IDs when editing scripts; find closing script relative to its opening tag, never the earlier external script tags. One result key appears near the top of each competition tab, with Newbury Fixtures keeping its key above the timeline. A/dash explanation consolidated into that key, with no duplicate key at the bottom. League Cup’s distinct group/combined/regional tables retained.

### Counties Cup shared fixture layout — 21 November 2026

Replace the separate compact two-column cup draw panels and cup-tie rows with the existing shared .model round sections, .fixtures grids and .fixture cards used on other competition pages. Teams sit either side of centred scores/VS/A; tie ID and FINAL/SCHEDULED beneath, with individual timing details only where available. Keep white team names/scores, shared outcome edges, top key and tournament journey. Round dates/venues remain above their fixture groups. Newbury Fixtures retains its different chronological layout. Results, dates, progression and draw unchanged.



## 21 November 2026 — Visitor usability pass
- Main URL now redirects to Newbury fixtures; National Cup lives at `/national-ko/`. All navigation updated with Newbury first; existing other competition URLs preserved.
- Newbury: Upcoming default, Results newest first, All chronological; undated awarded ties belong to resolved results. Repeated source notes omitted from cards, underlying data retained. Postponed fixtures remain unresolved; elapsed scheduled dates display result pending, never assumed scores.
- National: current draw first; completed rounds expandable; journey links open their rounds. Dynamic Newbury route summary.
- League: single table first, then upcoming and newest dated results; calendar retained below.
- League Cup: confirmed Newbury finals summary first, allocations expandable, one result list with Newbury filter, regional tables expandable. Illustrative combined ranking omitted from public page, retained in data.
- Shared compact headers/navigation, readable metadata, keyboard focus/skip link/back-to-top, table scrolling cues with sticky team/points columns. White team/score text and result edge colours retained.
- No fixture scores, dates or progression records changed. No scheduled tasks created.


## 21 November 2026 — Mobile usability verification
- Checked all five pages in browser frames at 360, 390 and 430 CSS-pixel widths. No horizontal page overflow or clipped match/team content observed.
- Added a compact Newbury Next matches summary with the first three unresolved upcoming entries. Swansea appears as expected 28 November, date unconfirmed. Existing date remains null; expected_date and play_by metadata express information already present in the note.
- Newbury cup route summaries and confirmed League Cup finals allocation now precede taller journey panels.
- Narrow tables use fixed column widths: team, played and points visible initially at 360px; team and points stay visible during horizontal scrolling. Browser verified scrollLeft 40 with team/points pinned.
- Verified Newbury Results shows 12 resolved entries (11 scores + Barnet advancement), latest dated first. League Cup Newbury filter shows six of 21 results. Existing competition cards and result edge colours retained.
- Navigation/filter controls have at least 44px height; compact headers and robust score/name columns checked.
- Temporary mobile-review.html test harness removed after verification. These are responsive browser layout checks, not physical-device or Safari tests.


## 21 November 2026 — Remove repeated next-match summary
- Removed the Coming up / Next matches panel and its renderer at the user's request; one Newbury fixture list remains.
- Upcoming view sorts expected dates alongside confirmed dates, while clearly labelling expected dates as unconfirmed. Swansea now appears in November before December fixtures. All view retains actual-date chronology; scores and confirmed dates unchanged.


## 21 November 2026 — Dates-only public presentation
- Removed kickoff times and all references to match times being unconfirmed from National Cup, League Cup, Counties Cup and Newbury fixture views.
- Match dates, expected dates, play-by deadlines and date-unconfirmed labels remain. Source time fields retained privately in repository data for record preservation and ordering, never rendered on public pages.
