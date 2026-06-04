/* ================= STUDENT LIST + PROFILE ================= */

function StudentList({ go, onAdd }) {
  const [q, setQ] = React.useState('');
  const [room, setRoom] = React.useState('ทั้งหมด');
  const [risk, setRisk] = React.useState('ทั้งหมด');
  const [visit, setVisit] = React.useState('ทั้งหมด');

  const rooms = ['ทั้งหมด', ...Array.from(new Set(window.STUDENTS.map(s => s.classroom)))];
  const list = window.STUDENTS.filter(s => {
    if (room !== 'ทั้งหมด' && s.classroom !== room) return false;
    if (risk !== 'ทั้งหมด' && s.level.label !== risk) return false;
    if (visit === 'เยี่ยมแล้ว' && !s.visit.done) return false;
    if (visit === 'ยังไม่เยี่ยม' && s.visit.done) return false;
    if (q && !`${window.fullName(s)} ${s.code} ${s.classroom}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="view stack">
      <div className="card card--pad">
        <div className="row wrap" style={{ gap: 10 }}>
          <div className="row" style={{ flex: 1, minWidth: 200, gap: 9, background: 'var(--surface-2)',
            border: '1.5px solid var(--line)', borderRadius: 11, padding: '0 14px', height: 44 }}>
            <Icon name="search" size={18} style={{ color: 'var(--ink-3)' }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหาชื่อ / รหัสนักเรียน / ห้อง"
              style={{ border: 'none', outline: 'none', background: 'none', flex: 1, height: '100%' }} />
          </div>
          <Picker value={room} onChange={setRoom} options={rooms} icon="users" />
          <Picker value={risk} onChange={setRisk} options={['ทั้งหมด', 'ปกติ', 'เฝ้าระวัง', 'เสี่ยง', 'เร่งด่วน']} icon="shield" />
          <Picker value={visit} onChange={setVisit} options={['ทั้งหมด', 'เยี่ยมแล้ว', 'ยังไม่เยี่ยม']} icon="home" />
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card__head">
          <h3>รายชื่อนักเรียน</h3>
          <span className="sub">พบ {list.length} คน</span>
          <div className="row right" style={{ gap: 8 }}>
            <button className="btn btn--ghost btn--sm"><Icon name="download" size={15} />ส่งออก</button>
            {onAdd && <button className="btn btn--soft btn--sm" onClick={onAdd}><Icon name="plus" size={15} />เพิ่มนักเรียน</button>}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl student-table">
            <thead>
              <tr>
                <th>นักเรียน</th><th>ห้อง</th><th>ผู้ปกครอง</th><th>การเยี่ยมบ้าน</th><th>ความเสี่ยง</th><th></th>
              </tr>
            </thead>
            <tbody>
              {list.map(s => (
                <tr key={s.id} className="clickable" onClick={() => go('profile', s.id)}>
                  <td>
                    <div className="studentcell">
                      <Avatar s={s} size={40} />
                      <div><b>{window.fullName(s)}</b><span>รหัส {s.code}</span></div>
                    </div>
                  </td>
                  <td><span className="fw5">{s.classroom}</span></td>
                  <td>
                    <div style={{ fontSize: 13.5 }}>{s.guardian.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.guardian.relation} · {s.guardian.phone}</div>
                  </td>
                  <td>
                    {s.visit.done
                      ? <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
                          <span className="badge badge--ok"><Icon name="check" size={13} />เยี่ยมแล้ว</span>
                          {!s.visit.complete && <span style={{ fontSize: 11, color: 'var(--r-watch)', display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="warn" size={11} />ข้อมูลไม่ครบ</span>}
                          {s.visit.date && <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.visit.date}</span>}
                        </div>
                      : <span className="badge badge--gray"><span className="d"></span>ยังไม่เยี่ยม</span>}
                  </td>
                  <td><RiskBadge level={s.level} withScore score={s.score} /></td>
                  <td style={{ textAlign: 'right', color: 'var(--ink-3)' }}><Icon name="chevron" size={18} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div className="empty">ไม่พบนักเรียนตามเงื่อนไข</div>}
        </div>
      </div>
    </div>
  );
}

function Picker({ value, onChange, options, icon }) {
  return (
    <div className="row" style={{ gap: 8, background: 'var(--surface-2)', border: '1.5px solid var(--line)',
      borderRadius: 11, padding: '0 12px 0 13px', height: 44 }}>
      <Icon name={icon} size={17} style={{ color: 'var(--ink-3)' }} />
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ border: 'none', outline: 'none', background: 'none', height: '100%', fontWeight: 500, cursor: 'pointer', paddingRight: 4 }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ---------- PROFILE ---------- */
function StudentProfile({ id, go, openVisit, readOnly }) {
  const s = window.STUDENTS.find(x => x.id === id) || window.STUDENTS[0];
  const [tab, setTab] = React.useState('info');
  const [, bump] = React.useReducer(x => x + 1, 0);
  const tabs = [
    { k: 'info', label: 'ข้อมูลพื้นฐาน' },
    { k: 'family', label: 'ครอบครัว' },
    { k: 'risk', label: 'คะแนนความเสี่ยง' },
    { k: 'photos', label: 'ภาพถ่าย' },
    { k: 'history', label: 'ประวัติการเยี่ยม' },
  ];
  return (
    <div className="view stack">
      <button className="btn btn--ghost btn--sm" style={{ alignSelf: 'flex-start' }} onClick={() => go('students')}>
        <Icon name="back" size={16} />กลับรายชื่อ
      </button>

      {/* HERO */}
      <div className="card card--pad">
        <div className="profile-hero">
          <AvatarUpload s={s} size={112} radius={24} editable={!readOnly} onChange={bump} />
          <div className="ident">
            <h2 style={{ margin: '0 0 9px' }}>{window.fullName(s)}</h2>
            <div className="row wrap" style={{ gap: 8, marginBottom: 13 }}>
              <RiskBadge level={s.level} withScore score={s.score} />
              {s.family.econ.includes('ยากจน') && <span className="badge badge--gray"><Icon name="coins" size={13} />{s.family.econ}</span>}
            </div>
            <div className="row wrap" style={{ gap: 16, color: 'var(--ink-2)', fontSize: 13.5 }}>
              <span className="row" style={{ gap: 6 }}><Icon name="users" size={15} />{s.classroom} เลขที่ {s.no}</span>
              <span className="row" style={{ gap: 6 }}><Icon name="user" size={15} />ครู{s.advisor}</span>
              <span className="row" style={{ gap: 6 }}><Icon name="clipboard" size={15} />รหัส {s.code}</span>
            </div>
            <div className="row wrap" style={{ gap: 9, marginTop: 16 }}>
              {!readOnly && <button className="btn btn--primary btn--sm" onClick={openVisit}><Icon name="clipboard" size={15} />บันทึกการเยี่ยมบ้าน</button>}
              <button className="btn btn--ghost btn--sm" onClick={() => go('map', s.id)}><Icon name="pin" size={15} />ดูบนแผนที่</button>
              <button className="btn btn--ghost btn--sm"><Icon name="phone" size={15} />โทรผู้ปกครอง</button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="card card--pad">
        <div className="tabs">
          {tabs.map(t => (
            <button key={t.k} className={`tab ${tab === t.k ? 'is-active' : ''}`} onClick={() => setTab(t.k)}>{t.label}</button>
          ))}
        </div>

        {tab === 'info' && <ProfileInfo s={s} />}
        {tab === 'family' && <ProfileFamily s={s} />}
        {tab === 'risk' && <ProfileRisk s={s} />}
        {tab === 'photos' && <ProfilePhotos s={s} readOnly={readOnly} />}
        {tab === 'history' && <ProfileHistory s={s} openVisit={openVisit} readOnly={readOnly} />}
      </div>
    </div>
  );
}

function MetaGrid({ items }) {
  return (
    <div className="meta-grid">
      {items.map((it, i) => (
        <div className="cell" key={i}>
          <div className="k">{it.k}</div>
          <div className="v">{it.v}</div>
        </div>
      ))}
    </div>
  );
}

function ProfileInfo({ s }) {
  return (
    <div className="stack">
      <div className="section-title">ข้อมูลนักเรียน</div>
      <MetaGrid items={[
        { k: 'ชื่อ-สกุล', v: window.fullName(s) },
        { k: 'ชื่อเล่น', v: s.nick },
        { k: 'รหัสนักเรียน', v: s.code },
        { k: 'เลขประจำตัวประชาชน', v: s.citizen },
        { k: 'ห้องเรียน', v: `${s.classroom} เลขที่ ${s.no}` },
        { k: 'เพศ', v: s.gender },
        { k: 'ครูที่ปรึกษา', v: s.advisor },
        { k: 'การเดินทาง', v: s.factors.includes('far_school') ? 'เกิน 10 กม.' : 'ปกติ' },
      ]} />
    </div>
  );
}

function ProfileFamily({ s }) {
  const g = s.guardian, f = s.family;
  return (
    <div className="stack">
      <div className="section-title">ข้อมูลผู้ปกครอง</div>
      <MetaGrid items={[
        { k: 'ชื่อผู้ปกครอง', v: g.name },
        { k: 'ความสัมพันธ์', v: g.relation },
        { k: 'อาชีพ', v: g.occupation },
        { k: 'การศึกษาสูงสุด', v: g.edu },
        { k: 'เบอร์โทรศัพท์', v: g.phone },
        { k: 'รายได้/เดือน', v: g.income ? `${g.income.toLocaleString()} บ.` : '—' },
      ]} />
      <div className="section-title mt8">ข้อมูลครัวเรือน</div>
      <MetaGrid items={[
        { k: 'จำนวนสมาชิก', v: `${f.members} คน` },
        { k: 'ประเภทที่อยู่อาศัย', v: f.type },
        { k: 'ฐานะเศรษฐกิจ', v: f.econ },
        { k: 'รายได้เฉลี่ย/คน', v: `${f.incomePerHead.toLocaleString()} บ.` },
        { k: 'การอยู่อาศัย', v: f.liveWith },
      ]} />
      <div className="section-title mt8">ความสัมพันธ์ในครอบครัว</div>
      <div className="chip-row">
        {f.relations.map((r, i) => {
          const tone = { 'สนิทสนม': 'ok', 'เฉย ๆ': 'gray', 'ห่างเหิน': 'watch', 'ขัดแย้ง': 'urgent', 'ไม่มี': 'gray' }[r.lv] || 'gray';
          return <span key={i} className={`badge badge--${tone}`}>{r.who}: {r.lv}</span>;
        })}
      </div>
    </div>
  );
}

function ProfileRisk({ s }) {
  const factors = s.factors.map(k => ({ key: k, ...window.RISK_FACTORS[k] }));
  return (
    <div className="grid" style={{ gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'start' }}>
      <div style={{ textAlign: 'center' }}>
        <RingScore score={s.score} level={s.level} />
        <div className="mt12"><RiskBadge level={s.level} /></div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 10, maxWidth: 170 }}>
          คำนวณอัตโนมัติจากปัจจัยที่พบในการเยี่ยมบ้าน
        </div>
        <div className="card--pad" style={{ background: 'var(--surface-2)', borderRadius: 12, marginTop: 14, textAlign: 'left' }}>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginBottom: 8, fontWeight: 600 }}>เกณฑ์</div>
          {[['0–20', 'ปกติ', 'ok'], ['21–40', 'เฝ้าระวัง', 'watch'], ['41–60', 'เสี่ยง', 'risk'], ['61+', 'เร่งด่วน', 'urgent']].map((x, i) => (
            <div key={i} className="row" style={{ justifyContent: 'space-between', padding: '3px 0', fontSize: 12.5 }}>
              <span className={`badge badge--${x[2]}`} style={{ padding: '2px 9px' }}>{x[1]}</span>
              <span className="tabular muted">{x[0]}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="section-title">ปัจจัยความเสี่ยงที่ตรวจพบ ({factors.length})</div>
        {factors.length === 0
          ? <div className="card--pad" style={{ background: 'var(--r-ok-bg)', borderRadius: 12, color: 'var(--r-ok)' }}>
              <Icon name="check-circle" size={18} /> ไม่พบปัจจัยความเสี่ยง — นักเรียนอยู่ในเกณฑ์ปกติ
            </div>
          : <div>
              {factors.map((f, i) => {
                const tone = f.pts >= 20 ? 'urgent' : f.pts >= 10 ? 'risk' : 'watch';
                return (
                  <div className="factor" key={i}>
                    <div className="fi" style={{ background: `var(--r-${tone}-bg)`, color: `var(--r-${tone})` }}>
                      <Icon name={f.icon} size={18} />
                    </div>
                    <div className="ft"><b>{f.label}</b><span>หมวด: {f.cat}</span></div>
                    <div className="pts" style={{ color: `var(--r-${tone})` }}>+{f.pts}</div>
                  </div>
                );
              })}
              <div className="row" style={{ justifyContent: 'flex-end', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                <span className="muted">คะแนนรวม</span>
                <span className="tabular" style={{ fontSize: 22, fontWeight: 600, color: s.level.color }}>{s.score}</span>
              </div>
            </div>}
      </div>
    </div>
  );
}

function ProfilePhotos({ s, readOnly }) {
  const [, bump] = React.useReducer(x => x + 1, 0);
  const slots = [
    { slot: 'home_ext', cap: 'สภาพบ้านภายนอก' },
    { slot: 'home_int', cap: 'ภายในบ้าน' },
    { slot: 'student_guardian', cap: 'นักเรียนกับผู้ปกครอง' },
  ];
  const stored = window.PhotoStore.get(s.id);
  const hasAny = slots.some(sl => stored[sl.slot]);
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="section-title">คลังภาพการเยี่ยมบ้าน</div>
        {!readOnly && <span className="badge badge--gray"><Icon name="camera" size={13} />แตะช่องรูปเพื่ออัปโหลด</span>}
      </div>
      {readOnly && !hasAny
        ? <div className="empty">ยังไม่มีภาพถ่าย</div>
        : <div className="gallery">
            {slots.map(sl => <UploadSlot key={sl.slot} studentId={s.id} slot={sl.slot} caption={sl.cap} editable={!readOnly} onChange={bump} />)}
          </div>}
      {!readOnly && (
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          * รูปจะถูกบันทึกในเครื่องและแสดงเป็นรูปประจำตัวนักเรียนทั่วทั้งระบบ
        </div>
      )}
    </div>
  );
}

function ProfileHistory({ s, openVisit, readOnly }) {
  if (!s.visit.done) {
    return <div className="empty">
      <div style={{ marginBottom: 14 }}>ยังไม่มีประวัติการเยี่ยมบ้าน</div>
      {!readOnly && <button className="btn btn--primary btn--sm" onClick={openVisit}><Icon name="clipboard" size={15} />เริ่มบันทึกการเยี่ยมบ้าน</button>}
    </div>;
  }
  return (
    <div className="timeline">
      <div className="tl-item">
        <div className="dot" style={{ borderColor: s.level.color }}></div>
        <div className="when">{s.visit.date} · โดยครู{s.visit.by}</div>
        <b>บันทึกการเยี่ยมบ้าน</b>
        <p>{s.visit.summary}</p>
        <div className="row" style={{ gap: 8, marginTop: 8 }}>
          {s.visit.photos && <span className="badge badge--brand"><Icon name="camera" size={13} />แนบรูป {s.gallery} รูป</span>}
          <span className="badge badge--gray"><Icon name="gps" size={13} />บันทึกพิกัด GPS</span>
          <span className="badge badge--gray"><Icon name="pen" size={13} />ลงนามผู้ปกครอง</span>
        </div>
      </div>
      <div className="tl-item">
        <div className="dot"></div>
        <div className="when">{s.visit.date}</div>
        <b>คัดกรองนักเรียนยากจน</b>
        <p>รายได้ครัวเรือนเฉลี่ย {s.family.incomePerHead.toLocaleString()} บ./คน · ฐานะ{s.family.econ}</p>
      </div>
    </div>
  );
}

Object.assign(window, { StudentList, StudentProfile });
