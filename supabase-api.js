/* ============================================================
   supabase-api.js  —  Drop-in integration layer
   ระบบดูแลช่วยเหลือนักเรียน · โรงเรียนปากกรานพิทยา
   
   วิธีใช้:
   1. เพิ่ม script ใน HTML ก่อน app.jsx:
      <script src="https://lvizorfgyrqqvxxmlalr.supabase.co"></script>
      <script src="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aXpvcmZneXJxcXZ4eG1sYWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTQwOTcsImV4cCI6MjA5NjA5MDA5N30.9IY71dr8vO3DRHuqfyFI-bBWbGUs66fAuOvisZettlc"></script>
   
   2. กรอก URL และ ANON KEY จาก Supabase Dashboard → Settings → API
   
   3. ไฟล์นี้จะแทนที่ window.Auth, window.STUDENTS, window.PhotoStore
      ด้วยข้อมูลจริงจากฐานข้อมูล — ไม่ต้องแก้ไข app.jsx
   ============================================================ */

// ─────────────────────────────────────────────
//  1. CONFIG — แก้ 2 บรรทัดนี้
// ─────────────────────────────────────────────
const SUPABASE_URL  = 'https://lvizorfgyrqqvxxmlalr.supabase.co';   // ← เปลี่ยน
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aXpvcmZneXJxcXZ4eG1sYWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTQwOTcsImV4cCI6MjA5NjA5MDA5N30.9IY71dr8vO3DRHuqfyFI-bBWbGUs66fAuOvisZettlc';               // ← เปลี่ยน
const STORAGE_BUCKET = 'student-photos';

// ─────────────────────────────────────────────
//  2. INIT
// ─────────────────────────────────────────────
let _sb = null;
function sb() {
  if (!_sb) {
    if (!window.supabase) throw new Error('โหลด @supabase/supabase-js ก่อน supabase-api.js');
    _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  }
  return _sb;
}

// ─────────────────────────────────────────────
//  3. RISK HELPERS (เหมือนเดิม — ทำงานออฟไลน์)
// ─────────────────────────────────────────────
window.riskLevel = function (score) {
  if (score >= 61) return { key:'urgent', label:'เร่งด่วน',   cls:'urgent', color:'var(--r-urgent)' };
  if (score >= 41) return { key:'risk',   label:'เสี่ยง',     cls:'risk',   color:'var(--r-risk)'   };
  if (score >= 21) return { key:'watch',  label:'เฝ้าระวัง',  cls:'watch',  color:'var(--r-watch)'  };
  return { key:'ok', label:'ปกติ', cls:'ok', color:'var(--r-ok)' };
};
window.calcScore = function (factors) {
  return (factors||[]).reduce((s,k)=>s+(window.RISK_FACTORS[k]?.pts||0),0);
};
window.fullName = (s) => `${s.prefix}${s.first} ${s.last}`;

// ─────────────────────────────────────────────
//  4. AUTH  (แทนที่ window.Auth)
// ─────────────────────────────────────────────
window.Auth = {
  /* ลงชื่อเข้าใช้ */
  async attempt(username, password) {
    // หา email จาก username ก่อน
    const { data: prof, error: profErr } = await sb()
      .from('user_profiles')
      .select('id, name, role, status, initials, classroom, email')
      .or(`username.eq.${username},email.eq.${username}`)
      .single();

    if (profErr || !prof) return { ok: false, reason: 'not_found' };
    if (prof.status === 'pending')  return { ok: false, reason: 'pending',  user: prof };
    if (prof.status === 'rejected') return { ok: false, reason: 'rejected', user: prof };

    const { data, error } = await sb().auth.signInWithPassword({ email: prof.email, password });
    if (error) return { ok: false, reason: 'bad_password' };
    return { ok: true, user: { ...prof, id: data.user.id } };
  },

  /* สมัครสมาชิก */
  async add(user) {
    const email = user.email.trim();
    const { data, error } = await sb().auth.signUp({ email, password: user.password });
    if (error) throw error;
    const { error: profErr } = await sb().from('user_profiles').insert({
      id: data.user.id, name: user.name, username: user.username,
      email, role: user.role, classroom: user.classroom || null,
      status: 'pending', initials: user.name.trim().slice(0, 2),
    });
    if (profErr) throw profErr;
    return { id: data.user.id, status: 'pending', ...user };
  },

  /* ดึงผู้ใช้ทั้งหมด (admin เท่านั้น) */
  async all() {
    const { data } = await sb().from('user_profiles').select('*').order('created_at');
    return data || [];
  },

  /* อัปเดตข้อมูล */
  async update(id, patch) {
    const { password, ...profilePatch } = patch;
    if (password) {
      // admin reset password ผ่าน Edge Function (ต้องตั้งค่าเพิ่ม)
      // ดูคู่มือหน้า 8 สำหรับการตั้ง admin password reset
    }
    const { data } = await sb().from('user_profiles').update(profilePatch).eq('id', id).select().single();
    return data;
  },

  /* session */
  async sessionUser() {
    const { data: { user } } = await sb().auth.getUser();
    if (!user) return null;
    const { data: prof } = await sb().from('user_profiles').select('*').eq('id', user.id).single();
    return prof;
  },
  clearSession() { sb().auth.signOut(); },
  setSession() { /* จัดการโดย Supabase SDK อัตโนมัติ */ },
  exists() { return false; }, // ตรวจ duplicate ผ่าน DB constraint
  find: async (username) => {
    const { data } = await sb().from('user_profiles').select('*')
      .or(`username.eq.${username},email.eq.${username}`).single();
    return data;
  },
};

