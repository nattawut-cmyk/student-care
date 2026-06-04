/* ================= ระบบบัญชีผู้ใช้ (Auth) — เก็บใน localStorage ================= */

window.ROLE_LABELS = {
  admin: 'ผู้ดูแลระบบ',
  teacher: 'ครูที่ปรึกษา',
  director: 'ผู้บริหาร',
  parent: 'ผู้ปกครอง',
};

window.Auth = {
  _key: 'pk_users_v1',
  _sessionKey: 'pk_session_v1',

  seed() {
    try {
      if (localStorage.getItem(this._key)) return;
    } catch (e) { return; }
    const now = Date.now();
    const users = [
      { id: 'u_admin', name: 'ผู้ดูแลระบบ', username: 'admin', email: 'admin@pakkran.ac.th', password: '123456', role: 'admin', status: 'approved', initials: 'AD', createdAt: now },
      { id: 'u_teacher', name: 'นางสาวพรรณี วงศ์สถิตย์', username: 'phannee', email: 'phannee.w@pakkran.ac.th', password: '123456', role: 'teacher', classroom: 'ม.2/1', initials: 'พว', status: 'approved', createdAt: now },
      { id: 'u_director', name: 'นายสมชาย รัฐมั่นคง', username: 'director', email: 'director@pakkran.ac.th', password: '123456', role: 'director', initials: 'สช', status: 'approved', createdAt: now },
      { id: 'u_parent', name: 'นางสมหญิง แสงทอง', username: 'parent', email: 'somying@gmail.com', password: '123456', role: 'parent', initials: 'สญ', status: 'approved', createdAt: now },
      { id: 'u_p1', name: 'นายอนุชา เกษมสุข', username: 'kru_anucha', email: 'anucha.k@pakkran.ac.th', password: 'anucha2568', role: 'teacher', classroom: 'ม.1/1', initials: 'อก', status: 'pending', createdAt: now - 3600e3 },
      { id: 'u_p2', name: 'นางมาลี ปานทอง', username: 'malee.p', email: 'malee.home@gmail.com', password: 'malee1234', role: 'parent', initials: 'มป', status: 'pending', createdAt: now - 7200e3 },
    ];
    this._save(users);
  },
  _save(list) { try { localStorage.setItem(this._key, JSON.stringify(list)); } catch (e) { console.warn('Auth save failed', e); } },
  all() { try { return JSON.parse(localStorage.getItem(this._key) || '[]'); } catch (e) { return []; } },
  find(username) {
    const u = (username || '').trim().toLowerCase();
    return this.all().find(x => x.username.toLowerCase() === u || x.email.toLowerCase() === u) || null;
  },
  exists(username, email) {
    const list = this.all();
    return list.some(x => x.username.toLowerCase() === (username || '').trim().toLowerCase()
      || x.email.toLowerCase() === (email || '').trim().toLowerCase());
  },
  add(user) {
    const list = this.all();
    const initials = (user.name || '?').trim().slice(0, 2);
    const rec = { id: 'u_' + Date.now() + Math.floor(Math.random() * 999), status: 'pending', createdAt: Date.now(), initials, ...user };
    list.push(rec); this._save(list); return rec;
  },
  update(id, patch) {
    const list = this.all().map(x => x.id === id ? { ...x, ...patch } : x);
    this._save(list); return list.find(x => x.id === id);
  },
  remove(id) { this._save(this.all().filter(x => x.id !== id)); },

  /* ---- session ---- */
  setSession(id) { localStorage.setItem(this._sessionKey, id || ''); },
  clearSession() { localStorage.removeItem(this._sessionKey); },
  sessionUser() {
    try {
      const id = localStorage.getItem(this._sessionKey);
      if (!id) return null;
      return this.all().find(x => x.id === id) || null;
    } catch (e) { return null; }
  },

  /* ---- login attempt -> {ok, user, reason} ---- */
  attempt(username, password) {
    const user = this.find(username);
    if (!user) return { ok: false, reason: 'not_found' };
    if (user.password !== password) return { ok: false, reason: 'bad_password' };
    if (user.status === 'pending') return { ok: false, reason: 'pending', user };
    if (user.status === 'rejected') return { ok: false, reason: 'rejected', user };
    return { ok: true, user };
  },
};

try { window.Auth.seed(); } catch (e) { console.warn('Auth seed failed', e); }
