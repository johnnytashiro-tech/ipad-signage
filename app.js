'use strict';

/* =====================================================================
   設定（必要に応じて書き換えてください）
   ===================================================================== */
const SETTINGS = {
  // 天気と地名。設定画面で「現在地／福岡／東京」を選べる（現在地が取れないときは福岡）
  places: {
    fukuoka: { name: '福岡', lat: 33.590, lon: 130.402 },
    tokyo:   { name: '東京', lat: 35.681, lon: 139.767 },
  },
  defaultPlace: 'fukuoka',

  workStart: '09:00',         // 「空き時間」の対象時間
  workEnd:   '19:00',
  minFreeSlot: 30,            // 「まとまった空き」とみなす最短の分数
  minListSlot: 15,            // 空きの一覧に出す最短の分数

  dayStart:   '08:30',        // 通常表示を始める時刻
  nightStart: '19:00',        // 夜間表示に切り替える時刻
  screenOff:  '21:30',        // スリープ防止をやめる時刻（iPad の自動ロックで消灯）
  offWeekdays: [0, 6],        // スリープ防止をしない曜日（0=日, 6=土）
  offOnHolidays: true,        // 祝日もスリープ防止をしない

  calendarRefreshMin: 5,      // 予定の再取得間隔（分）
  weatherRefreshMin: 30,      // 天気の再取得間隔（分）
  peekMinutes: 3,             // 夜間表示をタップしたとき通常表示に戻す時間（分）

  focusMinutes: 25, breakMinutes: 5, focusGoal: 4,
  chime: true,                // タイマー終了時に短い音を鳴らす
};

const THEMES = {
  forest:   {bg:'#0A1310',tile:'#12201A',ink:'#E6F0EA',sub:'#98AEA3',faint:'#889E93',line:'#1E3029',track:'#1E3029',hero:'#183028',heroInk:'#EAF5EE',heroSub:'#A3BBAF',heroTrack:'#28463B',accent:'#7FE0B0',onAccent:'#082016',onAccentSub:'#163A2A',btnInk:'#E4FFF1',work:'#8EC5FF',personal:'#F2C46D',rain:'#8EC5FF',sat:'#8EC5FF',sun:'#FF9C8A',dotIdle:'#2C4038',todayBg:'#7FE0B0',todayInk:'#082016',todayDot:'#082016',
             nBg:'#000000',nTile:'#0A1410',nInk:'#C6D6CC',nSub:'#8DA196'},
  lime:     {bg:'#D9DCD6',tile:'#F7F7F4',ink:'#1B1D1A',sub:'#5C6058',faint:'#6B6F67',line:'#E2E4DE',track:'#E6E8E2',hero:'#1B1D1A',heroInk:'#F3F4EE',heroSub:'#A4A89F',heroTrack:'#33362F',accent:'#C6F36B',onAccent:'#1B1D1A',onAccentSub:'#2E332A',btnInk:'#F3F4EE',work:'#4F7FD9',personal:'#2E9C8A',rain:'#2F5FA8',sat:'#2F5FA8',sun:'#B03A2E',dotIdle:'#C9CCC4',todayBg:'#1B1D1A',todayInk:'#F3F4EE',todayDot:'#C6F36B'},
  sand:     {bg:'#E6DED2',tile:'#FBF8F3',ink:'#2A2420',sub:'#665B51',faint:'#6F6459',line:'#EDE6DC',track:'#EFE8DE',hero:'#2A2420',heroInk:'#F6EFE6',heroSub:'#B5A898',heroTrack:'#40372F',accent:'#E8774B',onAccent:'#2A1A12',onAccentSub:'#3A2217',btnInk:'#FCEFE6',work:'#3F6E8C',personal:'#9A6B1F',rain:'#2F6690',sat:'#2F6690',sun:'#A8382A',dotIdle:'#DDD3C6',todayBg:'#2A2420',todayInk:'#F6EFE6',todayDot:'#E8774B'},
  ocean:    {bg:'#D3DDE5',tile:'#F5F8FA',ink:'#0F2233',sub:'#4D5E6E',faint:'#566778',line:'#E1E8EE',track:'#E3EAF0',hero:'#0F2A44',heroInk:'#EEF4F8',heroSub:'#9DB2C6',heroTrack:'#22405C',accent:'#6ED6CB',onAccent:'#0A2230',onAccentSub:'#163847',btnInk:'#E9FBF8',work:'#3567CF',personal:'#C2531A',rain:'#2B5FB3',sat:'#2B5FB3',sun:'#B4372B',dotIdle:'#C8D3DC',todayBg:'#0F2A44',todayInk:'#EEF4F8',todayDot:'#6ED6CB'},
  mono:     {bg:'#E8E8E6',tile:'#FFFFFF',ink:'#111111',sub:'#575757',faint:'#636363',line:'#EDEDED',track:'#EFEFEF',hero:'#111111',heroInk:'#FFFFFF',heroSub:'#A6A6A6',heroTrack:'#2E2E2E',accent:'#FF4F1A',onAccent:'#111111',onAccentSub:'#2B1006',btnInk:'#FFFFFF',work:'#111111',personal:'#8A8A8A',rain:'#1F5BB5',sat:'#1F5BB5',sun:'#C2321F',dotIdle:'#D6D6D6',todayBg:'#111111',todayInk:'#FFFFFF',todayDot:'#FF4F1A'},
  tron:     {bg:'#02070B',tile:'#06111A',ink:'#DDF8FF',sub:'#86BCCB',faint:'#7AAAB8',line:'#0F2C38',track:'#0B2230',hero:'#040C13',heroInk:'#E6FCFF',heroSub:'#8CC6D5',heroTrack:'#0F2C38',accent:'#00E5FF',onAccent:'#00141A',onAccentSub:'#023340',btnInk:'#00E5FF',work:'#00C8E8',personal:'#FF9A3C',rain:'#6FE9FF',sat:'#6FE9FF',sun:'#FF8A5C',dotIdle:'#173847',todayBg:'#00E5FF',todayInk:'#00141A',todayDot:'#00141A',
             nBg:'#000000',nTile:'#03090D',nInk:'#A6EEFA',nSub:'#6FA5B4'},
  midnight: {bg:'#07080A',tile:'#15171B',ink:'#EDEAE3',sub:'#9EA2AA',faint:'#8B9098',line:'#24272C',track:'#24272C',hero:'#1E2127',heroInk:'#F4F1EA',heroSub:'#A7ABB3',heroTrack:'#33373E',accent:'#FFB547',onAccent:'#1A1408',onAccentSub:'#3A2A0E',btnInk:'#FFF1D9',work:'#7FA7FF',personal:'#5CC8B8',rain:'#8FB3FF',sat:'#8FB3FF',sun:'#FF8A7A',dotIdle:'#3A3E45',todayBg:'#FFB547',todayInk:'#1A1408',todayDot:'#1A1408'},
};
const FONT_STYLES = {
  standard: { css: '', num: "'Plus Jakarta Sans', system-ui, sans-serif", clock: "'Plus Jakarta Sans', system-ui, sans-serif",
              jp: "'Zen Kaku Gothic New', 'Plus Jakarta Sans', system-ui, sans-serif" },
  round:    { css: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&family=Nunito:wght@500;600;700;800&display=swap',
              num: "'Nunito', 'M PLUS Rounded 1c', system-ui, sans-serif", clock: "'Nunito', 'M PLUS Rounded 1c', system-ui, sans-serif",
              jp: "'M PLUS Rounded 1c', 'Nunito', system-ui, sans-serif" },
  cyber:    { css: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&family=Chakra+Petch:wght@500;600;700&family=M+PLUS+1:wght@400;500;700&display=swap',
              num: "'Chakra Petch', 'M PLUS 1', system-ui, sans-serif", clock: "'Orbitron', 'Chakra Petch', system-ui, sans-serif",
              jp: "'M PLUS 1', 'Chakra Petch', system-ui, sans-serif" },
};
const NIGHT_DEFAULT = {nBg:'#000000', nTile:'#0E0F11', nInk:'#D2CABD', nSub:'#9A9388'};

/* =====================================================================
   小物
   ===================================================================== */
const $ = (id) => document.getElementById(id);
const WD = ['日', '月', '火', '水', '木', '金', '土'];
const MIN = 60000, DAY = 86400000;
const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem('signage.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('signage.' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('signage.' + k); } catch (e) {} },
};

