/* ================= แบบบันทึกการเยี่ยมบ้าน (เต็ม 4 หน้า ตามแบบ สพฐ.) ================= */

/* ---- form control helpers ---- */
function ChkRow({ on, label, onClick, pts }) {
  return (
    <div className={`opt ${on ? 'is-on' : ''}`} onClick={onClick} style={{ marginBottom: 8 }}>
      <div className="box" style={{ borderRadius: 7 }}>{on && <Icon name="check" size={13} />}</div>
      <span className="txt" style={{ flex: 1, fontSize: 14 }}>{label}</span>
      {pts ? <span className="badge badge--gray" style={{ padding: '1px 7px', fontSize: 11 }}>+{pts}</span> : null}
    </div>
  );
}
function RadioRow({ on, label, onClick }) {
  return (
    <div className={`opt ${on ? 'is-on' : ''}`} onClick={onClick} style={{ marginBottom: 8 }}>
      <div className="box" style={{ borderRadius: '50%' }}>{on && <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff' }}></span>}</div>
      <span className="txt" style={{ flex: 1, fontSize: 14 }}>{label}</span>
    </div>
  );
}
function FLabel({ children, n }) {
  return <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', margin: '16px 0 9px' }}>
    {n && <span style={{ color: 'var(--brand-600)' }}>{n} </span>}{children}</div>;
}
function TLine({ label, value, onChange, type = 'text', suffix, ph }) {
  return (
    <div className="field" style={{ marginBottom: 10 }}>
      {label && <label style={{ fontSize: 13 }}>{label}</label>}
      <div className="control" style={{ height: 44 }}>
        <input type={type} value={value} placeholder={ph} onChange={e => onChange(e.target.value)} />
        {suffix && <span className="muted" style={{ fontSize: 13 }}>{suffix}</span>}
      </div>
    </div>
  );
}
function SubCard({ title, children }) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-700)', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

/* ---- ปัจจัยเสี่ยง (จับคู่ checkbox -> คะแนน) ----
   key ที่ขึ้นต้นด้วยกลุ่ม จะถูกนำไป map เป็น window.RISK_FACTORS เพื่อคิดคะแนน */
const VISIT_RISK_MAP = {
  // 6.2 สวัสดิการ/ความปลอดภัย
  'safe_split': 'parents_split',
  'safe_drug': 'family_drug',
  'safe_noguardian': 'no_guardian',
  'safe_violence': 'family_violence',
  'safe_abuse': 'family_violence',
  'safe_sexual': 'sexual_risk',
  // 6.1 สุขภาพ
  'health_chronic': 'chronic_ill',
  'health_malnutrition': 'chronic_ill',
  // 6.8 พฤติกรรมทางเพศ (any)
  'sex_any': 'sexual_risk',
  // 6.9 ติดเกม (any)
  'game_any': 'game_addict',
  // 6.6 สารเสพติด
  'drug_current': 'family_drug',
};

