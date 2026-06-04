/* ================= สมัครสมาชิก + จัดการผู้ใช้ (Admin) ================= */

function AuthShell({ children }) {
  return (
    <div className="login">
      <div className="login__brand">
        <div className="login__glow"></div>
        <div className="login__brandtop">
          <img src="assets/logo.png" alt="logo" />
          <div>
            <b>{window.SCHOOL.name}</b>
            <span>{window.SCHOOL.area}</span>
          </div>
        </div>
        <div className="login__hero">
          <h1>ระบบดูแล<br />ช่วยเหลือนักเรียน</h1>
          <p>สมัครสมาชิกเพื่อเข้าใช้งานตามบทบาทของท่าน — บัญชีจะเปิดใช้งานได้หลังผู้ดูแลระบบอนุมัติ</p>
          <div className="login__chips">
            <span className="login__chip">ครูที่ปรึกษา</span>
            <span className="login__chip">ผู้บริหาร</span>
            <span className="login__chip">ผู้ปกครอง</span>
          </div>
        </div>
        <div className="login__foot">© 2568 {window.SCHOOL.name}</div>
      </div>
      <div className="login__form"><div className="login__card">{children}</div></div>
    </div>
  );
}

function Signup({ onDone, onBack }) {
  const roles = [
    { k: 'teacher', label: 'ครูที่ปรึกษา', icon: 'clipboard' },
    { k: 'director', label: 'ผู้บริหาร', icon: 'shield' },
    { k: 'parent', label: 'ผู้ปกครอง', icon: 'user' },
  ];
  const [f, setF] = React.useState({ name: '', username: '', email: '', password: '', confirm: '', role: 'teacher', classroom: '' });
  const [err, setErr] = React.useState('');
  const [done, setDone] = React.useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = () => {
    setErr('');
    if (!f.name.trim() || !f.username.trim() || !f.email.trim() || !f.password) return setErr('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    if (f.password.length < 6) return setErr('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    if (f.password !== f.confirm) return setErr('รหัสผ่านยืนยันไม่ตรงกัน');
    if (window.Auth.exists(f.username, f.email)) return setErr('ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้แล้ว');
    window.Auth.add({ name: f.name.trim(), username: f.username.trim(), email: f.email.trim(), password: f.password, role: f.role, classroom: f.classroom.trim() });
    setDone(true);
  };

  if (done) return (
    <AuthShell>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 50, background: 'var(--r-watch-bg)', color: 'var(--r-watch)',
          display: 'grid', placeItems: 'center', margin: '8px auto 18px' }}><Icon name="clock" size={34} /></div>
        <h2>ส่งคำขอสมัครแล้ว</h2>
        <p className="sub" style={{ marginTop: 8 }}>บัญชี <b>{f.username}</b> ({window.ROLE_LABELS[f.role]}) อยู่ระหว่างรอผู้ดูแลระบบอนุมัติ เมื่อได้รับอนุมัติแล้วจึงจะเข้าใช้งานได้</p>
        <button className="btn btn--primary btn--block mt24" onClick={onBack}>กลับไปหน้าเข้าสู่ระบบ</button>
      </div>
    </AuthShell>
  );

  return (
    <AuthShell>
      <button className="btn btn--ghost btn--sm" style={{ marginBottom: 14 }} onClick={onBack}><Icon name="back" size={16} />กลับ</button>
      <h2>สมัครสมาชิก</h2>
      <div className="sub">เลือกบทบาทและกรอกข้อมูลเพื่อขอเข้าใช้งาน</div>

      <label style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 7 }}>บทบาทที่ต้องการ</label>
      <div className="login__roles">
        {roles.map(r => (
          <button key={r.k} className={`login__role ${f.role === r.k ? 'is-active' : ''}`} onClick={() => set('role', r.k)}>
            <Icon name={r.icon} size={20} />{r.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="field"><label>ชื่อ-นามสกุล</label>
          <div className="control"><Icon name="user" size={18} /><input value={f.name} onChange={e => set('name', e.target.value)} placeholder="ชื่อจริง นามสกุล" /></div></div>
        {f.role === 'teacher' && (
          <div className="field"><label>ห้องที่ปรึกษา (ถ้ามี)</label>
            <div className="control"><Icon name="users" size={18} /><input value={f.classroom} onChange={e => set('classroom', e.target.value)} placeholder="เช่น ม.2/1" /></div></div>
        )}
        <div className="field"><label>ชื่อผู้ใช้ (username)</label>
          <div className="control"><Icon name="user" size={18} /><input value={f.username} onChange={e => set('username', e.target.value)} placeholder="username" /></div></div>
        <div className="field"><label>อีเมล</label>
          <div className="control"><Icon name="file" size={18} /><input value={f.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" /></div></div>
        <div className="field"><label>รหัสผ่าน</label>
          <div className="control"><Icon name="shield" size={18} /><input type="password" value={f.password} onChange={e => set('password', e.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร" /></div></div>
        <div className="field"><label>ยืนยันรหัสผ่าน</label>
          <div className="control"><Icon name="shield" size={18} /><input type="password" value={f.confirm} onChange={e => set('confirm', e.target.value)} placeholder="พิมพ์รหัสผ่านอีกครั้ง" /></div></div>
      </div>

      {err && <div style={{ background: 'var(--r-urgent-bg)', color: 'var(--r-urgent)', padding: '10px 13px', borderRadius: 10, fontSize: 13, marginBottom: 12 }}>{err}</div>}
      <button className="btn btn--primary btn--block" onClick={submit}><Icon name="check" size={18} />ส่งคำขอสมัคร</button>
      <div className="login__hint">มีบัญชีแล้ว? <b style={{ color: 'var(--brand-700)', cursor: 'pointer' }} onClick={onBack}>เข้าสู่ระบบ</b></div>
    </AuthShell>
  );
}

/* ================= จัดการผู้ใช้ (เฉพาะ Admin) ================= */
function UserManagement({ onUserChange }) {
  const [, bump] = React.useReducer(x => x + 1, 0);
  const refresh = () => { bump(); onUserChange && onUserChange(); };
  const [filter, setFilter] = React.useState('all');
  const [edit, setEdit] = React.useState(null);
  const [showPw, setShowPw] = React.useState({});
  const users = window.Auth.all();
  const pending = users.filter(u => u.status === 'pending');
  const list = users.filter(u => filter === 'all' ? true : u.status === filter);

  const statusBadge = { approved: ['ok', 'อนุมัติแล้ว'], pending: ['watch', 'รออนุมัติ'], rejected: ['urgent', 'ปฏิเสธ'] };
  const act = (id, status) => { window.Auth.update(id, { status }); refresh(); };

  return (
    <div className="view stack">
      {pending.length > 0 && (
        <div className="card card--pad" style={{ background: 'var(--r-watch-bg)', border: '1px solid #f3d98a' }}>
          <div className="row" style={{ gap: 10 }}>
            <div className="kpi__icon" style={{ background: '#fff', color: 'var(--r-watch)' }}><Icon name="clock" size={20} /></div>
            <div style={{ flex: 1 }}>
              <div className="fw6">มีคำขอสมัคร {pending.length} รายการรอการอนุมัติ</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>ตรวจสอบข้อมูลและกดอนุมัติเพื่อเปิดใช้งานบัญชี</div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card__head">
          <h3>จัดการผู้ใช้งาน</h3>
          <span className="sub">ทั้งหมด {users.length} บัญชี</span>
          <div className="seg right">
            {[['all', 'ทั้งหมด'], ['pending', 'รออนุมัติ'], ['approved', 'อนุมัติแล้ว'], ['rejected', 'ปฏิเสธ']].map(o => (
              <button key={o[0]} className={filter === o[0] ? 'is-on' : ''} onClick={() => setFilter(o[0])}>{o[1]}</button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead><tr><th>ผู้ใช้</th><th>บทบาท</th><th>Username / Email</th><th>Password</th><th>สถานะ</th><th>การจัดการ</th></tr></thead>
            <tbody>
              {list.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="studentcell">
                      <div className="ava" style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--brand-500)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 14 }}>{u.initials}</div>
                      <div><b>{u.name}</b><span>{new Date(u.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</span></div>
                    </div>
                  </td>
                  <td><span className="badge badge--brand">{window.ROLE_LABELS[u.role]}</span></td>
                  <td>
                    <div style={{ fontSize: 13.5 }} className="tabular">{u.username}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{u.email}</div>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 6 }}>
                      <code style={{ fontSize: 13, fontFamily: 'ui-monospace,monospace', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 6 }}>
                        {showPw[u.id] ? u.password : '•'.repeat(Math.min(u.password.length, 8))}</code>
                      <button onClick={() => setShowPw(s => ({ ...s, [u.id]: !s[u.id] }))} style={{ color: 'var(--ink-3)' }} title="แสดง/ซ่อน"><Icon name="eye" size={16} /></button>
                    </div>
                  </td>
                  <td><span className={`badge badge--${statusBadge[u.status][0]}`}><span className="d"></span>{statusBadge[u.status][1]}</span></td>
                  <td>
                    <div className="row" style={{ gap: 6 }}>
                      {u.status === 'pending' && <>
                        <button className="btn btn--sm" style={{ background: 'var(--r-ok-bg)', color: 'var(--r-ok)', height: 32, padding: '0 10px' }} onClick={() => act(u.id, 'approved')}><Icon name="check" size={14} />อนุมัติ</button>
                        <button className="btn btn--sm" style={{ background: 'var(--r-urgent-bg)', color: 'var(--r-urgent)', height: 32, padding: '0 10px' }} onClick={() => act(u.id, 'rejected')}>ปฏิเสธ</button>
                      </>}
                      <button className="btn btn--ghost btn--sm" style={{ height: 32, padding: '0 10px' }} onClick={() => setEdit(u)}><Icon name="pen" size={14} />แก้ไข</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div className="empty">ไม่มีบัญชีในหมวดนี้</div>}
        </div>
      </div>

      {edit && <UserEditModal user={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); refresh(); }} />}
    </div>
  );
}

function UserEditModal({ user, onClose, onSaved }) {
  const [f, setF] = React.useState({ ...user });
  const [err, setErr] = React.useState('');
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = () => {
    if (!f.name.trim() || !f.username.trim() || !f.email.trim() || !f.password) return setErr('กรอกข้อมูลให้ครบ');
    const dup = window.Auth.all().find(x => x.id !== user.id && (x.username.toLowerCase() === f.username.trim().toLowerCase() || x.email.toLowerCase() === f.email.trim().toLowerCase()));
    if (dup) return setErr('ชื่อผู้ใช้หรืออีเมลซ้ำกับบัญชีอื่น');
    window.Auth.update(user.id, { name: f.name.trim(), username: f.username.trim(), email: f.email.trim(), password: f.password, role: f.role, status: f.status });
    onSaved();
  };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,58,85,.45)', zIndex: 65, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card view" onClick={e => e.stopPropagation()} style={{ width: 'min(460px,100%)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="card__head">
          <div className="kpi__icon" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)', width: 38, height: 38 }}><Icon name="pen" size={18} /></div>
          <div><h3>แก้ไขบัญชีผู้ใช้</h3><div className="sub">{user.name}</div></div>
          <button className="right" onClick={onClose} style={{ color: 'var(--ink-3)' }}><Icon name="x" size={20} /></button>
        </div>
        <div className="card--pad stack" style={{ gap: 12 }}>
          <div className="field" style={{ margin: 0 }}><label>ชื่อ-นามสกุล</label><div className="control"><Icon name="user" size={17} /><input value={f.name} onChange={e => set('name', e.target.value)} /></div></div>
          <div className="field" style={{ margin: 0 }}><label>Username</label><div className="control"><Icon name="user" size={17} /><input value={f.username} onChange={e => set('username', e.target.value)} /></div></div>
          <div className="field" style={{ margin: 0 }}><label>Email</label><div className="control"><Icon name="file" size={17} /><input value={f.email} onChange={e => set('email', e.target.value)} /></div></div>
          <div className="field" style={{ margin: 0 }}><label>Password</label><div className="control"><Icon name="shield" size={17} /><input value={f.password} onChange={e => set('password', e.target.value)} /></div></div>
          <div className="row" style={{ gap: 12 }}>
            <div className="field" style={{ margin: 0, flex: 1 }}><label>บทบาท</label>
              <div className="control"><select value={f.role} onChange={e => set('role', e.target.value)} style={{ border: 'none', outline: 'none', background: 'none', flex: 1, height: '100%' }}>
                {Object.keys(window.ROLE_LABELS).map(r => <option key={r} value={r}>{window.ROLE_LABELS[r]}</option>)}</select></div></div>
            <div className="field" style={{ margin: 0, flex: 1 }}><label>สถานะ</label>
              <div className="control"><select value={f.status} onChange={e => set('status', e.target.value)} style={{ border: 'none', outline: 'none', background: 'none', flex: 1, height: '100%' }}>
                <option value="approved">อนุมัติแล้ว</option><option value="pending">รออนุมัติ</option><option value="rejected">ปฏิเสธ</option></select></div></div>
          </div>
          {err && <div style={{ background: 'var(--r-urgent-bg)', color: 'var(--r-urgent)', padding: '9px 12px', borderRadius: 9, fontSize: 13 }}>{err}</div>}
        </div>
        <div className="row" style={{ gap: 10, padding: 16, borderTop: '1px solid var(--line)' }}>
          <button className="btn btn--ghost" onClick={onClose}>ยกเลิก</button>
          <button className="btn btn--primary" style={{ flex: 1 }} onClick={save}><Icon name="check" size={16} />บันทึก</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Signup, UserManagement });