const rnd = (v) => (typeof v === 'number' && isFinite(v) ? Math.round(v) : '–');
const own = (o, k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(o, k);

// 接続URLの形（Apps Script のウェブアプリ URL ＋ 32桁のキー）
const CONN_RE = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec\?key=[0-9a-f]{32}$/;
// 会議リンクの形（Apps Script・Mac 側と同じ）
const MEET_OK = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
const TEAMS_OK = /^https:\/\/teams\.(microsoft|live)\.com\/(l\/meetup-join\/[A-Za-z0-9%._-]+\/0(\?[A-Za-z0-9%=&._-]*)?|meet\/[0-9]+(\?p=[A-Za-z0-9]+)?)$/;
const joinOk = (re, u) => typeof u === 'string' && re.test(u) && !/\.\.|%2e/i.test(u);

// 県庁所在地（現在地から近い地名を出すため。位置情報は外部に送らずに地名を決める）
const CITIES = [['札幌',43.06,141.35],['青森',40.82,140.74],['盛岡',39.70,141.15],['仙台',38.27,140.87],['秋田',39.72,140.10],['山形',38.24,140.36],['福島',37.75,140.47],['水戸',36.34,140.45],['宇都宮',36.57,139.88],['前橋',36.39,139.06],['さいたま',35.86,139.65],['千葉',35.61,140.12],['東京',35.69,139.69],['横浜',35.45,139.64],['新潟',37.90,139.02],['富山',36.70,137.21],['金沢',36.59,136.63],['福井',36.07,136.22],['甲府',35.66,138.57],['長野',36.65,138.18],['岐阜',35.39,136.72],['静岡',34.98,138.38],['名古屋',35.18,136.91],['津',34.73,136.51],['大津',35.00,135.87],['京都',35.02,135.76],['大阪',34.69,135.52],['神戸',34.69,135.18],['奈良',34.69,135.83],['和歌山',34.23,135.17],['鳥取',35.50,134.24],['松江',35.47,133.05],['岡山',34.66,133.93],['広島',34.40,132.46],['山口',34.19,131.47],['徳島',34.07,134.56],['高松',34.34,134.04],['松山',33.84,132.77],['高知',33.56,133.53],['福岡',33.59,130.40],['北九州',33.88,130.88],['佐賀',33.25,130.30],['長崎',32.74,129.87],['熊本',32.79,130.74],['大分',33.24,131.61],['宮崎',31.91,131.42],['鹿児島',31.56,130.56],['那覇',26.21,127.68]];
function nearestCity(lat, lon) {
  let best = null, bestKm = Infinity;
  CITIES.forEach((c) => {
    const dy = (c[1] - lat) * 111, dx = (c[2] - lon) * 111 * Math.cos(lat * Math.PI / 180);
    const km = Math.sqrt(dx * dx + dy * dy);
    if (km < bestKm) { bestKm = km; best = c[0]; }
  });
  return bestKm <= 60 ? best : '';
}

// テスト用: ?now=2026-10-29T10:42 で時刻を固定して動かせる
const QS = new URLSearchParams(location.search);
let clockOffset = 0;
if (QS.get('now')) { const t = parseLocal(QS.get('now')); if (t) clockOffset = t.getTime() - Date.now(); }
const now = () => new Date(Date.now() + clockOffset);

function parseLocal(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(s || '');
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
}
const ymd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const day0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const hm = (d) => pad(d.getHours()) + ':' + pad(d.getMinutes());
function at(d, hhmm) { const [h, m] = hhmm.split(':').map(Number); return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m); }
const mins = (a, b) => Math.round((b - a) / MIN);
function durShort(m) { return m < 60 ? m + '分' : (m % 60 ? Math.floor(m / 60) + 'h' + (m % 60) + 'm' : (m / 60) + 'h'); }
function durRow(m) { return m <= 180 ? m + '分' : durShort(m); }
function durFree(m) { return m <= 90 ? m + '分' : durShort(m); }
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dn = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dn);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / DAY + 1) / 7);
}
const mdw = (d) => (d.getMonth() + 1) + '/' + d.getDate() + ' ' + WD[d.getDay()];

/* アイコン（線のみ・currentColor） */
const ICON = {
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
  moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
  partly: '<path d="M8 4.5v1.5M3.5 9H5M4.8 5.8l1 1M11.2 5.8l-1 1"/><path d="M5.6 11.2A3.2 3.2 0 1 1 11 8.4"/><path d="M8.5 19.5a3.5 3.5 0 1 1 .9-6.9 4.5 4.5 0 0 1 8.6 1.4 2.8 2.8 0 0 1-.5 5.5z"/>',
  cloud: '<path d="M7 18.5a4.5 4.5 0 1 1 1.2-8.85A5.5 5.5 0 0 1 18.5 12a3.5 3.5 0 0 1-.5 6.5z"/>',
  rain: '<path d="M7 15.5a4.5 4.5 0 1 1 1.2-8.85A5.5 5.5 0 0 1 18.5 9a3.5 3.5 0 0 1-.5 6.5z"/><path d="M9 18.5l-1 2M13 18.5l-1 2M17 18.5l-1 2"/>',
  snow: '<path d="M7 15.5a4.5 4.5 0 1 1 1.2-8.85A5.5 5.5 0 0 1 18.5 9a3.5 3.5 0 0 1-.5 6.5z"/><path d="M8.5 19h.01M12.5 20.5h.01M16.5 19h.01"/>',
  thunder: '<path d="M7 15.5a4.5 4.5 0 1 1 1.2-8.85A5.5 5.5 0 0 1 18.5 9a3.5 3.5 0 0 1-.5 6.5"/><path d="M12.5 13l-2 4h3l-2 4"/>',
  fog: '<path d="M4 9h16M6 13h12M4 17h16"/>',
  umbrella: '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6.5a2 2 0 0 1-4 0"/>',
  video: '<rect x="3" y="6" width="12.5" height="12" rx="2.5"/><path d="M15.5 10.5 21 7.5v9l-5.5-3z"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4.5V9h4.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  teams: '<rect x="2.5" y="6" width="12" height="12" rx="2.5"/><path d="M5.5 9.5h6M8.5 9.5v6"/><circle cx="18.2" cy="7.6" r="2"/><path d="M16 12h5v3a2.5 2.5 0 0 1-5 0z"/>',
};
const icon = (name, size, sw) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>';
const ICON_PLAY = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
const ICON_PAUSE = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

/* 天気コード（WMO）→ 表示 */
function wx(code, isDay) {
  if (code == null) return { label: '—', icon: 'cloud' };
  if (code <= 1) return { label: code === 0 ? '快晴' : '晴れ', icon: isDay === 0 ? 'moon' : 'sun' };
  if (code === 2) return { label: '晴れ時々くもり', icon: isDay === 0 ? 'cloud' : 'partly' };
  if (code === 3) return { label: 'くもり', icon: 'cloud' };
  if (code === 45 || code === 48) return { label: '霧', icon: 'fog' };
  if (code >= 51 && code <= 57) return { label: '霧雨', icon: 'rain' };
  if (code >= 61 && code <= 67) return { label: code >= 65 ? '強い雨' : '雨', icon: 'rain' };
  if (code >= 71 && code <= 77) return { label: '雪', icon: 'snow' };
  if (code >= 80 && code <= 82) return { label: 'にわか雨', icon: 'rain' };
  if (code === 85 || code === 86) return { label: 'にわか雪', icon: 'snow' };
  if (code >= 95) return { label: '雷雨', icon: 'thunder' };
  return { label: 'くもり', icon: 'cloud' };
}

/* =====================================================================
   状態
   ===================================================================== */
const conf = {
  url: store.get('url', ''),
  theme: store.get('theme', 'forest'),
  tomorrow: store.get('tomorrow', 'tile'),
  meetTarget: store.get('meetTarget', 'mac'),
  font: store.get('font', 'standard'),
  place: store.get('place', SETTINGS.defaultPlace),
  geo: store.get('geo', null),
  demo: store.get('demo', false) || QS.get('demo') === '1',
};
if (!CONN_RE.test(conf.url || '')) conf.url = '';
if (!own(THEMES, conf.theme)) conf.theme = 'forest';
if (!own(FONT_STYLES, conf.font)) conf.font = 'standard';
if (conf.place !== 'auto' && !own(SETTINGS.places, conf.place)) conf.place = SETTINGS.defaultPlace;
// 動作確認用: ?theme=tron&font=cyber で一時的に見た目を切り替え（保存はしない）
if (own(THEMES, QS.get('theme'))) conf.theme = QS.get('theme');
if (own(FONT_STYLES, QS.get('font'))) conf.font = QS.get('font');
if (QS.get('tomorrow') === 'line' || QS.get('tomorrow') === 'tile') conf.tomorrow = QS.get('tomorrow');