/* ---- ข้อมูล checkbox กลุ่มต่าง ๆ ---- */
const G = {
  burden: [['คนพิการ', 'b_disabled'], ['ผู้สูงอายุเกิน 60 ปี', 'b_elderly'], ['พ่อ/แม่เลี้ยงเดี่ยว', 'b_single'], ['มีคนวัย 15–65 ว่างงาน', 'b_unemployed']],
  houseCond: [['บ้านชำรุดทรุดโทรม / ทำจากวัสดุพื้นบ้าน', 'hc_poor'], ['ไม่มีห้องส้วมในที่อยู่อาศัย', 'hc_notoilet']],
  health: [['ร่างกายไม่แข็งแรง', 'health_weak'], ['มีโรคประจำตัว/เจ็บป่วยบ่อย', 'health_chronic'], ['มีภาวะทุพโภชนาการ', 'health_malnutrition'], ['ป่วยโรคร้ายแรง/เรื้อรัง', 'health_severe'], ['สมรรถภาพร่างกายต่ำ', 'health_lowfit']],
  safety: [['พ่อแม่แยกทาง / แต่งงานใหม่', 'safe_split'], ['อยู่ในชุมชนแออัด/ใกล้แหล่งมั่วสุม', 'safe_slum'], ['ครอบครัวเจ็บป่วยโรคร้ายแรง', 'safe_illness'], ['บุคคลในครอบครัวติดสารเสพติด', 'safe_drug'], ['ครอบครัวเล่นการพนัน', 'safe_gamble'], ['ความขัดแย้ง/ทะเลาะในครอบครัว', 'safe_conflict'], ['ไม่มีผู้ดูแล', 'safe_noguardian'], ['ความขัดแย้งและใช้ความรุนแรง', 'safe_violence'], ['ถูกทารุณ/ทำร้าย', 'safe_abuse'], ['ถูกล่วงละเมิดทางเพศ', 'safe_sexual']],
  hobby: [['ดูทีวี/ฟังเพลง', 'h_tv'], ['อ่านหนังสือ', 'h_read'], ['ไปเที่ยวห้าง/ดูหนัง', 'h_mall'], ['ไปหาเพื่อน', 'h_friend'], ['เล่นเกมคอม/มือถือ', 'h_game'], ['เล่นกีฬา/ออกกำลัง', 'h_sport'], ['อื่น ๆ', 'h_other']],
  chores: [['ช่วยงานบ้าน', 'c_house'], ['ช่วยค้าขายเล็ก ๆ น้อย ๆ', 'c_sell'], ['ช่วยงานนาไร่', 'c_farm'], ['ดูแลคนเจ็บป่วย/พิการ', 'c_care'], ['ทำงานแถวบ้าน', 'c_work'], ['อื่น ๆ', 'c_other']],
  drug: [['คบเพื่อนกลุ่มใช้สารเสพติด', 'd_friends'], ['สมาชิกครอบครัวข้องเกี่ยวยาเสพติด', 'd_family'], ['อยู่ในสภาพแวดล้อมที่ใช้สารเสพติด', 'd_env'], ['ปัจจุบันเกี่ยวข้องกับสารเสพติด', 'drug_current'], ['ติดบุหรี่/สุรา/สารเสพติด', 'd_addict']],
  violence: [['มีการทะเลาะวิวาท', 'v_fight'], ['ก้าวร้าว เกเร', 'v_aggressive'], ['ทะเลาะวิวาทเป็นประจำ', 'v_often'], ['ทำร้ายร่างกายผู้อื่น', 'v_others'], ['ทำร้ายร่างกายตนเอง', 'v_self']],
  sexual: [['อยู่ในกลุ่มขายบริการ', 'sex_group'], ['ใช้สื่อเกี่ยวกับเพศเป็นเวลานาน/บ่อย', 'sex_media'], ['ตั้งครรภ์', 'sex_pregnant'], ['ขายบริการทางเพศ', 'sex_sell'], ['หมกมุ่นสื่อทางเพศ', 'sex_obsess'], ['มีการมั่วสุมทางเพศ', 'sex_promisc']],
  game: [['เล่นเกมเกินวันละ 1 ชม.', 'g_1hr'], ['ขาดจินตนาการ/ความคิดสร้างสรรค์', 'g_noimag'], ['เก็บตัว แยกจากเพื่อน', 'g_isolate'], ['ใช้จ่ายเงินผิดปกติ', 'g_spend'], ['เล่นเกมเกิน 2 ชม.', 'g_2hr'], ['หมกมุ่นจริงจังกับเกม', 'g_obsess'], ['โกหก/ลักขโมยเงินเพื่อเล่นเกม', 'g_steal']],
};

