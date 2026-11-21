(() => {
  const formatDate = value => new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
  }).format(new Date(value + 'T12:00:00Z'));
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
    return { title: 'Season calendar', summary: monthLabel, mode: 'Calendar phase', stages, active, earlier: 'Earlier period' };
  }
  function describe(kind, data, now) {
    if (kind === 'league' || kind === 'fixtures') return calendar(now);
    if (kind === 'national') {
      const rounds = [data.fixtures, data.round2, data.round3];
      const active = rounds.reduce((index, ties, i) => ties?.length ? i : index, 0);
      return { title: 'Tournament journey', summary: ['Round One', 'Round Two', 'Round Three'][active] + ' draw published',
        mode: 'Latest published draw', active, earlier: 'Earlier round',
        stages: [
          { label: 'Round One', detail: 'Opening ties' }, { label: 'Round Two', detail: 'Last 32' },
          { label: 'Round Three', detail: 'Last 16' }, { label: 'Quarter-finals', detail: 'Last 8' },
          { label: 'Semi-finals', detail: 'Last 4' }, { label: 'Final', detail: 'Last 2' },
          { label: 'Champion', detail: 'Cup winner', symbol: '★' }
        ] };
    }
    if (kind === 'counties-cup') {
      let active = data.rounds.findIndex(round => round.ties.some(tie => !tie.result?.winner));
      const complete = active < 0;
      if (complete) active = data.rounds.length;
      return { title: 'Tournament journey', summary: complete ? 'Cup complete' : data.rounds[active].name + ' · ' + formatDate(data.rounds[active].date),
        mode: complete ? 'Completed' : 'Current round in the draw', active, earlier: 'Complete',
        stages: [...data.rounds.map(round => ({ label: round.name, detail: formatDate(round.date) })),
          { label: 'Champion', detail: 'Cup winner', symbol: '★' }] };
    }
    if (kind === 'league-cup') {
      const completed = data.fixtures.length > 0 && data.fixtures.every(match =>
        Number.isInteger(match.score?.home) && Number.isInteger(match.score?.away));
      return { title: 'Tournament journey', summary: completed ? 'Regional tournament complete · Finals ' + formatDate(data.finals.date) : 'Regional tournament',
        mode: completed ? 'Next stage' : 'Current stage', active: completed ? 1 : 0, earlier: 'Complete',
        stages: [
          { label: 'Regional tournament', detail: formatDate(data.state.tournament_date) },
          { label: 'Girls’ finals', detail: formatDate(data.finals.date) },
          { label: 'Trophies decided', detail: 'Champions · Intermediate · Plate', symbol: '★' }
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
      const item = add(list, 'li', '', i === view.active ? 'is-current' : i < view.active ? 'is-earlier' : '');
      if (i === view.active) item.setAttribute('aria-current', 'step');
      add(item, 'span', stage.symbol ?? String(i + 1), 'progress-marker');
      const words = add(item, 'span', '', 'progress-label');
      add(words, 'strong', stage.label);
      add(words, 'small', stage.detail);
      add(words, 'small', i === view.active ? view.mode : i < view.active ? view.earlier : 'Ahead', 'progress-stage-status');
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