const state = {
  events: [], holidays: new Map(), weather: null,
  lastSync: null, syncError: null, lastWeather: 0, lastCalTry: 0,
  peekUntil: 0,
  meet: { url: '', phase: '', until: 0, note: '' },
};

/* URL の #url=…（または #api=…&key=…）から接続先を取り込む */
(function importFromHash() {
  if (!location.hash) return;
  const h = new URLSearchParams(location.hash.slice(1));
  let u = h.get('url') || '';
  if (!u && h.get('api')) u = h.get('api') + (h.get('key') ? (h.get('api').includes('?') ? '&' : '?') + 'key=' + h.get('key') : '');
  u = normalizeUrl(u);
  if (u && CONN_RE.test(u)) { conf.url = u; conf.demo = false; store.set('url', conf.url); store.set('demo', false); }
  if (own(THEMES, h.get('theme'))) { conf.theme = h.get('theme'); store.set('theme', conf.theme); }
  history.replaceState(null, '', location.pathname + location.search);
})();

function normalizeUrl(u) {
  u = String(u || '').trim();
  // Google Workspace の /a/macros/<ドメイン>/s/ 形式を共通の形にそろえる
  return u.replace(/\/a\/macros\/[^/]+\/s\//, '/macros/s/');
}

function applyTheme() {
  const t = Object.assign({}, NIGHT_DEFAULT, own(THEMES, conf.theme) ? THEMES[conf.theme] : THEMES.forest);
  const map = {bg:'--bg',tile:'--tile',ink:'--ink',sub:'--sub',faint:'--faint',line:'--line',track:'--track',hero:'--hero',heroInk:'--hero-ink',heroSub:'--hero-sub',heroTrack:'--hero-track',accent:'--accent',onAccent:'--on-accent',onAccentSub:'--on-accent-sub',btnInk:'--btn-ink',work:'--work',personal:'--personal',rain:'--rain',sat:'--sat',sun:'--sun',dotIdle:'--dot-idle',todayBg:'--today-bg',todayInk:'--today-ink',todayDot:'--today-dot',nBg:'--n-bg',nTile:'--n-tile',nInk:'--n-ink',nSub:'--n-sub'};
  const root = document.documentElement.style;
  Object.keys(map).forEach((k) => root.setProperty(map[k], t[k]));
  const f = own(FONT_STYLES, conf.font) ? FONT_STYLES[conf.font] : FONT_STYLES.standard;
  root.setProperty('--f-num', f.num); root.setProperty('--f-clock', f.clock); root.setProperty('--f-jp', f.jp);
  if (f.css && !document.querySelector('link[data-font="' + conf.font + '"]')) {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = f.css; l.setAttribute('data-font', conf.font);
    document.head.appendChild(l);
  }
  document.body.className = 't-' + (own(THEMES, conf.theme) ? conf.theme : 'forest') + ' f-' + (own(FONT_STYLES, conf.font) ? conf.font : 'standard');
  document.querySelector('meta[name="theme-color"]').setAttribute('content', t.bg);
}

/* 画面サイズに合わせて 1024×1366 の画面を拡大縮小 */
let safeProbe = null;
function safeTop() {
  if (!safeProbe) {
    safeProbe = document.createElement('div');
    safeProbe.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:env(safe-area-inset-top);visibility:hidden;pointer-events:none';
    document.body.appendChild(safeProbe);
  }
  return safeProbe.offsetHeight || 0;
}
function fit() {
  // ホーム画面アプリでは上にステータスバーが重なるので、その分だけ下げて配置する
  const top = safeTop();
  const w = window.innerWidth, h = window.innerHeight - top;
  const s = Math.min(w / 1024, h / 1366);
  const x = (w - 1024 * s) / 2, y = top + (h - 1366 * s) / 2;
  $('stage').style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
}

/* =====================================================================
   予定データ
   ===================================================================== */
function normEvent(e) {
  const allDay = !!e.allDay;
  const s = allDay ? parseLocal(e.start) : new Date(e.start);
  const en = allDay ? parseLocal(e.end) : new Date(e.end);
  if (!s || !en || isNaN(s) || isNaN(en)) return null;
  return { title: e.title || '（タイトルなし）', s: s, e: en, allDay: allDay, cal: e.cal || 'work', kind: e.kind || e.cal || 'work',
           busy: e.busy !== false, attendees: Number(e.attendees) || 0,
           meet: joinOk(MEET_OK, e.meet) ? e.meet : '', teams: joinOk(TEAMS_OK, e.teams) ? e.teams : '', location: e.location || '' };
}

function setData(payload) {
  state.events = (payload.events || []).map(normEvent).filter(Boolean).sort((a, b) => a.s - b.s || a.e - b.e);
  state.holidays = new Map((payload.holidays || []).map((h) => [h.date, h.name]));
}

function eventsOn(d) {
  const a = day0(d), b = addDays(d, 1);
  return state.events.filter((ev) => ev.s < b && ev.e > a);
}
const timedOn = (d) => eventsOn(d).filter((ev) => !ev.allDay);
const isMeeting = (ev) => !ev.allDay && ev.cal === 'work' && ev.kind === 'work' && ev.busy;

async function fetchCalendar() {
  state.lastCalTry = Date.now();
  if (conf.demo || !conf.url) return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(conf.url, { cache: 'no-store', signal: ctrl.signal });
    let data;
    try { data = await res.json(); } catch (e) { throw new Error('デプロイの公開設定を確認'); }
    if (!data.ok) throw new Error(data.error === 'unauthorized' ? 'キーが違います' : (data.error || '取得に失敗'));
    setData(data);
    state.lastSync = now(); state.syncError = null;
    store.set('cache', { at: Date.now(), events: data.events, holidays: data.holidays });
  } catch (err) {
    state.syncError = err.name === 'AbortError' ? '時間切れ' : err instanceof TypeError ? '接続できません' : (err.message || '通信エラー');
  } finally {
    clearTimeout(timer);
    render();
  }
}

/* 天気の地点：現在地（取れていれば）→ 選んだ都市 → 福岡 */
function currentPlace() {
  if (conf.place === 'auto' && conf.geo && isFinite(conf.geo.lat) && isFinite(conf.geo.lon)) {
    return { name: conf.geo.name || '現在地', lat: conf.geo.lat, lon: conf.geo.lon, auto: true };
  }
  const p = own(SETTINGS.places, conf.place) ? SETTINGS.places[conf.place] : SETTINGS.places[SETTINGS.defaultPlace];
  return { name: p.name, lat: p.lat, lon: p.lon, auto: false };
}

/* iPad の位置情報を取る（約1km 単位に丸めて保存。地名は端末内で決める） */
function locate(fromUser) {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(false);
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = Math.round(pos.coords.latitude * 100) / 100, lon = Math.round(pos.coords.longitude * 100) / 100;
      conf.geo = { lat: lat, lon: lon, name: nearestCity(lat, lon) || '現在地', at: Date.now() };
      store.set('geo', conf.geo);
      state.lastWeather = 0; fetchWeather();
      resolve(true);
    }, () => resolve(false), { enableHighAccuracy: false, timeout: 15000, maximumAge: 6 * 3600 * 1000 });
  });
}
/* 1日1回、許可済みのときだけ黙って現在地を取り直す（許可を求める画面は出さない） */
async function refreshLocation() {
  if (conf.place !== 'auto') return;
  if (conf.geo && Date.now() - (conf.geo.at || 0) < DAY) return;
  try {
    if (!navigator.permissions) return;
    const st = await navigator.permissions.query({ name: 'geolocation' });
    if (st.state === 'granted') locate(false);
  } catch (e) { /* 何もしない */ }
}