function VisitForm({ student, onClose, onSaved }) {
  const PAGES = ['หน้า 1 · ข้อมูลครัวเรือน', 'หน้า 2 · ความสัมพันธ์ & ความเสี่ยง', 'หน้า 3 · พฤติกรรม', 'หน้า 4 · ภาพถ่าย & ลงนาม'];
  const [step, setStep] = React.useState(0);
  const [saved, setSaved] = React.useState(false);

  // ---- form state ----
  const [chk, setChk] = React.useState({});          // ทุก checkbox key -> bool
  const [houseType, setHouseType] = React.useState(student ? student.family.type : 'บ้านของตนเอง');
  const [members, setMembers] = React.useState(student ? String(student.family.members) : '');
  const [income, setIncome] = React.useState(student ? String(student.family.incomePerHead) : '');
  const [stayWith, setStayWith] = React.useState('');
  const [help, setHelp] = React.useState({});
  const [internet, setInternet] = React.useState('');
  const [distance, setDistance] = React.useState('');
  const [travel, setTravel] = React.useState('');
  const [concern, setConcern] = React.useState('');
  const [gps, setGps] = React.useState(false);
  const [parentSigned, setParentSigned] = React.useState(false);
  const [teacherSigned, setTeacherSigned] = React.useState(false);
  const [, bumpPhotos] = React.useReducer(x => x + 1, 0);

  const tg = (k) => setChk(c => ({ ...c, [k]: !c[k] }));
  const setRel = (k, lv) => setChk(c => ({ ...c, [k]: c[k] === lv ? undefined : lv }));
  const tgHelp = (k) => setHelp(c => ({ ...c, [k]: !c[k] }));

  // ---- live risk score from form ----
  const derivedFactors = React.useMemo(() => {
    const fset = new Set();
    Object.keys(chk).forEach(k => { if (chk[k] && VISIT_RISK_MAP[k]) fset.add(VISIT_RISK_MAP[k]); });
    // group-any rules
    if (G.sexual.some(([, k]) => chk[k])) fset.add('sexual_risk');
    if (G.game.filter(([, k]) => chk[k]).length >= 2) fset.add('game_addict');
    if (G.burden.some(([, k]) => chk[k])) fset.add('dependent');
    const iph = parseInt(income) || 0;
    if (iph > 0 && iph < 1500) fset.add('poor_special');
    else if (iph > 0 && iph < 3000) fset.add('low_income');
    if (houseType === 'บ้านเช่า') fset.add('rent_house');
    if ((parseInt(distance) || 0) > 10) fset.add('far_school');
    return [...fset];
  }, [chk, income, houseType, distance]);

  const score = window.calcScore(derivedFactors);
  const level = window.riskLevel(score);
  const photoSlots = ['home_ext', 'home_int', 'student_guardian'];
  const photoCount = student ? photoSlots.filter(sl => window.PhotoStore.get(student.id)[sl]).length : 0;

  const commit = () => {
    if (student) {
      student.factors = derivedFactors;
      student.score = score;
      student.level = level;
      student.color = level.color;
      student.family.type = houseType;
      if (parseInt(members)) student.family.members = parseInt(members);
      if (parseInt(income)) student.family.incomePerHead = parseInt(income);
      const iph = parseInt(income) || student.family.incomePerHead;
      student.family.econ = iph < 1500 ? 'ยากจนพิเศษ' : iph < 3000 ? 'ยากจน' : iph < 6000 ? 'ปานกลาง' : 'ดี';
      student.gallery = photoCount;
      student.visit = {
        done: true,
        date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
        by: window.TEACHER.name, photos: photoCount > 0,
        complete: photoCount > 0 && gps && parentSigned && teacherSigned,
        summary: concern.trim() || `บันทึกการเยี่ยมบ้านโดยครู${window.TEACHER.name} — คะแนนความเสี่ยง ${score} (${level.label})`,
      };
    }
    setSaved(true);
    onSaved && onSaved();
  };

  const canSave = parentSigned && teacherSigned;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,58,85,.5)', zIndex: 70,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(3px)' }}>
      <div className="phone-frame view" onClick={e => e.stopPropagation()} style={{ maxHeight: '94vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--brand-600)', color: '#fff', padding: '16px 18px', flexShrink: 0 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="row" style={{ gap: 9 }}>
              <Icon name="clipboard" size={18} />
              <b style={{ fontSize: 15 }}>แบบบันทึกการเยี่ยมบ้าน</b>
            </div>
            <button onClick={onClose} style={{ color: '#fff', opacity: .85 }}><Icon name="x" size={20} /></button>
          </div>
          <div style={{ fontSize: 12.5, opacity: .85, marginTop: 3 }}>
            {student ? window.fullName(student) + ' · ' + student.classroom : 'นักเรียนใหม่'} · รวมคัดกรองยากจน
          </div>
        </div>

        {!saved ? (
          <>
            <div className="stepbar" style={{ flexShrink: 0 }}>
              {PAGES.map((_, i) => <div key={i} className={`s ${i < step ? 'done' : i === step ? 'now' : ''}`}></div>)}
            </div>
            <div style={{ padding: '13px 18px 2px', fontSize: 12.5, color: 'var(--brand-700)', fontWeight: 600, flexShrink: 0 }}>
              {PAGES[step]}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 18px' }}>
              {step === 0 && <PageHousehold {...{ student, chk, tg, houseType, setHouseType, members, setMembers, income, setIncome, bumpPhotos }} />}
              {step === 1 && <PageRelations {...{ chk, tg, setRel, stayWith, setStayWith, help, tgHelp, concern, setConcern, distance, setDistance, travel, setTravel, score, level }} />}
              {step === 2 && <PageBehavior {...{ chk, tg, internet, setInternet }} />}
              {step === 3 && <PagePhotosSign {...{ student, gps, setGps, parentSigned, setParentSigned, teacherSigned, setTeacherSigned, score, level, photoCount, bumpPhotos }} />}
            </div>

            <div className="row" style={{ gap: 10, padding: 16, borderTop: '1px solid var(--line)', flexShrink: 0 }}>
              {step > 0 && <button className="btn btn--ghost" style={{ flex: '0 0 auto' }} onClick={() => setStep(step - 1)}><Icon name="back" size={16} /></button>}
              {step < PAGES.length - 1
                ? <button className="btn btn--primary" style={{ flex: 1 }} onClick={() => setStep(step + 1)}>ถัดไป<Icon name="chevron" size={16} /></button>
                : <button className="btn btn--primary" style={{ flex: 1 }} disabled={!canSave} onClick={commit}
                    title={!canSave ? 'ต้องลงลายมือชื่อทั้งผู้ปกครองและครู' : ''}>
                    <Icon name="check" size={17} />บันทึกข้อมูล</button>}
            </div>
          </>
        ) : <VisitSaved {...{ score, level, photoCount, gps, onClose }} />}
      </div>
    </div>
  );
}

