(() => {
  'use strict';
  const script=document.currentScript;
  const base=new URL('.',script.src);
  const element=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el;};
  const button=element('button','ask-launch','Ask the tracker');button.type='button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','ask-dialog');
  const dialog=element('dialog','ask-dialog');dialog.id='ask-dialog';dialog.setAttribute('aria-labelledby','ask-heading');
  const header=element('div','ask-header');const title=element('h2','','Ask the tracker');title.id='ask-heading';
  const close=element('button','ask-close','Close ×');close.type='button';header.append(title,close);
  const intro=element('p','ask-intro','Ask about recorded 2026/27 girls’ results and fixtures. Start with Newbury, or name another team.');
  const suggestions=element('div','ask-suggestions');suggestions.setAttribute('aria-label','Suggested questions');
  const log=element('div','ask-log');log.setAttribute('role','log');log.setAttribute('aria-label','Questions and answers');log.setAttribute('aria-live','polite');
  const form=element('form','ask-form');const label=element('label','','Your question');label.htmlFor='ask-question';
  const row=element('div','ask-input-row');const input=element('input');input.id='ask-question';input.name='question';input.type='text';input.maxLength=240;input.required=true;input.autocomplete='off';input.placeholder='How many games have Newbury won?';
  const send=element('button','','Ask');send.type='submit';row.append(input,send);form.append(label,row);
  const status=element('p','ask-status');status.setAttribute('role','status');
  const footer=element('p','ask-footnote','Answers use the site’s stored data. Awarded ties are separate from played results.');
  dialog.append(header,intro,suggestions,log,form,status,footer);document.body.append(button,dialog);
  let dataPromise,context={};
  function load() {
    if(!dataPromise) dataPromise=Promise.all(['newbury-fixtures/data.json','data.json','southern-counties-league/data.json','southern-counties-league-cup/data.json','southern-counties-cup/data.json'].map(async path=>{
      const response=await fetch(new URL(path,base),{cache:'no-cache'});if(!response.ok)throw Error('Feed unavailable');return response.json();
    })).then(feeds=>TrackerAnswers.build(feeds)).catch(error=>{dataPromise=null;throw error;});
    return dataPromise;
  }
  async function ask(question) {
    if(send.disabled||!question.trim())return;
    const entry=element('section','ask-turn');entry.append(element('h3','ask-question-text',question));log.append(entry);send.disabled=true;suggestions.querySelectorAll('button').forEach(b=>b.disabled=true);status.textContent='Checking recorded data…';
    try {
      const data=await load();const result=TrackerAnswers.answer(data,question,context);context=result.context;
      entry.append(element('p','ask-answer',result.text));
      if(result.items.length){const list=element('ul','ask-answer-list');result.items.forEach(text=>list.append(element('li','',text)));entry.append(list);}
      const link=element('a','ask-result-link','View '+({ 'newbury-fixtures/':'Newbury fixtures','national-ko/':'National Cup','southern-counties-league/':'Counties League','southern-counties-league-cup/':'League Cup','southern-counties-cup/':'Counties Cup'}[result.path]||'fixtures')+' →');link.href=new URL(result.path,base).href;entry.append(link);status.textContent='';
    } catch(error) {entry.append(element('p','ask-answer','I couldn’t load the tracker data. Please try your question again.'));status.textContent='Data unavailable; you can retry.';}
    finally {send.disabled=false;suggestions.querySelectorAll('button').forEach(b=>b.disabled=false);entry.scrollIntoView({block:'nearest'});input.focus();}
  }
  for(const text of ['Newbury’s season record','Newbury’s biggest win','Who are Newbury playing next?','Counties League table']) {
    const b=element('button','',text);b.type='button';b.addEventListener('click',()=>{context={};ask(text);});suggestions.append(b);
  }
  button.addEventListener('click',()=>{dialog.showModal();button.setAttribute('aria-expanded','true');input.focus();});
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{button.setAttribute('aria-expanded','false');button.focus();});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  form.addEventListener('submit',event=>{event.preventDefault();const q=input.value.trim();if(q){input.value='';ask(q);}});
})();
