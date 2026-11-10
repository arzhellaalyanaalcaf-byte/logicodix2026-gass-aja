// =============================================================
// Ilustrasi SVG buatan tangan (vektor, ringan, beranimasi CSS).
// Semua warna disetel agar serasi dengan palet BanjirEuy.
// =============================================================
let uid = 0;
const id = (p) => `${p}${++uid}`;

/* ---------- Logo ---------- */
export function logo(size = 26) {
  const g = id('lg');
  return `<svg class="brand-mark" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
    <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f8ef5"/><stop offset="1" stop-color="#1446b8"/></linearGradient></defs>
    <path d="M16 2.5S6 13.4 6 20.2a10 10 0 0 0 20 0C26 13.4 16 2.5 16 2.5Z" fill="url(#${g})"/>
    <path d="M9.2 21.4c1.5 1 2.6 1 4 0s2.6-1 4 0 2.6 1 4 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="12.3" cy="14.5" r="1.8" fill="#fff" opacity=".7"/>
  </svg>`;
}

/* ---------- Bagian-bagian adegan ---------- */
function cloud(x, y, s = 1, fill = '#8fa6c9', shade = '#7891b8') {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="60" cy="40" rx="60" ry="26" fill="${shade}"/>
    <circle cx="38" cy="30" r="26" fill="${fill}"/><circle cx="72" cy="20" r="32" fill="${fill}"/><circle cx="104" cy="34" r="22" fill="${fill}"/>
    <ellipse cx="68" cy="44" rx="58" ry="16" fill="${fill}"/>
    <ellipse cx="62" cy="14" rx="18" ry="7" fill="#fff" opacity=".18"/>
  </g>`;
}

function tree(x, y, s = 1, c1 = '#4fae6c', c2 = '#3a9258', delay = 0) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="tree-sway" style="animation-delay:${delay}s">
    <rect x="-5" y="-6" width="10" height="46" rx="3" fill="#8a5a3c"/>
    <circle cx="0" cy="-30" r="30" fill="${c2}"/><circle cx="-20" cy="-14" r="22" fill="${c2}"/><circle cx="20" cy="-12" r="22" fill="${c2}"/>
    <circle cx="-6" cy="-38" r="22" fill="${c1}"/><circle cx="14" cy="-26" r="18" fill="${c1}"/><circle cx="-22" cy="-20" r="14" fill="${c1}"/>
    <circle cx="-10" cy="-44" r="7" fill="#fff" opacity=".15"/>
  </g></g>`;
}

function windowEl(x, y, w = 34, h = 30, lit = false) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#4d6f9f"/>
    <rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="1" fill="${lit ? '#ffe9a8' : '#a9c6ec'}"/>
    <path d="M${x + w / 2} ${y + 3}v${h - 6}M${x + 3} ${y + h / 2}h${w - 6}" stroke="#4d6f9f" stroke-width="2"/>
    <path d="M${x + 5} ${y + h - 6}l${w * 0.35} -${h * 0.55}" stroke="#fff" stroke-width="2" opacity=".35"/></g>`;
}

/** Gedung sekolah dengan atap merah, papan nama & bendera berkibar */
export function school(x, y, s = 1, opt = {}) {
  const { lit = false, sign = 'SMA' } = opt;
  let wins = '';
  const cols = [20, 62, 104, 214, 256, 298];
  for (const cx of cols) { wins += windowEl(cx, 72, 30, 28, lit) + windowEl(cx, 124, 30, 28, lit); }
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <!-- tiang bendera -->
    <rect x="34" y="-70" width="3" height="96" fill="#9aa7b8"/><circle cx="35.5" cy="-71" r="3" fill="#c9a14a"/>
    <g class="flag-wave"><rect x="37" y="-66" width="30" height="10" fill="#e11d2e"/><rect x="37" y="-56" width="30" height="10" fill="#fff"/></g>
    <!-- badan gedung -->
    <rect x="0" y="54" width="350" height="128" fill="#fbefdc"/>
    <rect x="0" y="54" width="350" height="8" fill="#ead9bf"/>
    <rect x="0" y="108" width="350" height="5" fill="#ead9bf"/>
    <!-- atap -->
    <path d="M-16 58 L26 16 L324 16 L366 58 Z" fill="#dc5442"/>
    <path d="M-16 58 L366 58 L366 66 L-16 66 Z" fill="#b13f30"/>
    <path d="M26 16 L324 16 L328 22 L22 22Z" fill="#ec7a63" opacity=".6"/>
    <!-- bagian tengah -->
    <rect x="140" y="30" width="70" height="152" fill="#fff6ea"/>
    <path d="M126 44 L175 -6 L224 44 Z" fill="#e45f4b"/><path d="M126 44 L224 44 L224 52 L126 52Z" fill="#b13f30"/>
    <rect x="152" y="22" width="46" height="16" rx="3" fill="#fff" stroke="#c9d6ea"/>
    <text x="175" y="34" text-anchor="middle" font-family="Plus Jakarta Sans,Arial" font-weight="800" font-size="11" fill="#183a80">${sign}</text>
    ${windowEl(158, 72, 34, 28, lit)}
    <rect x="160" y="122" width="30" height="60" rx="2" fill="#7b5236"/><rect x="163" y="125" width="11" height="54" fill="#8f6243"/><rect x="176" y="125" width="11" height="54" fill="#8f6243"/>
    <circle cx="173" cy="153" r="1.6" fill="#f2c14e"/>
    ${wins}
    <!-- talang & tiang -->
    <rect x="132" y="62" width="6" height="120" fill="#e8d6bb"/><rect x="212" y="62" width="6" height="120" fill="#e8d6bb"/>
  </g>`;
}

