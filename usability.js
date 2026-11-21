(() => {
  // Expanding a round via its journey link also works for a pasted deep link.
  function revealHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    for (let element = target; element; element = element.parentElement) {
      if (element.tagName === 'DETAILS') element.open = true;
    }
  }
  window.addEventListener('hashchange', revealHash);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target?.tagName === 'DETAILS') target.open = true;
  });
  revealHash();
  function improveTables() {
    for (const wrap of document.querySelectorAll('.table-wrap:not([data-accessible])')) {
      wrap.dataset.accessible = 'true';
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', 'Standings table; scroll horizontally for all columns');
      const help = document.createElement('p');
      help.className = 'table-help';
      help.textContent = 'Swipe or scroll sideways for all columns. Team and points stay visible.';
      wrap.before(help);
      const key = document.createElement('p');
      key.className = 'table-key';
      key.textContent = 'P = played · W = won · D = drawn · L = lost · GF = goals for · GA = goals against · Pts = points';
      wrap.after(key);
    }
  }
  improveTables();
  const observer = new MutationObserver(improveTables);
  observer.observe(document.querySelector('main'), { childList: true, subtree: true });
  document.querySelectorAll('[data-cup-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-cup-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    for (const card of document.querySelectorAll('#fixtures .fixture')) card.hidden = button.dataset.cupFilter === 'newbury' && card.dataset.newbury !== 'true';
  }));
})();
