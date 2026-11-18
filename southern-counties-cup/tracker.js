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

// Use the existing tracker assumptions for expected goals, home edge and draw resolution.
function matchProbabilities(homeRating, awayRating, homeAdvantage) {
  const ratio = Math.max(0.45, Math.min(2.2, homeRating / awayRating * homeAdvantage));
  const homeMean = 2.8 * ratio / (1 + ratio);
  const awayMean = 2.8 / (1 + ratio);
  function goalProbabilities(mean) {
    const probabilities = [Math.exp(-mean)];
    for (let goals = 1; goals <= 18; goals++) {
      probabilities.push(probabilities[goals - 1] * mean / goals);
    }
    return probabilities;
  }
  const homeGoals = goalProbabilities(homeMean);
  const awayGoals = goalProbabilities(awayMean);
  let win = 0, draw = 0, loss = 0;
  for (const [home, h] of homeGoals.entries()) {
    for (const [away, a] of awayGoals.entries()) {
      if (home > away) win += h * a;
      else if (home === away) draw += h * a;
      else loss += h * a;
    }
  }
  const total = win + draw + loss;
  return {
    normalTime: [win / total, draw / total, loss / total],
    homeAdvances: (win + draw * homeRating / (homeRating + awayRating)) / total
  };
}

function calculateForecast(rounds, ratings) {
  const outcomes = new Map();
  const matches = new Map();
  const newburyStages = [];
  for (const round of rounds) {
    let newburyReachesRound = 0;
    for (const tie of round.ties) {
      const entrants = side => typeof side === 'string'
        ? new Map([[side, 1]]) : outcomes.get(side.winnerOf);
      const home = entrants(tie.home);
      const away = entrants(tie.away);
      newburyReachesRound += (home.get('Newbury') ?? 0) + (away.get('Newbury') ?? 0);
      if (tie.result?.winner) {
        outcomes.set(tie.id, new Map([[tie.result.winner, 1]]));
        continue;
      }
      const winners = new Map();
      const advantage = round.venue ? 1 : 1.05;
      for (const [h, hChance] of home) {
        for (const [a, aChance] of away) {
          const match = matchProbabilities(ratings.get(h) ?? 1, ratings.get(a) ?? 1, advantage);
          const pairing = hChance * aChance;
          winners.set(h, (winners.get(h) ?? 0) + pairing * match.homeAdvances);
          winners.set(a, (winners.get(a) ?? 0) + pairing * (1 - match.homeAdvances));
          if (home.size === 1 && away.size === 1) matches.set(tie.id, match);
        }
      }
      outcomes.set(tie.id, winners);
    }
    newburyStages.push(newburyReachesRound);
  }
  return { matches, newburyStages, title: outcomes.get('F') };
}

const percent = chance => (chance * 100).toFixed(1) + '%';

function showMatchForecast(row, match) {
  const forecast = add(row, 'div', '', 'cup-forecast');
  const labels = ['Home win', 'Draw', 'Away win'];
  match.normalTime.forEach((chance, i) => add(forecast, 'span', labels[i] + ' ' + percent(chance)));
  add(row, 'small', 'To advance · Home ' + percent(match.homeAdvances) + ' · Away ' + percent(1 - match.homeAdvances));
}

function showTournamentForecast(rounds, forecast) {
  const milestones = document.getElementById('newbury-probabilities');
  const values = forecast.newburyStages.slice(1).map((chance, i) => ['Reach ' + rounds[i + 1].name.toLowerCase(), chance]);
  values.push(['Win the cup', forecast.title.get('Newbury') ?? 0]);
  for (const [label, chance] of values) {
    const item = add(milestones, 'span', label + ' ');
    add(item, 'strong', percent(chance));
  }

  const teams = new Set(rounds.flatMap(round => round.ties.flatMap(tie => [tie.home, tie.away]))
    .filter(side => typeof side === 'string'));
  const standings = [...teams].map(name => [name, forecast.title.get(name) ?? 0])
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const chart = document.getElementById('cup-probabilities');
  const max = standings[0][1];
  for (const [i, [name, chance]] of standings.entries()) {
    const row = add(chart, 'div', '', 'bar');
    add(row, 'span', String(i + 1), 'bar-rank');
    add(row, 'span', name, 'bar-team');
    const track = add(row, 'span', '', 'track');
    add(track, 'span', '', 'fill').style.width = (100 * chance / max) + '%';
    add(row, 'strong', percent(chance));
  }
  document.getElementById('title-forecast').hidden = false;
}

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error('Data unavailable');
  return response.json();
}

async function showDraw() {
  const { rounds, checkedOn } = await loadJson('data.json');
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
  const matchRows = new Map();
  for (const round of rounds) {
    const section = add(draw, 'section', '', 'cup-round');
    add(section, 'h3', round.name);
    add(section, 'p', [dateLabel(round.date), round.venue].filter(Boolean).join(' · '), 'muted');
    for (const tie of round.ties) {
      const home = sideLabel(tie.home);
      const away = sideLabel(tie.away);
      const newbury = [home, away].includes('Newbury');
      const row = add(section, 'div', '', newbury ? 'cup-tie cup-tie--newbury' : 'cup-tie');
      matchRows.set(tie.id, row);
      const { result } = tie;
      const hasScore = Number.isInteger(result?.homeScore) && Number.isInteger(result?.awayScore);
      const score = hasScore ? result.homeScore + '–' + result.awayScore : 'v';
      add(row, 'span', home);
      add(row, 'strong', score);
      add(row, 'span', away);
      const progression = result?.winner ? result.winner + (tie.id === 'F' ? ' won the cup' : ' advance') : '';
      const detail = [
        tie.id, tie.date ? dateLabel(tie.date) : '', tie.kickoff, tie.venue, result?.note, progression
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
  document.getElementById('checked-on').textContent = ' · checked ' + dateLabel(checkedOn);
  loadStatus.hidden = true;

  try {
    const [league, leagueCup] = await Promise.all([
      loadJson('../southern-counties-league/data.json'),
      loadJson('../southern-counties-league-cup/data.json')
    ]);
    const ratings = new Map(leagueCup.teams.map(team => [team.name, team.rating]));
    for (const [name, , rating] of league.strengths) ratings.set(name, rating);
    if ([...ratings.values()].some(rating => !Number.isFinite(rating) || rating <= 0)) {
      throw new Error('Invalid team rating');
    }
    const forecast = calculateForecast(rounds, ratings);
    for (const [id, match] of forecast.matches) showMatchForecast(matchRows.get(id), match);
    showTournamentForecast(rounds, forecast);
  } catch {
    add(document.getElementById('newbury-probabilities'), 'span', 'Forecasts are temporarily unavailable.');
  }
}

showDraw().catch(() => {
  loadStatus.textContent = 'The draw could not be loaded. See the GPSFA source below.';
});