function waterBand(y, h, c1, c2, cls, amp = 8, op = 1) {
  // pola gelombang 2x lebar (1760) agar bisa digeser -50% tanpa putus
  const crest = ` q27.5 -${amp} 55 0 t55 0`.repeat(16);
  const d = `M0 ${y}${crest} V${y + h} H0 Z`;
  const g = id('wg');
  return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <g class="${cls}" opacity="${op}"><path d="${d}" fill="url(#${g})"/>
    <path d="M0 ${y}${crest}" stroke="#fff" stroke-opacity=".55" stroke-width="2.5" fill="none"/></g>`;
}

function ripples(points) {
  return points.map(([x, y, d]) => `<ellipse class="ripple" style="animation-delay:${d}s" cx="${x}" cy="${y}" rx="14" ry="4" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>`).join('');
}

/* ---------- Adegan hero (halaman awal) ---------- */
export function heroScene() {
  const sky = id('sky');
  return `<svg class="scene" viewBox="0 0 820 600" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
    <defs>
      <linearGradient id="${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3d6f0"/><stop offset=".6" stop-color="#dfeafa" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="820" height="600" fill="url(#${sky})"/>
    <g class="cloud-drift slow" opacity=".75">${cloud(80, 40, 1.3, '#a9bbd8', '#98acce')}${cloud(520, 10, 1.6, '#a9bbd8', '#98acce')}</g>
    <g class="cloud-drift">${cloud(260, 60, 1.5)}${cloud(600, 90, 1.1, '#8299bf', '#6f88b2')}</g>
    <!-- bukit jauh -->
    <path d="M0 410 C120 360 220 380 320 360 S560 330 820 370 V600 H0Z" fill="#c9dcf1"/>
    <path d="M0 440 C160 400 300 420 420 405 S680 390 820 410 V600 H0Z" fill="#b5cfe9"/>
    ${tree(250, 420, 1.15, '#5cb978', '#469d61', 0)}${tree(310, 432, .9, '#4fae6c', '#3a9258', .6)}
    ${school(390, 248, 1.12)}
    ${tree(790, 430, 1.25, '#4fae6c', '#3a9258', .3)}
    <!-- pagar -->
    <g fill="#e9eef6" stroke="#c4cfdf" stroke-width="1.2">${Array.from({ length: 22 }, (_, i) => `<rect x="${200 + i * 28}" y="438" width="6" height="34" rx="2"/>`).join('')}<rect x="196" y="446" width="620" height="5"/></g>
    <!-- air banjir -->
    ${waterBand(462, 150, '#8fb6e8', '#5f8fd4', 'wave-move rev', 7, .85)}
    ${waterBand(480, 140, '#7aa7e3', '#4d82cc', 'wave-move', 9, .95)}
    ${ripples([[300, 520, 0], [520, 540, .8], [680, 510, 1.6], [420, 560, 1.1]])}
  </svg>`;
}

/* ---------- Header beranda: sekolah kecil + awan ---------- */
export function homeSchool() {
  return `<svg class="school-art" viewBox="0 0 600 260" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
    <g class="cloud-drift" opacity=".9">${cloud(150, 18, .9, '#c4d5ee', '#b2c6e6')}${cloud(430, 6, .8, '#d1def2', '#c2d3ee')}</g>
    <path d="M0 220 C140 190 260 200 380 186 S540 176 600 186 V260 H0Z" fill="#d6e5f7"/>
    ${tree(200, 216, .9, '#62bd7e', '#4aa266', 0)}${tree(560, 214, 1, '#62bd7e', '#4aa266', .5)}
    ${school(250, 92, .82)}
    <rect x="0" y="240" width="600" height="20" fill="#cfe0f5"/>
  </svg>`;
}

/* ---------- Awan hujan di atas rumah tergenang ---------- */
export function houseRain(opt = {}) {
  const { water = .55, sun = false } = opt;
  const wy = 218 - water * 60;
  const drops = sun ? '' : Array.from({ length: 9 }, (_, i) => `<line class="svg-drop" style="animation-delay:${(i * 0.17).toFixed(2)}s" x1="${92 + i * 14}" y1="70" x2="${88 + i * 14}" y2="84" stroke="#4c86e0" stroke-width="3" stroke-linecap="round"/>`).join('');
  return `<svg viewBox="0 0 300 230" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    ${sun ? `<g class="sun-spin" style="transform-origin:230px 50px"><circle cx="230" cy="50" r="22" fill="#fbbf24"/>${Array.from({ length: 8 }, (_, i) => `<rect x="228" y="12" width="4" height="10" rx="2" fill="#fbbf24" transform="rotate(${i * 45} 230 50)"/>`).join('')}</g>` : ''}
    <g class="cloud-bob">${cloud(70, 10, 1.1, sun ? '#cfdcf0' : '#7f97bf', sun ? '#bfd0ea' : '#6c85b0')}</g>
    ${drops}
    <path d="M10 ${wy + 8} C80 ${wy - 4} 220 ${wy + 14} 290 ${wy}" stroke="none" fill="none"/>
    <g transform="translate(92 92)">
      <path d="M-14 52 L58 -6 L130 52 Z" fill="#dc5442"/><path d="M-14 52 L130 52 L130 58 L-14 58Z" fill="#b13f30"/>
      <rect x="2" y="56" width="112" height="80" fill="#fbefdc"/>
      <rect x="44" y="84" width="28" height="52" fill="#7b5236"/>
      ${windowEl(12, 72, 24, 22)}${windowEl(82, 72, 24, 22)}
      <rect x="86" y="10" width="12" height="26" fill="#a24a3a"/>
    </g>
    ${tree(40, 168, .55, '#62bd7e', '#4aa266', .2)}${tree(262, 170, .5, '#62bd7e', '#4aa266', .7)}
    <g opacity=".95">${waterBand(wy, 120, '#86b1e8', '#4f84ce', 'wave-move', 6)}</g>
    ${ripples([[80, wy + 18, 0], [200, wy + 26, 1]])}
  </svg>`;
}

/* ---------- Ilustrasi per topik edukasi ---------- */
export function topicArt(key) {
  switch (key) {
    case 'penyebab':
      return `<svg viewBox="0 0 300 230" aria-hidden="true">
        <g class="cloud-bob">${cloud(70, 6, 1, '#7f97bf', '#6c85b0')}</g>
        ${Array.from({ length: 8 }, (_, i) => `<line class="svg-drop" style="animation-delay:${i * .2}s" x1="${90 + i * 15}" y1="62" x2="${86 + i * 15}" y2="76" stroke="#4c86e0" stroke-width="3" stroke-linecap="round"/>`).join('')}
        <rect x="20" y="150" width="260" height="70" rx="6" fill="#9aa9bd"/><rect x="20" y="150" width="260" height="10" fill="#b8c4d4"/>
        <rect x="100" y="150" width="100" height="40" fill="#5d6b80"/>
        ${Array.from({ length: 6 }, (_, i) => `<rect x="${106 + i * 16}" y="150" width="6" height="40" fill="#3f4a5c"/>`).join('')}
        <g class="bob-slow"><rect x="112" y="128" width="26" height="30" rx="4" fill="#ef4444" transform="rotate(-12 125 143)"/><rect x="146" y="134" width="30" height="20" rx="6" fill="#f59e0b"/><circle cx="186" cy="146" r="11" fill="#22c55e"/><path d="M96 152 l18 -14 l10 14z" fill="#a78bfa"/></g>
        <path d="M30 150 q20 -12 40 0 t40 0" stroke="#5f8fd4" stroke-width="5" fill="none" opacity=".8"/>
        <path d="M196 150 q20 -12 40 0 t40 0" stroke="#5f8fd4" stroke-width="5" fill="none" opacity=".8"/>
        <circle cx="250" cy="44" r="18" fill="#fff" stroke="#e11d48" stroke-width="4"/><path d="M250 34v12M250 52v1" stroke="#e11d48" stroke-width="4" stroke-linecap="round"/>
      </svg>`;
    case 'dampak':
      return houseRain({ water: .9 });
    case 'sebelum':
      return `<svg viewBox="0 0 300 230" aria-hidden="true">
        <circle cx="150" cy="120" r="96" fill="#e3edfd"/>
        <g class="bob-slow"><rect x="104" y="40" width="98" height="130" rx="10" fill="#fff" stroke="#c7d6ee" stroke-width="2"/>
        <rect x="132" y="32" width="42" height="16" rx="4" fill="#1a56db"/>
        ${[0, 1, 2, 3].map((i) => `<rect x="118" y="${66 + i * 24}" width="14" height="14" rx="3" fill="${i < 3 ? '#16a34a' : '#fff'}" stroke="#16a34a" stroke-width="2"/>${i < 3 ? `<path d="M121 ${73 + i * 24}l3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/>` : ''}<rect x="140" y="${69 + i * 24}" width="${48 - i * 6}" height="7" rx="3" fill="#c9dafb"/>`).join('')}</g>
        <g transform="translate(206 120) rotate(12)"><rect x="0" y="0" width="58" height="72" rx="14" fill="#5b8ff2"/><rect x="10" y="30" width="38" height="30" rx="8" fill="#3d72d8"/><path d="M14 0 q15 -22 30 0" stroke="#2a56a8" stroke-width="6" fill="none"/></g>
        <g transform="translate(40 128) rotate(-10)"><rect width="46" height="60" rx="6" fill="#facc15"/><rect x="6" y="8" width="34" height="8" rx="3" fill="#fff" opacity=".7"/><circle cx="23" cy="38" r="9" fill="#fff" opacity=".7"/></g>
      </svg>`;
    case 'saat':
      return `<svg viewBox="0 0 300 230" aria-hidden="true">
        <g class="cloud-bob">${cloud(150, 0, .85, '#7f97bf', '#6c85b0')}</g>
        <path d="M30 210 L30 120 L110 120 L110 70 L190 70 L190 30 L270 30 L270 210Z" fill="#dbe7f7"/>
        <path d="M30 120h80v-50h80v-40h80" stroke="#93b0d8" stroke-width="3" fill="none"/>
        <g class="climb"><path d="M70 150 C110 140 120 100 150 92 S210 60 230 52" stroke="#16a34a" stroke-width="5" stroke-dasharray="10 8" fill="none" stroke-linecap="round"/>
        <path d="M222 40 l16 10 -14 12" stroke="#16a34a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
        <g transform="translate(222 4)"><rect x="0" y="0" width="54" height="22" rx="6" fill="#16a34a"/><text x="27" y="15" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Plus Jakarta Sans,Arial">AMAN</text></g>
        ${waterBand(165, 70, '#86b1e8', '#4f84ce', 'wave-move', 6)}
      </svg>`;
    case 'setelah':
      return `<svg viewBox="0 0 300 230" aria-hidden="true">
        <g class="sun-spin" style="transform-origin:238px 46px"><circle cx="238" cy="46" r="24" fill="#fbbf24"/>${Array.from({ length: 8 }, (_, i) => `<rect x="236" y="6" width="4" height="10" rx="2" fill="#fbbf24" transform="rotate(${i * 45} 238 46)"/>`).join('')}</g>
        ${cloud(40, 20, .7, '#e3ebf7', '#d3dff0')}
        <g transform="translate(70 80)"><path d="M-12 44 L52 -6 L116 44 Z" fill="#dc5442"/><rect x="2" y="44" width="100" height="74" fill="#fbefdc"/><rect x="40" y="70" width="24" height="48" fill="#7b5236"/>${windowEl(10, 58, 22, 20)}${windowEl(72, 58, 22, 20)}<rect x="2" y="100" width="100" height="18" fill="#c8a77e" opacity=".55"/></g>
        <rect x="0" y="198" width="300" height="32" fill="#c8a77e"/><ellipse cx="90" cy="206" rx="40" ry="5" fill="#a9895f"/>
        <g class="bob-slow" transform="translate(206 150)"><path d="M0 10 h40 l-6 40 h-28z" fill="#1a56db"/><rect x="-2" y="4" width="44" height="8" rx="3" fill="#2f6fea"/><path d="M8 4 q12 -18 24 0" stroke="#183a80" stroke-width="3" fill="none"/></g>
        <g transform="translate(250 120) rotate(18)"><rect x="0" y="0" width="5" height="76" fill="#8a5a3c"/><path d="M-10 76 h25 l4 18 h-33z" fill="#f59e0b"/></g>
      </svg>`;
    case 'cuaca':
      return `<svg viewBox="0 0 300 230" aria-hidden="true">
        <rect x="40" y="40" width="220" height="150" rx="16" fill="#fff" stroke="#c7d6ee" stroke-width="2"/>
        <rect x="40" y="40" width="220" height="34" rx="16" fill="#1a56db"/><rect x="40" y="58" width="220" height="16" fill="#1a56db"/>
        <text x="58" y="62" font-size="12" font-weight="800" fill="#fff" font-family="Plus Jakarta Sans,Arial">PRAKIRAAN CUACA</text>
        <g transform="translate(58 86)">${wxIcon(61, false, 56)}</g>
        <text x="124" y="114" font-size="28" font-weight="800" fill="#0f2a63" font-family="Plus Jakarta Sans,Arial">26°</text>
        <text x="124" y="132" font-size="11" font-weight="700" fill="#5d6b85" font-family="Plus Jakarta Sans,Arial">Hujan Sedang</text>
        ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${64 + i * 30}" y="${176 - [10, 18, 30, 22, 12, 6][i]}" width="16" height="${[10, 18, 30, 22, 12, 6][i]}" rx="3" fill="${i === 2 ? '#1a56db' : '#9fbcf3'}"/>`).join('')}
        <g transform="translate(228 20)"><circle r="20" fill="#e3edfd"/><path d="M0 -12 v12 l8 6" stroke="#1a56db" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      </svg>`;
    default:
      return houseRain();
  }
}

/* ---------- Adegan simulasi (parametrik) ---------- */
/* rumah dua lantai untuk adegan simulasi di rumah */
function rumahScene(night) {
  const win = night ? '#fde68a' : '#cfe1fb';
  const small = (x, y, roof, wall) => `<g transform="translate(${x} ${y})"><path d="M-10 40 L55 0 L120 40Z" fill="${roof}"/><rect x="0" y="40" width="110" height="80" fill="${wall}"/><rect x="18" y="58" width="26" height="22" rx="2" fill="${win}"/><rect x="66" y="66" width="26" height="54" rx="2" fill="#8a5a3c"/></g>`;
  return `${small(-30, 186, '#b45309', '#f3e3c8')}${small(492, 192, '#2563eb', '#e8eef9')}
  <g transform="translate(176 92)">
    <path d="M-22 74 L124 0 L270 74Z" fill="#c2410c"/><path d="M-22 74 L124 0 L124 14 L-4 74Z" fill="#9a3412" opacity=".35"/>
    <rect x="0" y="74" width="248" height="166" fill="#fdf2e3"/><rect x="0" y="150" width="248" height="8" fill="#e8d5b9"/>
    ${[22, 104, 186].map((x) => `<rect x="${x}" y="92" width="42" height="40" rx="3" fill="${win}" stroke="#d6c3a5" stroke-width="3"/><path d="M${x + 21} 92 V132" stroke="#d6c3a5" stroke-width="2"/>`).join('')}
    <rect x="22" y="172" width="42" height="38" rx="3" fill="${win}" stroke="#d6c3a5" stroke-width="3"/><rect x="186" y="172" width="42" height="38" rx="3" fill="${win}" stroke="#d6c3a5" stroke-width="3"/>
    <rect x="100" y="168" width="48" height="72" rx="3" fill="#7c4a2d"/><circle cx="140" cy="206" r="3" fill="#fbbf24"/>
    <rect x="-6" y="236" width="260" height="8" fill="#cbb89a"/>
  </g>`;
}

/* deretan ruko dan lampu jalan untuk adegan di jalan */
function jalanScene(night) {
  const win = night ? '#fde68a' : '#d6e6fb';
  const ruko = [[0, 120, 150, '#f1d9c0', '#ef4444'], [150, 96, 150, '#dbe6f5', '#2563eb'], [300, 132, 140, '#f6e7c1', '#16a34a'], [440, 108, 170, '#e9dcf3', '#f59e0b']];
  return `${ruko.map(([x, y, w, wall, aw]) => `<g><rect x="${x}" y="${y}" width="${w}" height="${300 - y}" fill="${wall}" stroke="#c9d3e3" stroke-width="2"/>
    ${[0, 1, 2].map((c) => `<rect x="${x + 16 + c * (w - 32) / 3}" y="${y + 18}" width="${(w - 32) / 3 - 10}" height="26" rx="2" fill="${win}"/>`).join('')}
    <path d="M${x + 6} ${y + 70} h${w - 12} l-10 18 h-${w - 32}z" fill="${aw}"/>
    ${Array.from({ length: Math.floor((w - 12) / 22) }, (_, i) => `<rect x="${x + 10 + i * 22}" y="${y + 70}" width="11" height="18" fill="#fff" opacity=".35"/>`).join('')}
    <rect x="${x + 14}" y="${y + 96}" width="${w - 28}" height="${204 - 96}" fill="#94a3b8" opacity=".35"/>
    ${Array.from({ length: 6 }, (_, i) => `<path d="M${x + 14} ${y + 104 + i * 14} h${w - 28}" stroke="#7b8aa1" stroke-width="2" opacity=".45"/>`).join('')}
  </g>`).join('')}
  <rect x="0" y="292" width="600" height="88" fill="#6b7280"/><path d="M0 334 H600" stroke="#f8fafc" stroke-width="5" stroke-dasharray="34 26"/>
  <g><rect x="96" y="150" width="7" height="150" fill="#475569"/><path d="M99 152 q22 -14 40 0" stroke="#475569" stroke-width="5" fill="none"/><ellipse cx="140" cy="156" rx="10" ry="5" fill="${night ? '#fde047' : '#e2e8f0'}"/></g>`;
}

export function simScene(o = {}) {
  const { water = .3, lightning = false, sun = false, pole = false, gate = false, car = false, night = false, mud = false, place = 'sekolah' } = o;
  const sky = id('ss');
  const wy = 290 - water * 170;
  const skyTop = sun ? '#9cc3f2' : night ? '#33456e' : '#7f93b5';
  const skyBot = sun ? '#e6f1ff' : night ? '#56688f' : '#b9c7dc';
  const drops = sun ? '' : Array.from({ length: 70 }, () => {
    const x = Math.random() * 640 - 20; const y = Math.random() * 380; const d = (Math.random() * 1.2).toFixed(2); const l = 10 + Math.random() * 10;
    return `<line class="svg-rain" style="animation-delay:-${d}s" x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x - 4).toFixed(0)}" y2="${(y + l).toFixed(0)}" stroke="#dbe8fb" stroke-opacity=".7" stroke-width="1.5"/>`;
  }).join('');
  return `<svg class="scene" viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBot}"/></linearGradient></defs>
    <rect width="600" height="380" fill="url(#${sky})"/>
    ${sun ? `<g class="sun-spin" style="transform-origin:520px 60px"><circle cx="520" cy="60" r="28" fill="#fbbf24"/>${Array.from({ length: 10 }, (_, i) => `<rect x="518" y="14" width="4" height="12" rx="2" fill="#fbbf24" transform="rotate(${i * 36} 520 60)"/>`).join('')}</g>` : ''}
    <g class="cloud-drift">${cloud(20, 10, 1.2, sun ? '#e7eef9' : '#6d84ab', sun ? '#d8e3f4' : '#5c739b')}${cloud(330, -6, 1.5, sun ? '#eef3fb' : '#7a90b6', sun ? '#dde6f4' : '#677ea6')}</g>
    ${lightning ? `<path class="bolt" d="M300 60 l-22 52 h20 l-16 46 l40 -62 h-22 l18 -36z" fill="#fde047" stroke="#facc15" stroke-width="2"/>` : ''}
    <path d="M0 240 C120 214 260 226 380 212 S540 208 600 220 V380 H0Z" fill="${sun ? '#cfe2f6' : '#a6b9d4'}"/>
    ${tree(60, 254, 1, '#4fae6c', '#3a9258', 0)}${tree(560, 252, 1.05, '#4fae6c', '#3a9258', .4)}
    ${place === 'rumah' ? rumahScene(night) : place === 'jalan' ? jalanScene(night) : school(110, 126, 1.08, { lit: night })}
    ${gate ? `<g><rect x="70" y="250" width="12" height="90" fill="#6b7a90"/><rect x="510" y="250" width="12" height="90" fill="#6b7a90"/><path d="M82 262 H510" stroke="#6b7a90" stroke-width="6"/>${Array.from({ length: 18 }, (_, i) => `<rect x="${92 + i * 23}" y="262" width="4" height="70" fill="#8796ab"/>`).join('')}</g>` : ''}
    ${pole ? `<g><rect x="470" y="150" width="8" height="190" fill="#7a8699"/><rect x="452" y="160" width="44" height="6" fill="#7a8699"/><path d="M456 166 C430 230 420 260 400 ${wy - 4}" stroke="#1f2937" stroke-width="3" fill="none"/><g class="spark"><path d="M394 ${wy - 10} l8 6 -10 2 8 8" stroke="#facc15" stroke-width="3" fill="none"/><circle cx="400" cy="${wy - 4}" r="6" fill="#fde047" opacity=".8"/></g></g>` : ''}
    ${car ? `<g transform="translate(360 ${wy - 32})"><rect x="0" y="10" width="120" height="34" rx="10" fill="#e11d48"/><path d="M18 10 l14 -20 h50 l16 20z" fill="#be123c"/><rect x="36" y="-6" width="20" height="14" fill="#bfdbfe"/><rect x="62" y="-6" width="20" height="14" fill="#bfdbfe"/></g>` : ''}
    ${mud ? `<rect x="0" y="320" width="600" height="60" fill="#b08d62"/><ellipse cx="200" cy="330" rx="80" ry="8" fill="#9a7a52"/><ellipse cx="460" cy="340" rx="60" ry="6" fill="#9a7a52"/>` : ''}
    ${water > 0 ? waterBand(wy, 400 - wy, '#8bb4e9', '#3f74c2', 'wave-move', 7, .9) + waterBand(wy + 14, 400 - wy, '#79a6e4', '#3a6cb8', 'wave-move rev', 9, .85) : ''}
    ${water > 0 ? ripples([[150, wy + 30, 0], [330, wy + 46, .7], [480, wy + 24, 1.4]]) : ''}
    <g class="rain-svg">${drops}</g>
  </svg>`;
}