/* 天気 API の応答から、使う値だけを数値・決まった形の文字列として取り出す */
function cleanWeather(w) {
  if (!w || typeof w !== 'object' || !w.hourly || !w.daily) return null;
  const num = (v) => (typeof v === 'number' && isFinite(v) ? v : null);
  const nums = (a) => (Array.isArray(a) ? a.map(num) : []);
  const strs = (a, re) => (Array.isArray(a) ? a.map((v) => (typeof v === 'string' && re.test(v) ? v : '')) : []);
  const c = w.current || {};
  return {
    current: { temperature_2m: num(c.temperature_2m), weather_code: num(c.weather_code), is_day: num(c.is_day) },
    hourly: { time: strs(w.hourly.time, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/), temperature_2m: nums(w.hourly.temperature_2m),
              precipitation_probability: nums(w.hourly.precipitation_probability), weather_code: nums(w.hourly.weather_code) },
    daily: { time: strs(w.daily.time, /^\d{4}-\d{2}-\d{2}$/), weather_code: nums(w.daily.weather_code), temperature_2m_max: nums(w.daily.temperature_2m_max),
             temperature_2m_min: nums(w.daily.temperature_2m_min), precipitation_probability_max: nums(w.daily.precipitation_probability_max) },
  };
}

async function fetchWeather() {
  state.lastWeather = Date.now();
  const pl = currentPlace();
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + pl.lat.toFixed(2) + '&longitude=' + pl.lon.toFixed(2) +
    '&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,precipitation_probability,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=7';
  if (conf.demo) { state.weather = demoWeather(); render(); return; }
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const w = cleanWeather(await res.json());
    if (!w) throw new Error('bad weather');
    state.weather = w;
    store.set('weather', { at: Date.now(), w: w });
  } catch (err) { /* 前回の天気を表示し続ける */ }
  render();
}

/* =====================================================================
   表示モード・スリープ防止
   ===================================================================== */
function isOffDay(d) {
  return SETTINGS.offWeekdays.includes(d.getDay()) || (SETTINGS.offOnHolidays && state.holidays.has(ymd(d)));
}
function mode(t) {
  const ds = at(t, SETTINGS.dayStart), ns = at(t, SETTINGS.nightStart), so = at(t, SETTINGS.screenOff);
  if (t >= ds && t < ns) return 'day';
  if (t >= ns && t < so) return 'evening';
  return 'sleep';
}
const shouldHoldScreen = (t) => !isOffDay(t) && mode(t) !== 'sleep';
const showNight = (t) => mode(t) !== 'day' && Date.now() > state.peekUntil;

let wakeLock = null;
async function requestWake() {
  if (!('wakeLock' in navigator) || wakeLock || document.visibilityState !== 'visible') return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; renderWakeBtn(); });
  } catch (e) { wakeLock = null; }
  renderWakeBtn();
}
function releaseWake() { if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; } renderWakeBtn(); }
function syncWake() { if (shouldHoldScreen(now())) requestWake(); else releaseWake(); }
function renderWakeBtn() {
  $('wakeBtn').hidden = !('wakeLock' in navigator) || !!wakeLock || !shouldHoldScreen(now());
}

/* =====================================================================
   描画
   ===================================================================== */
function render() {
  const t = now();
  const night = showNight(t);
  $('day').hidden = night;
  $('night').hidden = !night;
  document.documentElement.style.background = night ? 'var(--n-bg)' : 'var(--bg)';
  if (night) renderNight(t); else renderDay(t);
}

function renderDay(t) {
  renderClock(t);
  renderNext(t);
  renderWeather(t);
  renderToday(t);
  renderFree(t);
  renderBottom(t);
  renderTimer();
  renderWakeBtn();
}

function syncLabel(t) {
  if (conf.demo) return { text: currentPlace().name + ' · デモ表示', warn: false };
  if (!conf.url) return { text: '未設定 · 時計を長押しで設定', warn: true };
  if (state.syncError) return { text: currentPlace().name + ' · 同期エラー（' + state.syncError + '）', warn: true };
  if (!state.lastSync) return { text: currentPlace().name + ' · 同期中…', warn: false };
  const stale = t - state.lastSync > 30 * MIN;
  return { text: currentPlace().name + ' · ' + hm(state.lastSync) + ' 同期', warn: stale };
}

function renderClock(t) {
  $('time').textContent = t.getHours() + ':' + pad(t.getMinutes());
  $('dateMain').textContent = (t.getMonth() + 1) + '月' + t.getDate() + '日';
  const hol = state.holidays.get(ymd(t));
  $('dateSub').textContent = WD[t.getDay()] + '曜日' + (hol ? ' · ' + hol : '');
  $('weekNo').textContent = 'WEEK ' + isoWeek(t);
  const y0 = new Date(t.getFullYear(), 0, 1), y1 = new Date(t.getFullYear() + 1, 0, 1);
  const pct = Math.floor((t - y0) / (y1 - y0) * 100);
  $('ypText').textContent = t.getFullYear() + '年の ' + pct + '%';
  $('ypFill').style.width = pct + '%';
  const s = syncLabel(t);
  $('syncText').textContent = s.text;
  $('syncDot').className = 'dot' + (s.warn ? ' warn' : '');
}

function untilParts(m) {
  if (m <= 0) return '<span class="w">まもなく</span>';
  if (m < 60) return '<span class="u">あと</span><span class="n">' + m + '</span><span class="u">分</span>';
  const h = Math.floor(m / 60), r = m % 60;
  return '<span class="u">あと</span><span class="n">' + h + '</span><span class="u">時間</span>' + (r ? '<span class="n">' + r + '</span><span class="u">分</span>' : '');
}
function eventSub(ev) {
  const parts = [];
  if (ev.attendees > 1) parts.push('参加者 ' + ev.attendees + '名');
  else if (ev.location) parts.push(ev.location);
  if (ev.cal === 'personal') parts.push('個人');
  return parts.join(' · ');
}
/* 参加ボタン：Teams と Meet の両方があれば2つ並べる */
function joinLinks(ev) {
  const out = [];
  if (ev && ev.teams) out.push({ url: ev.teams, name: 'Teams', icon: 'teams' });
  if (ev && ev.meet) out.push({ url: ev.meet, name: 'Meet', icon: 'video' });
  return out;
}
function joinActive(url) { const m = state.meet; return !!url && m.url === url && Date.now() < m.until; }
function joinBtn(l, compact) {
  const cls = 'meet' + (compact ? ' compact' : '');
  const ic = icon(l.icon, 20, 1.8);
  const full = compact ? l.name : l.name + ' に参加';
  const link = (label) => '<a class="' + cls + '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + ic + label + '</a>';
  if (conf.meetTarget !== 'mac' || conf.demo || !conf.url) return link(full);
  if (joinActive(l.url)) {
    const p = state.meet.phase;
    if (p === 'sending') return '<button type="button" class="' + cls + '" disabled>' + ic + (compact ? '送信中…' : 'Mac で開いています…') + '</button>';
    if (p === 'opened') return '<button type="button" class="' + cls + '" disabled>' + icon('check', 20, 2.2) + (compact ? '開きました' : 'Mac で開きました') + '</button>';
    if (p === 'fallback') return link(compact ? 'iPadで開く' : 'iPad で開く');
  }
  return '<button type="button" class="' + cls + '" data-meet="' + esc(l.url) + '" aria-label="' + l.name + ' に参加">' + ic + full + '</button>';
}
function joinBtns(ev) {
  const ls = joinLinks(ev);
  if (!ls.length) return '';
  return '<div class="joins">' + ls.map((l) => joinBtn(l, ls.length > 1)).join('') + '</div>';
}
function nextFoot(ev, withJoin) {
  let sub = eventSub(ev);
  const failed = withJoin && joinLinks(ev).some((l) => joinActive(l.url) && state.meet.phase === 'fallback');
  if (failed) sub = state.meet.note;
  return '<div class="nfoot"><div class="nmeta"><span class="m1 num">' + hm(ev.s) + ' – ' + hm(ev.e) + '</span>' +
    (sub ? '<span class="m2 ellipsis">' + esc(sub) + '</span>' : '') + '</div>' + (withJoin ? joinBtns(ev) : '') + '</div>';
}

