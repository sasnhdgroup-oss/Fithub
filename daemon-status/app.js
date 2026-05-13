/* ============================================================
   FITHUB — DAEMON STATUS MONITOR  |  app.js
   ============================================================ */

/* ── WORKER DEFINITIONS ── */
const WORKERS = [
  {
    id: 'wkr-sync-001',
    name: 'Workout Sync',
    icon: '🏋️',
    status: 'running',
    interval: '30s',
    lastRun: -18,
    nextRun: 12,
    successCount: 1482,
    failCount: 7,
    avgDuration: '340ms',
    description: 'Syncs user workout data to remote storage and handles conflict resolution.',
    history: [
      { ok: true, ts: -18, dur: '312ms' },
      { ok: true, ts: -48, dur: '298ms' },
      { ok: true, ts: -78, dur: '401ms' },
      { ok: false, ts: -108, dur: '5021ms' },
      { ok: true, ts: -138, dur: '305ms' },
    ],
  },
  {
    id: 'wkr-notif-002',
    name: 'Notification Dispatcher',
    icon: '🔔',
    status: 'running',
    interval: '10s',
    lastRun: -4,
    nextRun: 6,
    successCount: 4201,
    failCount: 2,
    avgDuration: '88ms',
    description: 'Dispatches push notifications, email alerts, and in-app messages to users.',
    history: [
      { ok: true, ts: -4,  dur: '76ms' },
      { ok: true, ts: -14, dur: '91ms' },
      { ok: true, ts: -24, dur: '83ms' },
      { ok: true, ts: -34, dur: '99ms' },
      { ok: true, ts: -44, dur: '78ms' },
    ],
  },
  {
    id: 'wkr-analytics-003',
    name: 'Analytics Aggregator',
    icon: '📊',
    status: 'idle',
    interval: '5m',
    lastRun: -142,
    nextRun: 158,
    successCount: 882,
    failCount: 14,
    avgDuration: '2.1s',
    description: 'Aggregates workout stats, streak data, and goal progress for dashboard views.',
    history: [
      { ok: true,  ts: -142, dur: '1.9s' },
      { ok: false, ts: -442, dur: '12.4s' },
      { ok: true,  ts: -742, dur: '2.1s' },
      { ok: true,  ts: -1042, dur: '2.3s' },
      { ok: true,  ts: -1342, dur: '1.8s' },
    ],
  },
  {
    id: 'wkr-media-004',
    name: 'Media Processor',
    icon: '🎬',
    status: 'running',
    interval: '15s',
    lastRun: -9,
    nextRun: 6,
    successCount: 2103,
    failCount: 31,
    avgDuration: '1.4s',
    description: 'Transcodes uploaded videos, resizes thumbnails, and generates previews.',
    history: [
      { ok: true,  ts: -9,   dur: '1.2s' },
      { ok: true,  ts: -24,  dur: '1.5s' },
      { ok: false, ts: -39,  dur: '8.1s' },
      { ok: true,  ts: -54,  dur: '1.4s' },
      { ok: true,  ts: -69,  dur: '1.3s' },
    ],
  },
  {
    id: 'wkr-billing-005',
    name: 'Billing Reconciler',
    icon: '💳',
    status: 'error',
    interval: '1h',
    lastRun: -720,
    nextRun: null,
    successCount: 312,
    failCount: 8,
    avgDuration: '4.2s',
    description: 'Reconciles subscription payments, handles retries, and updates plan statuses.',
    history: [
      { ok: false, ts: -720, dur: '30.1s' },
      { ok: true,  ts: -4320, dur: '3.9s' },
      { ok: true,  ts: -8040, dur: '4.1s' },
      { ok: true,  ts: -11880, dur: '4.4s' },
      { ok: false, ts: -15600, dur: '28.7s' },
    ],
  },
  {
    id: 'wkr-search-006',
    name: 'Search Indexer',
    icon: '🔍',
    status: 'idle',
    interval: '2m',
    lastRun: -67,
    nextRun: 53,
    successCount: 1749,
    failCount: 3,
    avgDuration: '620ms',
    description: 'Keeps the full-text search index updated with new skills, trainers, and workouts.',
    history: [
      { ok: true, ts: -67,  dur: '598ms' },
      { ok: true, ts: -187, dur: '641ms' },
      { ok: true, ts: -307, dur: '612ms' },
      { ok: true, ts: -427, dur: '634ms' },
      { ok: false, ts: -547, dur: '4.8s' },
    ],
  },
  {
    id: 'wkr-session-007',
    name: 'Session Cleaner',
    icon: '🧹',
    status: 'idle',
    interval: '10m',
    lastRun: -355,
    nextRun: 245,
    successCount: 420,
    failCount: 0,
    avgDuration: '210ms',
    description: 'Expires stale auth tokens, purges orphaned sessions, and frees temporary cache.',
    history: [
      { ok: true, ts: -355,  dur: '198ms' },
      { ok: true, ts: -955,  dur: '211ms' },
      { ok: true, ts: -1555, dur: '207ms' },
      { ok: true, ts: -2155, dur: '214ms' },
      { ok: true, ts: -2755, dur: '202ms' },
    ],
  },
  {
    id: 'wkr-leaderboard-008',
    name: 'Leaderboard Engine',
    icon: '🏆',
    status: 'stopped',
    interval: '3m',
    lastRun: -14400,
    nextRun: null,
    successCount: 508,
    failCount: 2,
    avgDuration: '890ms',
    description: 'Recalculates weekly / monthly leaderboards and broadcasts rank-change events.',
    history: [
      { ok: true,  ts: -14400, dur: '872ms' },
      { ok: true,  ts: -14580, dur: '901ms' },
      { ok: true,  ts: -14760, dur: '885ms' },
      { ok: false, ts: -14940, dur: '6.3s' },
      { ok: true,  ts: -15120, dur: '878ms' },
    ],
  },
];