/* ---------- Ikon fitur berwarna (kartu Beranda) ---------- */
export const featureIcon = {
  edukasi: () => `<svg class="f-ico" viewBox="0 0 80 80" aria-hidden="true">
    <ellipse cx="40" cy="70" rx="26" ry="4" fill="#dbe7f7"/>
    <path d="M10 18 C22 12 32 14 40 20 V66 C32 60 22 58 10 64Z" fill="#3b7cf0"/><path d="M70 18 C58 12 48 14 40 20 V66 C48 60 58 58 70 64Z" fill="#1a56db"/>
    <path d="M14 22 C24 18 32 19 38 24 V60 C31 56 23 55 14 58Z" fill="#e8f0ff"/><path d="M66 22 C56 18 48 19 42 24 V60 C49 56 57 55 66 58Z" fill="#fff"/>
    <path d="M19 31 h14 M19 38 h14 M19 45 h10 M47 31 h14 M47 38 h14 M47 45 h10" stroke="#9fbcf3" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,
  starter: () => `<svg class="f-ico" viewBox="0 0 80 80" aria-hidden="true">
    <ellipse cx="40" cy="72" rx="24" ry="4" fill="#e5e0fb"/>
    <path d="M28 18 q12 -16 24 0" stroke="#5b3fd1" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="16" y="18" width="48" height="52" rx="14" fill="#8b6cf6"/><rect x="16" y="18" width="48" height="20" rx="12" fill="#a08af8"/>
    <rect x="23" y="42" width="34" height="22" rx="7" fill="#6d4fe0"/><rect x="34" y="48" width="12" height="4" rx="2" fill="#c9bcfb"/>
    <rect x="10" y="38" width="8" height="20" rx="4" fill="#6d4fe0"/><rect x="62" y="38" width="8" height="20" rx="4" fill="#6d4fe0"/>
  </svg>`,
  kuis: () => `<svg class="f-ico" viewBox="0 0 80 80" aria-hidden="true">
    <ellipse cx="40" cy="68" rx="26" ry="4" fill="#e5e0fb"/>
    <path d="M14 34 C14 24 22 20 30 22 h20 C58 20 66 24 66 34 l4 18 c2 10 -8 14 -14 6 l-6 -8 H30 l-6 8 c-6 8 -16 4 -14 -6Z" fill="#7c5cf0"/>
    <path d="M20 34 C20 28 24 26 30 27 h20 c6 -1 10 1 10 7" stroke="#a08af8" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="23" y="35" width="12" height="4" rx="2" fill="#fff"/><rect x="27" y="31" width="4" height="12" rx="2" fill="#fff"/>
    <circle cx="51" cy="34" r="3" fill="#fde047"/><circle cx="57" cy="40" r="3" fill="#4ade80"/><circle cx="45" cy="40" r="3" fill="#60a5fa"/><circle cx="51" cy="46" r="3" fill="#f87171"/>
  </svg>`,
  simulasi: () => `<svg class="f-ico" viewBox="0 0 80 80" aria-hidden="true">
    <ellipse cx="40" cy="70" rx="26" ry="4" fill="#d5f3ee"/>
    <path d="M10 24 l20 -8 20 8 20 -8 v44 l-20 8 -20 -8 -20 8z" fill="#5eead4"/><path d="M30 16 v44 M50 24 v44" stroke="#14b8a6" stroke-width="2"/>
    <path d="M10 24 l20 -8 v44 l-20 8z" fill="#99f6e4"/><path d="M50 24 l20 -8 v44 l-20 8z" fill="#2dd4bf"/>
    <path d="M16 50 q10 -10 18 -2 t20 -10" stroke="#0f766e" stroke-width="2.4" stroke-dasharray="4 4" fill="none"/>
    <path d="M56 14 c-7 0 -11 5 -11 10 0 8 11 18 11 18 s11 -10 11 -18 c0 -5 -4 -10 -11 -10z" fill="#1a56db"/><circle cx="56" cy="24" r="4" fill="#fff"/>
  </svg>`,
  cuaca: () => `<svg class="f-ico" viewBox="0 0 80 80" aria-hidden="true">${wxIcon(80, false, 80, true)}</svg>`,
  ai: () => `<svg class="f-ico" viewBox="0 0 80 80" aria-hidden="true">
    <ellipse cx="40" cy="70" rx="24" ry="4" fill="#dbe7f7"/>
    <path d="M12 20 a8 8 0 0 1 8 -8 h40 a8 8 0 0 1 8 8 v26 a8 8 0 0 1 -8 8 H34 l-12 10 v-10 h-2 a8 8 0 0 1 -8 -8z" fill="#1a56db"/>
    <circle cx="28" cy="33" r="4" fill="#fff"/><circle cx="40" cy="33" r="4" fill="#fff"/><circle cx="52" cy="33" r="4" fill="#fff"/>
    <path d="M62 6 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#f59e0b"/>
  </svg>`,
};

/* ---------- Ikon cuaca beranimasi (berdasar kode cuaca BMKG) ---------- */
export function wxIcon(code, night = false, size = 64, mini = false) {
  const c = Number(code);
  const sun = (cx, cy, r) => night
    ? moon(cx, cy, r)
    : `<g class="sun-spin" style="transform-origin:${cx}px ${cy}px">${Array.from({ length: 8 }, (_, i) => `<rect x="${cx - 2}" y="${cy - r - 10}" width="4" height="7" rx="2" fill="#fbbf24" transform="rotate(${i * 45} ${cx} ${cy})"/>`).join('')}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbbf24"/><circle cx="${cx - r * .3}" cy="${cy - r * .3}" r="${r * .35}" fill="#fde68a"/>`;
  const moon = (cx, cy, r) => `<path d="M${cx + r * .2} ${cy - r} a${r} ${r} 0 1 0 ${r * .8} ${r * 1.6} a${r * .8} ${r * .8} 0 1 1 -${r * .8} -${r * 1.6}z" fill="#fde68a"/>`;
  const cl = (x, y, s, f = '#e7eef9', sh = '#c9d6ea') => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="30" cy="26" rx="28" ry="12" fill="${sh}"/><circle cx="20" cy="20" r="13" fill="${f}"/><circle cx="36" cy="14" r="16" fill="${f}"/><circle cx="50" cy="22" r="10" fill="${f}"/><ellipse cx="32" cy="28" rx="26" ry="8" fill="${f}"/></g>`;
  const drops = (n, x0, y0, gap, col = '#3b82f6') => Array.from({ length: n }, (_, i) => `<line class="svg-drop" style="animation-delay:${(i * .22).toFixed(2)}s" x1="${x0 + i * gap}" y1="${y0}" x2="${x0 + i * gap - 3}" y2="${y0 + 9}" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/>`).join('');
  const body = (() => {
    const celestial = night ? moon(28, 26, 14) : sun(28, 28, 13);
    if (c === 0) return night ? moon(40, 38, 20) : sun(40, 40, 18);
    if (c === 1 || c === 2) return `${night ? moon(30, 28, 15) : sun(30, 30, 14)}<g class="cloud-bob">${cl(24, 34, .95)}</g>`;
    if (c === 3) return `<g class="cloud-bob">${cl(4, 18, .9, '#dfe7f4', '#c2cfe4')}${cl(16, 30, 1.05)}</g>`;
    if (c === 4) return `<g class="cloud-bob">${cl(2, 16, .95, '#9fb0cc', '#8798b8')}${cl(16, 28, 1.05, '#b9c6dc', '#9eaecb')}</g>`;
    if ([5, 10, 45].includes(c)) return `${night ? '' : sun(40, 30, 14)}<g class="fog">${[0, 1, 2].map((i) => `<rect x="${12 + i * 4}" y="${44 + i * 10}" width="${56 - i * 8}" height="5" rx="2.5" fill="#a9b8d0"/>`).join('')}</g>`;
    if (c === 60) return `<g class="cloud-bob">${cl(10, 12, 1)}</g>${drops(2, 32, 56, 14)}`;
    if (c === 61) return `<g class="cloud-bob">${cl(10, 12, 1, '#cfdbee', '#aebfdc')}</g>${drops(3, 26, 56, 12)}`;
    if (c === 63) return `<g class="cloud-bob">${cl(10, 12, 1, '#94a6c4', '#7a8eb2')}</g>${drops(4, 22, 54, 11, '#2563eb')}`;
    if (c === 80) return `${celestial}<g class="cloud-bob">${cl(20, 26, .95)}</g>${drops(2, 40, 64, 12)}`;
    if (c === 95 || c === 97) return `<g class="cloud-bob">${cl(10, 10, 1, '#8b9ab8', '#6f80a3')}</g><path class="bolt" d="M42 46 l-8 14 h8 l-5 13 l14 -18 h-8 l6 -9z" fill="#facc15"/>${drops(2, 26, 56, 32)}`;
    return `<g class="cloud-bob">${cl(10, 20, 1)}</g>`;
  })();
  return mini ? body : `<svg class="wxi" width="${size}" height="${size}" viewBox="0 0 80 80" aria-hidden="true">${body}</svg>`;
}

/* ---------- Lencana & trofi ---------- */
export const badgeArt = {
  trophy: () => `<svg class="trophy" viewBox="0 0 120 120" aria-hidden="true">
    <ellipse cx="60" cy="110" rx="30" ry="5" fill="#dbe7f7"/>
    <path d="M30 18 h60 v18 c0 20 -12 34 -30 36 c-18 -2 -30 -16 -30 -36z" fill="#fbbf24"/>
    <path d="M30 24 h-12 c0 16 8 24 18 26" stroke="#f59e0b" stroke-width="6" fill="none"/><path d="M90 24 h12 c0 16 -8 24 -18 26" stroke="#f59e0b" stroke-width="6" fill="none"/>
    <path d="M38 22 h10 v22 c0 8 -4 14 -10 16z" fill="#fde68a" opacity=".8"/>
    <rect x="54" y="70" width="12" height="16" fill="#f59e0b"/><rect x="40" y="86" width="40" height="14" rx="4" fill="#1a56db"/><rect x="34" y="98" width="52" height="8" rx="3" fill="#183a80"/>
    <path d="M60 30 l4.5 9 10 1.5 -7.2 7 1.7 10 -9 -4.7 -9 4.7 1.7 -10 -7.2 -7 10 -1.5z" fill="#fff"/>
    <g class="twinkle"><path d="M98 8 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#fbbf24"/><path d="M16 50 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" fill="#60a5fa"/></g>
  </svg>`,
  star: () => `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 l6 12.5 13.6 2 -9.8 9.6 2.3 13.6 L24 35.3 11.9 41.7 14.2 28.1 4.4 18.5 18 16.5z" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round"/><path d="M24 11 l3.5 7.3" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/></svg>`,
  medal: () => `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 4 h8 l4 12 h-8z" fill="#3b82f6"/><path d="M34 4 h-8 l-4 12 h8z" fill="#ef4444"/><circle cx="24" cy="30" r="13" fill="#f472b6"/><circle cx="24" cy="30" r="9" fill="#fbcfe8"/><path d="M24 24 l2 4 4.4 .6 -3.2 3 .8 4.4 -4 -2.1 -4 2.1 .8 -4.4 -3.2 -3 4.4 -.6z" fill="#db2777"/></svg>`,
  shield: () => `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 l16 6 v12 c0 11 -7 18 -16 22 c-9 -4 -16 -11 -16 -22 V10z" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/><path d="M24 10 l11 4 v8 c0 8 -5 13 -11 16z" fill="#fde68a"/><path d="M24 15 c-3 4 -6 7 -6 10 a6 6 0 0 0 12 0 c0 -3 -3 -6 -6 -10z" fill="#1a56db"/></svg>`,
  book: () => `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#dbeafe"/><path d="M10 14 c6 -3 10 -2 14 1 v20 c-4 -3 -8 -4 -14 -1z" fill="#3b82f6"/><path d="M38 14 c-6 -3 -10 -2 -14 1 v20 c4 -3 8 -4 14 -1z" fill="#1d4ed8"/></svg>`,
  bag: () => `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#ede9fe"/><path d="M18 14 q6 -8 12 0" stroke="#5b3fd1" stroke-width="3" fill="none"/><rect x="13" y="14" width="22" height="24" rx="7" fill="#8b6cf6"/><rect x="17" y="25" width="14" height="9" rx="3" fill="#6d4fe0"/></svg>`,
  map: () => `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#ccfbf1"/><path d="M24 10 c-6 0 -10 4 -10 9 c0 7 10 17 10 17 s10 -10 10 -17 c0 -5 -4 -9 -10 -9z" fill="#14b8a6"/><circle cx="24" cy="19" r="4" fill="#fff"/></svg>`,
  cloud: () => `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#e0f2fe"/><circle cx="18" cy="16" r="6" fill="#fbbf24"/><path d="M15 32 a6 6 0 0 1 1 -12 a8 8 0 0 1 15 2 a5 5 0 0 1 2 10z" fill="#fff" stroke="#93c5fd" stroke-width="2"/></svg>`,
  hand: () => `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#dcfce7"/><path d="M14 30 c0 -8 6 -12 10 -12 s10 4 10 12 c0 4 -4 8 -10 8 s-10 -4 -10 -8z" fill="#22c55e"/><path d="M24 18 v-8 M24 10 c-3 -3 -6 -2 -7 1 M24 10 c3 -3 6 -2 7 1" stroke="#15803d" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
};

/* ---------- Ikon kartu Aksi Nyata ---------- */
export const aksiIcon = {
  tim: () => `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="20" cy="22" r="8" fill="#93c5fd"/><circle cx="44" cy="22" r="8" fill="#93c5fd"/><path d="M6 46 c0 -8 6 -13 14 -13 s14 5 14 13z" fill="#93c5fd"/><path d="M30 46 c0 -8 6 -13 14 -13 s14 5 14 13z" fill="#93c5fd"/><circle cx="32" cy="18" r="10" fill="#2563eb"/><path d="M14 52 c0 -10 8 -16 18 -16 s18 6 18 16z" fill="#2563eb"/></svg>`,
  rencana: () => `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="8" width="40" height="50" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><rect x="22" y="4" width="20" height="10" rx="3" fill="#2563eb"/><path d="M20 28 l4 4 7 -8" stroke="#2563eb" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M34 29 h10" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/><path d="M20 42 l4 4 7 -8" stroke="#2563eb" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M34 43 h10" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/></svg>`,
  kecil: () => `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 58 V30" stroke="#15803d" stroke-width="4" stroke-linecap="round"/><path d="M32 34 C18 34 10 24 10 12 C24 12 32 20 32 34z" fill="#22c55e"/><path d="M32 30 C46 30 54 20 54 8 C40 8 32 16 32 30z" fill="#16a34a"/><path d="M32 34 C24 26 18 20 12 14" stroke="#15803d" stroke-width="2" fill="none"/><ellipse cx="32" cy="58" rx="16" ry="4" fill="#bbf7d0"/></svg>`,
};

