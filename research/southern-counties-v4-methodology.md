# Southern Counties Girls' League — V4 Forecast Audit
Checked 10 October 2026. Internal methodology: **not a public-facing football article**.

## Why V3 was revised
V3 retained old base ratings of Newbury 1.64 vs St Albans 1.20, which gave Newbury a 37% advantage before adding the recovered 2025/26 league evidence. These ratings were not sufficiently justified by the prior-season league table (St Albans 28 points, +13; Newbury 27 points, +9). The V4 title forecast uses **no inherited V3 starting rating**. V4 preserves five existing recorded scores and the seven-team, 42-match format. Neither privately reported unconfirmed match score was introduced.

## Input status
- 2025/26 U11 girls final table: independently recorded by Slough Schools FA at https://sites.google.com/view/slough-schools-fa/home/district-teams/u11-girls-district-team/202526. Prior season involved different cohorts and some different associations.
- 2026/27 results: five already displayed by tracker. Four of five still lack independently confirmed, match-specific public sources. This material limitation requires sensitivity analysis.
- Reigate & Banstead v Newbury 4–1: public coach report, see `southern-counties-provenance.json`.
- Newbury v Dacorum and the unscored National KO Newbury v Oxford: private reports **not** used.

## Strength calculation
For each team with historical data, let P be last year's points per game, G be last year's goal difference per game, and Pmean be the mean P across all seven teams in the published 2025/26 final table. The historical log-rating prior is:

`prior = historicalWeight × (0.30 × (P - Pmean) + 0.18 × G / 1.5)`.

Missing historical team records (Dacorum, Wycombe) get a neutral prior of zero; this is **missing evidence, not proof of average ability**.

Each current-season match contributes an oriented observed signal:
`0.35 × sign(goalDifference) + 0.12 × clamp(goalDifference, -3, 3)`.
The cap prevents isolated 6–0 or 9–0 results from overwhelming the ratings.

Opponent-adjusted residual is `observedSignal - 0.48 × (priorHome - priorAway)`, credited positively to home and negatively to away. For a team with N recorded fixtures:
`rawLogRating = prior + currentWeight × sum(residuals) / (N + 2.5)`.

Default historicalWeight=1, currentWeight=1. The +2.5 denominator regularises small samples. Ratings are centred at the average log rating and exponentiated.

## Season forecast
- Seven teams, each plays every other team home and away = 42 fixtures. Five existing results are fixed; **37** ordered pairings are simulated.
- Goals are generated independently with Poisson distributions. Total expected goals per game = 2.8. Home strength is multiplied by 1.05 before the strength ratio is capped in [0.45, 2.2]. These are illustrative assumptions, not estimates fitted from a sufficient 2026/27 sample.
- Points use the known 3 win / 2 draw / 1 loss system.
- If multiple teams finish jointly top on points, each receives an equal fraction of that simulation's title credit because the official championship tie-break was **not verified**. Goal difference is not assumed to be the official tie-break.
- 100,000 simulated seasons, Mulberry32 pseudorandom generator with fixed seed 20261010. Validation included repeating the same seed and checking a second independent seed (20261011), all 37 remaining pairings, nonnegative probability values and total 100%.

## Validated probability estimates

| Team | Previous V3 | Revised V4 |
|---|---:|---:|
| St Albans | 23.94% | 29.77% |
| Dacorum | 17.06% | 21.95% |
| Reigate & Banstead | 15.25% | 19.67% |
| Newbury | 26.86% | 13.28% |
| Woking | 15.96% | 12.97% |
| Wycombe | 0.67% | 2.25% |
| Gloucester | 0.26% | 0.11% |

The second seed produced St Albans 29.76%, Dacorum 21.86%, Reigate & Banstead 19.91%, Newbury 13.15%; sampling variation was small.

## Sensitivity (40,000 runs per scenario)
Current-heavy (historical weight 0.5, current weight 1.5): Reigate & Banstead 28.59%, Dacorum 27.55%, St Albans 24.23%, Newbury 8.30%.
History-heavy (historical weight 1.5, current weight 0.7): St Albans 35.02%, Dacorum 17.69%, Newbury 17.29%, Reigate & Banstead 12.32%.
No prior-season history: Dacorum 28.74%, Reigate & Banstead 27.83%, St Albans 21.61%, Newbury 8.56%.

**Interpretation:** St Albans ranks ahead of Newbury under each tested weighting where last year's evidence is included, but the precise probabilities and positions of teams such as Dacorum and Reigate vary materially. Avoid excessive confidence.

## Future work
Confirm the four source-unverified current-season scorelines; verify league roster includes Wycombe; obtain official title tie-breaks. Recalculate only after source verification and preserve previous estimates for comparison. Keep methodology technical details out of public copy.

## Seasonal weighting policy for future revisions (adopted 10 October 2026)
As independent match-specific results become available, gradually decrease the 2025/26 historical prior rather than carrying its full starting weight throughout 2026/27. At the next recalculation, use a documented shrinkage factor such as `historical_prior/(1+verified_current_matches/2)` **per team**, so two independently verified current-season matches halve the historical influence, and four reduce it to one-third. Re-test the discount against emerging results before deployment; preserve V4 as a comparable baseline. Do **not** alter the current published V4 percentages simply by editing metadata. A result previously listed on the tracker but not independently verified should not count toward the verified-results decay until its source has been checked.