/* 「Meet に参加」→ Apps Script 経由で Mac の常駐スクリプトに渡し、Chrome で開いてもらう */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function apiGet(params) {
  const u = conf.url + (conf.url.indexOf('?') >= 0 ? '&' : '?') + new URLSearchParams(params).toString();
  const res = await fetch(u, { cache: 'no-store' });
  return res.json();
}
function renderNextOnly() { if ($('night').hidden) renderNext(now()); }
async function openOnMac(url) {
  const set = (phase, ms, note) => {
    state.meet = { url: url, phase: phase, until: Date.now() + ms, note: note || '' };
    renderNextOnly(); setTimeout(renderNextOnly, ms + 100);
  };
  set('sending', 20000);
  try {
    const r = await apiGet({ action: 'open', url: url });
    if (!r.ok) throw new Error(r.error || 'error');
    if (!r.agentOnline) { set('fallback', 60000, 'Mac オフライン'); return; }
    for (let i = 0; i < 6; i++) {
      await sleep(1500);
      const s = await apiGet({ action: 'status', id: r.id });
      if (s.ok && s.taken) { set('opened', 8000); return; }
    }
    set('fallback', 60000, 'Mac 応答なし');
  } catch (e) {
    set('fallback', 60000, 'Mac に送れず');
  }
}

function renderNext(t) {
  const today = timedOn(t);
  const current = today.filter((ev) => ev.s <= t && ev.e > t && ev.busy).sort((a, b) => b.s - a.s)[0];
  const upcoming = today.filter((ev) => ev.s > t);
  let html;
  if (current) {
    const after = upcoming[0];
    html = '<div class="head"><span>進行中</span>' + (after ? '<span class="after ellipsis">その後 ' + hm(after.s) + ' ' + esc(after.title) + '</span>' : '') + '</div>' +
      '<div class="big">' + untilParts(mins(t, current.e)).replace('あと', '残り') + '</div>' +
      '<div class="title ellipsis">' + esc(current.title) + '</div>' + nextFoot(current, true);
  } else if (upcoming.length) {
    const ev = upcoming[0], after = upcoming[1];
    html = '<div class="head"><span>次の予定</span>' + (after ? '<span class="after ellipsis">その後 ' + hm(after.s) + ' ' + esc(after.title) + '</span>' : '') + '</div>' +
      '<div class="big">' + untilParts(mins(t, ev.s)) + '</div>' +
      '<div class="title ellipsis">' + esc(ev.title) + '</div>' + nextFoot(ev, true);
  } else {
    const tm = addDays(t, 1);
    const ev = timedOn(tm)[0];
    if (ev) {
      html = '<div class="head"><span>次の予定</span><span class="after">今日の予定は終わり</span></div>' +
        '<div class="big"><span class="w">明日</span><span class="n">' + hm(ev.s) + '</span></div>' +
        '<div class="title ellipsis">' + esc(ev.title) + '</div>' + nextFoot(ev, false);
    } else {
      html = '<div class="head"><span>次の予定</span></div><div class="big"><span class="w">予定なし</span></div>' +
        '<div class="nfoot"><div class="nmeta"><span class="m1">今日と明日の予定はありません</span></div></div>';
    }
  }
  $('next').innerHTML = html;
}

function hourlyAt(w, d) {
  const key = ymd(d) + 'T' + pad(d.getHours()) + ':00';
  const i = w.hourly.time.indexOf(key);
  return i < 0 ? null : { temp: w.hourly.temperature_2m[i], pop: w.hourly.precipitation_probability[i], code: w.hourly.weather_code[i] };
}
function rainOutlook(w, t) {
  let max = 0;
  for (let k = 0; k < 12; k++) {
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours() + k);
    const h = hourlyAt(w, d);
    if (!h) continue;
    if (h.pop >= 50) return { text: k === 0 ? '雨 · 傘を' : (d.getDate() !== t.getDate() ? '夜中' : d.getHours() + '時ごろ') + 'から雨 · 傘', rain: true };
    max = Math.max(max, h.pop || 0);
  }
  return { text: max < 20 ? '雨の心配なし' : '降水 ' + max + '%', rain: false };
}

function renderWeather(t) {
  const w = state.weather;
  const pl = currentPlace();
  let html = '<div class="head"><span>天気</span><span class="sub">' + esc(pl.name + (pl.auto ? '（現在地）' : '')) + '</span></div>';
  if (!w) { $('weather').innerHTML = html + '<div class="empty">天気を取得中…</div>'; return; }
  const cur = w.current || {};
  const nowH = hourlyAt(w, t) || {};
  const code = cur.weather_code != null ? cur.weather_code : nowH.code;
  const temp = cur.temperature_2m != null ? cur.temperature_2m : nowH.temp;
  const info = wx(code, cur.is_day);
  const di = w.daily.time.indexOf(ymd(t));
  const hi = di >= 0 ? rnd(w.daily.temperature_2m_max[di]) : '–';
  const lo = di >= 0 ? rnd(w.daily.temperature_2m_min[di]) : '–';
  const ro = rainOutlook(w, t);
  html += '<div class="wx-main">' + icon(info.icon, 58, 1.6) +
    '<span class="wx-temp num">' + (temp != null ? Math.round(temp) : '–') + '°</span>' +
    '<div class="wx-side"><span class="c">' + info.label + '</span><span class="r">' + hi + '° / ' + lo + '°</span>' +
    '<span class="r' + (ro.rain ? ' rain' : '') + '">' + ro.text + '</span></div></div>';
  // 線の下：明日から5日分（天気マーク・最高/最低・降水確率）
  html += '<div class="days5 num">';
  for (let k = 1; k <= 5; k++) {
    const d = addDays(t, k);
    const i = w.daily.time.indexOf(ymd(d));
    const cls = state.holidays.has(ymd(d)) || d.getDay() === 0 ? ' sun' : d.getDay() === 6 ? ' sat' : '';
    const label = k === 1 ? '明日' : WD[d.getDay()];
    if (i < 0) { html += '<div><span class="h jp' + cls + '">' + label + '</span><span class="ic">' + icon('cloud', 30, 1.6) + '</span><span class="t">–</span><span class="p">–</span></div>'; continue; }
    const info = wx(w.daily.weather_code[i], 1);
    const mx = w.daily.temperature_2m_max[i], mn = w.daily.temperature_2m_min[i];
    const pop = w.daily.precipitation_probability_max[i];
    html += '<div><span class="h jp' + cls + '">' + label + '</span>' +
      '<span class="ic" title="' + info.label + '">' + icon(info.icon, 30, 1.6) + '</span>' +
      '<span class="t">' + (mx == null ? '–' : rnd(mx) + '°') + '<span class="lo">' + (mn == null ? '' : rnd(mn) + '°') + '</span></span>' +
      '<span class="p' + (pop >= 50 ? ' rain' : '') + '">' + icon('umbrella', 12, 2) + (pop == null ? '–' : pop + '%') + '</span></div>';
  }
  $('weather').innerHTML = html + '</div>';
}

function rowHtml(ev, cls, small, t) {
  const kind = ev.kind === 'focus' ? 'focus' : ev.kind === 'ooo' ? 'ooo' : ev.cal === 'personal' ? 'personal' : 'work';
  let meta;
  if (ev.allDay) meta = '終日';
  else if (t && ev.s <= t && ev.e > t) meta = '進行中';
  else meta = durRow(mins(ev.s, ev.e)) + (ev.cal === 'personal' ? ' · 個人' : '');
  return '<div class="row' + (small ? ' sm' : '') + (cls ? ' ' + cls : '') + '">' +
    '<span class="t num">' + (ev.allDay ? '終日' : hm(ev.s)) + '</span><span class="bar ' + kind + '"></span>' +
    '<span class="ti ellipsis">' + esc(ev.title) + '</span><span class="m">' + meta + '</span></div>';
}

function renderToday(t) {
  const all = eventsOn(t);
  const allDay = all.filter((ev) => ev.allDay);
  const timed = all.filter((ev) => !ev.allDay);
  let html = '<div class="head"><span>今日の予定</span><span class="sub">' + all.length + '件</span></div>';
  if (allDay.length) {
    html += '<div class="allday"><span>終日</span>' + allDay.slice(0, 2).map((ev) => '<span class="chip ellipsis">' + esc(ev.title) + '</span>').join('') +
      (allDay.length > 2 ? '<span>+' + (allDay.length - 2) + '</span>' : '') + '</div>';
  }
  if (!timed.length) { $('today').innerHTML = html + '<div class="empty">' + (allDay.length ? '時間指定の予定はありません' : '今日の予定はありません') + '</div>'; return; }

  const maxRows = allDay.length ? 5 : 6;
  const firstLive = timed.findIndex((ev) => ev.e > t);
  // これからの予定を優先し、余った行に直前の終わった予定を出す
  let start;
  if (firstLive < 0) start = Math.max(0, timed.length - maxRows);
  else start = Math.max(0, firstLive - Math.max(1, maxRows - (timed.length - firstLive)));
  const shown = timed.slice(start, start + maxRows);
  const hidden = timed.length - start - shown.length;
  const hot = timed.find((ev) => ev.s > t);
  let nowPlaced = false;
  shown.forEach((ev) => {
    if (!nowPlaced && ev.s > t) { html += '<div class="nowline"><i></i><b></b><span class="num">NOW</span></div>'; nowPlaced = true; }
    const cls = ev.e <= t ? 'past' : (ev.s <= t || ev === hot) ? 'hot' : '';
    html += rowHtml(ev, cls, false, t);
  });
  if (!nowPlaced && firstLive < 0) html += '<div class="nowline"><i></i><b></b><span class="num">NOW</span></div>';
  if (hidden > 0) html += '<div class="more">ほか ' + hidden + '件</div>';
  $('today').innerHTML = html;
}

