# Results verification and girls' team-form research protocol

Updated 11 October 2026. Internal research workflow for the public 2026/27 U11 girls' competition tracker. Technical forecast notes live in their individual methodology documents.

## Sources and publication policy

**Official results are not exclusive to Gloucestershire PSFA.** A score is eligible for verification when explicitly published by:
- the organiser or competition administrator (including a current official results grid or table);
- either participating district or county schools' football association on its official website, official match centre or identifiable official social account.

Treat qualifying official associations equally as credible *publishers of their own competition results*. Do not assume their websites share a database, automatically synchronise, or update at the same time: this has not been established. Record the **specific publishing association**, the original URL, publication or observation date, and exact match.

An official result for another girls' league, cup, or festival may be used in the **separate team-form register** but must not be imported into either tracked competition's league table or knockout results.

First-person coach reports and reputable media reports can add context. When there is no official result from the organiser or either participant, seek independent corroboration before presenting a third-party score as confirmed. A copy of the same syndicated source is not independent confirmation.

If official sources disagree on a fixture, score, team or date, preserve both records and mark it disputed; check which publication was subsequently corrected rather than assuming one official site is definitive.

## Authoritative tracker data
- National KO: `/data.json`; provenance: `/research/national-ko-provenance.json`.
- Southern Counties **Girls' League**: `/southern-counties-league/data.json`; provenance: `/research/southern-counties-provenance.json`.
- Relevant girls' results from other competitions: `/research/team-form-register-2026-27.json`.
- Technical forecast history and validation: `/research/national-ko-v3-methodology.md`, `/research/southern-counties-v4-methodology.md`.

## Verification and change detection

1. Check the latest **girls'** results grid, official league table and any accessible association match centre or match report. Do not rely only on web search snippets or page-text extraction; embedded and horizontally scrolling tables may be missed. A failed or incomplete retrieval must be reported as *unable to verify*, never as proof of no changes.
2. Compare each association's published **girls'** table against the previous recorded snapshot: played, wins, draws, losses, goals for, goals against and points. Investigate any change even when the match itself is hard to locate. Record source and timestamp of each observed snapshot.
3. Cross-check the relevant season (2026/27), U11 **girls**, competition, teams, home/away orientation and score. Never use a boys', mixed or older age group's similarly named table as girls' evidence.
4. Prefer explicit match-specific scores. A table change without a published match score is a lead to investigate, **not** authorisation to invent a result.
5. Save match provenance, which publisher confirmed it, source URL and access date. Official screenshots of the relevant girls' grid/table provided by the user may directly verify displayed results and help resolve stale text retrieval.
6. Correct and update the public competition results, standings, remaining fixtures and accompanying commentary when a new score meets this policy. Recalculate title probabilities as a separately validated step; do not display stale probabilities as though they include new results. Keep earlier snapshots for comparison.
7. Separate relevant external girls' form, first-person qualitative reports and opposition analysis from the official scoreboards. Add to the team-form register with source classification.
8. Do **not** write unpublished privately reported scores to the public GitHub repository, including research files.

## Known public source starting points

- GPSFA — Southern Counties Girls' League: https://www.gpsfa.com/cups/berkshire-league/
- GPSFA — National KO: https://www.gpsfa.com/cups/regional-competitons/
- ESFA girls' competitions: https://www.esfa.co.uk/competitions/?view=girls
- Participating district association websites, their official social media pages and match centres, searched by team and fixture.
- St Albans Schools FA: https://x.com/StAlbansSchools
- Kent Schools FA girls' district competition: https://ksfa.org.uk/inter-district/season-26-27/competitions/primary-cup-draws/girls-super-league/
- Brighton Schools U11 girls (participant match reports): https://www.pitchero.com/clubs/brightonschoolsu11/teams/296584
- Wolverhampton Schools FA: https://www.wolverhamptonsfa.org/
- Historical 2025/26 U11 girls: https://sites.google.com/view/slough-schools-fa/home/district-teams/u11-girls-district-team/202526

This list is a **starting directory**, not a closed list. Newly found official association sources can qualify immediately under the same verification rules.

## Current research position — 11 October 2026

- The user's direct GPSFA Girls' League screenshots show **seven** teams, including Wycombe, and explicitly show **Dacorum 1–5 Newbury**; do not confuse this with an earlier incomplete six-team text extraction.
- Previously missing or privately known scores must not be treated as official unless an eligible source publishes them.
- Continue pursuing specific official or participant reports for unresolved National KO Round One ties, and verify remaining historical league scores against their original girls' competition records.
