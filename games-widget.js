/*
 * Mode games widget
 * -----------------
 * One renderer, two data feeds, two brand skins.
 *
 * Embed (two lines, pasted once per page):
 *   <div id="mode-games" data-feed="new-games" data-skin="game-payouts"></div>
 *   <script src="https://cdn.jsdelivr.net/gh/ff-ca-mmm/top-articles-feed@main/games-widget.js"></script>
 *
 * Attributes on the mount div:
 *   data-feed  "new-games" | "top-games"                  which dataset to show
 *   data-skin  "game-payouts" | "patriot-payouts"         which brand to look like
 *   data-sub3  optional, overrides the aff_sub3 tracking value for this page
 *
 * The data files are rewritten daily by the scheduled tasks. This file is not —
 * it only changes when the design does.
 */
(function () {
  'use strict';

  var RAW  = 'https://raw.githubusercontent.com/ff-ca-mmm/top-articles-feed/refs/heads/main/';
  var FONT = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@700;800;900&display=swap';

  var FEEDS = {
    'new-games': { file: 'new-games.json', sub2: 'new_game_widget' },
    'top-games': { file: 'top-games.json', sub2: 'game_hour_widget' }
  };

  /* ---------------------------------------------------------------- skins */

  var SKINS = {

    'game-payouts': {
      mark: '🎮',                  /* gamepad */
      wordmark: ['Mode', 'Game Payouts'],
      tokens: [
        '--bg:hsl(262 16% 7%)',
        '--bg2:hsl(262 16% 5%)',
        '--card:hsl(262 13% 11%)',
        '--surface:hsl(262 13% 13%)',
        '--fg:hsl(0 0% 97%)',
        '--muted-fg:hsl(262 10% 64%)',
        '--border:hsl(262 12% 21%)',
        '--primary:hsl(262 82% 62%)',
        '--primary-dark:hsl(262 82% 50%)',
        '--primary-border:hsl(262 40% 30%)',
        '--primary-glow:hsl(262 82% 62% / .45)',
        '--hero-tint:hsl(262 82% 45% / .30)',
        '--wordmark-a:hsl(0 0% 97%)',
        '--wordmark-b:hsl(262 82% 70%)',
        '--accent:hsl(38 92% 52%)',
        '--flag-bg:hsl(38 45% 13%)',
        '--flag-line:hsl(38 55% 32%)',
        '--flag-ink:hsl(38 90% 70%)',
        '--pay-bg:hsl(142 45% 13%)',
        '--pay-line:hsl(142 40% 28%)',
        '--pay-ink:hsl(142 55% 68%)',
        '--pay-strong:hsl(142 62% 62%)',
        '--foot-strong:hsl(262 10% 78%)',
        '--shadow:0 1px 2px rgba(0,0,0,.3), 0 12px 32px -8px rgba(0,0,0,.5)'
      ].join(';'),
      copy: {
        'new-games': {
          eyebrow: 'Just added to Mode',
          title: 'The <em>Newest Games</em> on Mode',
          sub: 'Games that just landed in the Mode rewards lineup. Be among the first to play them and get rewarded.',
          footLead: 'Freshly added to the Mode rewards lineup.'
        },
        'top-games': {
          eyebrow: 'Ranked by real member payouts',
          title: 'The <em>Top Paying Games</em> Right Now',
          sub: 'These are the highest earners per hour played across the Mode community this week. Tap one and start racking up.',
          footLead: 'Avg USD earned per Mode Earn App user per hour, last 7 days.'
        }
      }
    },

    'patriot-payouts': {
      mark: '🦅',                  /* eagle */
      wordmark: ['Patriot', 'Payouts'],
      tokens: [
        '--bg:hsl(210 20% 98%)',
        '--bg2:hsl(210 20% 96%)',
        '--card:hsl(0 0% 100%)',
        '--surface:hsl(210 20% 99%)',
        '--fg:hsl(220 26% 14%)',
        '--muted-fg:hsl(215 16% 47%)',
        '--border:hsl(214 32% 91%)',
        '--primary:hsl(0 78% 45%)',
        '--primary-dark:hsl(0 78% 35%)',
        '--primary-border:hsl(0 60% 86%)',
        '--primary-glow:hsl(0 78% 45% / .40)',
        '--hero-tint:hsl(0 75% 94%)',
        '--wordmark-a:hsl(220 26% 14%)',
        '--wordmark-b:hsl(0 78% 45%)',
        '--accent:hsl(45 95% 50%)',
        '--flag-bg:hsl(38 92% 96%)',
        '--flag-line:hsl(38 92% 78%)',
        '--flag-ink:hsl(38 92% 36%)',
        '--pay-bg:hsl(142 72% 96%)',
        '--pay-line:hsl(142 60% 80%)',
        '--pay-ink:hsl(142 71% 27%)',
        '--pay-strong:hsl(142 71% 24%)',
        '--foot-strong:hsl(220 20% 32%)',
        '--shadow:0 1px 2px rgba(16,24,40,.04), 0 12px 32px -8px rgba(16,24,40,.12)'
      ].join(';'),
      copy: {
        'new-games': {
          eyebrow: 'American-made earnings',
          title: 'The <em>Newest Games</em> Paying Out',
          sub: 'Fresh games just added to the lineup. Get in early and start earning real American dollars.',
          footLead: 'Freshly added to the Mode rewards lineup.'
        },
        'top-games': {
          eyebrow: 'Ranked by real member payouts',
          title: 'The <em>Top Paying Games</em> Right Now',
          sub: 'The biggest earners per hour played across the community this week. Tremendous payouts. Pick one and get paid.',
          footLead: 'Avg USD earned per Mode Earn App user per hour, last 7 days.'
        }
      }
    }
  };

  var FOOT_TAIL =
    'Earnings vary by player and by how far you get in each game.<br>' +
    'Game offers are a snapshot of Mode’s dynamic rewards platform. Offers vary and may ' +
    'change or end without prior notice at any time. Act now for the best chance to be rewarded!';

  /* ------------------------------------------------------------------ css */

  var CSS = [
    ':host{display:block;}',
    '*{box-sizing:border-box;}',

    '.w{',
      'background:radial-gradient(120% 80% at 50% 0%, var(--hero-tint) 0%, transparent 60%),',
                 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);',
      'color:var(--fg);',
      'font:400 16px/1.45 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;',
      '-webkit-font-smoothing:antialiased;',
      'border:1px solid var(--border);border-radius:16px;',
      'padding:22px 18px 18px;max-width:560px;margin:0 auto;',
      'box-shadow:var(--shadow);',
    '}',

    '.brand{display:flex;align-items:center;justify-content:center;gap:9px;margin:0 0 6px;}',
    '.mark{width:34px;height:34px;flex:0 0 34px;border-radius:10px;',
      'background:linear-gradient(150deg,var(--primary),var(--primary-dark));',
      'display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1;',
      'box-shadow:0 4px 14px -4px var(--primary-glow);}',
    '.wm{font:800 21px/1 Montserrat,Inter,sans-serif;letter-spacing:-.48px;white-space:nowrap;',
      'color:var(--wordmark-a);}',
    '.wm b{font-weight:800;color:var(--wordmark-b);}',

    '.eyebrow{text-align:center;font-size:10.5px;font-weight:700;letter-spacing:1.4px;',
      'text-transform:uppercase;color:var(--muted-fg);margin:0 0 16px;}',
    '.title{font:800 23px/1.2 Montserrat,Inter,sans-serif;letter-spacing:-.48px;',
      'text-align:center;margin:0 0 6px;color:var(--fg);}',
    '.title em{font-style:normal;color:var(--primary);}',
    '.sub{text-align:center;font-size:13.5px;color:var(--muted-fg);margin:0 auto 18px;max-width:42ch;}',

    '.list{list-style:none;margin:0;padding:0;display:grid;gap:10px;}',
    '.row{display:flex;align-items:center;gap:13px;background:var(--card);',
      'border:1px solid var(--border);border-left:3px solid var(--accent);',
      'border-radius:14px;padding:12px;position:relative;',
      'transition:border-color .15s ease, transform .15s ease;}',
    '.row:hover{border-top-color:var(--primary-border);border-right-color:var(--primary-border);',
      'border-bottom-color:var(--primary-border);transform:translateY(-1px);}',
    '.row.rank{border-left-color:var(--primary);}',

    '.chip{position:absolute;top:-7px;left:-8px;min-width:22px;height:22px;padding:0 6px;',
      'border-radius:999px;background:linear-gradient(145deg,var(--primary),var(--primary-dark));',
      'color:#fff;font-size:11px;font-weight:700;line-height:22px;text-align:center;',
      'box-shadow:0 3px 10px -2px var(--primary-glow);}',

    '.icon{width:60px;height:60px;flex:0 0 60px;border-radius:14px;display:block;',
      'background:var(--surface);border:1px solid var(--border);object-fit:cover;}',

    '.meta{min-width:0;flex:1 1 0;}',
    '.name{font-size:14.5px;font-weight:600;line-height:1.3;margin:0 0 5px;color:var(--fg);',
      'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}',

    '.pill{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;line-height:1;',
      'padding:5px 8px;border-radius:999px;white-space:nowrap;font-weight:700;}',
    '.pill.new{background:var(--flag-bg);border:1px solid var(--flag-line);color:var(--flag-ink);',
      'font-weight:800;letter-spacing:.6px;text-transform:uppercase;}',
    '.pill.pay{background:var(--pay-bg);border:1px solid var(--pay-line);color:var(--pay-ink);}',
    '.pill.pay b{color:var(--pay-strong);font-weight:800;}',
    '.pill svg{width:11px;height:11px;flex:0 0 11px;}',

    '.cta{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;gap:6px;',
      'background:linear-gradient(145deg,var(--primary),var(--primary-dark));',
      'color:#fff;text-decoration:none;font:700 13px/1 Inter,sans-serif;',
      'padding:11px 16px;border-radius:999px;white-space:nowrap;',
      'box-shadow:0 4px 14px -4px var(--primary-glow);',
      'transition:filter .15s ease, transform .15s ease;}',
    '.cta:hover{filter:brightness(1.1);transform:translateY(-1px);}',
    '.cta svg{width:11px;height:11px;flex:0 0 11px;}',

    '.foot{margin:16px 0 0;padding-top:13px;border-top:1px solid var(--border);',
      'text-align:center;font-size:11px;line-height:1.5;color:var(--muted-fg);}',
    '.foot strong{color:var(--foot-strong);font-weight:600;}',

    '@container (max-width:430px){',
      '.title{font-size:20px;}',
      '.row{flex-wrap:wrap;gap:11px;}',
      '.icon{width:52px;height:52px;flex:0 0 52px;border-radius:12px;}',
      '.cta{flex:1 0 100%;padding:12px 16px;}',
    '}'
  ].join('');

  var SVG_COIN = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.6 7 6.5s2 2.8 5 3.5 5 1.6 5 3.5-2.2 3-5 3-5-1.1-5-3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  var SVG_STAR = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.5l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 8.9l6.1-.8L12 2.5Z" fill="currentColor"/></svg>';
  var SVG_ARROW = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ----------------------------------------------------------- utilities */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function ctaHref(dealId, sub2, sub3) {
    return 'https://modemobile.sng.link/Bf9sy/ardl'
      + '?_dl=mode-mobile%3A%2F%2Funified-offers%2F' + encodeURIComponent(dealId) + '%2F'
      + '&aff_sub2=' + encodeURIComponent(sub2)
      + '&aff_sub3=' + encodeURIComponent(sub3)
      + '&source=sms'
      + '&_forward_params=2';
  }

  function loadFont() {
    if (document.getElementById('mode-games-font')) return;
    var l = document.createElement('link');
    l.id = 'mode-games-font';
    l.rel = 'stylesheet';
    l.href = FONT;
    document.head.appendChild(l);
  }

  /* -------------------------------------------------------------- render */

  function render(root, skin, copy, items, sub2, sub3) {
    var cards = items.map(function (it, i) {
      var pill = it.payout
        ? '<span class="pill pay">' + SVG_COIN + '<span><b>$' + esc(it.payout) + '</b>/hr avg</span></span>'
        : '<span class="pill new">' + SVG_STAR + ' New</span>';
      var chip = it.payout ? '<span class="chip">#' + (i + 1) + '</span>' : '';
      return '<li class="row' + (it.payout ? ' rank' : '') + '">'
        + chip
        + '<img class="icon" src="' + esc(it.icon) + '" width="60" height="60" alt="'
        + esc(it.name) + '" loading="lazy">'
        + '<div class="meta"><p class="name">' + esc(it.name) + '</p>' + pill + '</div>'
        + '<a class="cta" href="' + esc(ctaHref(it.dealId, sub2, sub3))
        + '" target="_blank" rel="noopener">Play Now ' + SVG_ARROW + '</a>'
        + '</li>';
    }).join('');

    root.innerHTML =
      '<style>:host{' + skin.tokens + ';container-type:inline-size;}' + CSS + '</style>'
      + '<div class="w">'
      +   '<div class="brand"><div class="mark">' + skin.mark + '</div>'
      +     '<div class="wm">' + esc(skin.wordmark[0]) + ' <b>' + esc(skin.wordmark[1]) + '</b></div></div>'
      +   '<p class="eyebrow">' + esc(copy.eyebrow) + '</p>'
      +   '<h2 class="title">' + copy.title + '</h2>'
      +   '<p class="sub">' + esc(copy.sub) + '</p>'
      +   '<ul class="list">' + cards + '</ul>'
      +   '<p class="foot"><strong>' + esc(copy.footLead) + '</strong><br>' + FOOT_TAIL + '</p>'
      + '</div>';
  }

  /* ---------------------------------------------------------------- boot */

  function mount(host) {
    if (host.getAttribute('data-mounted')) return;
    host.setAttribute('data-mounted', '1');

    var feedKey = host.getAttribute('data-feed') || 'new-games';
    var skinKey = host.getAttribute('data-skin') || 'game-payouts';
    var feed = FEEDS[feedKey];
    var skin = SKINS[skinKey];

    if (!feed || !skin) {
      host.style.display = 'none';
      return;
    }

    var copy = skin.copy[feedKey];
    var sub3 = host.getAttribute('data-sub3') || 'ncl-mode-deals-lander';
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    loadFont();

    fetch(RAW + feed.file, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('feed ' + r.status);
        return r.json();
      })
      .then(function (items) {
        if (!Array.isArray(items) || !items.length) throw new Error('empty feed');
        render(root, skin, copy, items.slice(0, 5), feed.sub2, sub3);
      })
      .catch(function (err) {
        /* Fail quietly: collapse rather than leave a broken shell on the page. */
        host.style.display = 'none';
        if (window.console) console.warn('[mode-games] ' + err.message);
      });
  }

  function init() {
    var hosts = document.querySelectorAll('#mode-games, [data-feed][data-skin]');
    for (var i = 0; i < hosts.length; i++) mount(hosts[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