/* ── LOG TEMPLATES ── */
const LOG_TEMPLATES = [
  (w) => ({ lvl: 'INFO',  msg: `Worker ${w.id} cycle started` }),
  (w) => ({ lvl: 'INFO',  msg: `${w.name}: fetched ${rand(10,200)} records in ${rand(50,400)}ms` }),
  (w) => ({ lvl: 'INFO',  msg: `${w.name}: completed successfully — ${rand(1,50)} items processed` }),
  (w) => ({ lvl: 'DEBUG', msg: `${w.id}: heartbeat OK, memory ${rand(12,80)}MB` }),
  (w) => ({ lvl: 'WARN',  msg: `${w.name}: queue depth ${rand(100,500)} — consider scaling` }),
  (w) => ({ lvl: 'WARN',  msg: `${w.id}: retry attempt ${rand(1,3)}/3 after transient error` }),
  (w) => ({ lvl: 'ERROR', msg: `${w.name}: upstream timeout after 30000ms — circuit open` }),
  (w) => ({ lvl: 'INFO',  msg: `${w.id}: next run scheduled in ${rand(5,120)}s` }),
  (w) => ({ lvl: 'INFO',  msg: `${w.name}: cache warm, ${rand(80,99)}% hit-rate` }),
  (w) => ({ lvl: 'WARN',  msg: `${w.id}: avg latency ${rand(400,1200)}ms (p95 threshold: 1000ms)` }),
];

/* ── STATE ── */
let activeFilter = 'all';
let logLevelFilter = 'all';
let logTextFilter = '';
let logPaused = false;
let autoRefresh = true;
let autoRefreshTimer = null;
let logLines = [];
const MAX_LOG_LINES = 200;

/* ── HELPERS ── */
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function fmtRelTime(secs) {
  const abs = Math.abs(secs);
  if (abs < 60)  return `${abs}s ago`;
  if (abs < 3600) return `${Math.floor(abs/60)}m ${abs%60}s ago`;
  return `${Math.floor(abs/3600)}h ago`;
}