/* ---------- PAGE 1 ---------- */
function PageHousehold({ student, chk, tg, houseType, setHouseType, members, setMembers, income, setIncome, bumpPhotos }) {
  return (
    <div>
      {student && (
        <div className="row" style={{ gap: 12, padding: 10, background: 'var(--surface-2)', borderRadius: 12, marginTop: 8 }}>
          <AvatarUpload s={student} size={56} radius={13} onChange={bumpPhotos} />
          <div>
            <div className="fw5">{window.fullName(student)}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{student.classroom} · เลขที่ {student.no} · แตะรูปเพื่ออัปโหลด</div>
          </div>
        </div>
      )}

      <FLabel n="3.">จำนวนสมาชิกในครัวเรือน & รายได้</FLabel>
      <TLine label="จำนวนสมาชิก (รวมนักเรียน)" value={members} onChange={setMembers} type="number" suffix="คน" ph="0" />
      <TLine label="รายได้ครัวเรือนเฉลี่ยต่อคน/เดือน" value={income} onChange={setIncome} type="number" suffix="บาท" ph="0" />
      {income && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: -4, marginBottom: 4 }}>
        ฐานะ: <b style={{ color: 'var(--ink)' }}>{(parseInt(income) < 1500 ? 'ยากจนพิเศษ' : parseInt(income) < 3000 ? 'ยากจน' : parseInt(income) < 6000 ? 'ปานกลาง' : 'ดี')}</b></div>}

      <FLabel n="4.1">ครัวเรือนมีภาระพึ่งพิง</FLabel>
      {G.burden.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} />)}

      <FLabel n="4.2">ประเภทที่อยู่อาศัย</FLabel>
      {['บ้านของตนเอง', 'บ้านเช่า', 'อาศัยอยู่กับผู้อื่น'].map(t =>
        <RadioRow key={t} label={t} on={houseType === t} onClick={() => setHouseType(t)} />)}

      <FLabel n="4.3">สภาพที่อยู่อาศัย</FLabel>
      {G.houseCond.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} />)}

      <FLabel n="4.4">ยานพาหนะของครอบครัว</FLabel>
      {[['รถยนต์ส่วนบุคคล', 'veh_car'], ['รถปิกอัพ/บรรทุกเล็ก/รถตู้', 'veh_pickup'], ['รถไถ/เกี่ยวข้าว/อีแต๋น', 'veh_tractor']].map(([l, k]) =>
        <ChkRow key={k} label={'มี' + l} on={!!chk[k]} onClick={() => tg(k)} />)}
    </div>
  );
}

