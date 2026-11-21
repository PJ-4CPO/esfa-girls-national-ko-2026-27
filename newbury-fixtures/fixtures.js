(() => {
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const format = (date, options) => new Intl.DateTimeFormat('en-GB', {...options, timeZone:'UTC'}).format(new Date(date + 'T12:00:00Z'));
  const today = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/London', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
  const resolved = x => ['completed','advanced'].includes(x.status);
  const chronological = (a,b) => (a.date ?? '9999').localeCompare(b.date ?? '9999') || (a.time ?? '').localeCompare(b.time ?? '');
  let entries = [], view = 'upcoming';
  const root = document.getElementById('timeline');
  function status(x) {
    if (x.status === 'completed') return x.home_score + '–' + x.away_score;
    if (x.status === 'postponed') return 'Postponed';
    if (x.date && x.date < today && x.status === 'scheduled') return 'Result pending';
    return ({advanced:'Advanced',scheduled:'Scheduled',tentative:'Date unconfirmed',provisional:'Projected',conditional:'Conditional',result_pending:'Result pending'})[x.status] ?? 'TBC';
  }
  function render() {
    root.textContent = '';
    const selected = entries.filter(x => view === 'all' || (view === 'results' ? resolved(x) : !resolved(x)));
    const upcomingOrder = x => x.status === 'postponed' ? 2 : !x.date ? 1 : 0;
    selected.sort(view === 'upcoming' ? (a,b) => upcomingOrder(a)-upcomingOrder(b) || chronological(a,b) : view === 'results' ? (a,b) => (b.date ?? '').localeCompare(a.date ?? '') || (b.time ?? '').localeCompare(a.time ?? '') : chronological);
    let group = '';
    for (const x of selected) {
      const heading = !x.date ? resolved(x) ? 'Undated results & advancement' : 'Date to be confirmed' : view === 'upcoming' && x.status === 'postponed' ? 'Postponed · Awaiting new date' : format(x.date,{month:'long',year:'numeric'});
      if (heading !== group) {
        group = heading; const h = document.createElement('h3'); h.className = 'group-label'; h.textContent = heading; root.append(h);
      }
      const advanced = x.status === 'advanced' && x.winner;
      const outcome = MatchOutcome.classify(x.home,x.away,x.status==='completed'?x.home_score:null,x.status==='completed'?x.away_score:null,advanced?x.winner:null);
      const colour = outcome.newbury ? 'outcome-'+outcome.newbury : x.status==='postponed' ? 'outcome-postponed' : 'outcome-scheduled';
      const resultLabel = {win:'Win',loss:'Loss',draw:'Draw'}[outcome.newbury] ?? '';
      const advance = advanced ? '<strong class="score advancement-score" aria-label="'+safe(x.winner)+' advanced">'+[x.home,x.away].map(name=>'<span>'+(name===x.winner?'A':'—')+'</span>').join('')+'</strong>' : '';
      // Keep operational details, omit repeated provenance descriptions.
      const note = x.status==='postponed' ? 'Rearranged date to be confirmed' : x.status==='tentative' ? x.note : x.id==='NB-22' ? 'Champions Trophy · Woking · Match times TBC' : '';
      const row = document.createElement('article'); row.className='match-row '+colour; row.dataset.matchId=x.id;
      row.innerHTML='<div class="match-date">'+safe(x.date ? format(x.date,{day:'numeric',month:'short',year:'numeric'}) : 'Date TBC')+(x.time?'<div class="match-time">'+safe(x.time)+' kickoff</div>':'')+'</div><div><div class="match-meta">'+safe(x.competition)+'</div><div class="match-teams">'+safe(x.home)+' v '+safe(x.away)+'</div>'+(note?'<div class="match-note">'+safe(note)+'</div>':'')+'</div><div class="match-status">'+(advanced?advance:'<strong class="'+(x.status==='completed'?'score':'')+'">'+safe(status(x))+'</strong>'+(resultLabel?'<small class="outcome-label">'+resultLabel+'</small>':''))+'</div>';
      root.append(row);
    }
    if (!selected.length) root.textContent='No matches in this view.';
  }
  function renderNext() {
    const nextRoot = document.getElementById('next-matches-list');
    nextRoot.textContent = '';
    const nextDate = x => x.date ?? x.expected_date ?? x.play_by ?? '9999';
    const matches = entries.filter(x => !resolved(x) && x.status !== 'postponed' && x.status !== 'provisional' && nextDate(x) >= today)
      .sort((a,b) => nextDate(a).localeCompare(nextDate(b)) || (a.time ?? '').localeCompare(b.time ?? '')).slice(0,3);
    for (const x of matches) {
      const date = x.date ? format(x.date,{day:'numeric',month:'short'}) + (x.time ? ' · '+x.time : '') : x.expected_date ? 'Expected '+format(x.expected_date,{day:'numeric',month:'short'})+' · Date unconfirmed' : x.play_by ? 'Play by '+format(x.play_by,{day:'numeric',month:'short'})+' · Date unconfirmed' : 'Date to be confirmed';
      const item=document.createElement('article');
      item.className='next-match';
      item.innerHTML='<p class="next-date">'+safe(date)+'</p><h3>'+safe(x.home)+' v '+safe(x.away)+'</h3><p class="next-competition">'+safe(x.competition)+'</p>';
      nextRoot.append(item);
    }
    if (!matches.length) nextRoot.textContent='No upcoming matches are currently listed.';
  }
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
    view=button.dataset.view;
    document.querySelectorAll('[data-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    render();
  }));
  fetch('data.json?v=20261121-mobile').then(r=>{if(!r.ok)throw Error('Fixtures unavailable');return r.json()}).then(data=>{
    entries=data.entries;
    renderNext();
    document.getElementById('completed').textContent=entries.filter(x=>x.status==='completed').length;
    document.getElementById('future').textContent=entries.filter(x=>['scheduled','tentative','provisional','conditional'].includes(x.status)).length;
    document.getElementById('competitions').textContent=new Set(entries.map(x=>x.competition)).size;
    render();
  }).catch(()=>{root.textContent='The fixture list could not be loaded. Please refresh the page.';document.getElementById('next-matches-list').textContent='Next matches could not be loaded. Please refresh the page.';});
})();