function fmtNextRun(secs) {
  if (secs === null) return 'Stopped';
  if (secs < 60) return `in ${secs}s`;
  return `in ${Math.floor(secs/60)}m ${secs%60}s`;
}

function successRate(w) {
  const total = w.successCount + w.failCount;
  return total === 0 ? 100 : Math.round((w.successCount / total) * 100);
}

function rateClass(pct) {
  if (pct >= 95) return 'high';
  if (pct >= 75) return 'medium';
  return 'low';
}

function nowTs() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

/* ── RENDER WORKERS ── */
function renderWorkers() {
  const grid = document.getElementById('workersGrid');
  grid.innerHTML = '';

  const visible = WORKERS.filter(w => activeFilter === 'all' || w.status === activeFilter);

  visible.forEach((w, i) => {
    const rate = successRate(w);
    const card = document.createElement('div');
    card.className = `worker-card worker-card--${w.status}`;
    card.dataset.id = w.id;

    card.innerHTML = `
      <div class="worker-card__header">
        <div class="worker-card__icon">${w.icon}</div>
        <span class="worker-card__status status--${w.status}">
          <span class="status__dot"></span>${w.status}
        </span>
      </div>
      <div class="worker-card__name">${w.name}</div>
      <div class="worker-card__id">${w.id}</div>
      <div class="metrics-row">
        <div class="metric">
          <div class="metric__label">Last run</div>
          <div class="metric__val">${fmtRelTime(w.lastRun)}</div>
        </div>
        <div class="metric">
          <div class="metric__label">Next run</div>
          <div class="metric__val">${fmtNextRun(w.nextRun)}</div>
        </div>
      </div>
      <div class="success-bar-wrap">
        <div class="success-bar-label">
          <span>Success rate</span>
          <span>${rate}%</span>
        </div>
        <div class="success-bar">
          <div class="success-bar__fill success-bar__fill--${rateClass(rate)}"
               style="width: 0%" data-target="${rate}"></div>
        </div>
      </div>
    `;

    grid.appendChild(card);

    /* GSAP entrance */
    gsap.from(card, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.06,
      ease: 'power3.out',
    });

    /* Hover */
    card.addEventListener('mouseenter', () =>
      gsap.to(card, { y: -6, duration: 0.25, ease: 'power2.out' })
    );
    card.addEventListener('mouseleave', () =>
      gsap.to(card, { y: 0, duration: 0.35, ease: 'power2.inOut' })
    );

    /* Click → drawer */
    card.addEventListener('click', () => openDrawer(w.id));

    /* Animate bar fill */
    setTimeout(() => {
      const fill = card.querySelector('.success-bar__fill');
      gsap.to(fill, { width: rate + '%', duration: 1.2, ease: 'power2.out', delay: i * 0.06 });
    }, 100);
  });

  if (visible.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);padding:24px 0">No workers match this filter.</p>`;
  }
}

/* ── UPDATE SUMMARY ── */
function updateSummary() {
  const running = WORKERS.filter(w => w.status === 'running').length;
  const failed  = WORKERS.filter(w => w.status === 'error').length;
  const avgRate = Math.round(WORKERS.reduce((s, w) => s + successRate(w), 0) / WORKERS.length);

  document.getElementById('summWorkers').textContent = WORKERS.length;
  document.getElementById('summRunning').textContent = running;
  document.getElementById('summFailed').textContent  = failed;
  document.getElementById('summAvgRate').textContent  = avgRate + '%';

  const badge = document.getElementById('globalBadge');
  const badgeText = document.getElementById('globalBadgeText');

  if (failed > 0) {
    badge.className = 'status-badge status-badge--error';
    badgeText.textContent = `${failed} worker${failed > 1 ? 's' : ''} in error state`;
  } else {
    badge.className = 'status-badge';
    badgeText.textContent = 'All systems operational';
  }
}