/* ---------- PAGE 2 ---------- */
function PageRelations({ chk, tg, setRel, stayWith, setStayWith, help, tgHelp, concern, setConcern, distance, setDistance, travel, setTravel, score, level }) {
  const members = ['บิดา', 'มารดา', 'พี่/น้องชาย', 'พี่/น้องสาว', 'ปู่/ย่า/ตา/ยาย', 'ญาติ'];
  const levels = ['สนิทสนม', 'เฉย ๆ', 'ห่างเหิน', 'ขัดแย้ง', 'ไม่มี'];
  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', padding: '10px 14px', background: `var(--r-${level.cls}-bg)`,
        borderRadius: 12, margin: '10px 0 4px' }}>
        <span style={{ fontSize: 13 }}>คะแนนเสี่ยง (คำนวณสด)</span>
        <span className="row" style={{ gap: 8 }}><b className="tabular" style={{ fontSize: 20, color: level.color }}>{score}</b><RiskBadge level={level} /></span>
      </div>

      <FLabel n="5.2">ความสัมพันธ์ระหว่างนักเรียนกับสมาชิก</FLabel>
      <SubCard title="แตะระดับความสัมพันธ์ของแต่ละคน">
        {members.map(m => {
          const cur = chk['rel_' + m];
          return (
            <div key={m} style={{ marginBottom: 9 }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{m}</div>
              <div className="chip-row">
                {levels.map(lv => (
                  <span key={lv} className={`chip ${cur === lv ? 'is-on' : ''}`} style={{ fontSize: 12, padding: '4px 10px' }}
                    onClick={() => setRel('rel_' + m, lv)}>{lv}</span>
                ))}
              </div>
            </div>
          );
        })}
      </SubCard>

      <FLabel n="5.3">ผู้ปกครองไม่อยู่ ฝากเด็กไว้กับใคร</FLabel>
      {['ญาติ', 'เพื่อนบ้าน', 'นักเรียนอยู่บ้านด้วยตนเอง', 'อื่น ๆ'].map(o =>
        <RadioRow key={o} label={o} on={stayWith === o} onClick={() => setStayWith(o)} />)}

      <FLabel n="5.6">สิ่งที่ผู้ปกครองต้องการให้โรงเรียนช่วยเหลือ</FLabel>
      {[['ด้านการเรียน', 'learn'], ['ด้านพฤติกรรม', 'behav'], ['ด้านเศรษฐกิจ (ขอรับทุน)', 'econ'], ['อื่น ๆ', 'other']].map(([l, k]) =>
        <ChkRow key={k} label={l} on={!!help[k]} onClick={() => tgHelp(k)} />)}

      <FLabel n="5.8">ข้อห่วงใยของผู้ปกครอง / สรุปการเยี่ยม</FLabel>
      <textarea value={concern} onChange={e => setConcern(e.target.value)} rows={3} placeholder="บันทึกข้อห่วงใย/สรุปสภาพที่พบ..."
        style={{ width: '100%', border: '1.5px solid var(--line)', borderRadius: 11, padding: '10px 12px', resize: 'vertical', outline: 'none', fontSize: 14 }} />

      <FLabel n="6.1">สุขภาพ</FLabel>
      {G.health.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} pts={window.RISK_FACTORS[VISIT_RISK_MAP[k]]?.pts} />)}

      <FLabel n="6.2">สวัสดิการหรือความปลอดภัย</FLabel>
      {G.safety.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} pts={window.RISK_FACTORS[VISIT_RISK_MAP[k]]?.pts} />)}

      <FLabel n="6.3">การเดินทางไปโรงเรียน</FLabel>
      <TLine label="ระยะทางไป-กลับ" value={distance} onChange={setDistance} type="number" suffix="กม." ph="0" />
      {['ผู้ปกครองมาส่ง', 'รถโดยสารประจำทาง', 'รถจักรยานยนต์', 'รถโรงเรียน', 'รถจักรยาน', 'เดิน'].map(o =>
        <RadioRow key={o} label={o} on={travel === o} onClick={() => setTravel(o)} />)}
    </div>
  );
}
/* ---------- PAGE 3 ---------- */
function PageBehavior({ chk, tg, internet, setInternet }) {
  const pts = (k) => window.RISK_FACTORS[VISIT_RISK_MAP[k]]?.pts;
  return (
    <div>
      <FLabel n="6.4">ภาระงานความรับผิดชอบต่อครอบครัว</FLabel>
      {G.chores.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} />)}

      <FLabel n="6.5">กิจกรรมยามว่าง / งานอดิเรก</FLabel>
      {G.hobby.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} />)}

      <FLabel n="6.6">พฤติกรรมการใช้สารเสพติด</FLabel>
      {G.drug.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} pts={pts(k)} />)}

      <FLabel n="6.7">พฤติกรรมการใช้ความรุนแรง</FLabel>
      {G.violence.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} />)}

      <FLabel n="6.8">พฤติกรรมทางเพศ</FLabel>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginBottom: 6 }}>เลือกอย่างน้อย 1 ข้อ จะเพิ่มความเสี่ยง +15</div>
      {G.sexual.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} />)}

      <FLabel n="6.9">การติดเกม</FLabel>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginBottom: 6 }}>เลือกตั้งแต่ 2 ข้อขึ้นไป จะเพิ่มความเสี่ยง +10</div>
      {G.game.map(([l, k]) => <ChkRow key={k} label={l} on={!!chk[k]} onClick={() => tg(k)} />)}

      <FLabel n="6.10">การเข้าถึงอินเทอร์เน็ตที่บ้าน</FLabel>
      {['เข้าถึง Internet ได้จากที่บ้าน', 'ไม่สามารถเข้าถึง Internet ได้'].map(o =>
        <RadioRow key={o} label={o} on={internet === o} onClick={() => setInternet(o)} />)}
    </div>
  );
}

