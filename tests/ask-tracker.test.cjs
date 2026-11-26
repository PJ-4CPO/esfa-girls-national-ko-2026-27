const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const engine=require('../ask-tracker-engine.js');
const feeds=['newbury-fixtures/data.json','data.json','southern-counties-league/data.json','southern-counties-league-cup/data.json','southern-counties-cup/data.json'].map(p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p))));
const data=engine.build(feeds);
const ask=(q,c={})=>engine.answer(data,q,c,'2026-11-22');
test('Newbury season totals count overlapping feeds once and separate Barnet award',()=>{
 assert.match(ask('How many games have Newbury won this season?').text,/7 wins, 1 draw and 4 losses from 12/);
 assert.match(ask('Newbury wins').text,/1 advancement without playing/);
 assert.equal(data.matches.filter(m=>[m.home,m.away].includes('Newbury')).length,26);
});
test('competition filter and follow-up preserve explicit scope',()=>{
 const a=ask('Newbury league wins');assert.match(a.text,/3 wins, 0 draws and 1 loss from 4/);
 assert.match(ask('And goals?',a.context).text,/17 goals scored, 9 conceded/);
 assert.match(ask('Newbury wins overall',a.context).text,/7 wins/);
});
test('biggest win uses margin, highest scoring match uses combined goals',()=>{
 assert.match(ask('Newbury’s biggest win').items[0],/6–0 Wycombe/);
 assert.match(ask('Newbury highest scoring match').items[0],/Woking 4–5 Newbury/);
 const copy={...data,matches:[...data.matches,{home:'Newbury',away:'Example',hs:7,as:1,status:'completed',competition:'league'}]};
 assert.equal(engine.answer(copy,'Newbury biggest win').items.length,2);
});
test('next fixtures distinguish expected date from confirmed date and omit completed past fixtures',()=>{
 const a=ask('Who are Newbury playing next?');assert.match(a.items[0],/Expected 28 Nov 2026; date TBC/);
 assert.doesNotMatch(a.text,/earlier scheduled fixture/);assert.doesNotMatch(a.items.join(' '),/21 Nov/);
});
test('goals and clean sheets only include played matches',()=>{
 assert.match(ask('How many goals have Newbury scored?').text,/28 goals scored, 18 conceded/);
 assert.match(ask('Newbury clean sheets').text,/4 clean sheets/);
});
test('unknown and unsupported requests do not invent answers',()=>{
 assert.match(ask('How many games have Arsenal won?').text,/don’t recognise/);
 assert.match(ask('What about Arsenal wins?').text,/don’t recognise/);
 assert.match(ask('Newbury last season results').text,/don’t hold/);
 assert.match(ask('Predict Newbury score').text,/don’t hold/);
 assert.match(ask('Which team has most wins?').text,/named team/);
});
test('cup rounds are not mistaken for completed stages',()=>{
 assert.match(ask('Which teams are through to the quarter finals?').text,/quarter-final field is not yet recorded/);
 assert.match(ask('Counties Cup stage').text,/not all completed/);
 assert.match(ask('Newbury League Cup finals').text,/Champions Trophy.*24 Apr 2027.*Woking/);
});
test('opponent lookup separates Oxford results across competitions',()=>{
 const a=ask('Who won Newbury v Oxford?');assert.equal(a.items.length,2);assert.match(a.items[0],/1–0 Oxford · Counties Cup/);assert.match(a.items[1],/4–3 Oxford · National Cup/);
});

test('published Counties Cup results and next Newbury tie agree across feeds',()=>{
 const round=feeds[4].rounds[0];assert.ok(round.ties.every(t=>t.result?.winner));
 assert.deepEqual(round.ties.map(t=>[t.home,t.result.homeScore,t.result.awayScore,t.away]),[['Newbury',1,0,'Oxford'],['East Cornwall',0,2,'Gloucester'],['St Albans',1,0,'Merton']]);
 const next=ask('Newbury Counties Cup fixtures');assert.equal(next.items.length,1);assert.match(next.items[0],/Gloucester v Newbury.*6 Mar 2027/);
 assert.match(ask('Newbury Counties Cup wins').text,/1 win, 0 draws and 0 losses from 1/);
 assert.match(ask('St Albans Counties Cup results').items[0],/St Albans 1–0 Merton/);
 assert.equal(feeds[0].entries.filter(m=>m.id==='NB-26').length,1);
});