/* ── LOG VIEWER ── */
function pushLogLine(w, tmpl) {
  if (logPaused) return;
  const { lvl, msg } = tmpl(w);
  const line = { ts: nowTs(), lvl, worker: w.id, msg, id: Date.now() + Math.random() };
  logLines.push(line);
  if (logLines.length > MAX_LOG_LINES) logLines.shift();
  renderLogLine(line);
}

function renderLogLine(line) {
  const shouldShow = (logLevelFilter === 'all' || line.lvl === logLevelFilter) &&
    (!logTextFilter || line.msg.toLowerCase().includes(logTextFilter) ||
      line.worker.toLowerCase().includes(logTextFilter));

  const inner = document.getElementById('logInner');
  const div = document.createElement('div');
  div.className = `log-line${shouldShow ? '' : ' log-line--hidden'}`;
  div.dataset.lvl = line.lvl;
  div.dataset.lineId = line.id;

  div.innerHTML = `
    <span class="log-ts">${line.ts}</span>
    <span class="log-lvl log-lvl--${line.lvl}">${line.lvl}</span>
    <span class="log-worker">${line.worker}</span>
    <span class="log-msg log-msg--${line.lvl === 'ERROR' ? 'error' : line.lvl === 'WARN' ? 'warn' : ''}">${line.msg}</span>
  `;

  inner.appendChild(div);

  /* trim DOM if too long */
  while (inner.children.length > MAX_LOG_LINES) {
    inner.removeChild(inner.firstChild);
  }

  requestAnimationFrame(() => {
    div.classList.add('visible');
    if (shouldShow) {
      inner.scrollTop = inner.scrollHeight;
    }
  });
}

function applyLogFilters() {
  document.querySelectorAll('.log-line').forEach(el => {
    const lvl = el.dataset.lvl;
    const text = el.querySelector('.log-msg')?.textContent.toLowerCase() || '';
    const worker = el.querySelector('.log-worker')?.textContent.toLowerCase() || '';
    const matchLvl  = logLevelFilter === 'all' || lvl === logLevelFilter;
    const matchText = !logTextFilter || text.includes(logTextFilter) || worker.includes(logTextFilter);
    el.classList.toggle('log-line--hidden', !(matchLvl && matchText));
  });
}

/* ── DRAWER ── */
function openDrawer(id) {
  const w = WORKERS.find(wk => wk.id === id);
  if (!w) return;

  const rate = successRate(w);
  const content = document.getElementById('drawerContent');

  content.innerHTML = `
    <div class="drawer-worker-icon worker-card--${w.status}" style="background:var(--${w.status === 'running' ? 'green' : w.status === 'error' ? 'red' : 'blue'}-dim)">${w.icon}</div>
    <div class="drawer-worker-name">${w.name}</div>
    <div class="drawer-worker-id">${w.id}</div>
    <span class="worker-card__status status--${w.status}" style="display:inline-flex;margin-bottom:20px">
      <span class="status__dot"></span>${w.status}
    </span>
    <p style="color:var(--text-muted);font-size:13px;margin-bottom:24px;line-height:1.65">${w.description}</p>

    <div class="drawer-section">
      <div class="drawer-section__title">Metrics</div>
      <div class="drawer-metrics">
        <div class="drawer-metric">
          <div class="drawer-metric__label">Success rate</div>
          <div class="drawer-metric__val" style="color:${rate >= 95 ? 'var(--green)' : rate >= 75 ? 'var(--yellow)' : 'var(--red)'}">${rate}%</div>
        </div>
        <div class="drawer-metric">
          <div class="drawer-metric__label">Avg duration</div>
          <div class="drawer-metric__val">${w.avgDuration}</div>
        </div>
        <div class="drawer-metric">
          <div class="drawer-metric__label">Total runs</div>
          <div class="drawer-metric__val">${(w.successCount + w.failCount).toLocaleString()}</div>
        </div>
        <div class="drawer-metric">
          <div class="drawer-metric__label">Failures</div>
          <div class="drawer-metric__val" style="color:${w.failCount > 0 ? 'var(--red)' : 'var(--green)'}">${w.failCount}</div>
        </div>
        <div class="drawer-metric">
          <div class="drawer-metric__label">Interval</div>
          <div class="drawer-metric__val">${w.interval}</div>
        </div>
        <div class="drawer-metric">
          <div class="drawer-metric__label">Last run</div>
          <div class="drawer-metric__val">${fmtRelTime(w.lastRun)}</div>
        </div>
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section__title">Recent Runs</div>
      <div class="run-history">
        ${w.history.map(r => `
          <div class="run-item">
            <div class="run-item__dot run-item__dot--${r.ok ? 'ok' : 'err'}"></div>
            <span class="run-item__time">${fmtRelTime(r.ts)}</span>
            <span style="color:${r.ok ? 'var(--green)' : 'var(--red)';font-size:11px">${r.ok ? '✓ OK' : '✗ FAIL'}</span>
            <span class="run-item__dur">${r.dur}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const overlay = document.getElementById('drawerOverlay');
  overlay.classList.add('is-open');

  gsap.from('#drawer', { x: 60, duration: 0.35, ease: 'power3.out' });
}

