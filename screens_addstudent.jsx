/* ================= เพิ่มข้อมูลนักเรียน (ตามแบบฟอร์มเยี่ยมบ้าน หน้า 1) ================= */

function Fld({ label, children, full }) {
  return (
    <div className="field" style={{ marginBottom: 0, gridColumn: full ? '1 / -1' : 'auto' }}>
      <label>{label}</label>
      {children}
    </div>
  );
}
function TextCtrl({ icon, value, onChange, placeholder, type = 'text', suffix }) {
  return (
    <div className="control">
      {icon && <Icon name={icon} size={17} />}
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
      {suffix && <span className="muted" style={{ fontSize: 13 }}>{suffix}</span>}
    </div>
  );
}
function SelCtrl({ icon, value, onChange, options }) {
  return (
    <div className="control">
      {icon && <Icon name={icon} size={17} />}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ border: 'none', outline: 'none', background: 'none', flex: 1, height: '100%', cursor: 'pointer' }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function AddStudent({ onClose, onSave, go }) {
  const rooms = Array.from(new Set(window.CLASS_PROGRESS.map(c => c.room)));
  const advisors = Array.from(new Set(window.STUDENTS.map(s => s.advisor)));
  const [f, setF] = React.useState({
    prefix: 'เด็กชาย', first: '', last: '', nick: '', citizen: '',
    classroom: window.TEACHER.classroom, no: '', advisor: window.TEACHER.name,
    gName: '', gRelation: 'บิดา', gOccupation: '', gEdu: '', gPhone: '',
    members: '', houseType: 'บ้านตนเอง', incomePerHead: '', parentStatus: 'อยู่พร้อมหน้าพ่อแม่',
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const valid = f.first.trim() && f.last.trim() && f.classroom;

  const build = () => {
    const gender = ['เด็กชาย', 'นาย'].includes(f.prefix) ? 'ชาย' : 'หญิง';
    const iph = parseInt(f.incomePerHead) || 0;
    const econ = iph === 0 ? 'ไม่ระบุ' : iph < 1500 ? 'ยากจนพิเศษ' : iph < 3000 ? 'ยากจน' : iph < 6000 ? 'ปานกลาง' : 'ดี';
    const factors = [];
    if (iph > 0 && iph < 1500) factors.push('poor_special');
    else if (iph > 0 && iph < 3000) factors.push('low_income');
    if (f.parentStatus === 'พ่อแม่แยกทาง / แต่งงานใหม่') factors.push('parents_split');
    if (f.parentStatus === 'ไม่มีผู้ปกครอง') factors.push('no_guardian');
    if (f.houseType === 'บ้านเช่า') factors.push('rent_house');
    const score = window.calcScore(factors);
    const level = window.riskLevel(score);
    const stu = {
      id: 'PK068-' + Math.floor(3000 + Math.random() * 6000),
      code: String(13000 + Math.floor(Math.random() * 900)),
      citizen: f.citizen || '— ยังไม่ระบุ —',
      prefix: f.prefix, first: f.first.trim(), last: f.last.trim(), nick: f.nick.trim() || f.first.trim(),
      classroom: f.classroom, grade: f.classroom.split('/')[0], room: parseInt(f.classroom.split('/')[1]) || 1,
      no: parseInt(f.no) || '-', gender, advisor: f.advisor, photo: '', color: level.color,
      guardian: { name: f.gName.trim() || (f.parentStatus === 'ไม่มีผู้ปกครอง' ? '—' : 'ยังไม่ระบุ'),
        relation: f.parentStatus === 'ไม่มีผู้ปกครอง' ? 'ไม่มีผู้ปกครอง' : f.gRelation,
        occupation: f.gOccupation.trim() || '—', edu: f.gEdu.trim() || '—',
        phone: f.gPhone.trim() || '—', income: 0 },
      family: { members: parseInt(f.members) || 1, type: f.houseType, econ,
        liveWith: f.parentStatus, incomePerHead: iph, relations: [] },
      factors, score, level,
      visit: { done: false, date: null, by: null, photos: false, complete: false, summary: null },
      gps: { x: 20 + Math.random() * 60, y: 20 + Math.random() * 55 }, gallery: 0,
    };
    return stu;
  };

  const save = () => {
    const stu = build();
    window.STUDENTS.unshift(stu);
    onSave && onSave();
    onClose();
    go('profile', stu.id);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,58,85,.45)', zIndex: 65,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card view" onClick={e => e.stopPropagation()}
        style={{ width: 'min(620px,100%)', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}>
        <div className="card__head" style={{ flexShrink: 0 }}>
          <div className="kpi__icon" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)', width: 38, height: 38 }}>
            <Icon name="plus" size={20} />
          </div>
          <div>
            <h3>เพิ่มข้อมูลนักเรียน</h3>
            <div className="sub">ข้อมูลพื้นฐานตามแบบบันทึกการเยี่ยมบ้าน</div>
          </div>
          <button className="right" onClick={onClose} style={{ color: 'var(--ink-3)' }}><Icon name="x" size={20} /></button>
        </div>

        <div style={{ overflowY: 'auto', padding: 20 }}>
          <div className="section-title" style={{ marginTop: 0 }}>ข้อมูลนักเรียน</div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
            <Fld label="คำนำหน้า"><SelCtrl value={f.prefix} onChange={v => set('prefix', v)} options={['เด็กชาย', 'เด็กหญิง', 'นาย', 'นางสาว']} /></Fld>
            <Fld label="ชื่อเล่น"><TextCtrl value={f.nick} onChange={v => set('nick', v)} placeholder="(ไม่บังคับ)" /></Fld>
            <Fld label="ชื่อ *"><TextCtrl icon="user" value={f.first} onChange={v => set('first', v)} placeholder="ชื่อจริง" /></Fld>
            <Fld label="นามสกุล *"><TextCtrl value={f.last} onChange={v => set('last', v)} placeholder="นามสกุล" /></Fld>
            <Fld label="เลขประจำตัวประชาชน" full><TextCtrl icon="clipboard" value={f.citizen} onChange={v => set('citizen', v)} placeholder="x xxxx xxxxx xx x" /></Fld>
            <Fld label="ห้องเรียน *"><SelCtrl icon="users" value={f.classroom} onChange={v => set('classroom', v)} options={rooms} /></Fld>
            <Fld label="เลขที่"><TextCtrl value={f.no} onChange={v => set('no', v)} type="number" placeholder="0" /></Fld>
            <Fld label="ครูที่ปรึกษา" full><SelCtrl icon="user" value={f.advisor} onChange={v => set('advisor', v)} options={advisors} /></Fld>
          </div>

          <div className="section-title">ข้อมูลผู้ปกครอง</div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
            <Fld label="ชื่อ-สกุลผู้ปกครอง"><TextCtrl icon="user" value={f.gName} onChange={v => set('gName', v)} placeholder="ชื่อผู้ปกครอง" /></Fld>
            <Fld label="ความสัมพันธ์"><SelCtrl value={f.gRelation} onChange={v => set('gRelation', v)} options={['บิดา', 'มารดา', 'ปู่/ย่า', 'ตา/ยาย', 'ลุง/ป้า/น้า/อา', 'ผู้ปกครองอื่น']} /></Fld>
            <Fld label="อาชีพ"><TextCtrl icon="briefcase" value={f.gOccupation} onChange={v => set('gOccupation', v)} placeholder="อาชีพ" /></Fld>
            <Fld label="เบอร์โทรศัพท์"><TextCtrl icon="phone" value={f.gPhone} onChange={v => set('gPhone', v)} placeholder="08x-xxx-xxxx" /></Fld>
            <Fld label="การศึกษาสูงสุด" full><TextCtrl value={f.gEdu} onChange={v => set('gEdu', v)} placeholder="เช่น ป.6 / ม.3 / ปริญญาตรี" /></Fld>
          </div>

          <div className="section-title">ข้อมูลครัวเรือน</div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
            <Fld label="จำนวนสมาชิก"><TextCtrl icon="users" value={f.members} onChange={v => set('members', v)} type="number" placeholder="0" suffix="คน" /></Fld>
            <Fld label="รายได้เฉลี่ยต่อคน/เดือน"><TextCtrl icon="coins" value={f.incomePerHead} onChange={v => set('incomePerHead', v)} type="number" placeholder="0" suffix="บาท" /></Fld>
            <Fld label="ประเภทที่อยู่อาศัย"><SelCtrl icon="home" value={f.houseType} onChange={v => set('houseType', v)} options={['บ้านตนเอง', 'บ้านเช่า', 'อาศัยกับญาติ', 'อาศัยกับผู้อื่น']} /></Fld>
            <Fld label="สถานะผู้ปกครอง"><SelCtrl value={f.parentStatus} onChange={v => set('parentStatus', v)} options={['อยู่พร้อมหน้าพ่อแม่', 'พ่อแม่แยกทาง / แต่งงานใหม่', 'อยู่กับญาติ', 'ไม่มีผู้ปกครอง']} /></Fld>
          </div>

          <div className="row" style={{ gap: 8, marginTop: 16, padding: 11, background: 'var(--brand-50)', borderRadius: 11, fontSize: 12.5, color: 'var(--brand-700)' }}>
            <Icon name="sparkle" size={16} style={{ flexShrink: 0 }} />
            ระบบจะประเมินคะแนนความเสี่ยงเบื้องต้นจากข้อมูลนี้ — รายละเอียดเพิ่มเติมบันทึกได้ตอนลงพื้นที่เยี่ยมบ้าน
          </div>
        </div>

        <div className="row" style={{ gap: 10, padding: 16, borderTop: '1px solid var(--line)', flexShrink: 0 }}>
          <button className="btn btn--ghost" onClick={onClose} style={{ flex: '0 0 auto' }}>ยกเลิก</button>
          <button className="btn btn--primary" style={{ flex: 1 }} disabled={!valid} onClick={save}>
            <Icon name="check" size={17} />บันทึกข้อมูลนักเรียน
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AddStudent });