/* ---------- PAGE 4 ---------- */
function PagePhotosSign({ student, gps, setGps, parentSigned, setParentSigned, teacherSigned, setTeacherSigned, score, level, photoCount, bumpPhotos }) {
  const slots = [['home_ext', 'รูปที่ 1 · สภาพบ้านนักเรียน'], ['home_int', 'รูปที่ 2 · ภายในบ้าน'], ['student_guardian', 'นักเรียนกับผู้ปกครอง']];
  return (
    <div className="stack" style={{ marginTop: 8 }}>
      <label style={{ fontSize: 13.5, fontWeight: 600 }}>ภาพถ่ายบ้านนักเรียน</label>
      {student
        ? <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {slots.map(([slot, cap]) => <UploadSlot key={slot} studentId={student.id} slot={slot} caption={cap} onChange={bumpPhotos} />)}
          </div>
        : <div className="muted" style={{ fontSize: 13 }}>บันทึกข้อมูลนักเรียนก่อนจึงจะแนบรูปได้</div>}

      <label style={{ fontSize: 13.5, fontWeight: 600 }}>พิกัดที่ตั้งบ้าน (GPS)</label>
      <button onClick={() => setGps(true)} className="opt" style={{ width: '100%', borderColor: gps ? 'var(--r-ok)' : 'var(--line)',
        background: gps ? 'var(--r-ok-bg)' : 'var(--surface)' }}>
        <Icon name="gps" size={20} style={{ color: gps ? 'var(--r-ok)' : 'var(--brand-500)' }} />
        <span className="txt" style={{ flex: 1 }}>{gps ? 'บันทึกพิกัดแล้ว · 14.3521, 100.5483' : 'แตะเพื่อปักหมุดตำแหน่งปัจจุบัน'}</span>
        {gps && <Icon name="check" size={18} style={{ color: 'var(--r-ok)' }} />}
      </button>

      <div className="card--pad" style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 14 }}>
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 13.5 }}>
          <span className="muted">คะแนนความเสี่ยงรวม</span>
          <span className="row" style={{ gap: 7 }}><b className="tabular" style={{ color: level.color }}>{score}</b><RiskBadge level={level} /></span>
        </div>
      </div>

      <label style={{ fontSize: 13.5, fontWeight: 600 }}>ลงชื่อผู้ปกครอง / ผู้แทน</label>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: -8 }}>ขอรับรองว่าข้อมูลดังกล่าวเป็นความจริง</div>
      <SignaturePad onChange={setParentSigned} height={120} />

      <label style={{ fontSize: 13.5, fontWeight: 600 }}>ลงชื่อครู / ผู้อำนวยการ</label>
      <SignaturePad onChange={setTeacherSigned} height={120} />
      <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>ครู{window.TEACHER.name} · {window.TEACHER.role}</div>
    </div>
  );
}

