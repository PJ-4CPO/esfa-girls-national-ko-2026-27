# Results verification and girls' team-form research protocol

Updated 14 November 2026. Internal research workflow for the public 2026/27 U11 girls' competition tracker. Technical forecast notes live in their individual methodology documents.

## Sources and publication policy

A score is eligible for verification when explicitly published by:
- the organiser or competition administrator (including a current official results grid or table);
- either participating district or county schools' football association on its official website, official match centre or identifiable official social account.

Start with the competition organiser. Cross-check the relevant official participant reports and external trackers. Sites can publish at different times and can reproduce each other's data. Record the **specific publishing association**, the original URL, publication or observation date, and exact match.

An official result for another girls' league, cup, or festival may be used in the **separate team-form register** but must not be imported into either tracked competition's league table or knockout results.

First-person coach reports and reputable media reports can add context. When there is no official result from the organiser or either participant, seek independent corroboration before presenting a third-party score as confirmed. A copy of the same syndicated source is not independent confirmation.

If official sources disagree on a fixture, score, team or date, preserve both records and mark it disputed; check which publication was subsequently corrected rather than assuming one official site is definitive.

## Authoritative tracker data
- National KO: `/data.json`; provenance: `/research/national-ko-provenance.json`.
- Southern Counties **Girls' League**: `/southern-counties-league/data.json`; provenance: `/research/southern-counties-provenance.json`.
- Southern Counties Girls’ Cup: `/southern-counties-cup/data.json`. GPSFA labels the four quarter-finals Round Two. Record a confirmed outcome on the originating tie as `result` with `winner`, the official `source` URL, and `homeScore` and `awayScore` where published. Add a `note` for penalties, a walkover or a disputed score. Later ties resolve from the named winner. Update `/newbury-fixtures/data.json` together with the cup record when Newbury’s schedule or result changes. The tab calculates match and title estimates from the current Counties League ratings and archived League Cup ratings, with a neutral rating of 1 for entrants missing from both. It uses the existing Poisson model (2.8 expected goals, rated home multiplier 1.05, ratio cap 0.45–2.2 and strength-weighted progression after a draw), a multiplier of 1 at the shared finals venue and the published bracket for exact progression probabilities. Record the actual winner when a result is confirmed.
- Relevant girls' results from other competitions: `/research/team-form-register-2026-27.json`.
- Technical forecast history and validation: `/research/national-ko-v3-methodology.md`, `/research/southern-counties-v4-methodology.md`.

## Verification and change detection