function freeInfo(t) {
  const ws = at(t, SETTINGS.workStart), we = at(t, SETTINGS.workEnd);
  const timed = timedOn(t);
  const meetings = timed.filter(isMeeting);
  const meetMin = meetings.reduce((s, ev) => s + mins(ev.s, ev.e), 0);
  const busy = timed.filter((ev) => ev.busy).map((ev) => [Math.max(+ev.s, +ws), Math.min(+ev.e, +we)]).filter((r) => r[1] > r[0]).sort((a, b) => a[0] - b[0]);
  const merged = [];
  busy.forEach((r) => { const last = merged[merged.length - 1]; if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]); else merged.push(r.slice()); });
  const from = Math.min(Math.max(+t, +ws), +we);
  const gaps = [];
  let cur = from;
  merged.forEach((r) => { if (r[1] <= cur) return; if (r[0] > cur) gaps.push([cur, r[0]]); cur = Math.max(cur, r[1]); });
  if (cur < +we) gaps.push([cur, +we]);
  const freeMin = gaps.reduce((s, g) => s + Math.round((g[1] - g[0]) / MIN), 0);
  const slot = gaps.find((g) => (g[1] - g[0]) / MIN >= SETTINGS.minFreeSlot) || null;
  return { ws: ws, we: we, timed: timed, meetMin: meetMin, meetCount: meetings.length, freeMin: freeMin, slot: slot, gaps: gaps, after: +t >= +we };
}

/* 空き時間：主役は「次のまとまった空き」。下に、ほかの空きを一覧で出す */
function renderFree(t) {
  const f = freeInfo(t);
  const meetText = f.meetCount ? '会議 ' + durShort(f.meetMin) + ' · ' + f.meetCount + '件' : '会議なし';
  let html = '<div class="head"><span>空き時間</span><span class="sub">' + meetText + '</span></div>';
  if (f.after) {
    $('free').innerHTML = html + '<div class="flabel">次のまとまった空き</div><div class="fbig"><span class="fr none">今日の勤務時間は終わりました</span></div>' +
      '<div class="flist-head"><span>' + SETTINGS.workStart.replace(/^0/, '') + ' – ' + SETTINGS.workEnd.replace(/^0/, '') + ' の予定はすべて終了</span></div>';
    return;
  }
  const slot = f.slot;
  if (slot) {
    const a = new Date(slot[0]), b = new Date(slot[1]), live = +a <= +t;
    html += '<div class="flabel">' + (live ? 'いま空いています' : '次のまとまった空き') + '</div>' +
      '<div class="fbig"><span class="fr num">' + (live ? '〜 ' + hm(b) : hm(a) + ' – ' + hm(b)) + '</span><span class="fd">' + durFree(mins(a, b)) + '</span></div>';
  } else {
    html += '<div class="flabel">次のまとまった空き</div><div class="fbig"><span class="fr none">今日はもうありません</span></div>';
  }
  const others = f.gaps.filter((g) => (g[1] - g[0]) / MIN >= SETTINGS.minListSlot && (!slot || g[0] !== slot[0]));
  html += '<div class="flist-head"><span>ほかの空き</span><span>空き合計 ' + durShort(f.freeMin) + '</span></div>';
  if (!others.length) {
    html += '<div class="flist-empty">' + (slot ? 'ほかに空きはありません' : SETTINGS.minListSlot + '分以上の空きはありません') + '</div>';
  } else {
    const max = 4;
    const show = others.length > max ? others.slice(0, max - 1) : others;
    html += '<div class="flist">' + show.map((g) => {
      const a = new Date(g[0]), b = new Date(g[1]), m = mins(a, b);
      return '<div class="fchip' + (m < SETTINGS.minFreeSlot ? ' short' : '') + '"><span class="num">' + (+a <= +t ? 'いま' : hm(a)) + ' – ' + hm(b) + '</span><span class="d">' + durFree(m) + '</span></div>';
    }).join('') + (others.length > max ? '<div class="fchip more">ほか ' + (others.length - show.length) + '件</div>' : '') + '</div>';
  }
  $('free').innerHTML = html;
}

function tomorrowWeather(t) {
  const w = state.weather;
  if (!w) return null;
  const i = w.daily.time.indexOf(ymd(addDays(t, 1)));
  if (i < 0) return null;
  const pop = w.daily.precipitation_probability_max[i];
  const info = wx(w.daily.weather_code[i], 1);
  return { pop: pop, rain: pop >= 50, label: info.label, icon: info.icon, hi: rnd(w.daily.temperature_2m_max[i]), lo: rnd(w.daily.temperature_2m_min[i]) };
}

function weekHtml(t, wide) {
  const mon = addDays(t, -((t.getDay() + 6) % 7));
  const todayKey = ymd(t);
  let next = null;
  for (let k = 0; k <= 90 && !next; k++) { const d = addDays(t, k); if (state.holidays.has(ymd(d))) next = d; }
  const holText = next ? (ymd(next) === todayKey ? '今日は' + state.holidays.get(todayKey) : (wide ? '次の祝日 ' : '祝日 ') + (next.getMonth() + 1) + '/' + next.getDate() + '（' + WD[next.getDay()] + '）' + state.holidays.get(ymd(next))) : '';
  let html = '<div class="tile week' + (wide ? ' wide' : '') + '"><div class="head"><span>今週</span><span class="sub ellipsis" style="font-size:15px">' + esc(holText) + '</span></div><div class="days">';
  for (let k = 0; k < 7; k++) {
    const d = addDays(mon, k), key = ymd(d);
    const n = eventsOn(d).length;
    const cls = ['day'];
    if (key === todayKey) cls.push('today'); else if (d < day0(t)) cls.push('past');
    if (state.holidays.has(key) || d.getDay() === 0) cls.push('sun'); else if (d.getDay() === 6) cls.push('sat');
    let dots = '';
    for (let j = 0; j < Math.min(n, 5); j++) dots += '<i></i>';
    if (n > 5) dots += '<em>+</em>';
    html += '<div class="' + cls.join(' ') + '"><span class="w">' + WD[d.getDay()] + '</span><span class="d num">' + d.getDate() + '</span><div class="ds">' + dots + '</div></div>';
  }
  return html + '</div></div>';
}

