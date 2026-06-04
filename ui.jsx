/* ================= UI PRIMITIVES (icons, charts, badges) ================= */

/* ---- Icon: stroke-based, 24x24 ---- */
const ICON_PATHS = {
  dashboard: '<path d="M3 3h8v8H3zM13 3h8v5h-8zM13 11h8v10h-8zM3 13h8v8H3z"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3 3 0 0 1 0 5.8M17 20a5.3 5.3 0 0 0-3-4.8"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
  file: '<path d="M14 3H6v18h12V7l-4-4Z"/><path d="M14 3v4h4M8 13h8M8 17h6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
  bell: '<path d="M18 9a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M10.3 20a2 2 0 0 0 3.4 0"/>',
  clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v1H9V4Z"/><path d="M9 11h6M9 15h4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/>',
  phone: '<path d="M5 3h3l2 5-2 1a12 12 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
  coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M15 12.5c2.8-.2 6-1.4 6-3.5"/><path d="M9 15v3c0 1.7 3.2 3 6 3s6-1.3 6-3v-5"/>',
  game: '<rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 12h3M8.5 10.5v3M15 11h.01M18 13h.01"/>',
  warn: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  'user-x': '<circle cx="9" cy="8" r="3.4"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="m16 9 5 5M21 9l-5 5"/>',
  heart: '<path d="M12 20s-7-4.6-9.2-9C1.2 8 3 4.5 6.3 4.8 8.3 5 9.6 6.4 12 9c2.4-2.6 3.7-4 5.7-4.2C21 4.5 22.8 8 21.2 11 19 15.4 12 20 12 20Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  accessible: '<circle cx="12" cy="4.5" r="1.8"/><path d="M12 7v6M7 9h10M12 13l-2 6M12 13l2 6"/>',
  health: '<path d="M5 12h3l2-5 3 10 2-5h4"/><rect x="2.5" y="4" width="19" height="16" rx="3"/>',
  route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.2 17.8C13 16 11 8 15.8 6.2"/>',
  split: '<path d="M12 3v6M12 9 7 21M12 9l5 12"/><circle cx="12" cy="3" r="1.6"/>',
  camera: '<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h0a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"/><circle cx="12" cy="13" r="3.5"/>',
  gps: '<circle cx="12" cy="11" r="3"/><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z"/>',
  pen: '<path d="M3 21l3-1 11-11-2-2L4 18l-1 3Z"/><path d="m14 7 3 3"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  back: '<path d="M15 6 9 12l6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"/>',
  print: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/>',
  scholarship: '<path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M21 9v5"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',
  shield: '<path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z"/>',
  pin: '<path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z"/><circle cx="12" cy="11" r="2.2"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M16 7h5v5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  arrowup: '<path d="M12 19V5M5 12l7-7 7 7"/>',
};

function Icon({ name, size = 20, sw = 2, style, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || '' }} />
  );
}

/* ---- Risk badge ---- */
function RiskBadge({ level, withScore, score }) {
  return (
    <span className={`badge badge--${level.cls}`}>
      <span className="d"></span>{level.label}{withScore ? ` · ${score}` : ''}
    </span>
  );
}

/* ---- Avatar (shows uploaded photo if present, else initials) ---- */
function Avatar({ s, size = 38, radius = 11 }) {
  const uploaded = window.PhotoStore ? window.PhotoStore.avatar(s.id) : null;
  if (uploaded) {
    return <img src={uploaded} alt="" style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover', flexShrink: 0 }} />;
  }
  const initials = (s.first || '?').slice(0, 1) + (s.last || '').slice(0, 1);
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
      color: '#fff', display: 'grid', placeItems: 'center',
      fontWeight: 600, fontSize: size * 0.36, letterSpacing: '.5px',
    }}>{initials}</div>
  );
}

/* ---- Donut chart (SVG) ---- */
function Donut({ data, size = 168, thickness = 26, centerLabel, centerValue }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="row" style={{ gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {data.map((d, i) => {
            const len = (d.value / total) * c;
            const seg = (
              <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={d.color} strokeWidth={thickness}
                strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
                style={{ transition: 'stroke-dasharray .7s ease' }} />
            );
            offset += len;
            return seg;
          })}
        </g>
        {centerValue !== undefined && (
          <text x="50%" y="47%" textAnchor="middle" fontSize="28" fontWeight="600"
            fill="var(--ink)" fontFamily="inherit">{centerValue}</text>
        )}
        {centerLabel && (
          <text x="50%" y="60%" textAnchor="middle" fontSize="12" fill="var(--ink-3)" fontFamily="inherit">{centerLabel}</text>
        )}
      </svg>
      <div className="donut-legend" style={{ flex: 1, minWidth: 150 }}>
        {data.map((d, i) => (
          <div className="row" key={i} style={{ gap: 9, fontSize: 13.5 }}>
            <i style={{ width: 11, height: 11, borderRadius: 3, background: d.color, flexShrink: 0 }}></i>
            <span style={{ color: 'var(--ink-2)' }}>{d.label}</span>
            <span className="v" style={{ marginLeft: 'auto', fontWeight: 600 }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Horizontal bar chart ---- */
function Bars({ data, color = 'var(--brand-500)', unit = '' }) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="stack" style={{ marginTop: 4 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{d.label}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{d.value}{unit}</span>
          </div>
          <div style={{ height: 10, background: 'var(--line-2)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${(d.value / max) * 100}%`,
              background: d.color || color, transition: 'width .7s cubic-bezier(.2,.8,.2,1)' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- Ring score (big, for profile) ---- */
function RingScore({ score, level, size = 150 }) {
  const thickness = 13;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(score, 100) / 100;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={thickness} />
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={level.color}
            strokeWidth={thickness} strokeLinecap="round"
            strokeDasharray={`${c * pct} ${c}`} style={{ transition: 'stroke-dasharray .8s ease' }} />
        </g>
      </svg>
      <div className="ring-val">
        <div style={{ fontSize: 38, fontWeight: 600, lineHeight: 1, color: level.color }}>{score}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>คะแนนเสี่ยง</div>
      </div>
    </div>
  );
}

/* ---- Photo placeholder slot ---- */
function PhotoSlot({ caption, filled }) {
  return (
    <div className="photo-slot">
      {filled ? <Icon name="camera" size={26} /> : <Icon name="camera" size={26} />}
      {!filled && <span style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>ยังไม่มีรูป</span>}
      <span className="cap">{caption}</span>
    </div>
  );
}

Object.assign(window, { Icon, RiskBadge, Avatar, Donut, Bars, RingScore, PhotoSlot });