function closeDrawer() {
  const overlay = document.getElementById('drawerOverlay');
  gsap.to('#drawer', {
    x: 60,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => overlay.classList.remove('is-open'),
  });
}

/* ── SIMULATED LIVE UPDATES ── */
function simulateTick() {
  WORKERS.forEach(w => {
    /* Tick timers */
    if (w.lastRun !== null)  w.lastRun  -= 5;
    if (w.nextRun !== null && w.status !== 'stopped') {
      w.nextRun -= 5;
      if (w.nextRun <= 0) {
        /* Worker "ran" — reset */
        const succeeded = Math.random() > 0.05;
        w.lastRun = 0;
        const intervalSecs = parseInterval(w.interval);
        w.nextRun = intervalSecs;
        if (succeeded) {
          w.successCount++;
          pushLogLine(w, LOG_TEMPLATES[rand(0, 4)]);
        } else {
          w.failCount++;
          if (Math.random() > 0.7) w.status = 'error';
          pushLogLine(w, LOG_TEMPLATES[rand(5, 6)]);
        }
      }
    }

    /* Occasionally push an info heartbeat */
    if (w.status === 'running' && Math.random() < 0.15) {
      pushLogLine(w, LOG_TEMPLATES[rand(0, 9)]);
    }
  });

  updateWorkerTimings();
  updateSummary();
}

function parseInterval(s) {
  if (s.endsWith('s')) return parseInt(s);
  if (s.endsWith('m')) return parseInt(s) * 60;
  if (s.endsWith('h')) return parseInt(s) * 3600;
  return 30;
}

function updateWorkerTimings() {
  document.querySelectorAll('.worker-card').forEach(card => {
    const w = WORKERS.find(wk => wk.id === card.dataset.id);
    if (!w) return;
    const vals = card.querySelectorAll('.metric__val');
    if (vals[0]) vals[0].textContent = fmtRelTime(w.lastRun);
    if (vals[1]) vals[1].textContent = fmtNextRun(w.nextRun);
    const rate = successRate(w);
    const rateEl = card.querySelector('.success-bar-label span:last-child');
    const fill   = card.querySelector('.success-bar__fill');
    if (rateEl) rateEl.textContent = rate + '%';
    if (fill) fill.style.width = rate + '%';
  });
}

/* ── FILTER TABS ── */
function initFilterTabs() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      activeFilter = btn.dataset.filter;
      renderWorkers();
    });
  });
}