1. Use the [source register](#source-register) on each update. Check every organiser or tournament source relevant to the competitions being refreshed, then the listed participant and external sources for the teams and fixtures in scope. Include all tracked competitions in a full refresh. Record which sources returned data, which had no relevant entry and which could not be checked. For a page with embedded or dynamically loaded results, inspect the actual draw or its public fixture feed. A blank search extract does not establish that there are no updates.
2. Compare each association's published **girls'** table against the previous recorded snapshot: played, wins, draws, losses, goals for, goals against and points. Investigate any change even when the match itself is hard to locate. Record source and timestamp of each observed snapshot.
3. Cross-check the relevant season (2026/27), U11 **girls**, competition, teams, home/away orientation and score. Never use a boys', mixed or older age group's similarly named table as girls' evidence.
4. Require a published match-specific score before recording a score. Record a bye, forfeit or confirmed progression separately. Distinguish the scheduled date from the play-by deadline. In the ESFA data, only treat score fields as scores when the result status confirms a score was recorded. A status of `NONE` can carry default zeroes.
5. Save match provenance, which publisher confirmed it, source URL and access date. Official screenshots of the relevant girls' grid/table provided by the user may directly verify displayed results and help resolve stale text retrieval.
6. Correct and update the public competition results, standings, remaining fixtures and accompanying commentary when a new score meets this policy. Recalculate title probabilities as a separately validated step; do not display stale probabilities as though they include new results. Keep earlier snapshots for comparison.
7. Separate relevant external girls' form, first-person qualitative reports and opposition analysis from the official scoreboards. Add to the team-form register with source classification.
8. Do **not** write unpublished privately reported scores to the public GitHub repository, including research files.

## Source register

| Source | Use in an update |
| --- | --- |
| [ESFA 2026/27 U11 Girls 7v7 Inter-Association Cup](https://www.schoolsfootball.org/competitions/fixtures/year/2026-2027/946) | Primary National Knockout draw, match dates, venues, results, progression and play-by deadlines. If the page extract omits the draw, read the [public fixture feed for draw 946](https://www.schoolsfootball.org/public-search/collections/esfa-public-fixtures/documents/search?q=%2A&query_by=homeTeam%2CawayTeam&filter_by=competitionId%3A%3D946&per_page=150) and check competition ID 946, season 2026/27, U11 and girls. |
| [ESFA fixtures and resources](https://www.schoolsfootball.org/national-competitions/login-fixtures-results-resources) · [National competition deadlines](https://www.schoolsfootball.org/api/assets/Play-on-Dates-for-ESFA-National-Competitions---Season-2026-2030.pdf) · [Legacy girls’ competition index](https://www.esfa.co.uk/competitions/?view=girls) | Official rules and deadlines, plus historical discovery. Verify the competition format before applying a rule. |
| [GPSFA regional competitions](https://www.gpsfa.com/cups/regional-competitons/) | Compare the exact girls’ National KO draw with ESFA. Also covers neighbouring girls’ competitions for opponent research. |
| [GPSFA Southern Counties League](https://www.gpsfa.com/cups/berkshire-league/) | Dedicated girls’ results grid and standings. Reconcile scores and every table column. |
| [GPSFA Southern Counties League Cup](https://www.gpsfa.com/southern-counties-league-cup/) · [LeagueHub365 girls’ Central & East match centre](https://leaguehub365.com/c/c3pdPtMzAGeXKzuHSUaH) | GPSFA lists regional tables and finals allocations when published. LeagueHub365 supplies match-level Central & East results and standings. Check the Woking tournament programme for regional rules. |
| [GPSFA Southern Counties Cup](https://www.gpsfa.com/southern-counties-cup/) | Separate girls’ knockout draw. Confirm exact dates and kick-offs through team notices when available. |
| [GPSFA Information Board](https://www.gpsfa.com/information-board/) · [Newsdesk](https://www.gpsfa.com/newsdesk/) · [Girls’ district fixture list](https://www.gpsfa.com/gpsfa-girls-district-squad/) | Weekly results and dates, announcements, and Gloucester's own fixture details. The grid and bulletin have disagreed before. Keep both records when this happens. |
| [Surrey Schools FA competitions on SchoolsSportsHub](https://schoolssportshub.com/competitions) | External tracker and discovery source for Surrey district competitions. Verify season, age group and competition before using a result. |
| [Kent Schools FA Girls’ Super League](https://ksfa.org.uk/inter-district/season-26-27/competitions/primary-cup-draws/girls-super-league/) · [U11 Girls’ Development League](https://www.ksfa.org.uk/inter-district/season-26-27/competitions/primary-cup-draws/under-11-girls-development-league/fixtures/) · [Area 11 U11 Girls’ Cup](https://ksfa.org.uk/inter-district/season-26-27/competitions/area-11-div-competitions/under-11-girls-cup/) | Opponent results in separate competitions. The development schedule can represent a different squad. |
| Kent Schools FA district pages for [Canterbury](https://www.ksfa.org.uk/inter-district/associations/primary/canterbury-sfa/), [Maidstone](https://www.ksfa.org.uk/inter-district/associations/primary/maidstone-psfa/), [Medway](https://www.ksfa.org.uk/inter-district/associations/primary/medway-psfa/), [Thanet](https://www.ksfa.org.uk/inter-district/associations/primary/thanet-psfa/), [West Kent](https://www.ksfa.org.uk/inter-district/associations/primary/west-kent-psfa/) and [Woking](https://ksfa.org.uk/inter-district/associations/primary/woking-psfa/) | District-specific fixture cross-checks. Where they repeat the same Kent listing, count them as one publisher. |
| [Woking PSFA girls’ football](https://www.wokingprimaryschools.co.uk/girls-district-football.html) · [District events](https://www.wokingprimaryschools.co.uk/woking-psfa-fixtures---results.html) | Participant and competition discovery, with results used only when the page gives a match-specific record. |
| [Brighton Schools U11 Girls on Pitchero](https://www.pitchero.com/clubs/brightonschoolsu11/teams/296584) · [Wolverhampton Schools FA](https://www.wolverhamptonsfa.org/) · [St Albans Schools FA on X](https://x.com/StAlbansSchools) | Participant fixture and match reports. Specific report links belong in the team-form or competition provenance record. |
| [Reigate coach’s public profile](https://uk.linkedin.com/in/noah-chant-81905a363) · [Slough Schools FA 2025/26 U11 Girls](https://sites.google.com/view/slough-schools-fa/home/district-teams/u11-girls-district-team/202526) | Corroborating match context and historical standings, respectively. |
| Newbury district fixture workbook and team notices · Woking regional tournament programme dated 17 October | District schedule, subsequent fixture revisions, and event rules. Use the latest dated notice for logistics. Keep private copies and unpublished scores outside this repository. |

Add newly identified organiser, district or external tracker links here when they contribute evidence. In the update log, record match or round, each source's observation date, any conflicting values and the basis for the decision. Where a secondary listing leaves a fixture blank but the organiser publishes a result, record the organiser result and the secondary listing’s coverage gap.

## Earlier research position — 11 October 2026

- The user's direct GPSFA Girls' League screenshots show **seven** teams, including Wycombe, and explicitly show **Dacorum 1–5 Newbury**; do not confuse this with an earlier incomplete six-team text extraction.
- Previously missing or privately known scores must not be treated as official unless an eligible source publishes them.
- Continue pursuing specific official or participant reports for unresolved National KO Round One ties, and verify remaining historical league scores against their original girls' competition records.


### Southern Counties 7-a-side Cup
Schedule-only coverage in Newbury Fixtures: 12 December 2026 and 17 April 2027. See [schedule evidence and limitations](sevens-cup-schedule.md). Cross-check [GPSFA Girls District Squad](https://www.gpsfa.com/gpsfa-girls-district-squad/) and Newbury's latest team notice before adding draw, venue or opponents. Keep separate from the League Cup; no dedicated tab until substantive details are available.
