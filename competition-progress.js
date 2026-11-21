(() => {
  const formatDate = value => new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
  }).format(new Date(value + 'T12:00:00Z'));
  function roundDate(stage) {
    if (stage.matchDate) return formatDate(stage.matchDate);
    if (stage.playBy) return 'Play by ' + formatDate(stage.playBy);
    return 'Date TBC';
  }
  function calendar(now) {
    const year = now.getUTCFullYear(), month = now.getUTCMonth();
    const seasonYear = 2026;
    const stages = [
      { label: 'Autumn', detail: 'Sep–Nov 2026', start: Date.UTC(seasonYear, 8, 1) },
      { label: 'Winter', detail: 'Dec 2026–Feb 2027', start: Date.UTC(seasonYear, 11, 1) },
      { label: 'Spring', detail: 'Mar–May 2027', start: Date.UTC(seasonYear + 1, 2, 1) }
    ];
    const active = stages.reduce((index, stage, i) => now.getTime() >= stage.start ? i : index, 0);
    const monthLabel = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'Europe/London' }).format(now);
    return { title: 'Season calendar', summary: monthLabel, mode: 'Calendar phase', stages: stages.map((stage, i) => ({ ...stage, complete: i < active })), active, earlier: 'Earlier period' };
  }
  function describe(kind, data, now) {
    if (kind === 'league' || kind === 'fixtures') return calendar(now);
    if (kind === 'national') {
      const rounds = [data.fixtures, data.round2, data.round3];
      const dates = data.round_dates ?? {};
      const stageDate = key => roundDate(dates[key] ?? {});
      const active = rounds.reduce((index, ties, i) => ties?.length ? i : index, 0);
      return { title: 'Tournament journey', summary: ['Round One', 'Round Two', 'Round Three'][active] + ' draw published',
        mode: 'Latest published draw', active, earlier: 'Earlier round',
        stages: [
          { label: 'Round One', detail: 'Opening ties · ' + stageDate('round1'), complete: data.fixtures.length > 0 && data.fixtures.every(tie => ['Complete', 'Forfeit'].includes(tie[4])) }, { label: 'Round Two', detail: 'Last 32 · ' + stageDate('round2'), complete: data.round2.length > 0 && data.round2.every(tie => Number.isInteger(tie[3]) || tie[5]?.winner || tie[2] === 'Bye') },
          { label: 'Round Three', detail: 'Last 16 · ' + stageDate('round3'), complete: data.round3.length > 0 && data.round3.every(tie => Number.isInteger(tie[3]) || tie[5]?.winner || tie[2] === 'Bye') }, { label: 'Quarter-finals', detail: 'Last 8 · ' + stageDate('quarterFinals') },
          { label: 'Semi-finals', detail: 'Last 4 · ' + stageDate('semiFinals') }, { label: 'Final', detail: 'Last 2 · ' + stageDate('final') },
          { label: 'Champion', detail: 'Cup winner', symbol: '★' }
        ] };
    }
    if (kind === 'counties-cup') {
      let active = data.rounds.findIndex(round => round.ties.some(tie => !tie.result?.winner));
      const complete = active < 0;
      if (complete) active = data.rounds.length;
      return { title: 'Tournament journey', summary: complete ? 'Cup complete' : data.rounds[active].name + ' · ' + formatDate(data.rounds[active].date),
        mode: complete ? 'Completed' : 'Current round in the draw', active, earlier: 'Complete',
        stages: [...data.rounds.map(round => ({ label: round.name, detail: [roundDate(round.playBy ? { playBy: round.playBy } : { matchDate: round.date }), round.venue].filter(Boolean).join(' · '), complete: round.ties.every(tie => Boolean(tie.result?.winner)) })),
          { label: 'Champion', detail: 'Cup winner', symbol: '★', complete }] };
    }
    if (kind === 'league-cup') {
      const completed = data.fixtures.length > 0 && data.fixtures.every(match =>
        Number.isInteger(match.score?.home) && Number.isInteger(match.score?.away));
      return { title: 'Tournament journey', summary: completed ? 'Regional tournament complete · Finals ' + formatDate(data.finals.date) : 'Regional tournament',
        mode: completed ? 'Next stage' : 'Current stage', active: completed ? 1 : 0, earlier: 'Complete',
        stages: [
          { label: 'Regional tournament', detail: formatDate(data.state.tournament_date), complete: completed },
          { label: 'Girls’ finals', detail: formatDate(data.finals.date) + ' · Woking / Bath / Oxford' },
          { label: 'Trophies decided', detail: formatDate(data.finals.date), symbol: '★' }
        ] };
    }
    throw new Error('Unknown competition');
  }
  function render(panel, view) {
    panel.textContent = '';
    const add = (parent, tag, content, className) => {
      const element = document.createElement(tag);
      element.textContent = content;
      if (className) element.className = className;
      parent.appendChild(element);
      return element;
    };
    add(panel, 'h2', view.title);
    add(panel, 'p', view.summary, 'progress-summary');
    add(panel, 'p', view.mode, 'progress-mode');
    const list = add(panel, 'ol', '', 'progress-stages');
    for (const [i, stage] of view.stages.entries()) {
      const item = add(list, 'li', '', [i === view.active ? 'is-current' : i < view.active ? 'is-earlier' : '', stage.complete ? 'is-complete' : ''].filter(Boolean).join(' '));
      if (i === view.active) item.setAttribute('aria-current', 'step');
      add(item, 'span', stage.complete ? '✓' : stage.symbol ?? String(i + 1), 'progress-marker');
      const words = add(item, 'span', '', 'progress-label');
      add(words, 'strong', stage.label);
      add(words, 'small', stage.detail);
      add(words, 'small', stage.complete ? 'Completed' : i === view.active ? view.mode : i < view.active ? view.earlier : 'Ahead', 'progress-stage-status');
    }
  }
  for (const panel of document.querySelectorAll('[data-competition-progress]')) {
    const kind = panel.dataset.competitionProgress;
    if (kind === 'league' || kind === 'fixtures') render(panel, describe(kind, null, new Date()));
    else fetch(panel.dataset.progressFeed, { cache: 'no-cache' })
      .then(response => { if (!response.ok) throw new Error('Progress unavailable'); return response.json(); })
      .then(data => render(panel, describe(kind, data, new Date())))
      .catch(() => { panel.hidden = true; });
  }
})();