/* ---------- Ikon mini untuk item checklist ---------- */
export const itemIcon = (k) => {
  const m = {
    baju: '<path d="M10 6 l6 -3 h0 c1 3 6 3 8 0 l6 3 4 8 -6 3 v15 H12 V17 l-6 -3z" fill="#60a5fa"/>',
    jas: '<path d="M20 4 c-8 0 -12 6 -12 12 v18 h24 V16 c0 -6 -4 -12 -12 -12z" fill="#facc15"/><path d="M20 4 v30" stroke="#ca8a04" stroke-width="2"/>',
    senter: '<rect x="14" y="12" width="12" height="24" rx="3" fill="#475569"/><path d="M11 4 h18 l-3 8 h-12z" fill="#94a3b8"/><path d="M14 2 l-4 -2 M26 2 l4 -2 M20 2 v-3" stroke="#facc15" stroke-width="2"/>',
    obat: '<rect x="6" y="10" width="28" height="22" rx="5" fill="#f87171"/><path d="M20 15 v12 M14 21 h12" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>',
    makan: '<rect x="8" y="12" width="24" height="22" rx="4" fill="#fb923c"/><rect x="8" y="12" width="24" height="7" rx="3" fill="#fdba74"/><rect x="26" y="4" width="8" height="30" rx="3" fill="#38bdf8"/>',
    power: '<rect x="10" y="4" width="20" height="32" rx="5" fill="#334155"/><path d="M21 11 l-5 9 h5 l-2 8 6 -10 h-5 l2 -7z" fill="#4ade80"/>',
    dok: '<rect x="8" y="6" width="22" height="28" rx="3" fill="#e2e8f0"/><path d="M12 13 h14 M12 18 h14 M12 23 h9" stroke="#64748b" stroke-width="2"/><rect x="5" y="16" width="30" height="20" rx="4" fill="#93c5fd" opacity=".55"/>',
    peluit: '<circle cx="15" cy="23" r="9" fill="#f59e0b"/><rect x="15" y="14" width="18" height="9" rx="3" fill="#f59e0b"/><circle cx="15" cy="23" r="3" fill="#fff"/>',
    masker: '<rect x="8" y="12" width="24" height="16" rx="6" fill="#bae6fd"/><path d="M8 16 h-4 M8 24 h-4 M32 16 h4 M32 24 h4" stroke="#7dd3fc" stroke-width="2"/><path d="M12 18 h16 M12 22 h16" stroke="#7dd3fc" stroke-width="1.6"/>',
    p3k: '<rect x="6" y="10" width="28" height="22" rx="4" fill="#fff" stroke="#ef4444" stroke-width="2.5"/><path d="M20 15 v12 M14 21 h12" stroke="#ef4444" stroke-width="3.5"/><rect x="15" y="6" width="10" height="5" rx="2" fill="#ef4444"/>',
    uang: '<rect x="4" y="10" width="32" height="20" rx="3" fill="#86efac"/><circle cx="20" cy="20" r="5" fill="#22c55e"/>',
    kontak: '<rect x="11" y="3" width="18" height="34" rx="4" fill="#1e293b"/><rect x="13.5" y="7" width="13" height="23" rx="1" fill="#60a5fa"/><circle cx="20" cy="33.5" r="1.5" fill="#fff"/>',
    plastik: '<path d="M8 10 h24 l-2 24 h-20z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/><path d="M14 10 q6 -8 12 0" stroke="#60a5fa" stroke-width="2" fill="none"/>',
    sandal: '<ellipse cx="14" cy="22" rx="7" ry="13" fill="#a78bfa"/><ellipse cx="27" cy="20" rx="7" ry="13" fill="#8b5cf6"/>',
  };
  return `<svg class="cl-ico" viewBox="0 0 40 40" aria-hidden="true">${m[k] || m.dok}</svg>`;
};

