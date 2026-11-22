# Built-in question assistant

The assistant reads the same five public JSON feeds as the tracker. All arithmetic runs in the browser; it does not call an AI provider, store conversations, or send questions to a server. It supports a defined set of question patterns rather than unrestricted conversation.

Newbury's chronological entries are the single source for its matches, including competition, dates and results. Its appearances in other feeds are excluded from aggregation. Other teams use available match-level records; regional standings without scorelines are not reconstructed into invented matches. Their answers explicitly describe recorded-scoreline coverage.

Only numeric scores on completed matches contribute to wins, draws, losses, goals, clean sheets and margins. Awarded ties are separate advancements. Scheduled, tentative and postponed fixtures do not contribute. Biggest win/defeat uses goal margin and returns ties. Highest-scoring match uses combined goals.

Upcoming answers omit past scheduled dates, flag earlier fixtures with missing results, and distinguish expected from confirmed dates. Cup deadlines remain deadlines. Later draw stages are not proof of completed matches.

Routine updates require no assistant changes: it reads current JSON on its first question after a page load. Failed loads are not cached; another question retries.

Calculation regression checks: `node --test tests/ask-tracker.test.cjs`.
