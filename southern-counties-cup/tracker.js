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
  for (const [roundIndex, round] of rounds.entries()) {
    const section = document.createElement('section');
    section.className = 'model cup-round';
    section.id = 'cup-round-' + roundIndex;
    draw.before(section);
    const heading = add(section, 'div', '', 'section-title stacked-heading');
    add(heading, 'span', round.ties.length + (round.ties.length === 1 ? ' TIE' : ' TIES'), 'section-kicker');
    add(heading, 'h2', round.name + ' fixtures & results');
    add(section, 'p', [dateLabel(round.date), round.venue].filter(Boolean).join(' · '), 'muted');
    const fixtures = add(section, 'div', '', 'fixtures');
    for (const tie of round.ties) {
      const home = sideLabel(tie.home), away = sideLabel(tie.away), result = tie.result;
      const scored = Number.isInteger(result?.homeScore) && Number.isInteger(result?.awayScore);
      const advanced = !scored && Boolean(result?.winner);
      const card = add(fixtures, 'div', '', 'fixture' + (scored || advanced ? ' complete' : ''));
      const outcome = MatchOutcome.classify(home, away, scored ? result.homeScore : null, scored ? result.awayScore : null, result?.winner);
      MatchOutcome.decorate(card, outcome);
      if (advanced) card.title = result.type === 'forfeit' ? 'Forfeit' : result.type === 'awarded' ? 'Awarded' : 'Assumed awarded';
      function addTeam(name, state, position) {
        const holder = document.createElement('div');
        holder.innerHTML = MatchOutcome.team(name, state, position);
        card.append(holder.firstElementChild);
      }
      addTeam(home, outcome.home, 'home');
      const middle = add(card, 'span', '', 'mid');
      if (advanced) {
        const badge = add(middle, 'strong', '', 'score advancement-score');
        badge.setAttribute('aria-label', result.winner + ' advanced');
        for (const name of [home, away]) add(badge, 'span', name === result.winner ? 'A' : '—', name === result.winner ? 'advanced-team' : 'no-score');
      } else add(middle, 'strong', scored ? result.homeScore + '–' + result.awayScore : 'VS', scored ? 'score' : 'vs');
      add(middle, 'small', scored ? 'FINAL' : advanced ? '' : 'SCHEDULED');
      if (!advanced) {
        const detail = [tie.date ? dateLabel(tie.date) : '', tie.venue].filter(Boolean).join(' · ');
        if (detail) add(middle, 'small', detail, 'match-date');
      }
      addTeam(away, outcome.away, 'away');
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

