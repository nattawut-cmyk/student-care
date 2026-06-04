/* ================= มุมมองผู้ปกครอง (ParentView) ================= */
/* ผู้ปกครองเห็นเฉพาะข้อมูลของบุตรหลานตนเอง — อ่านอย่างเดียว */

function ParentView({ user, onLogout }) {
  // ผูกผู้ปกครองกับบุตรหลานจากชื่อผู้ปกครอง (fallback คนแรก)
  const child = (user && window.STUDENTS.find(s => s.guardian.name === user.name))
    || window.STUDENTS.find(s => s.guardian.relation === 'มารดา') || window.STUDENTS[0];
  const [tab, setTab] = React.useState('overview');
  const photos = window.PhotoStore.get(child.id);
  const photoSlots = [['home_ext', 'สภาพบ้าน'], ['home_int', 'ภายในบ้าน'], ['student_guardian', 'กับผู้ปกครอง']];

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      <header style={{ background: 'var(--brand-700)', color: '#fff', padding: '16px 20px' }}>
        <div className="row" style={{ maxWidth: 760, margin: '0 auto', gap: 12 }}>
          <img src="assets/logo.png" alt="" style={{ width: 38, height: 38, background: '#fff', borderRadius: 9, padding: 2 }} />
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 15 }}>ระบบผู้ปกครอง</b>
            <div style={{ fontSize: 11.5, opacity: .8 }}>{user ? user.name : window.SCHOOL.name}</div>
          </div>
          <button className="btn btn--sm" onClick={onLogout} style={{ background: 'rgba(255,255,255,.15)', color: '#fff' }}>
            <Icon name="logout" size={16} />ออก
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 16px 60px' }} className="view stack">
        {/* child hero */}
        <div className="card card--pad">
          <div className="row" style={{ gap: 16 }}>
            <Avatar s={child} size={84} radius={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>บุตรหลานของท่าน</div>
              <h2 style={{ fontSize: 22, fontWeight: 600 }}>{window.fullName(child)}</h2>
              <div className="row wrap" style={{ gap: 8, marginTop: 6 }}>
                <span className="badge badge--brand">{child.classroom}</span>
                <span className="badge badge--gray">รหัส {child.code}</span>
              </div>
            </div>
          </div>
          <div className="row wrap" style={{ gap: 9, marginTop: 16 }}>
            <button className="btn btn--primary btn--sm"><Icon name="phone" size={15} />ติดต่อครูที่ปรึกษา</button>
            <button className="btn btn--ghost btn--sm"><Icon name="bell" size={15} />การแจ้งเตือน</button>
          </div>
        </div>

        {/* visit status */}
        <div className="card card--pad">
          <div className="section-title" style={{ marginTop: 0 }}>สถานะการเยี่ยมบ้าน</div>
          {child.visit.done
            ? <div className="row" style={{ gap: 12 }}>
                <div className="kpi__icon" style={{ background: 'var(--r-ok-bg)', color: 'var(--r-ok)' }}><Icon name="check-circle" size={22} /></div>
                <div style={{ flex: 1 }}>
                  <div className="fw5">เยี่ยมบ้านแล้ว</div>
                  <div className="muted" style={{ fontSize: 13 }}>{child.visit.date} · โดยครู{child.visit.by}</div>
                </div>
              </div>
            : <div className="row" style={{ gap: 12 }}>
                <div className="kpi__icon" style={{ background: 'var(--surface-2)', color: 'var(--ink-3)' }}><Icon name="clock" size={22} /></div>
                <div><div className="fw5">รอการเยี่ยมบ้าน</div><div className="muted" style={{ fontSize: 13 }}>ครูจะนัดหมายเร็ว ๆ นี้</div></div>
              </div>}
          {child.visit.summary && <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line-2)' }}>{child.visit.summary}</p>}
        </div>

        {/* info grid */}
        <div className="card card--pad">
          <div className="tabs">
            {[['overview', 'ข้อมูลทั่วไป'], ['family', 'ครอบครัว'], ['photos', 'ภาพถ่าย']].map(([k, l]) =>
              <button key={k} className={`tab ${tab === k ? 'is-active' : ''}`} onClick={() => setTab(k)}>{l}</button>)}
          </div>
          {tab === 'overview' && <MetaGrid items={[
            { k: 'ชื่อ-สกุล', v: window.fullName(child) },
            { k: 'ชื่อเล่น', v: child.nick },
            { k: 'ห้องเรียน', v: `${child.classroom} เลขที่ ${child.no}` },
            { k: 'ครูที่ปรึกษา', v: child.advisor },
          ]} />}
          {tab === 'family' && <MetaGrid items={[
            { k: 'ผู้ปกครอง', v: child.guardian.name },
            { k: 'ความสัมพันธ์', v: child.guardian.relation },
            { k: 'อาชีพ', v: child.guardian.occupation },
            { k: 'เบอร์โทร', v: child.guardian.phone },
            { k: 'จำนวนสมาชิก', v: `${child.family.members} คน` },
            { k: 'ที่อยู่อาศัย', v: child.family.type },
          ]} />}
          {tab === 'photos' && (
            photoSlots.some(([sl]) => photos[sl])
              ? <div className="gallery">{photoSlots.map(([sl, cap]) => <UploadSlot key={sl} studentId={child.id} slot={sl} caption={cap} editable={false} />)}</div>
              : <div className="empty">ยังไม่มีภาพถ่ายจากการเยี่ยมบ้าน</div>
          )}
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)' }}>
          ข้อมูลนี้แสดงเฉพาะผู้ปกครองที่ลงทะเบียนกับโรงเรียนเท่านั้น
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ParentView });
