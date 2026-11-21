const loadStatus = document.getElementById('load-status');
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});

function add(parent, tag, label, className) {
  const element = document.createElement(tag);
  element.textContent = label;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error('Data unavailable');
  return response.json();
}

async function showDraw() {
  const { rounds } = await loadJson('data.json');
  const ties = new Map(rounds.flatMap(round => round.ties.map(tie => [tie.id, tie])));
  const dateLabel = date => dateFormat.format(new Date(date));

  function sideLabel(side) {
    if (typeof side === 'string') return side;
    const feeder = ties.get(side.winnerOf);
    if (feeder.result?.winner) return feeder.result.winner;
    if (feeder.id.startsWith('R1-')) return 'Winner of ' + feeder.home + ' v ' + feeder.away;
    return 'Winner of ' + feeder.id;
  }

  const draw = document.getElementById('cup-rounds');
  for (const round of rounds) {
    const section = add(draw, 'section', '', 'cup-round');
    add(section, 'h3', round.name);
    add(section, 'p', [dateLabel(round.date), round.venue].filter(Boolean).join(' · '), 'muted');
    for (const tie of round.ties) {
      const home = sideLabel(tie.home);
      const away = sideLabel(tie.away);
      const newbury = [home, away].includes('Newbury');
      const row = add(section, 'div', '', newbury ? 'cup-tie cup-tie--newbury' : 'cup-tie');
      const { result } = tie;
      const hasScore = Number.isInteger(result?.homeScore) && Number.isInteger(result?.awayScore);
      const score = hasScore ? result.homeScore + '–' + result.awayScore : result?.winner ? '→' : 'v';
      add(row, 'span', home);
      if (result?.winner && !hasScore) {
        const outcome = add(row, 'div', '', 'advancement-result');
        const badge = add(outcome, 'strong', '', 'score advancement-score');
        badge.setAttribute('aria-label', result.winner + ' advanced');
        for (const name of [home, away]) add(badge, 'span', name === result.winner ? 'A' : '—', name === result.winner ? 'advanced-team' : 'no-score');
        add(outcome, 'small', 'Advanced', 'advancement-label');
      } else add(row, 'strong', score);
      add(row, 'span', away);
      const progression = result?.winner ? result.winner + (tie.id === 'F' ? ' won the cup' : ' advance') : '';
      const detail = [
        tie.id, tie.date ? dateLabel(tie.date) : '', tie.kickoff, tie.venue, result?.note, result?.winner && !hasScore ? (result.type === 'forfeit' ? 'Forfeit' : result.type === 'awarded' ? 'Awarded' : 'Assumed awarded') : '', progression
      ].filter(Boolean);
      add(row, 'small', detail.join(' · '));
    }
  }

  const newburyRoute = rounds.flatMap(round => round.ties
    .filter(tie => [sideLabel(tie.home), sideLabel(tie.away)].includes('Newbury'))
    .map(tie => ({ round, tie })));
  const { round, tie } = newburyRoute.at(-1);
  document.getElementById('newbury-heading').textContent = sideLabel(tie.home) + ' v ' + sideLabel(tie.away);
  const matchDate = dateLabel(tie.date ?? round.date);
  let pathway = round.name + ' · ' + matchDate + '.';
  if (tie.result?.winner) {
    pathway += tie.id === 'F' ? ' ' + tie.result.winner + ' won the cup.' : ' ' + tie.result.winner + ' advance.';
  } else if (tie.id === 'R1-1') {
    pathway += ' The winner plays away against ' + sideLabel(ties.get('QF-3').home) + ' in the quarter-finals.';
  }
  document.getElementById('newbury-path').textContent = pathway;
  loadStatus.hidden = true;


}

showDraw().catch(() => {
  loadStatus.textContent = 'The draw could not be loaded. Please refresh the page.';
});
