(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var KEY = 'who-fired-first-eureka-v1';
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role=tab]'));
  var panels = { brief: document.getElementById('brief'), casefile: document.getElementById('casefile') };

  function show(name, focusTop) {
    if (!panels[name]) name = 'brief';
    Object.keys(panels).forEach(function (k) { panels[k].classList.toggle('active', k === name); });
    tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.tab === name)); });
    if (focusTop !== undefined && history.replaceState) history.replaceState(null, '', '#' + name);
    if (name === 'casefile') grow();
    if (focusTop) { var t = document.querySelector('.tabs'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.tab, true); }); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-goto]'), function (b) {
    b.addEventListener('click', function () { show(b.dataset.goto, true); });
  });
  var start = (location.hash || '').replace('#', '');
  show(start === 'casefile' ? 'casefile' : 'brief');

  // saving
  var fields = Array.prototype.slice.call(document.querySelectorAll('textarea[data-key]'));
  var radios = Array.prototype.slice.call(document.querySelectorAll('input[name=confidence]'));
  var data = {};
  try { data = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { data = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }
  fields.forEach(function (f) {
    if (data[f.dataset.key]) f.value = data[f.dataset.key];
    f.addEventListener('input', function () { data[f.dataset.key] = f.value; save(); size(f); });
  });
  radios.forEach(function (r) {
    if (data.confidence === r.value) r.checked = true;
    r.addEventListener('change', function () { data.confidence = r.value; save(); });
  });
  function size(f) { f.style.height = 'auto'; f.style.height = (f.scrollHeight + 2) + 'px'; }
  function grow() { if (fields) fields.forEach(size); }
  window.addEventListener('resize', grow);
  window.addEventListener('beforeprint', grow);
  setTimeout(grow, 50);

  var clear = document.getElementById('clear');
  if (clear) clear.addEventListener('click', function () {
    if (!window.confirm('Clear everything you have written on this device?')) return;
    data = {}; save();
    fields.forEach(function (f) { f.value = ''; size(f); });
    radios.forEach(function (r) { r.checked = false; });
  });

  // printing
  function doPrint(mode) {
    if (mode === 'brief') show('brief');
    else show('casefile');
    document.body.setAttribute('data-print', mode);
    grow();
    var done = function () { document.body.removeAttribute('data-print'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(function () { window.print(); }, 50);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-print]'), function (b) {
    if (b.tagName === 'BUTTON') b.addEventListener('click', function () { doPrint(b.dataset.print); });
  });
})();