// ─────────────────────────────────────────────
//  5. PHOTO STORE  (แทนที่ window.PhotoStore)
// ─────────────────────────────────────────────
window.PhotoStore = {
  _cache: {},

  async getAll(studentId) {
    if (this._cache[studentId]) return this._cache[studentId];
    const { data } = await sb().from('visit_photos').select('photo_type, storage_path')
      .eq('student_id', studentId);
    const map = {};
    for (const row of (data || [])) {
      const { data: { publicUrl } } = sb().storage.from(STORAGE_BUCKET).getPublicUrl(row.storage_path);
      map[row.photo_type] = publicUrl;
    }
    this._cache[studentId] = map;
    return map;
  },

  get(studentId) {
    return this._cache[studentId] || {};
  },

  avatar(studentId) {
    return (this._cache[studentId] || {}).avatar || null;
  },

  async set(studentId, slot, dataUrl) {
    if (dataUrl === null) {
      // ลบรูป
      const path = `${studentId}/${slot}.jpg`;
      await sb().storage.from(STORAGE_BUCKET).remove([path]);
      await sb().from('visit_photos').delete().eq('student_id', studentId).eq('photo_type', slot);
      if (this._cache[studentId]) delete this._cache[studentId][slot];
      return;
    }
    // แปลง data URL → Blob แล้วอัปโหลด
    const blob = await (await fetch(dataUrl)).blob();
    const path = `${studentId}/${slot}.jpg`;
    await sb().storage.from(STORAGE_BUCKET).upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
    const { data: { publicUrl } } = sb().storage.from(STORAGE_BUCKET).getPublicUrl(path);
    await sb().from('visit_photos').upsert({ student_id: studentId, photo_type: slot, storage_path: path });
    if (!this._cache[studentId]) this._cache[studentId] = {};
    this._cache[studentId][slot] = publicUrl;
  },
};

// ─────────────────────────────────────────────
//  6. STUDENT DATA API
// ─────────────────────────────────────────────
function mapStudent(row) {
  const factors = row.home_visits?.[0]?.risk_factors || [];
  const score   = window.calcScore(factors);
  const level   = window.riskLevel(score);
  const visit   = row.home_visits?.[0];
  const g       = row.guardians?.[0] || {};
  return {
    id: row.id, code: row.student_code, citizen: row.citizen_id,
    prefix: row.prefix, first: row.first_name, last: row.last_name, nick: row.nick_name || row.first_name,
    classroom: row.classroom, grade: row.grade, room: row.room_no, no: row.room_no,
    gender: row.gender, advisor: row.advisor_name || '', photo: '', color: level.color,
    guardian: { name: g.name||'—', relation: g.relation||'—', occupation: g.occupation||'—',
      edu: g.education||'—', phone: g.phone||'—', income: g.income_per_head||0 },
    family: { members: g.members||1, type: g.house_type||'ไม่ระบุ', econ: g.econ_status||'ไม่ระบุ',
      liveWith: g.live_with||'—', incomePerHead: g.income_per_head||0, relations: [] },
    factors, score, level,
    visit: visit ? {
      done: true, date: visit.visit_date, by: visit.teacher_name || '—',
      photos: !!visit.complete, complete: !!visit.complete, summary: visit.summary || '',
    } : { done: false, date: null, by: null, photos: false, complete: false, summary: null },
    gps: { x: 50, y: 50 }, gallery: 0,
  };
}

