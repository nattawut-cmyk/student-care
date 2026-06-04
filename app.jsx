/* ================= APP SHELL · LOGIN · ROUTING · TWEAKS ================= */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": ["#2c7ab6", "#21689f", "#1b5483", "#143a55"],
  "font": "'IBM Plex Sans Thai'",
  "density": "regular"
}/*EDITMODE-END*/;

const FONT_LABELS = {
  "'IBM Plex Sans Thai'": "IBM Plex Sans Thai",
  "'Noto Sans Thai'": "Noto Sans Thai",
  "'Prompt'": "Prompt",
  "'Sarabun'": "Sarabun",
};

function applyTheme(t) {
  try {
    const root = document.documentElement;
    const theme = (t && Array.isArray(t.theme) && t.theme.length >= 4) ? t.theme : TWEAK_DEFAULTS.theme;
    const [b500, b600, b700, b900] = theme;
    // derive a light scale by mixing toward white via color-mix
    root.style.setProperty('--brand-500', b500);
    root.style.setProperty('--brand-600', b600);
    root.style.setProperty('--brand-700', b700);
    root.style.setProperty('--brand-800', b700);
    root.style.setProperty('--brand-900', b900);
    root.style.setProperty('--brand-400', `color-mix(in srgb, ${b500} 80%, white)`);
    root.style.setProperty('--brand-300', `color-mix(in srgb, ${b500} 58%, white)`);
    root.style.setProperty('--brand-200', `color-mix(in srgb, ${b500} 34%, white)`);
    root.style.setProperty('--brand-100', `color-mix(in srgb, ${b500} 18%, white)`);
    root.style.setProperty('--brand-50',  `color-mix(in srgb, ${b500} 8%, white)`);
    const font = (t && typeof t.font === 'string') ? t.font : TWEAK_DEFAULTS.font;
    document.body.style.fontFamily = `${font}, system-ui, sans-serif`;
    root.style.fontSize = t.density === 'compact' ? '14.5px' : t.density === 'comfy' ? '16.5px' : '15.5px';
  } catch (e) { console.warn('applyTheme skipped', e); }
}