function renderBottom(t) {
  const tm = addDays(t, 1);
  const evs = eventsOn(tm).sort((a, b) => (b.allDay - a.allDay) || (a.s - b.s));
  const hol = state.holidays.get(ymd(tm));
  const tw = tomorrowWeather(t);
  const meetMin = evs.filter(isMeeting).reduce((s, ev) => s + mins(ev.s, ev.e), 0);
  let html;
  if (conf.tomorrow === 'line') {
    const first = evs.find((ev) => !ev.allDay) || evs[0];
    html = '<div class="bottom-line">' + weekHtml(t, true) + '<div class="tline jp"><div class="l"><span class="k num">TOMORROW</span>';
    if (first) {
      html += '<span class="v num">' + (first.allDay ? '終日' : hm(first.s)) + '</span><span class="v ellipsis">' + esc(first.title) + '</span>' +
        '<span class="muted" style="font-size:16px;white-space:nowrap">' + (evs.length > 1 ? 'ほか ' + (evs.length - 1) + '件' : '') + (meetMin ? ' · 会議 ' + durShort(meetMin) : '') + '</span>';
    } else html += '<span class="v">' + (hol ? esc(hol) : '予定なし') + '</span>';
    html += '</div>' + (tw ? '<div class="tw' + (tw.rain ? ' rain' : '') + '" style="font-size:16px;white-space:nowrap">' + icon(tw.rain ? 'umbrella' : tw.icon, 18, 1.8) + '<span>' + (tw.rain ? '雨 ' + tw.pop + '%' : tw.label) + ' · ' + tw.hi + '°/' + tw.lo + '°</span></div>' : '') + '</div></div>';
  } else {
    html = '<div class="bottom-tile"><div class="tile jp" id="tomorrow"><div class="head"><div style="display:flex;align-items:baseline;gap:10px;min-width:0"><span>明日</span><span class="sub ellipsis">' +
      esc(mdw(tm) + (hol ? ' · ' + hol : '') + ' · ' + evs.length + '件') + '</span></div>' +
      (tw ? '<div class="tw' + (tw.rain ? ' rain' : '') + '">' + icon(tw.rain ? 'umbrella' : tw.icon, 18, 1.8) + '<span>' + (tw.rain ? '雨 ' + tw.pop + '%' : tw.label) + ' · ' + tw.hi + '°/' + tw.lo + '°</span></div>' : '') + '</div>';
    if (!evs.length) html += '<div class="empty" style="font-size:18px">予定はありません</div>';
    else {
      const show = evs.length > 3 ? evs.slice(0, 2) : evs;
      show.forEach((ev) => { html += rowHtml(ev, '', true, null); });
      if (evs.length > 3) html += '<div class="more" style="padding-top:2px">ほか ' + (evs.length - 2) + '件</div>';
    }
    html += '</div>' + weekHtml(t, false) + '</div>';
  }
  $('bottom').innerHTML = html;
}

/* 夜の画面 */
function renderNight(t) {
  $('nTime').textContent = t.getHours() + ':' + pad(t.getMinutes());
  const hol = state.holidays.get(ymd(t));
  $('nDate').textContent = (t.getMonth() + 1) + '月' + t.getDate() + '日 ' + WD[t.getDay()] + '曜日' + (hol ? ' · ' + hol : '');
  const rest = timedOn(t).filter((ev) => ev.e > t);
  let a;
  if (rest.length) {
    const live = rest[0].s <= t;
    a = '<span class="l">' + (live ? '進行中' : 'このあと') + '</span><span class="v num">' + hm(rest[0].s) + '</span><span class="s ellipsis">' + esc(rest[0].title) + '</span>' +
      '<span class="x">' + (live ? hm(rest[0].e) + ' まで · ' : '') + (rest.length > 1 ? 'ほか ' + (rest.length - 1) + '件' : '今日はこれで最後') + '</span>';
  } else {
    const base = mode(t) === 'sleep' && t.getHours() < 12 ? t : addDays(t, 1);
    const evs = timedOn(base);
    const label = base === t ? '今日の最初の予定' : '明日の最初の予定';
    const meetMin = evs.filter(isMeeting).reduce((s, ev) => s + mins(ev.s, ev.e), 0);
    a = evs.length
      ? '<span class="l">' + label + '</span><span class="v num">' + hm(evs[0].s) + '</span><span class="s ellipsis">' + esc(evs[0].title) + '</span>' +
        '<span class="x">' + (evs.length > 1 ? 'ほか ' + (evs.length - 1) + '件' : '予定はこの1件') + (meetMin ? ' · 会議 ' + durShort(meetMin) : '') + '</span>'
      : '<span class="l">' + label + '</span><span class="s" style="margin-top:auto;margin-bottom:auto">予定はありません</span>';
  }
  $('nA').innerHTML = a;
  const tw = tomorrowWeather(mode(t) === 'sleep' && t.getHours() < 12 ? addDays(t, -1) : t);
  $('nB').innerHTML = tw
    ? '<span class="l">' + (mode(t) === 'sleep' && t.getHours() < 12 ? '今日の天気' : '明日の天気') + '</span><div style="display:flex;align-items:center;gap:14px">' + icon(tw.rain ? 'rain' : tw.icon, 50, 1.5) +
      '<span class="v num">' + tw.hi + '°</span><span class="x" style="font-size:20px">/ ' + tw.lo + '°</span></div>' +
      '<span class="s">' + (tw.rain ? '雨 ' + tw.pop + '%' : tw.label + (tw.pop >= 20 ? ' · 降水 ' + tw.pop + '%' : '')) + '</span>' +
      '<span class="x">' + (tw.rain ? '傘を忘れずに' : '傘はいらなさそう') + '</span>'
    : '<span class="l">明日の天気</span><span class="s" style="margin-top:auto;margin-bottom:auto">取得中…</span>';
  const m = mode(t);
  $('nStatus').textContent = isOffDay(t) && m !== 'day' ? 'お休みの日 · 画面は自動で消えます'
    : m === 'evening' ? '夜間表示 · ' + SETTINGS.screenOff + ' に画面オフ'
    : '消灯中 · ' + SETTINGS.dayStart + ' から通常表示';
}

/* =====================================================================
   集中タイマー
   ===================================================================== */
const timer = { phase: 'focus', running: false, endAt: 0, left: SETTINGS.focusMinutes * 60, iv: null };
function doneToday() { const d = store.get('pomo', {}); return d.date === ymd(now()) ? d.n : 0; }
function addDone() { store.set('pomo', { date: ymd(now()), n: doneToday() + 1 }); }
function timerLeft() { return timer.running ? Math.max(0, Math.round((timer.endAt - Date.now()) / 1000)) : timer.left; }
function renderTimer() {
  const left = timerLeft();
  $('tmTime').textContent = Math.floor(left / 60) + ':' + pad(left % 60);
  $('tmLabel').textContent = timer.phase === 'focus' ? (timer.running ? '集中しています' : '集中タイマー') : (timer.running ? '休憩中' : '休憩');
  const n = doneToday();
  let dots = '';
  for (let i = 0; i < SETTINGS.focusGoal; i++) dots += '<i class="' + (i < n ? 'on' : '') + '"></i>';
  $('tmDots').innerHTML = dots + '<span style="margin-left:6px">今日 ' + n + ' / ' + SETTINGS.focusGoal + '</span>';
  $('tmPlay').innerHTML = timer.running ? ICON_PAUSE : ICON_PLAY;
  $('tmPlay').setAttribute('aria-label', timer.running ? 'タイマーを一時停止' : (timer.phase === 'focus' ? '集中タイマーを開始' : '休憩を開始'));
  const full = (timer.phase === 'focus' ? SETTINGS.focusMinutes : SETTINGS.breakMinutes) * 60;
  $('tmReset').hidden = timer.running || left === full;
}
let audioCtx = null;
function chime() {
  if (!SETTINGS.chime || !audioCtx) return;
  [0, 0.28].forEach((d, i) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = i ? 880 : 660; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime + d);
    g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + d + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + d + 0.5);
    o.connect(g); g.connect(audioCtx.destination); o.start(audioCtx.currentTime + d); o.stop(audioCtx.currentTime + d + 0.55);
  });
}
function timerTick() {
  if (timerLeft() > 0) { renderTimer(); return; }
  clearInterval(timer.iv); timer.running = false;
  if (timer.phase === 'focus') { addDone(); timer.phase = 'break'; timer.left = SETTINGS.breakMinutes * 60; }
  else { timer.phase = 'focus'; timer.left = SETTINGS.focusMinutes * 60; }
  chime(); renderTimer();
}
$('tmPlay').addEventListener('click', () => {
  if (!audioCtx && SETTINGS.chime) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (timer.running) { timer.left = timerLeft(); timer.running = false; clearInterval(timer.iv); }
  else { timer.endAt = Date.now() + timer.left * 1000; timer.running = true; timer.iv = setInterval(timerTick, 1000); }
  renderTimer();
});
$('tmReset').innerHTML = icon('reset', 22, 1.8);
$('tmReset').addEventListener('click', () => {
  timer.phase = 'focus'; timer.left = SETTINGS.focusMinutes * 60; renderTimer();
});

/* =====================================================================
   設定画面
   ===================================================================== */