window.SupabaseAPI = {
  /* โหลดนักเรียนทั้งหมด */
  async loadStudents() {
    const { data, error } = await sb()
      .from('students')
      .select(`
        *,
        guardians(*),
        home_visits(*, teacher:teacher_id(name))
      `)
      .order('classroom').order('room_no');
    if (error) throw error;
    window.STUDENTS = data.map(mapStudent);
    // โหลดรูปภาพใน background
    for (const s of window.STUDENTS) {
      window.PhotoStore.getAll(s.id).catch(() => {});
    }
    return window.STUDENTS;
  },

  /* บันทึกนักเรียนใหม่ */
  async addStudent(stu) {
    const { data: s, error } = await sb().from('students').insert({
      student_code: stu.code, citizen_id: stu.citizen, prefix: stu.prefix,
      first_name: stu.first, last_name: stu.last, nick_name: stu.nick,
      classroom: stu.classroom, grade: stu.grade, room_no: stu.no,
      gender: stu.gender, advisor_id: window.SESSION?.id,
    }).select().single();
    if (error) throw error;

    if (stu.guardian) {
      await sb().from('guardians').insert({
        student_id: s.id, name: stu.guardian.name, relation: stu.guardian.relation,
        occupation: stu.guardian.occupation, education: stu.guardian.edu,
        phone: stu.guardian.phone, income_per_head: stu.family?.incomePerHead || 0,
        members: stu.family?.members || 1, house_type: stu.family?.type || '',
        econ_status: stu.family?.econ || '', live_with: stu.family?.liveWith || '',
      });
    }
    return s;
  },

  /* บันทึกการเยี่ยมบ้าน */
  async saveVisit(studentId, visitData) {
    const { data, error } = await sb().from('home_visits').upsert({
      student_id: studentId, teacher_id: window.SESSION?.id,
      visit_date: new Date().toISOString().split('T')[0],
      risk_factors: visitData.factors, risk_score: visitData.score,
      risk_level: visitData.level?.key, summary: visitData.summary,
      latitude: visitData.gps?.lat, longitude: visitData.gps?.lng,
      house_type: visitData.houseType, income_per_head: visitData.income,
      family_members: visitData.members, complete: visitData.complete,
    }).select().single();
    if (error) throw error;
    return data;
  },

  /* บันทึกเคสช่วยเหลือ */
  async saveCase(c) {
    const { data, error } = await sb().from('student_cases').insert({
      student_id: c.studentId, title: c.title, case_type: c.type,
      severity: c.severity, status: c.status || 'new',
      problems: c.problems, plan: c.plan, owner_id: window.SESSION?.id,
    }).select().single();
    if (error) throw error;
    return data;
  },

  /* สถิติ KPI */
  async loadStats() {
    const [totalRes, visitedRes, urgentRes] = await Promise.all([
      sb().from('students').select('id', { count: 'exact', head: true }),
      sb().from('home_visits').select('student_id', { count: 'exact', head: true }),
      sb().from('home_visits').select('id', { count: 'exact', head: true }).eq('risk_level','urgent'),
    ]);
    return {
      total: totalRes.count || 0,
      visited: visitedRes.count || 0,
      urgent: urgentRes.count || 0,
      notVisited: (totalRes.count||0) - (visitedRes.count||0),
    };
  },

  /* Real-time subscription — อัปเดตหน้า dashboard อัตโนมัติ */
  subscribeStudents(onChange) {
    return sb().channel('students-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'home_visits' }, onChange)
      .subscribe();
  },
};

/* ──────────────────────────────────────────────
   7. ASYNC INIT — โหลดข้อมูลเริ่มต้น
   เรียกก่อน ReactDOM.createRoot()
   หากใช้งานร่วมกับ app.jsx ให้เรียก:
     await window.SupabaseAPI.initApp()
   ────────────────────────────────────────────── */
window.SupabaseAPI.initApp = async function () {
  try {
    // โหลดข้อมูลพร้อมกัน
    const [students] = await Promise.all([
      this.loadStudents(),
    ]);
    console.log(`✅ โหลดนักเรียนสำเร็จ: ${students.length} คน`);
  } catch (err) {
    console.error('❌ โหลดข้อมูลไม่สำเร็จ:', err.message);
    // fallback ใช้ mock data เดิม (จาก data.js) ถ้า Supabase ล้มเหลว
  }
};