/* ---------------- LOGIN ---------------- */
function Login({ onLogin, onSignup }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [msg, setMsg] = React.useState(null);

  const submit = () => {
    setMsg(null);
    const res = window.Auth.attempt(username, password);
    if (res.ok) { onLogin(res.user); return; }
    if (res.reason === 'not_found') setMsg({ t: 'err', m: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ' });
    else if (res.reason === 'bad_password') setMsg({ t: 'err', m: 'รหัสผ่านไม่ถูกต้อง' });
    else if (res.reason === 'pending') setMsg({ t: 'warn', m: 'บัญชีของคุณอยู่ระหว่างรอผู้ดูแลระบบอนุมัติ' });
    else if (res.reason === 'rejected') setMsg({ t: 'err', m: 'บัญชีนี้ถูกปฏิเสธการเข้าใช้งาน กรุณาติดต่อผู้ดูแลระบบ' });
  };
  const onKey = (e) => { if (e.key === 'Enter') submit(); };

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
          <p>เยี่ยมบ้าน คัดกรอง ประเมินความเสี่ยง และติดตามการช่วยเหลือนักเรียนรายบุคคล — ครบในที่เดียว</p>
          <div className="login__chips">
            <span className="login__chip">เยี่ยมบ้าน · คัดกรองยากจน</span>
            <span className="login__chip">Risk Score อัตโนมัติ</span>
            <span className="login__chip">ใช้งานบนมือถือ</span>
          </div>
        </div>
        <div className="login__foot">© 2568 {window.SCHOOL.name} · ระบบสารสนเทศเพื่อการดูแลช่วยเหลือนักเรียน</div>
      </div>

      <div className="login__form">
        <div className="login__card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <img src="assets/logo.png" alt="" style={{ width: 40, height: 40 }} />
            <div className="hide-desktop" style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-700)' }}>{window.SCHOOL.name}</div>
          </div>
          <h2>เข้าสู่ระบบ</h2>
          <div className="sub">กรอกชื่อผู้ใช้และรหัสผ่านเพื่อเข้าใช้งาน</div>

          <div className="field">
            <label>ชื่อผู้ใช้ / อีเมล</label>
            <div className="control">
              <Icon name="user" size={18} />
              <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={onKey} placeholder="username หรือ email" autoFocus />
            </div>
          </div>
          <div className="field">
            <label>รหัสผ่าน</label>
            <div className="control">
              <Icon name="shield" size={18} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={onKey} placeholder="รหัสผ่าน" />
            </div>
          </div>

          {msg && (
            <div style={{ padding: '10px 13px', borderRadius: 10, fontSize: 13, marginBottom: 14,
              background: msg.t === 'warn' ? 'var(--r-watch-bg)' : 'var(--r-urgent-bg)',
              color: msg.t === 'warn' ? '#a87b06' : 'var(--r-urgent)' }}>
              <span className="row" style={{ gap: 7 }}><Icon name={msg.t === 'warn' ? 'clock' : 'warn'} size={15} />{msg.m}</span>
            </div>
          )}

          <button className="btn btn--primary btn--block" style={{ marginTop: 4 }} onClick={submit}>
            <Icon name="logout" size={18} style={{ transform: 'scaleX(-1)' }} />เข้าสู่ระบบ
          </button>
          <div className="login__hint">ยังไม่มีบัญชี? <b style={{ color: 'var(--brand-700)', cursor: 'pointer' }} onClick={onSignup}>สมัครสมาชิก</b></div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- NAV CONFIG ---------------- */
const NAV = [
  { group: 'ภาพรวม', items: [
    { k: 'exec', label: 'Dashboard ผู้บริหาร', icon: 'dashboard' },
    { k: 'overview', label: 'ภาพรวมโรงเรียน', icon: 'chart' },
  ]},
  { group: 'นักเรียน', items: [
    { k: 'students', label: 'รายชื่อนักเรียน', icon: 'users' },
    { k: 'map', label: 'แผนที่บ้านนักเรียน', icon: 'map' },
  ]},
  { group: 'งานช่วยเหลือ', items: [
    { k: 'cases', label: 'เคสช่วยเหลือ', icon: 'briefcase' },
    { k: 'reports', label: 'รายงาน', icon: 'file' },
    { k: 'notifications', label: 'การแจ้งเตือน', icon: 'bell', badge: 3 },
  ]},
];
const TITLES = {
  exec: ['Dashboard ผู้บริหาร', 'ภาพรวมการดูแลช่วยเหลือนักเรียน'],
  overview: ['ภาพรวมโรงเรียน', 'สรุปข้อมูลเชิงสถิติจากการเยี่ยมบ้าน'],
  students: ['รายชื่อนักเรียน', 'ค้นหาและจัดการข้อมูลนักเรียนรายบุคคล'],
  profile: ['โปรไฟล์นักเรียน', 'ข้อมูล ครอบครัว และคะแนนความเสี่ยง'],
  map: ['แผนที่บ้านนักเรียน', 'ตำแหน่งที่อยู่อาศัยและระดับความเสี่ยง'],
  cases: ['เคสช่วยเหลือ', 'จัดการกรณีนักเรียนกลุ่มเสี่ยง'],
  reports: ['รายงาน', 'สรุปผลและส่งออกข้อมูล'],
  notifications: ['การแจ้งเตือน', 'งานที่ต้องดำเนินการ'],
  users: ['จัดการผู้ใช้งาน', 'อนุมัติคำขอสมัครและจัดการบัญชีผู้ใช้'],
};

/* ---------------- APP ---------------- */
function applyIdentity(u) {
  window.SESSION = u;
  if (u && (u.role === 'teacher' || u.role === 'admin')) {
    window.TEACHER = { name: u.name, role: window.ROLE_LABELS[u.role], classroom: u.classroom || '', initials: u.initials };
  }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTheme(t); }, [t]);

  const [user, setUser] = React.useState(() => window.Auth.sessionUser());
  const [authScreen, setAuthScreen] = React.useState('login');
  const role = user ? user.role : null;
  const canEdit = role === 'teacher' || role === 'admin';
  const [route, setRoute] = React.useState({ view: 'exec', param: null });
  const [navOpen, setNavOpen] = React.useState(false);
  const [visit, setVisit] = React.useState({ open: false, student: null });
  const [addOpen, setAddOpen] = React.useState(false);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => { if (user) applyIdentity(user); }, []);

  const go = (view, param = null) => { setRoute({ view, param }); setNavOpen(false); window.scrollTo(0, 0); };
  const openVisit = (student) => setVisit({ open: true, student: student || null });
  const doLogin = (u) => { window.Auth.setSession(u.id); applyIdentity(u); setUser(u); go(u.role === 'admin' ? 'users' : 'exec'); };
  const doLogout = () => { window.Auth.clearSession(); setUser(null); setAuthScreen('login'); };

  if (!user) return (<>
    {authScreen === 'signup'
      ? <Signup onBack={() => setAuthScreen('login')} onDone={() => setAuthScreen('login')} />
      : <Login onLogin={doLogin} onSignup={() => setAuthScreen('signup')} />}
    <AppTweaks t={t} setTweak={setTweak} />
  </>);

  if (role === 'parent') return (<>
    <ParentView user={user} onLogout={doLogout} />
    <AppTweaks t={t} setTweak={setTweak} />
  </>);

  const [title, crumb] = TITLES[route.view] || ['', ''];
  const curStudent = route.view === 'profile' ? window.STUDENTS.find(s => s.id === route.param) : null;

  return (
    <div className="app">
      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)}></div>}
      <aside className={`sidebar ${navOpen ? 'is-open' : ''}`}>
        <div className="sidebar__brand">
          <img src="assets/logo.png" alt="logo" />
          <div>
            <b>ปากกรานพิทยา</b>
            <span>ระบบดูแลช่วยเหลือนักเรียน</span>
          </div>
        </div>
        <nav className="sidebar__nav">
          {NAV.map(g => (
            <div key={g.group}>
              <div className="sidebar__group">{g.group}</div>
              {g.items.map(it => {
                const active = route.view === it.k || (it.k === 'students' && route.view === 'profile');
                return (
                  <button key={it.k} className={`navitem ${active ? 'is-active' : ''}`} onClick={() => go(it.k)}>
                    <Icon name={it.icon} size={19} />{it.label}
                    {it.badge && <span className="badge-dot">{it.badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
          {role === 'admin' && (
            <div>
              <div className="sidebar__group">ผู้ดูแลระบบ</div>
              {(() => {
                const pending = window.Auth.all().filter(u => u.status === 'pending').length;
                return (
                  <button className={`navitem ${route.view === 'users' ? 'is-active' : ''}`} onClick={() => go('users')}>
                    <Icon name="shield" size={19} />จัดการผู้ใช้งาน
                    {pending > 0 && <span className="badge-dot">{pending}</span>}
                  </button>
                );
              })()}
            </div>
          )}
        </nav>
        <div className="sidebar__user">
          <div className="ava">{user.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{user.name}</b>
            <span>{window.ROLE_LABELS[role]}{role === 'teacher' && user.classroom ? ' ' + user.classroom : ''}</span>
          </div>
          <button onClick={doLogout} title="ออกจากระบบ"><Icon name="logout" size={18} /></button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="topbar__icon menu-btn" onClick={() => setNavOpen(true)}><Icon name="menu" size={20} /></button>
          <div className="topbar__title">{title}<span className="crumb">{crumb}</span></div>
          <div className="topbar__search">
            <Icon name="search" size={18} />
            <input placeholder="ค้นหานักเรียน..." onFocus={() => go('students')} readOnly />
          </div>
          <button className="topbar__icon" onClick={() => go('notifications')}><Icon name="bell" size={19} /><span className="dot"></span></button>
          {canEdit && (route.view === 'students' || route.view === 'profile') && (
            <button className="btn btn--primary btn--sm" onClick={() => setAddOpen(true)} style={{ flexShrink: 0 }}>
              <Icon name="plus" size={16} /><span className="hide-mobile">เพิ่มนักเรียน</span>
            </button>
          )}
          {role === 'director' && <span className="badge badge--gray" style={{ flexShrink: 0 }}><Icon name="eye" size={13} />โหมดดูข้อมูล</span>}
        </header>

        <main className="content">
          {route.view === 'exec' && <DashboardExec go={go} />}
          {route.view === 'overview' && <SchoolOverview />}
          {route.view === 'students' && <StudentList go={go} onAdd={canEdit ? () => setAddOpen(true) : null} />}
          {route.view === 'profile' && <StudentProfile id={route.param} go={go} openVisit={() => openVisit(curStudent)} readOnly={!canEdit} />}
          {route.view === 'map' && <MapScreen go={go} focusId={route.param} />}
          {route.view === 'cases' && <Cases go={go} />}
          {route.view === 'reports' && <Reports go={go} />}
          {route.view === 'notifications' && <Notifications />}
          {route.view === 'users' && <UserManagement onUserChange={forceUpdate} />}
        </main>
      </div>

      {/* mobile FAB — เพิ่มนักเรียน เฉพาะครูและแท็บนักเรียน */}
      {canEdit && (route.view === 'students' || route.view === 'profile') && (
        <button className="fab" onClick={() => setAddOpen(true)} title="เพิ่มนักเรียน"><Icon name="plus" size={26} /></button>
      )}
      <nav className="bottomnav">
        {[['exec', 'หน้าหลัก', 'dashboard'], ['students', 'นักเรียน', 'users'], ['map', 'แผนที่', 'map'], ['cases', 'เคส', 'briefcase'], ['notifications', 'แจ้งเตือน', 'bell']].map(x => (
          <button key={x[0]} className={route.view === x[0] || (x[0] === 'students' && route.view === 'profile') ? 'is-active' : ''} onClick={() => go(x[0])}>
            <Icon name={x[2]} size={21} />{x[1]}
          </button>
        ))}
      </nav>

      {visit.open && <VisitForm student={visit.student} onClose={() => setVisit({ open: false, student: null })} onSaved={forceUpdate} />}
      {addOpen && <AddStudent onClose={() => setAddOpen(false)} onSave={forceUpdate} go={go} />}
      <AppTweaks t={t} setTweak={setTweak} />
    </div>
  );
}

function AppTweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="ปรับแต่ง">
      <TweakSection label="ธีมสี" />
      <TweakColor label="โทนหลัก" value={t.theme}
        options={[
          ["#2c7ab6", "#21689f", "#1b5483", "#143a55"],
          ["#1f6fd6", "#1857ab", "#13458a", "#0f3056"],
          ["#0e8a8a", "#0b7070", "#085656", "#063b3b"],
          ["#5b54d6", "#473fb0", "#372f8c", "#241f5c"],
        ]}
        onChange={(v) => setTweak('theme', v)} />
      <TweakSection label="ตัวอักษร" />
      <TweakSelect label="ฟอนต์" value={t.font}
        options={Object.keys(FONT_LABELS).map(k => ({ value: k, label: FONT_LABELS[k] }))}
        onChange={(v) => setTweak('font', v)} />
      <TweakRadio label="ความหนาแน่น" value={t.density}
        options={['compact', 'regular', 'comfy']}
        onChange={(v) => setTweak('density', v)} />
    </TweaksPanel>
  );
}

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error('App crashed:', err, info); }
  render() {
    if (this.state.err) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--bg)' }}>
          <div className="card card--pad" style={{ maxWidth: 420, textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 50, background: 'var(--r-watch-bg)', color: 'var(--r-watch)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
              <Icon name="refresh" size={28} />
            </div>
            <h2 style={{ fontSize: 19, fontWeight: 600 }}>ระบบขัดข้องชั่วคราว</h2>
            <p style={{ color: 'var(--ink-2)', fontSize: 14, marginTop: 8 }}>เกิดข้อผิดพลาดในการแสดงผล กรุณาโหลดหน้าใหม่อีกครั้ง</p>
            <div className="row" style={{ gap: 10, justifyContent: 'center', marginTop: 18 }}>
              <button className="btn btn--primary btn--sm" onClick={() => location.reload()}><Icon name="refresh" size={15} />โหลดใหม่</button>
              <button className="btn btn--ghost btn--sm" onClick={() => { try { localStorage.clear(); } catch (e) {} location.reload(); }}>ล้างข้อมูลและเริ่มใหม่</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<ErrorBoundary><App /></ErrorBoundary>);