/* ── LOG CONTROLS ── */
function initLogControls() {
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('level-btn--active'));
      btn.classList.add('level-btn--active');
      logLevelFilter = btn.dataset.level;
      applyLogFilters();
    });
  });

  document.getElementById('logFilter').addEventListener('input', e => {
    logTextFilter = e.target.value.toLowerCase().trim();
    applyLogFilters();
  });

  document.getElementById('clearLogBtn').addEventListener('click', () => {
    logLines = [];
    document.getElementById('logInner').innerHTML = '';
  });

  const pauseBtn  = document.getElementById('pauseLogBtn');
  const pauseIcon = document.getElementById('pauseIcon');
  const pauseLabel = document.getElementById('pauseLabel');
  pauseBtn.addEventListener('click', () => {
    logPaused = !logPaused;
    pauseLabel.textContent = logPaused ? 'Resume' : 'Pause';
    pauseIcon.innerHTML = logPaused
      ? '<polygon points="5 3 19 12 5 21 5 3"/>'
      : '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    gsap.to(pauseBtn, { scale: 1.08, duration: 0.1, yoyo: true, repeat: 1 });
  });
}

/* ── AUTO REFRESH ── */
function initAutoRefresh() {
  const toggle = document.getElementById('autoToggle');

  function startAutoRefresh() {
    if (autoRefreshTimer) clearInterval(autoRefreshTimer);
    autoRefreshTimer = setInterval(() => {
      simulateTick();
    }, 5000);
  }

  toggle.addEventListener('click', () => {
    autoRefresh = !autoRefresh;
    toggle.classList.toggle('toggle--on', autoRefresh);
    if (autoRefresh) {
      startAutoRefresh();
    } else {
      clearInterval(autoRefreshTimer);
      autoRefreshTimer = null;
    }
  });

  document.getElementById('refreshBtn').addEventListener('click', () => {
    simulateTick();
    gsap.to('#refreshBtn svg', { rotation: 360, duration: 0.5, ease: 'power2.out', onComplete: () => {
      gsap.set('#refreshBtn svg', { rotation: 0 });
    }});
  });

  startAutoRefresh();
}

/* ── NAV SCROLL ── */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── HEADER ANIMATION ── */
function initHeaderAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('#nav', { y: -50, opacity: 0, duration: 0.7 });
  tl.from('.page-header__orb', { scale: 0, opacity: 0, duration: 1.4, stagger: 0.2, ease: 'power2.out' }, 0);
  tl.from('#headerContent > *', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=1');
}

/* ── SEED INITIAL LOGS ── */
function seedLogs() {
  const seed = [
    { w: WORKERS[0], tmpl: LOG_TEMPLATES[2] },
    { w: WORKERS[1], tmpl: LOG_TEMPLATES[0] },
    { w: WORKERS[2], tmpl: LOG_TEMPLATES[1] },
    { w: WORKERS[4], tmpl: LOG_TEMPLATES[6] },
    { w: WORKERS[3], tmpl: LOG_TEMPLATES[2] },
    { w: WORKERS[5], tmpl: LOG_TEMPLATES[8] },
    { w: WORKERS[1], tmpl: LOG_TEMPLATES[3] },
    { w: WORKERS[4], tmpl: LOG_TEMPLATES[5] },
    { w: WORKERS[0], tmpl: LOG_TEMPLATES[7] },
    { w: WORKERS[2], tmpl: LOG_TEMPLATES[4] },
  ];
  seed.forEach(({ w, tmpl }) => pushLogLine(w, tmpl));
}

/* ── INIT ── */
window.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeaderAnimation();
  updateSummary();
  renderWorkers();
  initFilterTabs();
  initLogControls();
  initAutoRefresh();
  seedLogs();

  /* Drawer close */
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  document.getElementById('drawerOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('drawerOverlay')) closeDrawer();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('drawerOverlay').classList.contains('is-open')) {
      closeDrawer();
    }
  });
});
