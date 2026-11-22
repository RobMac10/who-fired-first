/* Place and time widget. Public-record places and dates already in each case file. */
(function () {
  'use strict';

  function xy(lon, lat) {
    var x = (lon - 112) / (155 - 112) * 200;
    var y = ((-10) - lat) / 35 * 170 + 6;
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  }

  /* Simplified mainland + Tasmania coastline, lon/lat samples. */
  var MAINLAND = [
    [113.7, -26.6], [113.6, -24.9], [114.0, -22.0], [114.1, -21.8],
    [116.8, -20.6], [121.6, -18.8], [122.2, -18.2], [123.8, -16.4],
    [126.0, -14.3], [126.8, -13.8], [129.0, -14.9], [129.9, -14.4],
    [130.4, -13.3], [130.8, -12.4], [132.0, -12.2], [133.4, -12.1],
    [135.0, -12.2], [136.8, -13.8], [137.8, -15.6], [139.5, -17.0],
    [140.9, -17.5], [141.8, -15.0], [141.7, -12.8], [142.1, -11.0],
    [142.5, -10.7], [143.0, -11.7], [143.6, -14.3], [145.3, -15.0],
    [145.8, -16.9], [146.3, -19.0], [148.7, -20.3], [149.2, -21.2],
    [150.8, -23.5], [151.9, -24.2], [153.1, -25.3], [153.5, -27.0],
    [153.5, -28.2], [153.2, -30.0], [153.1, -31.5], [151.3, -33.8],
    [151.2, -34.0], [150.9, -34.6], [150.5, -35.3], [150.2, -36.2],
    [149.9, -37.3], [147.0, -38.3], [145.5, -38.4], [144.9, -38.5],
    [143.5, -38.9], [141.0, -38.3], [140.0, -38.0], [138.8, -35.6],
    [138.5, -35.0], [137.6, -35.0], [136.8, -35.3], [135.9, -34.8],
    [135.2, -34.6], [134.2, -32.8], [131.5, -31.6], [129.0, -31.7],
    [125.0, -32.8], [122.3, -34.0], [119.6, -34.4], [116.7, -35.0],
    [115.14, -34.37], [115.0, -33.6], [115.7, -32.0], [115.3, -30.5],
    [114.9, -29.2], [114.1, -28.0], [113.8, -26.8]
  ];
  var TAS = [
    [144.7, -40.7], [146.3, -41.0], [148.3, -40.9], [148.3, -42.2],
    [148.0, -43.2], [147.0, -43.6], [145.9, -43.5], [144.7, -42.8],
    [144.6, -41.7]
  ];

  function pathFrom(ring) {
    var d = '', i, p;
    for (i = 0; i < ring.length; i++) {
      p = xy(ring[i][0], ring[i][1]);
      d += (i ? 'L' : 'M') + p[0] + ' ' + p[1] + ' ';
    }
    return d + 'Z';
  }

  /* Facts already stated in each case file. */
  var CASES = {
    'freedom-ride': {
      lead: 'Places and dates already in this file. The bus left Sydney on 12 February 1965.',
      events: [
        { date: '12 February 1965', place: 'Sydney', lon: 151.21, lat: -33.87, text: 'Twenty-nine University of Sydney students left around midnight as Student Action for Aborigines (SAFA).' },
        { date: '15 February 1965', place: 'Walgett', lon: 148.12, lat: -30.02, text: 'The students met Harry Hall, president of the Walgett Aborigines’ Progressive Association.' },
        { date: '16 February 1965', place: 'Moree', lon: 149.84, lat: -29.47, text: 'Aboriginal children were at first refused the baths, then let in. A public meeting voted 88 to 10 to remove the segregation clause.' },
        { date: '19–20 February 1965', place: 'Moree', lon: 149.84, lat: -29.47, text: 'They returned to Moree. A hostile crowd met them at the pool. Children and students went in, then left that night through the crowd.' }
      ],
      route: true
    },
    'protection': {
      lead: 'Places and dates already in this file, from 1787 to 1937.',
      events: [
        { date: '25 April 1787', place: 'London', skip: true, text: 'Instructions were issued to Arthur Phillip at St James’s, including to “conciliate their affections.”' },
        { date: '20 April 1906', place: 'Perth', lon: 115.86, lat: -31.95, text: 'Western Australia’s 1905 protection Act commenced (reserved 23 December 1905; assent proclaimed 27 April 1906).' },
        { date: '1918', place: 'Moore River', lon: 115.88, lat: -31.05, text: 'The Moore River Native Settlement was established under the 1905 Act.' },
        { date: '9 March 1928', place: 'Perth', lon: 115.86, lat: -31.95, text: 'William Harris led an Aboriginal deputation to Premier Philip Collier in Perth. They asked for the 1905 Act to be repealed. It was not repealed at that meeting.' },
        { date: '21–23 April 1937', place: 'Canberra', lon: 149.13, lat: -35.28, text: 'A conference of Commonwealth and State Aboriginal authorities at Canberra heard A. O. Neville and recorded a resolution on “absorption.”' }
      ]
    },
    'cook': {
      lead: 'Places and dates already in this file, from the 1768 instructions to the 1770 landing.',
      events: [
        { date: '30 July 1768', place: 'The Admiralty', skip: true, text: 'Additional instructions told Cook, “with the Consent of the Natives,” to take possession of convenient situations in the King’s name.' },
        { date: '28–29 April 1770', place: 'Kamay (Botany Bay)', lon: 151.22, lat: -34.00, text: 'The Endeavour entered Kamay. Cook’s journal dates the landing Sunday 29 April; Banks records 28 April. Two men opposed the landing.' },
        { date: '22 August 1770', place: 'Possession Island', lon: 142.37, lat: -10.72, text: 'At what Cook called Possession Island (Bedanug / Tuidin), he recorded hoisting colours and taking possession of the eastern coast.' }
      ]
    },
    'mabo': {
      lead: 'Places and dates already in this file, from the 1982 claim to the 1992 judgment.',
      events: [
        { date: 'May 1982', place: 'Mer (Murray Island)', lon: 144.05, lat: -9.92, text: 'Eddie Koiki Mabo, a Meriam man from Mer, and other Meriam plaintiffs began a High Court case about ownership of land on the Murray Islands.' },
        { date: '1985', place: 'Queensland', lon: 153.03, lat: -27.47, text: 'The Queensland Coast Islands Declaratory Act 1985 declared that, on annexation, the islands were vested in the Crown “freed from all other rights.”' },
        { date: '8 December 1988', place: 'High Court', lon: 149.13, lat: -35.28, text: 'In Mabo v Queensland (No 1) the High Court held the 1985 Act invalid to the extent it was inconsistent with the Racial Discrimination Act 1975.' },
        { date: '3 June 1992', place: 'High Court', lon: 149.13, lat: -35.28, text: 'In Mabo v Queensland (No 2), six of the seven High Court justices held that the common law of Australia can recognise native title, and that the Meriam people were entitled, as against the whole world, to the possession, use, occupation and enjoyment of the Murray Islands.' }
      ]
    },
    'federation': {
      lead: 'Places and dates already in this file, from Tenterfield in 1889 to 1 January 1901.',
      events: [
        { date: '24 October 1889', place: 'Tenterfield', lon: 152.02, lat: -29.05, text: 'Sir Henry Parkes spoke at Tenterfield.' },
        { date: '27 April 1896', place: 'Sydney', lon: 151.21, lat: -33.87, text: 'Parkes died in Sydney. He did not live to see the Commonwealth.' },
        { date: '1 January 1901', place: 'Centennial Park, Sydney', lon: 151.23, lat: -33.89, text: 'The Commonwealth of Australia came into being at a ceremony in Centennial Park, Sydney.' }
      ]
    },
    'cameleers': {
      lead: 'Places and dates already in this file, from the 1860s camel trade into the inland.',
      events: [
        { date: '1860s', place: 'The inland', lon: 133.5, lat: -24.0, text: 'From the 1860s, cameleers worked camel transport in the Australian inland. Settlers often called them “Afghans.”' },
        { date: '1862', place: 'South Australia', lon: 138.60, lat: -34.93, text: 'Sir Thomas Elder imported camels from India into South Australia.' },
        { date: 'Hergott Springs', place: 'Marree (Hergott Springs)', lon: 138.06, lat: -29.65, text: 'Faiz Mahomet managed Elder Smith & Co.’s camel station at Hergott Springs, later called Marree.' }
      ]
    },
    'burke-wills': {
      lead: 'Places and dates already in this file, from the 1860 departure to the missed depot in 1861.',
      events: [
        { date: '1860', place: 'Melbourne', lon: 144.96, lat: -37.81, text: 'A party left Melbourne to cross the continent from south to north. Robert O’Hara Burke led it. William John Wills was the surveyor.' },
        { date: 'Early 1861', place: 'The Gulf country', lon: 140.9, lat: -17.5, text: 'Burke, Wills, John King and Charles Gray reached the Gulf country and turned back.' },
        { date: '17 April 1861', place: 'On the return', lon: 140.8, lat: -22.5, text: 'Gray died on the return, before they reached the depot.' },
        { date: '21 April 1861', place: 'Cooper Creek depot', lon: 140.74, lat: -27.74, text: 'Burke, Wills and King reached the depot that evening. The depot party, led by William Brahe, had left that same morning.' },
        { date: '30 May 1861', place: 'Cooper Creek depot', lon: 140.74, lat: -27.74, text: 'Wills went back to the depot and left a note in the buried cache. The depot was still empty.' }
      ],
      route: true
    },
    'eliza-fraser': {
      lead: 'Places and dates already in this file, from the wreck of the Stirling Castle in 1836.',
      events: [
        { date: 'May–August 1836', place: 'The Stirling Castle', skip: true, text: 'The Stirling Castle was wrecked in 1836. This file’s span is May–August 1836.' },
        { date: 'Early July 1836', place: 'Great Sandy Island', lon: 153.13, lat: -25.25, text: 'A constructed letter in this file is set on Great Sandy Island in early July 1836, after the survivors had landed.' }
      ]
    },
    'batavia': {
      lead: 'Places and dates already in this file, from the wreck in the Houtman Abrolhos.',
      events: [
        { date: '4 June 1629', place: 'Houtman Abrolhos', lon: 113.79, lat: -28.48, text: 'In the early hours of 4 June 1629 the ship struck a reef in the Houtman Abrolhos, off the coast of what is now Western Australia. About 40 people drowned at the wreck. The rest reached low islands nearby.' }
      ]
    },
    'broken-hill': {
      lead: 'Places and dates already in this file, from the picnic train on 1 January 1915.',
      events: [
        { date: '1 January 1915, 10 a.m.', place: 'Broken Hill', lon: 141.47, lat: -31.96, text: 'A picnic train left Sulphide-street station for Silverton for the annual Manchester Unity Oddfellows picnic.' },
        { date: '1 January 1915', place: 'The line to Silverton', lon: 141.30, lat: -31.92, text: 'Two men later named as Gool Badsha Mahomed and Mullah Abdullah fired on the train. Four people were killed.' },
        { date: '1 January 1915', place: 'White Rocks', lon: 141.40, lat: -31.93, text: 'Police, military men and armed civilians pursued the two men to a quartz outcrop later known as White Rocks. Both men were shot.' }
      ],
      route: true
    },
    'centaur': {
      lead: 'Places and dates already in this file, from the Centaur’s departure to the sinking.',
      events: [
        { date: '12 May 1943', place: 'Sydney', lon: 151.21, lat: -33.87, text: 'The 2/3rd Australian Hospital Ship Centaur left Sydney unescorted, bound north, carrying her crew and medical staff and no patients.' },
        { date: '14 May 1943, shortly after 4 a.m.', place: 'Off the Queensland coast', lon: 153.6, lat: -27.3, text: 'Centaur was sunk off the Queensland coast. A later official check revised the number on board to 332, with 64 survivors.' }
      ],
      route: true
    },
    'lambing-flat': {
      lead: 'Places and dates already in this file, from the first riot in 1860 to July 1861.',
      events: [
        { date: '13 November 1860', place: 'Burrangong / Lambing Flat', lon: 148.29, lat: -34.31, text: 'The first anti-Chinese riot on this goldfield is dated 13 November 1860. The main settlement later became the town of Young.' },
        { date: '27 January 1861', place: 'Burrangong', lon: 148.29, lat: -34.31, text: 'Further attacks included 27 January 1861. The Riot Act was read on this day, and again on 14 July.' },
        { date: '30 June 1861', place: 'Back Creek', lon: 148.25, lat: -34.28, text: 'The worst attack: a crowd commonly put at 2,000 to 3,000 marched from Allandale (Tipperary Gully) to camps at Sawpit Gully and then Back Creek.' },
        { date: '14 July 1861', place: 'Burrangong', lon: 148.29, lat: -34.31, text: 'The Riot Act was read again. The series of attacks on this field ran from November 1860 to July 1861.' }
      ]
    },
    'perth-mint': {
      lead: 'Places and dates already in this file, from 1982 to the 2004 court decision.',
      events: [
        { date: 'June 1982', place: 'Perth', lon: 115.86, lat: -31.95, text: 'The events in this file begin with the 1982 Perth Mint gold swindle, in Perth, Western Australia.' },
        { date: '1989', place: 'Perth', lon: 115.86, lat: -31.95, text: 'The opener is a page from 1989, in Perth.' },
        { date: '2002', place: 'Perth', lon: 115.86, lat: -31.95, text: 'Tony Lewandowski made an affidavit in 2002. This file asks how far that affidavit can be trusted.' },
        { date: '2004', place: 'Perth', lon: 115.86, lat: -31.95, text: 'The court quashed the convictions. It did not decide who obtained the gold. No one has been convicted of the swindle since.' }
      ]
    },
    'who-fired-first': {
      lead: 'Places and dates already in this file, at Ballarat in 1854.',
      events: [
        { date: 'January 1854', place: 'St Alipius, Ballarat', lon: 143.86, lat: -37.56, text: 'Eugene von Guérard drew the Catholic chapel on the Gravel Pit Line, Ballarat, in January 1854. The chapel stood by St Alipius school.' },
        { date: '3 December 1854', place: 'Eureka Stockade, Ballarat', lon: 143.86, lat: -37.56, text: 'The Eureka Stockade, Ballarat, 1854 — the morning this case asks about: who fired first?' }
      ]
    }
  };

  function svgFor(data, index) {
    var vb = '0 0 200 186';
    var dMain = pathFrom(MAINLAND);
    var dTas = pathFrom(TAS);
    var pins = '';
    var route = '';
    var seen = {};
    var pts = [];
    data.events.forEach(function (ev, i) {
      if (ev.skip || ev.lon == null) return;
      var p = xy(ev.lon, ev.lat);
      var key = ev.lon + ',' + ev.lat;
      pts.push(p);
      var on = i === index ? ' pt-on' : ' pt-dim';
      /* Only one pin per coordinate; last label wins, current event highlighted. */
      pins += '<circle class="pt-pin' + on + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === index ? 5 : 3.5) + '"></circle>';
      var labelX = p[0] + 6, anchor = 'start';
      if (p[0] > 140) { labelX = p[0] - 6; anchor = 'end'; }
      pins += '<text class="pt-label" text-anchor="' + anchor + '" x="' + labelX + '" y="' + (p[1] + 3) + '">' + escapeXml(ev.place) + '</text>';
      seen[key] = true;
    });
    if (data.route && pts.length > 1) {
      var rd = '';
      pts.forEach(function (p, i) { rd += (i ? 'L' : 'M') + p[0] + ' ' + p[1] + ' '; });
      route = '<path class="pt-route" d="' + rd + '"></path>';
    }
    var ev = data.events[index];
    var label = ev.place + (ev.skip ? '' : '');
    return '<svg class="pt-map" viewBox="' + vb + '" role="img" aria-label="Simple map of Australia showing ' + escapeXml(label) + '. Tap to enlarge.">' +
      '<rect width="200" height="186" fill="#bfe0ea"></rect>' +
      '<path d="' + dMain + '" fill="#c4a574" stroke="#4a2e1b" stroke-width="1"></path>' +
      '<path d="' + dTas + '" fill="#c4a574" stroke="#4a2e1b" stroke-width="1"></path>' +
      route + pins +
      '</svg>';
  }

  function escapeXml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function openInLightbox(root, html, cap) {
    var lb = document.getElementById('portrait-lightbox') || document.getElementById('lightbox') || document.getElementById('lb');
    /* Prefer a simple overlay so we can show SVG without replacing existing lightbox image logic. */
    var existing = document.getElementById('pt-lightbox');
    if (existing) existing.remove();
    var wrap = document.createElement('div');
    wrap.id = 'pt-lightbox';
    wrap.className = 'lightbox';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = '<button type="button" class="lightbox-close pt-lb-close" aria-label="Close the magnified map">&times;</button>' +
      '<div class="lightbox-stage pt-lb-stage">' + html + '</div>' +
      (cap ? '<p class="lightbox-hint">' + escapeXml(cap) + '</p>' : '');
    wrap.style.display = 'flex';
    wrap.removeAttribute('hidden');
    document.body.classList.add('lightbox-open');
    document.body.appendChild(wrap);
    function close() {
      wrap.remove();
      document.body.classList.remove('lightbox-open');
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap || e.target.classList.contains('pt-lb-close') || e.target.classList.contains('lightbox-close')) close();
    });
    document.addEventListener('keydown', onKey);
    var closeBtn = wrap.querySelector('.pt-lb-close');
    if (closeBtn) closeBtn.focus();
  }

  function mount(root) {
    var key = root.getAttribute('data-place-time');
    var data = CASES[key];
    if (!data) return;
    var evs = data.events;
    var index = 0;
    var mapcard = root.querySelector('.pt-mapcard');
    var lbl = root.querySelector('.pt-maplbl');
    var list = root.querySelector('.pt-tl');
    var range = root.querySelector('input[type=range]');
    var play = root.querySelector('.pt-play');
    var timer = null;

    var leadEl = root.querySelector('.pt-lead');
    if (leadEl && data.lead) leadEl.textContent = data.lead;

    evs.forEach(function (ev, i) {
      var li = document.createElement('li');
      li.setAttribute('tabindex', '0');
      li.innerHTML = '<strong>' + escapeXml(ev.date) + (ev.place ? ' · ' + escapeXml(ev.place) : '') + '</strong>' + escapeXml(ev.text);
      li.addEventListener('click', function () { show(i, true); });
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i, true); }
      });
      list.appendChild(li);
    });
    if (range) {
      range.min = 0;
      range.max = evs.length - 1;
      range.value = 0;
      range.setAttribute('aria-label', 'Step through places and dates in this file');
      range.addEventListener('input', function () { show(parseInt(range.value, 10) || 0, true); });
    }

    function stopPlay() {
      if (timer) { clearInterval(timer); timer = null; }
      if (play) play.textContent = '▶ Play';
    }
    function show(i, user) {
      if (user) stopPlay();
      index = Math.max(0, Math.min(evs.length - 1, i));
      if (range) range.value = String(index);
      mapcard.innerHTML = svgFor(data, index);
      var ev = evs[index];
      lbl.textContent = ev.date + ' — ' + ev.place + '. ' + ev.text;
      list.querySelectorAll('li').forEach(function (li, n) {
        if (n === index) { li.classList.add('pt-on'); li.setAttribute('aria-current', 'true'); }
        else { li.classList.remove('pt-on'); li.removeAttribute('aria-current'); }
      });
      var svg = mapcard.querySelector('svg');
      if (svg) {
        svg.style.cursor = 'zoom-in';
        svg.addEventListener('click', function () {
          openInLightbox(root, svgFor(data, index), lbl.textContent);
        });
      }
    }

    if (play) {
      play.addEventListener('click', function () {
        if (timer) { stopPlay(); return; }
        play.textContent = '❚❚ Pause';
        if (index >= evs.length - 1) show(0, false);
        timer = setInterval(function () {
          if (index >= evs.length - 1) { stopPlay(); return; }
          show(index + 1, false);
        }, 2200);
      });
    }
    show(0, false);
  }

  function init() {
    var nodes = document.querySelectorAll('[data-place-time]');
    Array.prototype.forEach.call(nodes, mount);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
