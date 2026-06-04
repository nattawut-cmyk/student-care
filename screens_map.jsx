/* ================= GIS MAP (จำลอง) ================= */

function MapScreen({ go, focusId }) {
  const [sel, setSel] = React.useState(focusId || null);
  const [filter, setFilter] = React.useState('all');
  const selS = sel ? window.STUDENTS.find(s => s.id === sel) : null;
  const visible = window.STUDENTS.filter(s => filter === 'all' || s.level.key === filter);

  return (
    <div className="view stack">
      <div className="card card--pad">
        <div className="row wrap" style={{ justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>แผนที่บ้านนักเรียน</h3>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>ต.ปากกราน อ.พระนครศรีอยุธยา · พิกัดบันทึกระหว่างเยี่ยมบ้าน</div>
          </div>
          <div className="seg">
            {[['all', 'ทั้งหมด'], ['ok', 'ปกติ'], ['watch', 'เฝ้าระวัง'], ['risk', 'เสี่ยง'], ['urgent', 'เร่งด่วน']].map(o => (
              <button key={o[0]} className={filter === o[0] ? 'is-on' : ''} onClick={() => setFilter(o[0])}>{o[1]}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: selS ? 'minmax(0,1fr) 320px' : '1fr', gap: 16 }}>
        <div className="map-shell">
          <div className="map-canvas">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0 }}>
              {/* river */}
              <path d="M-5 20 Q 30 35 45 55 T 80 95" fill="none" stroke="#bcd6ea" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
              {/* roads */}
              <g stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.95">
                <line x1="10" y1="15" x2="92" y2="22" />
                <line x1="50" y1="5" x2="46" y2="95" />
                <line x1="5" y1="62" x2="95" y2="70" />
                <line x1="72" y1="8" x2="80" y2="92" />
                <line x1="20" y1="40" x2="70" y2="44" />
              </g>
              <g stroke="#d4e3ef" strokeWidth="0.8">
                {Array.from({ length: 9 }).map((_, i) => <line key={'h' + i} x1="0" y1={i * 12} x2="100" y2={i * 12} />)}
                {Array.from({ length: 9 }).map((_, i) => <line key={'v' + i} x1={i * 12} y1="0" x2={i * 12} y2="100" />)}
              </g>
              {/* school marker */}
              <g transform="translate(48,46)">
                <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="var(--brand-700)" />
              </g>
            </svg>
            <div style={{ position: 'absolute', left: '48%', top: '46%', transform: 'translate(-50%,-150%)',
              fontSize: 11, fontWeight: 600, color: 'var(--brand-800)', background: 'rgba(255,255,255,.85)',
              padding: '2px 7px', borderRadius: 6, whiteSpace: 'nowrap' }}>🏫 โรงเรียนปากกรานพิทยา</div>

            {visible.map(s => (
              <div key={s.id} className="map-pin" style={{ left: `${s.gps.x}%`, top: `${s.gps.y}%` }}
                onClick={() => setSel(s.id)}>
                <svg width={sel === s.id ? 40 : 32} height={sel === s.id ? 40 : 32} viewBox="0 0 24 24">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z"
                    fill={s.level.color} stroke="#fff" strokeWidth="1.6" />
                  <circle cx="12" cy="9" r="2.4" fill="#fff" />
                </svg>
              </div>
            ))}

            <div className="map-legend">
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 5 }}>ระดับความเสี่ยง</div>
              {[['var(--r-ok)', 'ปกติ'], ['var(--r-watch)', 'เฝ้าระวัง'], ['var(--r-risk)', 'เสี่ยง'], ['var(--r-urgent)', 'เร่งด่วน']].map((x, i) => (
                <div className="row" key={i}><i style={{ background: x[0] }}></i><span>{x[1]}</span></div>
              ))}
            </div>
          </div>

          {selS && (
            <></>
          )}
        </div>

        {selS && (
          <div className="card card--pad view" style={{ alignSelf: 'start' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="section-title" style={{ margin: 0 }}>ข้อมูลพิกัด</span>
              <button onClick={() => setSel(null)} style={{ color: 'var(--ink-3)' }}><Icon name="x" size={18} /></button>
            </div>
            <div className="row" style={{ gap: 12, marginTop: 12 }}>
              <Avatar s={selS} size={52} radius={14} />
              <div>
                <div className="fw5" style={{ fontSize: 15 }}>{window.fullName(selS)}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{selS.classroom} · รหัส {selS.code}</div>
              </div>
            </div>
            <div className="mt12"><RiskBadge level={selS.level} withScore score={selS.score} /></div>
            <div className="divider"></div>
            <div className="stack" style={{ gap: 8, fontSize: 13.5 }}>
              <div className="row" style={{ gap: 8 }}><Icon name="home" size={15} style={{ color: 'var(--ink-3)' }} />{selS.family.type}</div>
              <div className="row" style={{ gap: 8 }}><Icon name="gps" size={15} style={{ color: 'var(--ink-3)' }} />
                <span className="tabular">14.{(3500 + Math.round(selS.gps.y * 3)).toString()}, 100.{(5200 + Math.round(selS.gps.x * 3)).toString()}</span></div>
              <div className="row" style={{ gap: 8 }}><Icon name="phone" size={15} style={{ color: 'var(--ink-3)' }} />{selS.guardian.phone}</div>
            </div>
            <button className="btn btn--primary btn--sm btn--block mt16" onClick={() => go('profile', selS.id)}>
              <Icon name="eye" size={15} />ดูโปรไฟล์เต็ม
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { MapScreen });
