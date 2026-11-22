/* Shared, deterministic answers from public tracker feeds. No remote AI service. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TrackerAnswers = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const pages = {national:'national-ko/',league:'southern-counties-league/',leagueCup:'southern-counties-league-cup/',cup:'southern-counties-cup/',sevens:'newbury-fixtures/'};
  const labels = {national:'National Cup',league:'Counties League',leagueCup:'League Cup',cup:'Counties Cup',sevens:'Sevens Cup'};
  const clean = s => String(s || '').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const canonical = s => ({'oxford city':'Oxford','high wycombe':'Wycombe','reigate':'Reigate & Banstead','st. albans':'St Albans'}[String(s).toLowerCase()] || s);
  const scored = m => Number.isInteger(m.hs) && Number.isInteger(m.as) && m.status === 'completed';
  function comp(text) {
    const q=clean(text);
    if (/sevens|seven|7 a side|7s/.test(q)) return 'sevens';
    if (/league cup|champions trophy|intermediate|plate/.test(q)) return 'leagueCup';
    if (/national|knockout|knock out|esfa/.test(q)) return 'national';
    if (/count(?:y|ies) cup|southern counties.*cup/.test(q)) return 'cup';
    if (/league/.test(q)) return 'league';
    if (/southern counties girls cup/.test(q)) return 'cup';
    return null;
  }
  function build(feeds) {
    const [nb,national,league,lc,cup] = feeds;
    const matches=[];
    function add(m,primary=false) {
      m.home=canonical(m.home);m.away=canonical(m.away);
      // Newbury's chronological feed is authoritative for its matches and dates.
      if (!primary && [m.home,m.away].includes('Newbury')) return;
      matches.push(m);
    }
    for (const m of nb.entries) add({id:m.id,home:m.home,away:m.away,hs:m.home_score,as:m.away_score,status:m.status,winner:m.winner,date:m.date,expected:m.expected_date,playBy:m.play_by,event:m.event_name,competition:comp(m.competition)},true);
    for (const r of league.results) add({home:r[0],hs:r[1],as:r[2],away:r[3],date:r[4],status:'completed',competition:'league'});
    for (const r of league.upcoming) add({home:r[0],away:r[1],date:r[2],status:clean(r[3]),competition:'league'});
    for (const r of lc.results) add({home:r.home,away:r.away,hs:r.home_score,as:r.away_score,date:lc.state.tournament_date,status:'completed',competition:'leagueCup'});
    for (const [i,rows] of [national.fixtures,national.round2,national.round3].entries()) {
      for(const r of rows) {
        const a=i===0?{home:r[0],away:r[1],hs:r[2],as:r[3],meta:r[6]||{}}:{home:r[1],away:r[2],hs:r[3],as:r[4],meta:r[5]||{}};
        add({...a,status:Number.isInteger(a.hs)&&Number.isInteger(a.as)?'completed':a.meta.winner?'advanced':'scheduled',winner:a.meta.winner,competition:'national',round:i+1});
      }
    }
    for (const round of cup.rounds) for(const t of round.ties) if(typeof t.home==='string'&&typeof t.away==='string') {
      add({home:t.home,away:t.away,hs:t.result?.homeScore,as:t.result?.awayScore,winner:t.result?.winner,date:round.date,status:t.result?(t.result.type==='played'?'completed':'advanced'):'scheduled',competition:'cup',round:round.name});
    }
    const teams=[...new Set(matches.flatMap(m=>[m.home,m.away]).filter(t=>t&&!/TBC|winner|loser/i.test(t)))];
    return {matches,teams,league,lc,national,cup};
  }
  const dateLabel=d=>d?new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'Europe/London'}):'Date TBC';
  function describe(m) {
    const title=m.event?`${m.home} · ${m.event}`:`${m.home} ${scored(m)?`${m.hs}–${m.as}`:'v'} ${m.away}`;
    const date=m.date?dateLabel(m.date):m.expected?`Expected ${dateLabel(m.expected)}; date TBC`:m.playBy?`Date TBC; play by ${dateLabel(m.playBy)}`:'Date TBC';
    return `${title} · ${labels[m.competition]} · ${date}${m.status==='advanced'?' · Advanced without a played score':m.status==='postponed'?' · Postponed':''}`;
  }
  function answer(data,question,previous={},today=new Date().toLocaleDateString('en-CA',{timeZone:'Europe/London'})) {
    let q=clean(question);
    for(const t of data.teams) q=q.replace(new RegExp('\\b'+clean(t)+'s\\b','g'),clean(t));
    const found=data.teams.filter(t=>(' '+q+' ').includes(' '+clean(t)+' ')).sort((a,b)=>b.length-a.length);
    for(const [alias,team] of [['high wycombe','Wycombe'],['reigate','Reigate & Banstead'],['oxford city','Oxford']]) if((' '+q+' ').includes(' '+alias+' ')&&!found.includes(team)) found.push(team);
    const team=found[0]||previous.team||'Newbury';
    const competition=/all competitions|overall|whole season/.test(q)?null:comp(question)||previous.competition||null;
    const context={team,competition};
    const noun=(n,one,many)=>`${n} ${n===1?one:many}`;
    const reply=(text,items=[],path=null)=>({text,items,path:path||(competition?pages[competition]:team==='Newbury'?'newbury-fixtures/':'national-ko/'),context});
    const subject=q.match(/(?:games|matches) (?:have|has) (.+?) (?:won|lost|drawn|played|scored)/)?.[1] || q.match(/what about (.+?) (?:wins|losses|results)/)?.[1];
    const bareSubject=!found.length?q.match(/^([a-z]+(?: [a-z]+)?) (?:wins|losses|results|fixtures|biggest win)$/)?.[1]:null;
    if(bareSubject&&!['our','their','season','all','league','national cup','counties cup','county cup','league cup'].includes(bareSubject)) return reply('I don’t recognise that team in the stored tracker data. Try a team listed in the competition pages.');
    if(/\bcup\b/.test(q)&&!comp(question)&&!previous.competition) return reply('Which cup do you mean? Please specify National Cup, League Cup, Counties Cup or Sevens Cup.');
    if(subject && !data.teams.some(t=>clean(t)===subject) && !['we','they','newbury district'].includes(subject)) return reply('I don’t recognise that team in the stored tracker data. Try Newbury or a team listed in the competition pages.');
    if(/which team.*most|who.*most wins|compare/.test(q)) return reply('I can show a named team’s recorded results or a competition table. Try “Counties League table” or “Newbury wins”.');
    if (!q) return reply('Ask about wins, results, goals, upcoming fixtures, standings or cup rounds.');
    if ((q.match(/\b20\d{2}\b/g)||[]).some(y=>!['2026','2027'].includes(y)) || /last season|2025|2024|boys|sophia|player|scorer|kickoff|kick off|what time|predict|probabilit|odds/.test(q)) return reply('I can answer questions about the recorded 2026/27 district girls’ team data. I don’t hold player statistics, earlier seasons or predictions.');
    if (/table|standing|position|points|leading|top of|rank/.test(q)) {
      if(competition==='leagueCup') {
        const rows=data.lc.standings;
        const r=rows.find(r=>canonical(r.name)===team);
        return reply(`${r?`${team}: position ${r.position}, ${r.points} points from ${r.played} games. `:''}League Cup — Central & East, Tournament One.`,rows.map(r=>`${r.position}. ${r.name} · ${r.points} pts · P ${r.played} · W ${r.won} D ${r.drawn} L ${r.lost}`),pages.leagueCup);
      }
      if(competition&&competition!=='league') return reply('There is no league table for that knockout competition. Ask which round is published instead.');
      const rows=data.league.standings;
      const idx=rows.findIndex(r=>r[0]===team);const r=rows[idx];
      return reply(`${r?`${team}: position ${idx+1}, ${r[7]} points from ${r[1]} games. `:''}Recorded Counties League standings.`,rows.map((r,i)=>`${i+1}. ${r[0]} · ${r[7]} pts · P ${r[1]} · W ${r[2]} D ${r[3]} L ${r[4]}`),pages.league);
    }
    if (/round|quarter|semi|final|through|progress|advanced|awarded|barnet|stage|qualified/.test(q)&&!/how many.*(?:won|win|lost|loss|draw|played)/.test(q)) {
      if(competition==='leagueCup'||/qualified/.test(q)) {
        const event=data.lc.finals.events.find(e=>e.teams.some(t=>canonical(t)===team));
        return event?reply(`${team} are listed in the ${event.name} on ${dateLabel(data.lc.finals.date)} at ${event.location}.`,event.teams,pages.leagueCup):reply(`No League Cup finals allocation is recorded for ${team}.`,[],pages.leagueCup);
      }
      if(competition==='cup') return reply('Counties Cup: the published draw includes Round One, quarter-finals, semi-finals and final. These are draw stages; they are not all completed.',data.cup.rounds.map(r=>`${r.name} · ${dateLabel(r.date)}${r.venue?' · '+r.venue:''}`),pages.cup);
      const rows=data.national.round3;
      if(/which teams|who.*through|who.*quarter/.test(q)) return reply('The latest stored National Cup draw is Round Three (last 16). A quarter-final field is not yet recorded.',rows.map(r=>`${r[1]} v ${r[2]}`),pages.national);
      const advanced=data.matches.filter(m=>m.status==='advanced'&&m.winner===team&&(!competition||m.competition===competition));
      const tie=rows.find(r=>[canonical(r[1]),canonical(r[2])].includes(team));
      return reply(`${advanced.length?`${team} have ${advanced.length} recorded advancement(s) without a played score. `:''}${tie?`${team} are in the published National Cup Round Three draw against ${canonical(tie[1])===team?tie[2]:tie[1]}. The play-by deadline is ${dateLabel(data.national.round_dates.round3.playBy)}; this is not a confirmed match date.`:'No later National Cup round is recorded for this team.'}`,advanced.map(m=>`${m.home} v ${m.away} · ${m.winner} advanced; no played score`),pages.national);
    }
    let matches=data.matches.filter(m=>[m.home,m.away].includes(team)&&(!competition||m.competition===competition));
    if(found.length>1) matches=matches.filter(m=>[m.home,m.away].includes(found[1]));
    const played=matches.filter(scored);
    const goals=m=>m.home===team?[m.hs,m.as]:[m.as,m.hs];
    const wins=played.filter(m=>goals(m)[0]>goals(m)[1]);
    const losses=played.filter(m=>goals(m)[0]<goals(m)[1]);
    const draws=played.filter(m=>m.hs===m.as);
    const scope=`${team}${competition?' in the '+labels[competition]:''}`;
    const partial=team==='Newbury'?'':' Match-level coverage varies by competition; these are recorded scorelines only.';
    if (/next|upcoming|fixture|when|playing|play next|postpon|sevens|7 a side/.test(q)&&!/result|biggest|highest|won|lost|draw/.test(q)) {
      const postponed=/postpon/.test(q);
      const overdue=matches.filter(m=>m.status==='scheduled'&&m.date&&m.date<today);
      const future=matches.filter(m=>postponed?m.status==='postponed':['scheduled','tentative'].includes(m.status)&&(!(m.date||m.expected)||(m.date||m.expected)>=today)).sort((a,b)=>(a.date||a.expected||'9999').localeCompare(b.date||b.expected||'9999'));
      const next=/next/.test(q);
      const list=next&&future.length?future.filter(m=>(m.date||m.expected)===(future[0].date||future[0].expected)):future;
      return reply(`${scope}: ${postponed?'postponed fixtures':next?'next recorded fixture(s)':'recorded upcoming fixtures'}.${!future.length?' None recorded.':''}${overdue.length&&!postponed?` ${overdue.length} earlier scheduled fixture(s) still have no recorded result.`:''}`,list.map(describe));
    }
    if (/biggest|largest|highest|most goals|best score|worst|heaviest/.test(q)) {
      const loss=/defeat|loss|lost|worst|heaviest/.test(q);
      const combined=/combined|total goals|highest scoring game|highest scoring match/.test(q);
      const most=/most goals|highest score|highest scoring/.test(q)&&!combined;
      const pool=combined?played:loss?losses:most?played:wins;
      if(!pool.length) return reply(`No matching played scorelines are recorded for ${scope}.`);
      const value=m=>combined?m.hs+m.as:most?goals(m)[0]:loss?goals(m)[1]-goals(m)[0]:goals(m)[0]-goals(m)[1];
      const max=Math.max(...pool.map(value));
      return reply(`${scope}: ${combined?'highest combined score':most?'most goals scored in one game':loss?'heaviest defeat':'biggest win by goal margin'} (${max} ${combined||most?'goals':'goal margin'}).${partial}`,pool.filter(m=>value(m)===max).map(describe));
    }
    if(/goal|scored|conceded|clean sheet/.test(q)) {
      const gf=played.reduce((n,m)=>n+goals(m)[0],0),ga=played.reduce((n,m)=>n+goals(m)[1],0);
      return reply(`${scope}: ${gf} goals scored, ${ga} conceded, goal difference ${gf-ga>=0?'+':''}${gf-ga}, and ${played.filter(m=>goals(m)[1]===0).length} clean sheets across ${played.length} recorded played games.${partial}`);
    }
    if(/won|wins?|lost|loss|draw|drawn|played|record|results?|form|how many games|how many matches/.test(q)) {
      if((/results?|form/.test(q)&&!/how many/.test(q)) || (found.length>1&&/who won|score/.test(q))) return reply(`${scope}: ${played.length} recorded played results.${found.length>1?' Matches without a recorded score are excluded.':''}${partial}`,played.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(describe));
      const awards=matches.filter(m=>m.status==='advanced'&&m.winner===team).length;
      return reply(`${scope}: ${noun(wins.length,'win','wins')}, ${noun(draws.length,'draw','draws')} and ${noun(losses.length,'loss','losses')} from ${noun(played.length,'recorded played game','recorded played games')} in 2026/27.${awards?` Plus ${noun(awards,'advancement','advancements')} without playing, excluded from the win and played totals.`:''}${partial}`);
    }
    return reply('Try “How many games have Newbury won?”, “Newbury’s biggest win”, “Who are Newbury playing next?” or “Counties League table”. You can name another team or competition. I can only answer the supported questions from stored tracker data.');
  }
  return {build,answer,describe};
});