/* ---------- success ---------- */
function VisitSaved({ score, level, photoCount, gps, onClose }) {
  return (
    <div style={{ padding: 28, textAlign: 'center', overflowY: 'auto' }}>
      <div style={{ width: 72, height: 72, borderRadius: 50, background: 'var(--r-ok-bg)', color: 'var(--r-ok)',
        display: 'grid', placeItems: 'center', margin: '8px auto 16px' }}><Icon name="check" size={36} /></div>
      <h3 style={{ fontSize: 19, fontWeight: 600 }}>บันทึกสำเร็จ</h3>
      <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>ข้อมูลซิงค์เข้าระบบทันที ไม่ต้องกลับมาคีย์ซ้ำ</p>
      <div className="card--pad" style={{ background: 'var(--surface-2)', borderRadius: 12, marginTop: 18, textAlign: 'left' }}>
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 13.5, padding: '4px 0' }}>
          <span className="muted">คะแนนความเสี่ยง</span><b className="tabular" style={{ color: level.color }}>{score} · {level.label}</b></div>
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 13.5, padding: '4px 0' }}>
          <span className="muted">ภาพถ่าย</span><b>{photoCount} รูป</b></div>
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 13.5, padding: '4px 0' }}>
          <span className="muted">พิกัด GPS</span><b>{gps ? 'บันทึกแล้ว' : '—'}</b></div>
      </div>
      {level.key !== 'ok' && (
        <div className="row" style={{ gap: 8, marginTop: 14, padding: 11, background: 'var(--r-risk-bg)', borderRadius: 11, fontSize: 12.5, color: 'var(--r-risk)', textAlign: 'left' }}>
          <Icon name="sparkle" size={16} style={{ flexShrink: 0 }} />ระบบสร้างเคสช่วยเหลืออัตโนมัติและแจ้งเตือนผู้บริหารแล้ว
        </div>
      )}
      <button className="btn btn--primary btn--block mt16" onClick={onClose}>เสร็จสิ้น</button>
    </div>
  );
}

Object.assign(window, { VisitForm });