/* ---------- Dekorasi daun latar starter pack ---------- */
export function leafBg() {
  return `<svg class="leaf-bg" viewBox="0 0 420 380" aria-hidden="true">
    <circle cx="210" cy="200" r="150" fill="#e3edfd"/>
    <g class="tree-sway" style="animation-duration:5s"><path d="M80 320 C40 260 50 190 110 150 C120 220 110 270 80 320z" fill="#86c99b"/><path d="M80 320 C90 250 100 200 110 150" stroke="#5aa875" stroke-width="3" fill="none"/></g>
    <g class="tree-sway" style="animation-duration:6s;animation-delay:.5s"><path d="M340 330 C390 270 380 200 320 160 C310 230 320 280 340 330z" fill="#6fbf88"/><path d="M340 330 C330 260 325 210 320 160" stroke="#4c9a68" stroke-width="3" fill="none"/></g>
    <g class="tree-sway" style="animation-duration:7s"><path d="M110 330 C70 300 60 250 90 220 C110 260 115 300 110 330z" fill="#a7dcb6"/></g>
    <circle cx="330" cy="100" r="6" fill="#93c5fd"/><circle cx="96" cy="110" r="4" fill="#93c5fd"/><circle cx="360" cy="230" r="3" fill="#60a5fa"/>
  </svg>`;
}

