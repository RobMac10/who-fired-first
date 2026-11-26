(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var KEY = 'who-fired-first-eureka-v2';
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role=tab]'));
  var panels = {
    diary: document.getElementById('diary'),
    case: document.getElementById('case'),
    finding: document.getElementById('finding'),
    sleuth: document.getElementById('sleuth')
  };
  var aliases = { brief: 'case', casefile: 'finding', supersleuths: 'sleuth', 'super-sleuths': 'sleuth' };

  function show(name, focusTop) {
    name = aliases[name] || name;
    if (!panels[name]) name = 'diary';
    Object.keys(panels).forEach(function (k) { panels[k].classList.toggle('active', k === name); });
    tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.tab === name)); });
    if (focusTop !== undefined && history.replaceState) history.replaceState(null, '', '#' + name);
    if (name === 'case' || name === 'finding' || name === 'sleuth') grow();
    if (focusTop) { var t = document.querySelector('.tabs'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.tab, true); }); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-goto]'), function (b) {
    b.addEventListener('click', function () { show(b.dataset.goto, true); });
  });
  function fromHash() {
    var name = (location.hash || '').replace('#', '');
    name = aliases[name] || name;
    show(panels[name] ? name : 'diary');
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();


  // Easy-read toggle: Nell in Kalam (slanted hand-print); teacher notes stay in Italianno.
  // Remembered on this device only. Print uses the mode that is on.
  var EASY_KEY = 'who-fired-first-easy-read';
  var easy = document.getElementById('easy-read');
  function applyEasy(on) {
    document.body.classList.toggle('easy-read', !!on);
    if (easy) {
      easy.checked = !!on;
      easy.setAttribute('aria-checked', on ? 'true' : 'false');
      var st = document.querySelector('.easy-toggle .easy-state');
      if (st) st.textContent = on ? 'On' : 'Off';
    }
    try { localStorage.setItem(EASY_KEY, on ? '1' : '0'); } catch (e) {}
  }
  if (easy) {
    var saved = false;
    try { saved = localStorage.getItem(EASY_KEY) === '1'; } catch (e) {}
    applyEasy(saved);
    easy.addEventListener('change', function () { applyEasy(easy.checked); });
  }

  // saving
  var fields = Array.prototype.slice.call(document.querySelectorAll('textarea[data-key]'));
  var radios = Array.prototype.slice.call(document.querySelectorAll('input[type=radio][name]'));
  var data = {};
  try { data = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { data = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }
  fields.forEach(function (f) {
    if (data[f.dataset.key]) f.value = data[f.dataset.key];
    f.addEventListener('input', function () { data[f.dataset.key] = f.value; save(); size(f); });
  });
  radios.forEach(function (r) {
    if (data[r.name] === r.value) r.checked = true;
    r.addEventListener('change', function () { data[r.name] = r.value; save(); });
  });
  function size(f) { f.style.height = 'auto'; f.style.height = (f.scrollHeight + 2) + 'px'; }
  function grow() { if (fields) fields.forEach(size); }
  window.addEventListener('resize', grow);
  window.addEventListener('beforeprint', grow);
  setTimeout(grow, 50);

  function clearAnswers() {
    if (!window.confirm('Clear everything you have written on this device?')) return;
    data = {}; save();
    fields.forEach(function (f) { f.value = ''; size(f); });
    radios.forEach(function (r) { r.checked = false; });
  }
  ['clear', 'clear-sleuth'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', clearAnswers);
  });

  function doPrint(mode) {
    mode = aliases[mode] || mode;
    if (panels[mode]) show(mode);
    var opened = [];
    if (mode === 'sleuth') {
      document.querySelectorAll('#sleuth details').forEach(function (d) {
        if (!d.open) { d.open = true; opened.push(d); }
      });
    }
    document.body.setAttribute('data-print', mode);
    grow();
    var done = function () {
      document.body.removeAttribute('data-print');
      opened.forEach(function (d) { d.open = false; });
      window.removeEventListener('afterprint', done);
    };
    window.addEventListener('afterprint', done);
    setTimeout(function () { window.print(); }, 50);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-print]'), function (b) {
    if (b.tagName === 'BUTTON') b.addEventListener('click', function () { doPrint(b.dataset.print); });
  });


  // Chapel sketch lightbox: tap to magnify, pinch/scroll to zoom, close with tap, × or Esc.
  (function chapelLightbox() {
    var lb = document.getElementById('chapel-lightbox');
    var openBtn = document.getElementById('chapel-zoom');
    if (!lb || !openBtn) return;
    var closeBtn = lb.querySelector('.lightbox-close');
    var stage = lb.querySelector('.lightbox-stage');
    var img = stage ? stage.querySelector('img') : null;
    var lastFocus = null;

    function isOpen() { return !lb.hasAttribute('hidden'); }

    function open() {
      lastFocus = document.activeElement;
      lb.removeAttribute('hidden');
      lb.classList.remove('is-zoomed');
      document.body.classList.add('lightbox-open');
      if (closeBtn) closeBtn.focus();
      if (history.replaceState && location.hash !== '#chapel') {
        history.replaceState(null, '', '#chapel');
      }
    }
    function close() {
      if (!isOpen()) return;
      lb.setAttribute('hidden', '');
      lb.classList.remove('is-zoomed');
      document.body.classList.remove('lightbox-open');
      if (history.replaceState && location.hash === '#chapel') {
        history.replaceState(null, '', '#diary');
      }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function toggleZoom() { lb.classList.toggle('is-zoomed'); }

    openBtn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    if (closeBtn) closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
    if (img) {
      img.addEventListener('click', function (e) { e.stopPropagation(); toggleZoom(); });
    }
    if (stage) {
      stage.addEventListener('click', function (e) {
        if (e.target === stage) close();
      });
    }
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { e.preventDefault(); close(); }
    });
    window.addEventListener('hashchange', function () {
      if (location.hash === '#chapel') open();
      else if (isOpen()) close();
    });
    if (location.hash === '#chapel') open();
  })();


  // Portrait lightbox: tap a witness image to magnify.
  (function portraitLightbox() {
    var lb = document.getElementById('portrait-lightbox');
    if (!lb) return;
    var closeBtn = lb.querySelector('.lightbox-close');
    var stage = lb.querySelector('.lightbox-stage');
    var img = stage ? stage.querySelector('img') : null;
    var title = document.getElementById('portrait-lightbox-title');
    var lastFocus = null;
    function isOpen() { return !lb.hasAttribute('hidden'); }
    function open(src, alt) {
      lastFocus = document.activeElement;
      if (img) { img.src = src; img.alt = alt || ''; }
      if (title) title.textContent = alt || 'Magnified portrait';
      lb.removeAttribute('hidden');
      lb.classList.remove('is-zoomed');
      document.body.classList.add('lightbox-open');
      if (closeBtn) closeBtn.focus();
    }
    function close() {
      if (!isOpen()) return;
      lb.setAttribute('hidden', '');
      lb.classList.remove('is-zoomed');
      document.body.classList.remove('lightbox-open');
      if (img) { img.src = ''; }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    document.querySelectorAll('.portrait-zoom').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var im = btn.querySelector('img');
        open(btn.getAttribute('data-full') || (im && im.src), im ? im.alt : '');
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
    if (img) img.addEventListener('click', function (e) { e.stopPropagation(); lb.classList.toggle('is-zoomed'); });
    if (stage) stage.addEventListener('click', function (e) { if (e.target === stage) close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { e.preventDefault(); close(); }
    });
  })();

  // Optional ?shot=cover scrolls the diary cover into view (used for previews).
  if (/(?:^|[?&])shot=cover(?:&|$)/.test(location.search)) {
    var scrollCover = function () {
      var el = document.querySelector(".exhibit-cover");
      if (el) el.scrollIntoView({ block: "center", inline: "nearest" });
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scrollCover);
    setTimeout(scrollCover, 60);
  }

})();