function openSetup(msg) {
  // 接続URL（キー入り）は画面に出さない。変えるときだけ貼り付ける
  $('fUrl').value = '';
  $('fUrl').placeholder = conf.url ? '設定済み（キー末尾 …' + conf.url.slice(-4) + '）。変えるときだけ貼り付け' : 'https://script.google.com/macros/s/…/exec?key=…';
  $('fTheme').value = conf.theme; $('fTomorrow').value = conf.tomorrow; $('fMeet').value = conf.meetTarget; $('fFont').value = conf.font;
  $('fPlace').value = conf.place;
  $('setupMsg').textContent = msg || '';
  $('btnClose').hidden = !conf.url && !conf.demo;
  $('setup').hidden = false;
}
function saveLooks() {
  conf.theme = $('fTheme').value; conf.tomorrow = $('fTomorrow').value; conf.meetTarget = $('fMeet').value; conf.font = $('fFont').value;
  if (!own(THEMES, conf.theme)) conf.theme = 'forest';
  if (!own(FONT_STYLES, conf.font)) conf.font = 'standard';
  store.set('theme', conf.theme); store.set('tomorrow', conf.tomorrow); store.set('meetTarget', conf.meetTarget); store.set('font', conf.font);
  const place = $('fPlace').value;
  conf.place = place === 'auto' || own(SETTINGS.places, place) ? place : SETTINGS.defaultPlace;
  store.set('place', conf.place);
  state.lastWeather = 0;
}
$('setupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const typed = normalizeUrl($('fUrl').value);
  const u = typed || conf.url;
  if (!u) { $('setupMsg').textContent = '接続URLを貼り付けるか、「デモデータで表示」を選んでください'; return; }
  if (!CONN_RE.test(u)) { $('setupMsg').textContent = 'Apps Script の URL（末尾に ?key= と32桁の英数字）を貼り付けてください'; return; }
  conf.url = u; conf.demo = false;
  store.set('url', conf.url); store.set('demo', false);
  saveLooks();
  if (conf.place === 'auto') {
    $('setupMsg').textContent = '現在地を確認しています…';
    const ok = await locate(true);
    if (!ok && !conf.geo) { $('setupMsg').textContent = '現在地を取得できなかったので、福岡の天気を表示します'; await sleep(1800); }
  }
  $('setup').hidden = true; applyTheme(); start();
});
$('btnDemo').addEventListener('click', () => {
  conf.demo = true; store.set('demo', true);
  saveLooks();
  $('setup').hidden = true; applyTheme(); start();
});
$('btnClose').addEventListener('click', () => { $('setup').hidden = true; });
$('fTheme').addEventListener('change', () => { if ($('fTheme').value === 'tron') $('fFont').value = 'cyber'; });

let pressTimer = null;
$('clock').addEventListener('pointerdown', () => { pressTimer = setTimeout(() => openSetup(), 1200); });
['pointerup', 'pointercancel', 'pointerleave'].forEach((n) => $('clock').addEventListener(n, () => clearTimeout(pressTimer)));

/* =====================================================================
   デモデータ
   ===================================================================== */
function demoPayload() {
  const t = now(), d = (k) => ymd(addDays(t, k));
  const mon = -((t.getDay() + 6) % 7);
  const ev = (k, s, e, title, o) => Object.assign({ title: title, start: d(k) + 'T' + s + ':00', end: d(k) + 'T' + e + ':00', cal: 'work', kind: 'work', busy: true, attendees: 4 }, o || {});
  const list = [
    ev(0, '09:30', '09:45', '朝会', { attendees: 8 }),
    ev(0, '11:00', '12:00', 'プロダクト定例', { attendees: 6, meet: 'https://meet.google.com/abc-defg-hij', teams: 'https://teams.microsoft.com/meet/1234567890?p=Demo' }),
    ev(0, '13:30', '14:00', '1on1', { attendees: 2, meet: 'https://meet.google.com/xyz-abcd-efg' }),
    ev(0, '15:00', '16:00', 'デザインレビュー', { attendees: 5 }),
    ev(0, '17:00', '18:30', '集中作業ブロック', { kind: 'focus', attendees: 0 }),
    ev(0, '19:30', '20:00', '歯医者', { cal: 'personal', kind: 'personal', attendees: 0 }),
    ev(1, '09:30', '10:30', '週次レビュー', { attendees: 7 }),
    ev(1, '14:00', '14:45', '採用面接', { attendees: 3 }),
    ev(1, '16:30', '16:45', 'クライアント定例', { attendees: 4 }),
  ];
  for (let k = mon; k < mon + 7; k++) if (k < 0) { list.push(ev(k, '10:00', '11:00', '定例')); list.push(ev(k, '15:00', '15:30', '打合せ')); }
  const toIso = (s) => parseLocal(s.slice(0, 16)).toISOString();
  return { events: list.map((e) => Object.assign({}, e, { start: toIso(e.start), end: toIso(e.end) })), holidays: [{ date: d(5), name: '文化の日' }] };
}
function demoWeather() {
  const t = day0(now()), time = [], temp = [], pop = [], code = [];
  for (let h = 0; h < 72; h++) {
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate(), h);
    time.push(ymd(d) + 'T' + pad(d.getHours()) + ':00');
    temp.push(14 + 6 * Math.sin((h % 24 - 9) / 24 * Math.PI * 2));
    pop.push(h < 18 ? 0 : h < 21 ? 10 : h < 24 ? 40 : h < 36 ? 60 : 20);
    code.push(h < 21 ? 1 : 61);
  }
  return { current: { temperature_2m: 18, weather_code: 1, is_day: 1 },
    hourly: { time: time, temperature_2m: temp, precipitation_probability: pop, weather_code: code },
    daily: { time: [0, 1, 2, 3, 4, 5, 6].map((k) => ymd(addDays(t, k))), weather_code: [1, 61, 3, 2, 0, 80, 3],
      temperature_2m_max: [21, 14, 17, 19, 22, 16, 18], temperature_2m_min: [12, 9, 10, 11, 13, 10, 9], precipitation_probability_max: [40, 60, 20, 10, 0, 70, 30] } };
}

/* =====================================================================
   起動・定期処理
   ===================================================================== */
let tickTimer = null;
function scheduleTick() {
  clearTimeout(tickTimer);
  const t = now();
  tickTimer = setTimeout(tick, (60 - t.getSeconds()) * 1000 - t.getMilliseconds() + 50);
}
function tick() {
  const t = now();
  const sleeping = mode(t) === 'sleep';
  const calEvery = (sleeping ? 30 : SETTINGS.calendarRefreshMin) * MIN;
  const wxEvery = (sleeping ? 60 : SETTINGS.weatherRefreshMin) * MIN;
  if (!conf.demo && conf.url && Date.now() - state.lastCalTry >= calEvery) fetchCalendar();
  if (Date.now() - state.lastWeather >= wxEvery) fetchWeather();
  // 1日1回（4時台）ページを読み直して最新の状態に
  if (t.getHours() === 4 && store.get('reloaded') !== ymd(t)) { store.set('reloaded', ymd(t)); location.reload(); return; }
  render(); syncWake(); scheduleTick();
}

function start() {
  refreshLocation();
  if (conf.demo) { setData(demoPayload()); state.weather = demoWeather(); state.lastWeather = Date.now(); }
  else {
    const c = store.get('cache', null);
    if (c) setData(c);
    const w = store.get('weather', null);
    if (w) state.weather = cleanWeather(w.w);
    state.lastCalTry = 0; state.lastWeather = 0;
  }
  render(); syncWake();
  if (!conf.demo) { fetchCalendar(); fetchWeather(); }
  scheduleTick();
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  const t = now();
  const sleeping = mode(t) === 'sleep';
  if (!conf.demo && conf.url && Date.now() - state.lastCalTry >= (sleeping ? 30 : SETTINGS.calendarRefreshMin) * MIN) fetchCalendar();
  if (!conf.demo && Date.now() - state.lastWeather >= SETTINGS.weatherRefreshMin * MIN) fetchWeather();
  render(); syncWake(); scheduleTick();
});
document.addEventListener('pointerdown', (e) => {
  if (!$('setup').hidden) return;
  if (shouldHoldScreen(now()) && !wakeLock) requestWake();
  if (!$('night').hidden) { state.peekUntil = Date.now() + SETTINGS.peekMinutes * MIN; render(); setTimeout(render, SETTINGS.peekMinutes * MIN + 500); }
});
$('wakeBtn').addEventListener('click', requestWake);
$('next').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-meet]');
  if (b) openOnMac(b.getAttribute('data-meet'));
});
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', fit);

applyTheme(); fit();
if (!conf.url && !conf.demo) { setData({ events: [], holidays: [] }); render(); openSetup(); }
else start();
