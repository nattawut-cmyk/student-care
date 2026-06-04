/* ================= DASHBOARDS ================= */

function KPICard({ icon, value, label, tint, delta, deltaDir, sub }) {
  return (
    <div className="card kpi">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="kpi__icon" style={{ background: tint.bg, color: tint.fg }}>
          <Icon name={icon} size={22} />
        </div>
        {delta && (
          <span className={`kpi__delta ${deltaDir}`}>
            <Icon name="trend" size={14} />{delta}
          </span>
        )}
      </div>
      <div>
        <div className="kpi__val tabular">{value}</div>
        <div className="kpi__label">{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  );
}

function ClassProgress({ onPick }) {
  return (
    <div className="card">
      <div className="card__head">
        <div>
          <h3>เปอร์เซ็นต์การเยี่ยมบ้านรายห้อง</h3>
          <div className="sub">เรียงตามความคืบหน้า · คลิกเพื่อดูรายห้อง</div>
        </div>
        <span className="badge badge--brand right"><Icon name="check-circle" size={14} />รวม 89%</span>
      </div>
      <div className="card--pad" style={{ paddingTop: 8 }}>
        {[...window.CLASS_PROGRESS].sort((a, b) => (a.visited / a.total) - (b.visited / b.total)).map((c, i) => {
          const pct = Math.round((c.visited / c.total) * 100);
          const col = pct === 100 ? 'var(--r-ok)' : pct >= 85 ? 'var(--brand-500)' : pct >= 70 ? 'var(--r-watch)' : 'var(--r-risk)';
          return (
            <div className="barrow" key={i} style={{ cursor: 'pointer' }} onClick={() => onPick && onPick(c.room)}>
              <span className="lbl fw5">{c.room}</span>
              <div className="track"><div className="fill" style={{ width: `${pct}%`, background: col }}></div></div>
              <span className="pct tabular" style={{ color: col }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardExec({ go }) {
  const st = window.SCHOOL_STATS;
  const urgent = window.STUDENTS.filter(s => s.level.key === 'urgent' || s.level.key === 'risk')
    .sort((a, b) => b.score - a.score);
  return (
    <div className="view stack">
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(186px,1fr))' }}>
        <KPICard icon="users" value={st.total.toLocaleString()} label="นักเรียนทั้งหมด"
          tint={{ bg: 'var(--brand-50)', fg: 'var(--brand-600)' }} />
        <KPICard icon="check-circle" value={st.visited.toLocaleString()} label="เยี่ยมบ้านแล้ว"
          tint={{ bg: 'var(--r-ok-bg)', fg: 'var(--r-ok)' }} delta={`${st.pctVisited}%`} deltaDir="up" sub={`จากทั้งหมด ${st.total} คน`} />
        <KPICard icon="clock" value={st.notVisited} label="ยังไม่ได้เยี่ยม"
          tint={{ bg: 'var(--r-watch-bg)', fg: 'var(--r-watch)' }} sub="ครบกำหนด 30 มิ.ย." />
        <KPICard icon="shield" value={st.risk} label="นักเรียนกลุ่มเสี่ยง"
          tint={{ bg: 'var(--r-risk-bg)', fg: 'var(--r-risk)' }} />
        <KPICard icon="coins" value={st.poor} label="นักเรียนยากจน / ยากจนพิเศษ"
          tint={{ bg: 'var(--gold-soft)', fg: '#a87b06' }} />
        <KPICard icon="warn" value={st.urgent} label="ต้องช่วยเหลือเร่งด่วน"
          tint={{ bg: 'var(--r-urgent-bg)', fg: 'var(--r-urgent)' }} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)' }}>
        <ClassProgress onPick={() => go('students')} />
        <div className="card">
          <div className="card__head">
            <div>
              <h3>ต้องดำเนินการก่อน</h3>
              <div className="sub">นักเรียนคะแนนเสี่ยงสูงสุด</div>
            </div>
            <button className="btn btn--soft btn--sm right" onClick={() => go('students')}>ดูทั้งหมด</button>
          </div>
          <div style={{ padding: '6px 8px' }}>
            {urgent.map(s => (
              <div key={s.id} className="row" style={{ padding: '10px 12px', borderRadius: 12, cursor: 'pointer' }}
                onClick={() => go('profile', s.id)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Avatar s={s} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fw5" style={{ fontSize: 14.5 }}>{window.fullName(s)}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{s.classroom} · {s.advisor}</div>
                </div>
                <RiskBadge level={s.level} withScore score={s.score} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutCard({ title, sub, data, total }) {
  return (
    <div className="card card--pad">
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{title}</h3>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{sub}</div>
      </div>
      <Donut data={data} centerValue={total} centerLabel="คน" />
    </div>
  );
}

function SchoolOverview() {
  const C = window.CHARTS;
  const sum = (a) => a.reduce((s, d) => s + d.value, 0);
  const riskData = C.risk.map((d, i) => ({ ...d, color: ['#e23b3b', '#ea7b17', '#2c7ab6', '#9b59b6', '#e6a417'][i] }));
  return (
    <div className="view stack">
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
        <DonutCard title="สถานะที่อยู่อาศัย" sub="ประเภทครัวเรือน" data={C.house} total={sum(C.house)} />
        <DonutCard title="ฐานะทางเศรษฐกิจ" sub="จากการคัดกรองนักเรียนยากจน" data={C.econ} total={sum(C.econ)} />
        <DonutCard title="สถานะผู้ปกครอง" sub="โครงสร้างครอบครัว" data={C.guardian} total={sum(C.guardian)} />
        <div className="card card--pad">
          <div style={{ marginBottom: 6 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>ปัจจัยความเสี่ยงที่พบ</h3>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>จำนวนนักเรียน (คน)</div>
          </div>
          <Bars data={riskData} unit=" คน" />
        </div>
      </div>

      <div className="card card--pad">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>สรุปเชิงพื้นที่</h3>
          <span className="badge badge--gray">{window.SCHOOL.year}</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', marginTop: 8 }}>
          {[
            { k: 'ครอบครัวเปราะบาง', v: '23%', c: 'var(--r-risk)' },
            { k: 'ได้รับทุนปัจจัยพื้นฐาน', v: '89', c: 'var(--brand-600)' },
            { k: 'เข้าถึงอินเทอร์เน็ตที่บ้าน', v: '71%', c: 'var(--r-ok)' },
            { k: 'เดินทางเกิน 10 กม.', v: '14%', c: 'var(--r-watch)' },
          ].map((x, i) => (
            <div key={i} style={{ padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 12 }}>
              <div className="tabular" style={{ fontSize: 26, fontWeight: 600, color: x.c }}>{x.v}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{x.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { KPICard, DashboardExec, SchoolOverview, ClassProgress });
