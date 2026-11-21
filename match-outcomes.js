(() => {
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function classify(home, away, homeScore, awayScore, advancingTeam) {
    const scored = Number.isInteger(homeScore) && Number.isInteger(awayScore);
    const winner = advancingTeam || (scored && homeScore !== awayScore ? (homeScore > awayScore ? home : away) : null);
    const draw = scored && !winner;
    const side = name => winner ? name === winner ? 'win' : 'loss' : draw ? 'draw' : null;
    return { winner, draw, scored, home: side(home), away: side(away),
      newbury: home === 'Newbury' ? side(home) : away === 'Newbury' ? side(away) : null };
  }
  function team(name, outcome, position = '') {
    const label = outcome === 'win' ? ' · Winner' : outcome === 'loss' ? ' · Losing team' : outcome === 'draw' ? ' · Draw' : '';
    return '<span class="team ' + position + (outcome ? ' outcome-team team-' + outcome : '') + '" aria-label="' + safe(name + label) + '">' + safe(name) + '</span>';
  }
  function decorate(card, outcome) {
    card.classList.add('outcome-card');
    if (outcome.home) card.classList.add('home-' + outcome.home);
    if (outcome.away) card.classList.add('away-' + outcome.away);
    if (outcome.draw) card.classList.add('match-draw');
    if (outcome.newbury) card.classList.add('outcome-' + outcome.newbury);
  }
  window.MatchOutcome = { classify, team, decorate };
})();
