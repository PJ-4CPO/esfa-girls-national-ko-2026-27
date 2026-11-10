# National KO — V3 Probability Review

Internal audit recorded 10 October 2026. This is **not** public-facing copy.

## Reason for revision
The prior V2 title estimates combined a frozen historical rating with a limited set of verified cup results; a previous V3 attempt was rejected because a custom JavaScript random simulation gave impossible 100% title odds to one side in a fixed-bracket test. V3 was independently recalculated with NumPy PCG64 and checked against a fixed-bracket and changing-opponent scenario. The previous V2 title estimates remain retained under `previous_model_snapshot` in `/data.json`.

## Data
- 44 original entrants; 12 Round One matches and 20 byes.
- Seven Round One scorelines verified against the competition organiser; do not infer missing scores or use privately reported match results.
- 32 remaining entrants are taken from the explicitly recorded Round Two tie list. No eliminated team receives a nonzero chance.
- Historical strength is based **only on documented competition-level past success** in the team's `teams[][3]` category. A lack of documented cup achievement means neutral prior, not proof of weakness.
- Newbury's independent Southern Counties League V4 strength enters at one-quarter of its log-rating to limit transfer across competitions; no league form was invented for other teams.

## Historical evidence and automatic decay
Initial log-strength categories:
- Repeated champions / finalists: +0.63.
- Champion and another deep run: +0.52.
- Champion: +0.45.
- Runner-up / multiple deep runs: +0.32.
- Recent semi-finalist: +0.28.
- Verified quarter-finalist: +0.18.
- No verified deep run: 0.

For each team with `n` **verified current-season cup matches**, historical influence is `historic_log_strength / (1 + n/2)`. After two verified matches, historical evidence has half its initial influence; after four, one-third. Do not count inferred progression as a scored match.

For a verified result, clip home goal difference to -3..+3. Match signal is `0.20×sign(goalDifference)+0.07×clippedGoalDifference`. Subtract `0.25×(historical_home - historical_away)` before attributing `1/3` of the residual to winner and `-1/3` to the other team. This conservative adjustment limits what a single 9–0 result can imply. Team current log strength = decayed historical log strength + residual evidence + optional league transfer. The `current_strengths` dictionary in `/data.json` holds the result for **Round Two active teams**, used for match forecasts as well as title chances.

The scheme is a transparent illustrative rating, **not** a fitted predictive model proven on held-out historical match data. Any future revision should assess alternative hyperparameters against new independent results.

## Tournament forecast
- Actual Round Two pairings are respected.
- Because subsequent round pairings are not yet independently documented, the primary forecasts randomly vary opponents in Rounds Three–Final. This is not a claim about the real bracket's draw method; replace it once the actual bracket is verified.
- For each fixture, cap the home/away strength ratio after a 1.05 home multiplier in [0.45,2.2]; draw independent Poisson scorelines with combined mean 2.8 goals. On a tie, randomly progress a team in proportion to relative strength (illustrative proxy only; official tie-resolution rules not independently verified).
- 100,000 knockout campaigns run using NumPy `default_rng(20261010)` (PCG64). Alternative seed `20261011` produces similar top contenders.
- A separate fixed-adjacent-pairings scenario was also checked with the independent NumPy implementation and produced plausible, non-degenerate outcomes.

## V3 results (percent)
| Side | V3 |
|---|---:|
| Brighton | 11.950 |
| West Kent | 9.725 |
| Liverpool | 9.563 |
| Leeds | 6.542 |
| Sefton | 4.163 |
| Gainsborough | 4.039 |
| Barnsley | 3.967 |
| Wolverhampton | 3.445 |
| Rossendale | 3.177 |
| SE Sussex | 3.158 |
| Afan Nedd | 2.856 |
| Newbury | 2.207 |
| Other 20 remaining teams combined | 35.208 |

32 active teams together total 100%; 12 eliminated teams total 0%.

### Sensitivity
- Fixed-adjacent round progression: Brighton ~11.16%, West Kent ~9.88%, Liverpool ~8.53%; importantly, **not** 100% for SE Sussex.
- Halving historical log priors: Liverpool ~6.63%, Brighton ~6.53%, Leeds ~5.91%, West Kent ~5.80%. Past achievement meaningfully changes estimates, hence automatic decay.
- Removing Newbury's league evidence: its title estimate falls from ~2.21% to roughly 1.8%, all else equal.
- Alternative random seed gives Brighton ~12.22%, West Kent ~9.77%, Liverpool ~9.34%.

## Important limitations and next revision
Only seven confirmed National KO scores, and only one current-season league score individually corroborated. Cup-history tags may relate to earlier squads, not current players. Beyond Round Two the true knockout path needs independent verification; older competition honours must automatically diminish with accumulating verified current-season results. Do not silently introduce privately reported scores. Recompute both match and title probabilities together from the same `current_strengths`. Maintain public football language and keep these mechanics in the research folder.

## V3.1 refresh — 10 November 2026

- The [girls’ draw](https://www.gpsfa.com/cups/regional-competitons/) lists seven Round One scores, twelve Round Two scores, a Round Two bye and eight Round Three pairings. Only the three unresolved Round Two ties are simulated. Their winners fill the specified Round Three slots. The 19 teams with a path to the title receive the model’s title estimates.
- Use the documented V3 rating formula with the current verified scores and the league V4.2 strength for Newbury’s transfer. The published later rounds say SE Essex. Leave SE Sussex’s title status unresolved and transfer no rating or result between the two labels.
- Quarter-final and later opponents are shuffled independently in each campaign because the draw is blank. The [ESFA U11 9-a-side rule](https://www.esfa.co.uk/competitions/rules.asp?id=23) specifies penalties in a tournament knockout section. Its regional tournament format does not establish how this published inter-district bracket resolves a level tie. The model retains the strength-weighted progression proxy without asserting a competition rule.
- Match estimates and title simulations both use a 1.05 home multiplier and a 2.8 total-goal mean. Two 100,000-campaign NumPy PCG64 runs (seeds 20261110 and 20261111) differed by less than one percentage point for each team. Published probabilities sum to 100.00%. The preceding V3.0 snapshot is in commit `ae2ae16`.
