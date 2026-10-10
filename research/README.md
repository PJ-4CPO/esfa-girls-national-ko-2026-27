# Result verification and historical evidence workflow

Created 10 October 2026. These research files are not loaded by either public tracker and do not alter the frozen V2 probabilities.

## Authoritative data
- National KO live display: `/data.json`; research provenance: `/research/national-ko-provenance.json`.
- Southern Counties Girls' League live display: `/southern-counties-league/data.json`; research provenance: `/research/southern-counties-provenance.json`.

## Verification procedure
1. Find an explicit match-specific score published by GPSFA/ESFA or the home/away participating district FA. Capture the original permalink and date observed.
2. Confirm U11 **girls**, competition, season, opponents, home/away order and score. Do not confuse with boys or other age groups.
3. If only third-party coverage exists, seek a second independent credible source before classifying it corroborated. A repost is not independent.
4. Set `source_granularity` to `match_specific` only with a direct match reference; set `independently_rechecked_on` when verified. Preserve earlier evidence instead of overwriting.
5. Publish new scores only after verification and approval. Update standings and model only through a separate reviewed recalculation; never silently recompute frozen V2.
6. For historical strength evidence, add a separate dated record under `historical_evidence` with girls' age group, season, competition, original URL, result, and relevance/transfer caveat. Historical evidence is not itself a current-season score.
7. Do not put privately reported, unconfirmed scorelines into public GitHub files, including research files.

## Sources to check
- National KO: https://www.gpsfa.com/cups/regional-competitons/
- Southern Counties League: https://www.gpsfa.com/cups/berkshire-league/
- ESFA: https://www.esfa.co.uk/competitions/?view=girls
- St Albans Schools FA: https://x.com/StAlbansSchools
- Slough historical U11 girls: https://sites.google.com/view/slough-schools-fa/home/district-teams/u11-girls-district-team/202526

## Current backlog
- Recheck original match-specific sources for all 12 existing published scores.
- Seek original primary sources for five National KO Round One ties without published scores.
- Check participating district girls' results for any newer Southern Counties matches.
- Build a separate historical girls' results register before reviewing any strength model changes.