/* ---------- Latar Aksi Nyata ---------- */
export function aksiBg() {
  return `<svg viewBox="0 0 500 470" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
    <g class="cloud-drift" opacity=".9">${cloud(60, 30, .9, '#ffffff', '#e3ecf9')}${cloud(300, 10, .7, '#ffffff', '#e3ecf9')}</g>
    <path d="M0 360 C120 330 260 340 380 326 S480 320 500 330 V470 H0Z" fill="#d3e4f8"/>
    ${school(150, 196, .62)}
    ${[[-6, 262, .95, '#dc5442', '#fbefdc'], [96, 286, .8, '#2563eb', '#eef3fb'], [372, 270, .9, '#16a34a', '#fff6e6']].map(([x, y, k, roof, wall]) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-8 44 L58 0 L124 44Z" fill="${roof}"/><rect x="0" y="44" width="116" height="78" fill="${wall}" stroke="#d9c9ae" stroke-width="2"/><rect x="16" y="62" width="28" height="24" rx="3" fill="#cfe1fb" stroke="#d9c9ae" stroke-width="2"/><rect x="70" y="70" width="28" height="52" rx="3" fill="#8a5a3c"/></g>`).join('')}
    ${tree(30, 360, 1, '#62bd7e', '#4aa266', 0)}${tree(470, 350, 1.2, '#62bd7e', '#4aa266', .5)}
    <rect x="0" y="420" width="500" height="50" fill="#c6dbf3"/>
  </svg>`;
}

/* ---------- Ilustrasi tiap jenis banjir ---------- */
function rainLines(n, x0, x1, y0, y1, col = '#93b4e6') {
  return Array.from({ length: n }, (_, i) => {
    const x = x0 + ((x1 - x0) * (i + 0.5)) / n + ((i * 37) % 11) - 5; const y = y0 + ((i * 53) % (y1 - y0));
    return `<line class="svg-drop" style="animation-delay:${((i * 0.13) % 1.1).toFixed(2)}s" x1="${x}" y1="${y}" x2="${x - 3}" y2="${y + 11}" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`;
  }).join('');
}

export function floodTypeArt(key) {
  const sky = id('fs');
  const skyDef = (a, b) => `<defs><linearGradient id="${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="320" height="200" fill="url(#${sky})"/>`;
  if (key === 'genangan') {
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${skyDef('#9fb6d8', '#dce7f6')}
      <g class="cloud-drift">${cloud(10, 4, .8, '#7f97bf', '#6c85b0')}${cloud(170, -4, .9, '#8aa1c6', '#768fb7')}</g>
      <rect x="18" y="62" width="58" height="110" fill="#c3cfe0"/><rect x="84" y="40" width="64" height="132" fill="#aebfd6"/><rect x="214" y="54" width="54" height="118" fill="#b9c8dc"/><rect x="274" y="76" width="44" height="96" fill="#c9d4e4"/>
      ${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => `<rect x="${92 + c * 18}" y="${52 + r * 22}" width="10" height="12" rx="1" fill="#ffe9a8" opacity="${(r + c) % 2 ? .9 : .5}"/>`).join('')).join('')}
      ${[0, 1, 2].map((r) => [0, 1].map((c) => `<rect x="${26 + c * 24}" y="${74 + r * 26}" width="12" height="14" rx="1" fill="#eef3fb"/>`).join('')).join('')}
      <rect x="180" y="96" width="4" height="76" fill="#5b6b82"/><path d="M182 96 q14 -6 22 4" stroke="#5b6b82" stroke-width="4" fill="none"/><circle cx="204" cy="102" r="5" fill="#fde68a"/>
      <rect x="0" y="168" width="320" height="32" fill="#7d8aa0"/>
      <g transform="translate(118 140)"><path d="M0 22 h70 l-6 -16 h-12 l-8 -12 h-24 l-10 12 h-6z" fill="#e11d48"/><rect x="20" y="0" width="12" height="9" fill="#bfdbfe"/><rect x="36" y="0" width="12" height="9" fill="#bfdbfe"/><circle cx="14" cy="24" r="7" fill="#1f2937"/><circle cx="56" cy="24" r="7" fill="#1f2937"/></g>
      ${waterBand(156, 60, '#8bb4e9', '#4f84ce', 'wave-move', 4, .88)}
      ${ripples([[60, 176, 0], [250, 182, .9]])}
      ${rainLines(16, 0, 320, 10, 150)}
    </svg>`;
  }
  if (key === 'luapan') {
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${skyDef('#8fa9d1', '#dfe9f7')}
      <g class="cloud-drift">${cloud(150, 0, 1, '#7189b0', '#5f779f')}</g>
      <path d="M0 96 C60 70 120 82 170 74 S270 60 320 72 V200 H0Z" fill="#9fc79f"/>
      <path d="M0 110 C70 92 140 104 200 96 S290 86 320 92 V200 H0Z" fill="#7fb684"/>
      ${tree(40, 104, .55, '#5aa96f', '#3f8f57', 0)}${tree(286, 98, .6, '#5aa96f', '#3f8f57', .4)}
      <g transform="translate(218 104)"><path d="M-6 26 L22 4 L50 26Z" fill="#dc5442"/><rect x="0" y="26" width="44" height="30" fill="#fbefdc"/><rect x="18" y="38" width="10" height="18" fill="#7b5236"/></g>
      <g transform="translate(70 116)"><path d="M-6 22 L18 2 L42 22Z" fill="#e45f4b"/><rect x="0" y="22" width="36" height="26" fill="#fff6ea"/></g>
      <path d="M0 150 C80 136 160 160 240 146 S300 140 320 146" stroke="#6b8f5e" stroke-width="6" fill="none" opacity=".5"/>
      ${waterBand(138, 70, '#7fa9e2', '#3f74c2', 'wave-move', 6, .92)}
      ${waterBand(150, 60, '#6c9bdc', '#3568b4', 'wave-move rev', 7, .85)}
      ${ripples([[110, 166, 0], [190, 178, .7], [280, 170, 1.4]])}
      ${rainLines(10, 150, 300, 40, 120)}
    </svg>`;
  }
  if (key === 'bandang') {
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${skyDef('#8a9cbc', '#d8e2f0')}
      <g class="cloud-drift">${cloud(-10, -6, 1, '#6d7f9f', '#5b6c8c')}${cloud(150, -10, .9, '#7a8bac', '#677898')}</g>
      <path d="M0 60 L90 40 L170 92 L320 150 V200 H0Z" fill="#7a9a6c"/>
      <path d="M0 80 L70 64 L150 108 L320 166 V200 H0Z" fill="#5f8455"/>
      ${tree(30, 74, .5, '#4f8f5d', '#3a7449', 0)}${tree(62, 70, .42, '#4f8f5d', '#3a7449', .3)}${tree(118, 98, .45, '#4f8f5d', '#3a7449', .6)}
      <path d="M40 66 C90 84 120 100 160 118 S250 150 320 172 V200 H200 C170 186 120 160 80 130 S50 90 40 66Z" fill="#a0764a"/>
      <path class="mud-flow" d="M48 72 C95 92 125 108 165 126 S250 156 320 178" stroke="#c99a68" stroke-width="5" fill="none" stroke-dasharray="14 12" opacity=".9"/>
      <path class="mud-flow" d="M60 90 C105 112 135 128 175 144 S255 170 320 190" stroke="#c99a68" stroke-width="4" fill="none" stroke-dasharray="10 14" opacity=".8"/>
      <g class="tumble" style="transform-origin:150px 128px"><rect x="132" y="122" width="40" height="7" rx="3" fill="#6b4226" transform="rotate(18 152 125)"/></g>
      <ellipse class="tumble2" cx="210" cy="152" rx="10" ry="7" fill="#8a8f98"/><ellipse cx="248" cy="170" rx="8" ry="6" fill="#7c818a"/>
      <g transform="translate(262 120)"><path d="M-6 20 L18 0 L42 20Z" fill="#dc5442" transform="rotate(-6 18 10)"/><rect x="0" y="20" width="36" height="22" fill="#fbefdc" transform="rotate(-6 18 31)"/></g>
      ${rainLines(14, 0, 320, 20, 120, '#a9bbd6')}
    </svg>`;
  }
  // rob
  return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${skyDef('#f6c7a1', '#fde9d7')}
    <circle cx="258" cy="46" r="22" fill="#fff3d6"/><circle cx="268" cy="40" r="20" fill="#f9d2b0"/>
    ${cloud(20, 18, .6, '#fbe3cf', '#f3d1b5')}
    <path d="M0 108 H320 V200 H0Z" fill="#4f8fcf"/>
    ${waterBand(100, 30, '#5fa0dc', '#3f7fc2', 'wave-move', 5, 1)}
    <path d="M150 128 L320 128 V200 H120Z" fill="#e8d3a8"/>
    ${[0, 1, 2].map((i) => `<g transform="translate(${170 + i * 48} ${102 - (i % 2) * 6})"><rect x="4" y="30" width="3" height="20" fill="#8a5a3c"/><rect x="32" y="30" width="3" height="20" fill="#8a5a3c"/><path d="M-4 18 L20 0 L44 18Z" fill="${['#dc5442', '#2563eb', '#16a34a'][i]}"/><rect x="0" y="18" width="40" height="14" fill="#fbefdc"/><rect x="16" y="22" width="8" height="10" fill="#7b5236"/></g>`).join('')}
    <g class="bob-slow"><path d="M40 122 h60 l-10 14 h-42z" fill="#b45309"/><rect x="68" y="96" width="3" height="26" fill="#6b4226"/><path d="M71 98 l18 18 h-18z" fill="#fff"/></g>
    ${waterBand(140, 70, '#7fb0e6', '#3f7fc2', 'wave-move rev', 6, .85)}
    ${ripples([[200, 160, 0], [270, 170, .8]])}
  </svg>`;
}
