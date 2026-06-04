/* ================= REPORTS ================= */

function Reports({ go }) {
  const [active, setActive] = React.useState('class');
  const reports = [
    { k: 'class', label: 'รายห้อง', icon: 'users', desc: 'ความคืบหน้าการเยี่ยมบ้านแยกตามห้องเรียน' },
    { k: 'teacher', label: 'รายครู', icon: 'user', desc: 'ผลการดำเนินงานของครูที่ปรึกษาแต่ละคน' },
    { k: 'risk', label: 'กลุ่มเสี่ยง', icon: 'shield', desc: 'รายชื่อนักเรียนที่ต้องเฝ้าระวัง / เร่งด่วน' },
    { k: 'scholarship', label: 'ทุนการศึกษา', icon: 'scholarship', desc: 'นักเรียนยากจน / รายได้ต่ำกว่าเกณฑ์' },
    { k: 'sdq', label: 'SDQ / ระบบดูแลฯ', icon: 'health', desc: 'สรุปผลการคัดกรองพฤติกรรม' },
  ];
  return (
    <div className="view stack">
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))' }}>
        {reports.map(r => (
          <button key={r.k} className="card card--pad" onClick={() => setActive(r.k)}
            style={{ textAlign: 'left', border: active === r.k ? '1.5px solid var(--brand-400)' : '1px solid var(--line)',
              boxShadow: active === r.k ? '0 0 0 3px var(--brand-100)' : 'var(--shadow-sm)', cursor: 'pointer' }}>
            <div className="kpi__icon" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)', marginBottom: 10 }}>
              <Icon name={r.icon} size={20} />
            </div>
            <div className="fw6" style={{ fontSize: 15 }}>รายงาน{r.label}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4 }}>{r.desc}</div>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card__head">
          <h3>รายงาน{reports.find(r => r.k === active).label}</h3>
          <span className="sub">{window.SCHOOL.year}</span>
          <div className="row right" style={{ gap: 8 }}>
            <button className="btn btn--ghost btn--sm"><Icon name="print" size={15} />พิมพ์</button>
            <button className="btn btn--soft btn--sm"><Icon name="download" size={15} />Excel</button>
          </div>
        </div>
        <div className="card--pad">
          {active === 'class' && <ReportClass />}
          {active === 'teacher' && <ReportTeacher />}
          {active === 'risk' && <ReportRisk go={go} />}
          {active === 'scholarship' && <ReportScholarship go={go} />}
          {active === 'sdq' && <ReportSDQ />}
        </div>
      </div>
    </div>
  );
}

function ReportClass() {
  return (
    <table className="tbl">
      <thead><tr><th>ห้อง</th><th>นักเรียน</th><th>เยี่ยมแล้ว</th><th>คงเหลือ</th><th>ความคืบหน้า</th></tr></thead>
      <tbody>
        {window.CLASS_PROGRESS.map((c, i) => {
          const pct = Math.round((c.visited / c.total) * 100);
          const col = pct === 100 ? 'var(--r-ok)' : pct >= 85 ? 'var(--brand-500)' : pct >= 70 ? 'var(--r-watch)' : 'var(--r-risk)';
          return (
            <tr key={i}>
              <td className="fw5">{c.room}</td>
              <td className="tabular">{c.total}</td>
              <td className="tabular">{c.visited}</td>
              <td className="tabular">{c.total - c.visited}</td>
              <td>
                <div className="row" style={{ gap: 10 }}>
                  <div className="track" style={{ flex: 1, height: 8, background: 'var(--line-2)', borderRadius: 99, overflow: 'hidden', maxWidth: 160 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 99 }}></div>
                  </div>
                  <span className="tabular fw6" style={{ color: col, width: 42 }}>{pct}%</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ReportTeacher() {
  const teachers = [
    { name: 'นางสาวพรรณี วงศ์สถิตย์', room: 'ม.2/1', total: 40, done: 38, cases: 2 },
    { name: 'นายอนุชา เกษมสุข', room: 'ม.1/1, ม.2/2', total: 77, done: 60, cases: 1 },
    { name: 'นางมาลี ปานทอง', room: 'ม.3/1', total: 36, done: 36, cases: 2 },
  ];
  return (
    <table className="tbl">
      <thead><tr><th>ครูที่ปรึกษา</th><th>ห้องรับผิดชอบ</th><th>เยี่ยมแล้ว</th><th>เคสที่เปิด</th><th>สถานะ</th></tr></thead>
      <tbody>
        {teachers.map((t, i) => {
          const pct = Math.round((t.done / t.total) * 100);
          return (
            <tr key={i}>
              <td className="fw5">{t.name}</td>
              <td>{t.room}</td>
              <td className="tabular">{t.done}/{t.total} ({pct}%)</td>
              <td className="tabular">{t.cases}</td>
              <td>{pct === 100 ? <span className="badge badge--ok"><Icon name="check" size={13} />ครบ</span>
                : <span className="badge badge--watch"><span className="d"></span>กำลังดำเนินการ</span>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ReportRisk({ go }) {
  const list = window.STUDENTS.filter(s => s.level.key === 'risk' || s.level.key === 'urgent' || s.level.key === 'watch')
    .sort((a, b) => b.score - a.score);
  return (
    <table className="tbl">
      <thead><tr><th>นักเรียน</th><th>ห้อง</th><th>ปัจจัยเสี่ยง</th><th>คะแนน</th><th>ระดับ</th></tr></thead>
      <tbody>
        {list.map(s => (
          <tr key={s.id} className="clickable" onClick={() => go('profile', s.id)}>
            <td><div className="studentcell"><Avatar s={s} size={36} /><div><b>{window.fullName(s)}</b><span>รหัส {s.code}</span></div></div></td>
            <td>{s.classroom}</td>
            <td className="tabular">{s.factors.length} ปัจจัย</td>
            <td className="tabular fw6" style={{ color: s.level.color }}>{s.score}</td>
            <td><RiskBadge level={s.level} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReportScholarship({ go }) {
  const list = window.STUDENTS.filter(s => s.family.econ.includes('ยากจน') || s.family.incomePerHead < 3000)
    .sort((a, b) => a.family.incomePerHead - b.family.incomePerHead);
  return (
    <div className="stack">
      <div className="row" style={{ gap: 10, padding: '10px 14px', background: 'var(--gold-soft)', borderRadius: 11, fontSize: 13.5, color: '#7a5a04' }}>
        <Icon name="scholarship" size={18} />ดึงเฉพาะนักเรียน <b>ยากจน / ยากจนพิเศษ / รายได้เฉลี่ยต่อคนต่ำกว่า 3,000 บ.</b>
      </div>
      <table className="tbl">
        <thead><tr><th>นักเรียน</th><th>ห้อง</th><th>ฐานะ</th><th>รายได้/คน</th><th>ผู้ปกครอง</th></tr></thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id} className="clickable" onClick={() => go('profile', s.id)}>
              <td><div className="studentcell"><Avatar s={s} size={36} /><div><b>{window.fullName(s)}</b><span>รหัส {s.code}</span></div></div></td>
              <td>{s.classroom}</td>
              <td><span className={`badge badge--${s.family.econ === 'ยากจนพิเศษ' ? 'urgent' : 'risk'}`}>{s.family.econ}</span></td>
              <td className="tabular fw6">{s.family.incomePerHead.toLocaleString()} บ.</td>
              <td style={{ fontSize: 13 }}>{s.guardian.occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportSDQ() {
  const data = [
    { label: 'ปกติ', value: 478, color: 'var(--r-ok)' },
    { label: 'เสี่ยง', value: 96, color: 'var(--r-watch)' },
    { label: 'มีปัญหา', value: 38, color: 'var(--r-urgent)' },
  ];
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
      <div>
        <div className="section-title">ผลการประเมิน SDQ (ครูประเมิน)</div>
        <Donut data={data} centerValue={612} centerLabel="คน" />
      </div>
      <div>
        <div className="section-title">ด้านที่พบปัญหาสูงสุด</div>
        <Bars data={[
          { label: 'ด้านอารมณ์', value: 42 },
          { label: 'ด้านความประพฤติ', value: 31 },
          { label: 'พฤติกรรมอยู่ไม่นิ่ง', value: 28 },
          { label: 'ความสัมพันธ์กับเพื่อน', value: 19 },
        ]} unit=" คน" />
      </div>
    </div>
  );
}

Object.assign(window, { Reports });
