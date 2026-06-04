/* ================= ข้อมูลจำลอง + เครื่องคำนวณคะแนนความเสี่ยง ================= */
/* อิงปัจจัยจากแบบบันทึกการเยี่ยมบ้าน (สพฐ.) + เกณฑ์ที่ผู้ใช้กำหนด */

window.SCHOOL = {
  name: "โรงเรียนปากกรานพิทยา",
  area: "สพม.พระนครศรีอยุธยา",
  year: "ปีการศึกษา 2568",
};

window.TEACHER = {
  name: "นางสาวพรรณี วงศ์สถิตย์",
  role: "ครูที่ปรึกษา",
  classroom: "ม.2/1",
  initials: "พว",
};

/* ปัจจัยความเสี่ยง — key, ชื่อ, คะแนน, หมวด, รายละเอียด */
window.RISK_FACTORS = {
  parents_split:   { label: "ผู้ปกครองแยกทาง / แต่งงานใหม่", pts: 10, cat: "ครอบครัว", icon: "split" },
  low_income:      { label: "รายได้ครัวเรือนเฉลี่ย < 3,000 บ./เดือน", pts: 15, cat: "เศรษฐกิจ", icon: "coins" },
  poor_special:    { label: "ยากจนพิเศษ (รายได้เฉลี่ย < 1,500)", pts: 20, cat: "เศรษฐกิจ", icon: "coins" },
  game_addict:     { label: "ติดเกม / ใช้สื่อเกินควร", pts: 10, cat: "พฤติกรรม", icon: "game" },
  family_drug:     { label: "ครอบครัวมีสารเสพติด", pts: 20, cat: "ความเสี่ยง", icon: "warn" },
  no_guardian:     { label: "ไม่มีผู้ดูแล", pts: 25, cat: "ครอบครัว", icon: "user-x" },
  family_violence: { label: "ครอบครัวมีความรุนแรง", pts: 20, cat: "ความเสี่ยง", icon: "warn" },
  sexual_risk:     { label: "พฤติกรรมเสี่ยงทางเพศ", pts: 15, cat: "พฤติกรรม", icon: "heart" },
  often_absent:    { label: "ขาดเรียนบ่อย", pts: 10, cat: "พฤติกรรม", icon: "calendar" },
  dependent:       { label: "ครัวเรือนมีภาระพึ่งพิง (พิการ/ผู้สูงอายุ)", pts: 8, cat: "ครอบครัว", icon: "accessible" },
  rent_house:      { label: "บ้านเช่า / ทรุดโทรม", pts: 5, cat: "เศรษฐกิจ", icon: "home" },
  chronic_ill:     { label: "เจ็บป่วยเรื้อรัง / ทุพโภชนาการ", pts: 8, cat: "สุขภาพ", icon: "health" },
  far_school:      { label: "เดินทางไกล > 10 กม.", pts: 5, cat: "อื่น ๆ", icon: "route" },
};

window.riskLevel = function (score) {
  if (score >= 61) return { key: "urgent", label: "เร่งด่วน", cls: "urgent", color: "var(--r-urgent)" };
  if (score >= 41) return { key: "risk",   label: "เสี่ยง",   cls: "risk",   color: "var(--r-risk)" };
  if (score >= 21) return { key: "watch",  label: "เฝ้าระวัง", cls: "watch",  color: "var(--r-watch)" };
  return { key: "ok", label: "ปกติ", cls: "ok", color: "var(--r-ok)" };
};
window.calcScore = function (factors) {
  return (factors || []).reduce((s, k) => s + (window.RISK_FACTORS[k]?.pts || 0), 0);
};

/* ===== นักเรียน (ข้อมูลน้อย ๆ พอเห็นโครงสร้าง) ===== */
function S(o) {
  o.score = window.calcScore(o.factors);
  o.level = window.riskLevel(o.score);
  return o;
}

window.STUDENTS = [
  S({
    id: "PK068-2014", code: "13245", citizen: "1 1037 03842 21 5",
    prefix: "เด็กชาย", first: "ธนกร", last: "แสงทอง", nick: "กร",
    classroom: "ม.2/1", grade: "ม.2", room: 1, no: 7, gender: "ชาย",
    advisor: "นางสาวพรรณี วงศ์สถิตย์",
    photo: "", color: "#2c7ab6",
    guardian: { name: "นางสมหญิง แสงทอง", relation: "มารดา", occupation: "รับจ้างทั่วไป", edu: "ป.6", phone: "081-234-5678", income: 4500 },
    family: { members: 5, type: "บ้านเช่า", econ: "ยากจน", liveWith: "อยู่กับมารดา (พ่อแม่แยกทาง)", incomePerHead: 2900,
      relations: [{ who: "มารดา", lv: "สนิทสนม" }, { who: "บิดา", lv: "ห่างเหิน" }, { who: "ยาย", lv: "สนิทสนม" }] },
    factors: ["parents_split", "low_income", "game_addict", "rent_house"],
    visit: { done: true, date: "12 พ.ค. 2568", by: "นางสาวพรรณี วงศ์สถิตย์", photos: true, complete: true,
      summary: "บ้านเช่าห้องแถว อยู่กับมารดาและยาย รายได้ไม่แน่นอน นักเรียนใช้เวลาเล่นเกมมาก ควรติดตามด้านการเรียนและจัดสรรทุนอาหารกลางวัน" },
    gps: { x: 38, y: 44 },
    gallery: 3,
  }),
  S({
    id: "PK068-2015", code: "13301", citizen: "1 1037 02211 09 2",
    prefix: "เด็กชาย", first: "ณัฐวุฒิ", last: "ทองสุข", nick: "บอล",
    classroom: "ม.2/1", grade: "ม.2", room: 1, no: 11, gender: "ชาย",
    advisor: "นางสาวพรรณี วงศ์สถิตย์",
    photo: "", color: "#e23b3b",
    guardian: { name: "นายประสิทธิ์ ทองสุข", relation: "ลุง", occupation: "เกษตรกร", edu: "ป.4", phone: "089-555-2210", income: 2200 },
    family: { members: 4, type: "อาศัยกับญาติ", econ: "ยากจนพิเศษ", liveWith: "อยู่กับลุง (พ่อแม่แยกทาง ไม่มีผู้ดูแลหลัก)", incomePerHead: 1350,
      relations: [{ who: "บิดา", lv: "ไม่มี" }, { who: "มารดา", lv: "ห่างเหิน" }, { who: "ลุง", lv: "เฉย ๆ" }] },
    factors: ["parents_split", "poor_special", "no_guardian", "often_absent", "game_addict"],
    visit: { done: true, date: "12 พ.ค. 2568", by: "นางสาวพรรณี วงศ์สถิตย์", photos: true, complete: true,
      summary: "ผู้ปกครองแยกทาง ปัจจุบันอยู่กับลุงซึ่งออกไปทำไร่ทั้งวัน นักเรียนขาดเรียนบ่อยและขาดผู้ดูแล แนะนำเปิดเคสช่วยเหลือเร่งด่วน + ขอรับทุน" },
    gps: { x: 64, y: 30 },
    gallery: 3,
  }),
  S({
    id: "PK068-1190", code: "12880", citizen: "1 1037 09921 44 8",
    prefix: "เด็กหญิง", first: "ปิยะดา", last: "ใจงาม", nick: "ใบเฟิร์น",
    classroom: "ม.2/1", grade: "ม.2", room: 1, no: 22, gender: "หญิง",
    advisor: "นางสาวพรรณี วงศ์สถิตย์",
    photo: "", color: "#1ea672",
    guardian: { name: "นายวิรัตน์ ใจงาม", relation: "บิดา", occupation: "ข้าราชการ", edu: "ปริญญาตรี", phone: "086-700-1145", income: 28000 },
    family: { members: 4, type: "บ้านตนเอง", econ: "ดี", liveWith: "อยู่พร้อมหน้าพ่อแม่", incomePerHead: 7000,
      relations: [{ who: "บิดา", lv: "สนิทสนม" }, { who: "มารดา", lv: "สนิทสนม" }, { who: "น้องสาว", lv: "สนิทสนม" }] },
    factors: [],
    visit: { done: true, date: "13 พ.ค. 2568", by: "นางสาวพรรณี วงศ์สถิตย์", photos: true, complete: true,
      summary: "ครอบครัวอบอุ่น อยู่พร้อมหน้า ฐานะดี นักเรียนมีความรับผิดชอบ ไม่พบความเสี่ยง" },
    gps: { x: 50, y: 64 },
    gallery: 3,
  }),
  S({
    id: "PK068-2208", code: "13412", citizen: "1 1037 04510 77 1",
    prefix: "เด็กหญิง", first: "กนกวรรณ", last: "ศรีสุวรรณ", nick: "อิ๋ม",
    classroom: "ม.2/2", grade: "ม.2", room: 2, no: 5, gender: "หญิง",
    advisor: "นายอนุชา เกษมสุข",
    photo: "", color: "#e6a417",
    guardian: { name: "นางลำดวน ศรีสุวรรณ", relation: "ยาย", occupation: "ค้าขาย", edu: "ป.6", phone: "082-119-4420", income: 6000 },
    family: { members: 3, type: "บ้านตนเอง", econ: "ปานกลาง", liveWith: "อยู่กับยาย (บิดามารดาทำงานต่างจังหวัด)", incomePerHead: 4000,
      relations: [{ who: "ยาย", lv: "สนิทสนม" }, { who: "มารดา", lv: "เฉย ๆ" }, { who: "บิดา", lv: "ห่างเหิน" }] },
    factors: ["dependent", "parents_split"],
    visit: { done: true, date: "14 พ.ค. 2568", by: "นายอนุชา เกษมสุข", photos: false, complete: false,
      summary: "อยู่กับยายซึ่งสูงอายุ บิดามารดาทำงานต่างจังหวัด ส่งเงินกลับสม่ำเสมอ — ยังไม่ได้อัปโหลดรูปภายในบ้าน" },
    gps: { x: 28, y: 70 },
    gallery: 1,
  }),
  S({
    id: "PK068-1102", code: "12771", citizen: "1 1037 01122 33 9",
    prefix: "เด็กชาย", first: "อภิสิทธิ์", last: "พงษ์ไพร", nick: "เจ",
    classroom: "ม.3/1", grade: "ม.3", room: 1, no: 14, gender: "ชาย",
    advisor: "นางมาลี ปานทอง",
    photo: "", color: "#ea7b17",
    guardian: { name: "นางสาวกาญจนา พงษ์ไพร", relation: "มารดา", occupation: "รับจ้างรายวัน", edu: "ม.3", phone: "090-882-3311", income: 5500 },
    family: { members: 6, type: "บ้านเช่า", econ: "ยากจน", liveWith: "อยู่กับมารดาและน้อง 3 คน", incomePerHead: 2400,
      relations: [{ who: "มารดา", lv: "สนิทสนม" }, { who: "บิดา", lv: "ขัดแย้ง" }] },
    factors: ["low_income", "family_violence", "rent_house", "often_absent"],
    visit: { done: true, date: "15 พ.ค. 2568", by: "นางมาลี ปานทอง", photos: true, complete: true,
      summary: "มีประวัติความขัดแย้งรุนแรงในครอบครัว มารดาเป็นเสาหลักเลี้ยงลูก 4 คน ควรประสานนักจิตวิทยาโรงเรียนและพิจารณาทุน" },
    gps: { x: 76, y: 58 },
    gallery: 2,
  }),
  S({
    id: "PK068-0904", code: "12550", citizen: "1 1037 00781 12 4",
    prefix: "เด็กหญิง", first: "สุชาดา", last: "บุญมาก", nick: "หมิว",
    classroom: "ม.1/1", grade: "ม.1", room: 1, no: 19, gender: "หญิง",
    advisor: "นายอนุชา เกษมสุข",
    photo: "", color: "#1ea672",
    guardian: { name: "นายสมบูรณ์ บุญมาก", relation: "บิดา", occupation: "พนักงานบริษัท", edu: "ปวส.", phone: "084-220-8890", income: 18000 },
    family: { members: 4, type: "บ้านตนเอง", econ: "ปานกลาง", liveWith: "อยู่พร้อมหน้าพ่อแม่", incomePerHead: 4500,
      relations: [{ who: "บิดา", lv: "สนิทสนม" }, { who: "มารดา", lv: "สนิทสนม" }] },
    factors: ["far_school"],
    visit: { done: false, date: null, by: null, photos: false, complete: false, summary: null },
    gps: { x: 18, y: 28 },
    gallery: 0,
  }),
  S({
    id: "PK068-0772", code: "12330", citizen: "1 1037 00210 55 7",
    prefix: "เด็กชาย", first: "วีรภัทร", last: "คงทน", nick: "ภัทร",
    classroom: "ม.1/1", grade: "ม.1", room: 1, no: 3, gender: "ชาย",
    advisor: "นายอนุชา เกษมสุข",
    photo: "", color: "#7c8aa0",
    guardian: { name: "นางอุไร คงทน", relation: "มารดา", occupation: "แม่บ้าน", edu: "ม.6", phone: "081-440-7723", income: 9000 },
    family: { members: 5, type: "บ้านตนเอง", econ: "ปานกลาง", liveWith: "อยู่พร้อมหน้าพ่อแม่", incomePerHead: 3600,
      relations: [{ who: "บิดา", lv: "เฉย ๆ" }, { who: "มารดา", lv: "สนิทสนม" }] },
    factors: ["chronic_ill"],
    visit: { done: false, date: null, by: null, photos: false, complete: false, summary: null },
    gps: { x: 44, y: 22 },
    gallery: 0,
  }),
  S({
    id: "PK068-2299", code: "13501", citizen: "1 1037 05512 88 3",
    prefix: "เด็กหญิง", first: "จิราพร", last: "มากมี", nick: "มุก",
    classroom: "ม.3/1", grade: "ม.3", room: 1, no: 28, gender: "หญิง",
    advisor: "นางมาลี ปานทอง",
    photo: "", color: "#e23b3b",
    guardian: { name: "—", relation: "ไม่มีผู้ปกครอง", occupation: "—", edu: "—", phone: "—", income: 0 },
    family: { members: 2, type: "อาศัยกับผู้อื่น", econ: "ยากจนพิเศษ", liveWith: "อยู่กับเพื่อนบ้าน (ไม่มีผู้ปกครอง)", incomePerHead: 900,
      relations: [{ who: "บิดา", lv: "ไม่มี" }, { who: "มารดา", lv: "ไม่มี" }] },
    factors: ["no_guardian", "poor_special", "sexual_risk", "often_absent", "parents_split"],
    visit: { done: true, date: "16 พ.ค. 2568", by: "นางมาลี ปานทอง", photos: true, complete: true,
      summary: "ไม่มีผู้ปกครอง อาศัยกับเพื่อนบ้าน รายได้ต่ำมาก พบพฤติกรรมเสี่ยง ต้องเปิดเคสเร่งด่วนและประสานหน่วยงานภายนอก (พมจ.)" },
    gps: { x: 84, y: 40 },
    gallery: 3,
  }),
];

/* ===== KPI ภาพรวม (อิงจากชุดข้อมูลข้างบน + จำนวนรวมทั้งโรงเรียน) ===== */
window.SCHOOL_STATS = (function () {
  const total = 612;          // นักเรียนทั้งหมด
  const visited = 548;        // เยี่ยมบ้านแล้ว
  const sample = window.STUDENTS;
  const cnt = (k) => sample.filter(s => s.level.key === k).length;
  return {
    total, visited, notVisited: total - visited,
    risk: 47,                 // กลุ่มเสี่ยง (เสี่ยง+เร่งด่วน)
    poor: 89,                 // ยากจน + ยากจนพิเศษ
    urgent: 12,               // เร่งด่วน
    pctVisited: Math.round((visited / total) * 100),
  };
})();

/* เปอร์เซ็นต์การเยี่ยมบ้านรายห้อง */
window.CLASS_PROGRESS = [
  { room: "ม.1/1", total: 38, visited: 31 },
  { room: "ม.1/2", total: 37, visited: 37 },
  { room: "ม.2/1", total: 40, visited: 38 },
  { room: "ม.2/2", total: 39, visited: 29 },
  { room: "ม.3/1", total: 36, visited: 36 },
  { room: "ม.3/2", total: 35, visited: 24 },
  { room: "ม.4/1", total: 33, visited: 33 },
  { room: "ม.5/1", total: 31, visited: 28 },
  { room: "ม.6/1", total: 30, visited: 30 },
];

/* ===== ชุดข้อมูลกราฟภาพรวมโรงเรียน ===== */
window.CHARTS = {
  house: [
    { label: "บ้านตนเอง", value: 372, color: "#2c7ab6" },
    { label: "บ้านเช่า", value: 128, color: "#4895d0" },
    { label: "อาศัยกับญาติ", value: 92, color: "#79b6e0" },
    { label: "อาศัยกับผู้อื่น", value: 20, color: "#aed3ee" },
  ],
  econ: [
    { label: "ยากจนพิเศษ", value: 34, color: "#e23b3b" },
    { label: "ยากจน", value: 55, color: "#ea7b17" },
    { label: "ปานกลาง", value: 388, color: "#e6a417" },
    { label: "ดี", value: 135, color: "#1ea672" },
  ],
  guardian: [
    { label: "พ่อแม่อยู่พร้อมหน้า", value: 401, color: "#2c7ab6" },
    { label: "พ่อแม่แยกทาง", value: 118, color: "#e6a417" },
    { label: "ผู้ปกครองเป็นญาติ", value: 78, color: "#ea7b17" },
    { label: "ไม่มีผู้ดูแล", value: 15, color: "#e23b3b" },
  ],
  risk: [
    { label: "ครอบครัวมีสารเสพติด", value: 14 },
    { label: "ครอบครัวมีความรุนแรง", value: 9 },
    { label: "นักเรียนติดเกม", value: 63 },
    { label: "พฤติกรรมเสี่ยงทางเพศ", value: 7 },
    { label: "ขาดผู้ดูแล", value: 15 },
  ],
};

/* ===== เคสช่วยเหลือ ===== */
window.CASES = [
  { id: "2568-001", studentId: "PK068-2299", title: "ไม่มีผู้ปกครอง + รายได้ต่ำมาก",
    type: "เร่งด่วน", severity: "urgent", status: "new",
    problems: ["ไม่มีผู้ปกครอง อาศัยกับเพื่อนบ้าน", "รายได้ครัวเรือนเฉลี่ย 900 บ./เดือน", "พบพฤติกรรมเสี่ยง", "ขาดเรียนบ่อย"],
    plan: ["เยี่ยมบ้านซ้ำ + ประเมินซ้ำ", "เสนอขอรับทุนปัจจัยพื้นฐาน", "ประสาน พมจ. / นักจิตวิทยา"],
    opened: "16 พ.ค. 2568", owner: "นางมาลี ปานทอง" },
  { id: "2568-002", studentId: "PK068-2015", title: "ขาดผู้ดูแล + ขาดเรียนบ่อย",
    type: "เด็กกลุ่มเสี่ยงใหม่", severity: "risk", status: "progress",
    problems: ["ผู้ปกครองแยกทาง", "อยู่กับลุงที่ออกไปทำไร่ทั้งวัน", "ขาดเรียนบ่อย"],
    plan: ["เยี่ยมบ้าน ✓", "มอบทุน ✓", "พบครูแนะแนว"],
    opened: "12 พ.ค. 2568", owner: "นางสาวพรรณี วงศ์สถิตย์" },
  { id: "2568-003", studentId: "PK068-1102", title: "ครอบครัวมีความรุนแรง",
    type: "พบความขัดแย้งในครอบครัว", severity: "risk", status: "progress",
    problems: ["ความขัดแย้งรุนแรงในครอบครัว", "มารดาเลี้ยงลูก 4 คนลำพัง"],
    plan: ["เยี่ยมบ้าน ✓", "ประสานนักจิตวิทยา", "พิจารณาทุน"],
    opened: "15 พ.ค. 2568", owner: "นางมาลี ปานทอง" },
  { id: "2568-000", studentId: "PK068-2014", title: "ติดตามด้านการเรียน + ทุนอาหาร",
    type: "ติดตามทั่วไป", severity: "watch", status: "done",
    problems: ["ใช้เวลาเล่นเกมมาก", "รายได้ครัวเรือนน้อย"],
    plan: ["เยี่ยมบ้าน ✓", "มอบทุนอาหารกลางวัน ✓", "ติดตามผลการเรียน ✓"],
    opened: "12 พ.ค. 2568", owner: "นางสาวพรรณี วงศ์สถิตย์" },
];

/* ===== การแจ้งเตือน ===== */
window.NOTIFS = [
  { id: 1, kind: "urgent", title: "พบเด็กกลุ่มเสี่ยงเร่งด่วนรายใหม่", body: "จิราพร มากมี (ม.3/1) — ไม่มีผู้ปกครอง คะแนนเสี่ยง 85", when: "10 นาทีที่แล้ว", unread: true },
  { id: 2, kind: "visit", title: "ยังไม่ได้เยี่ยมบ้าน 2 คน", body: "สุชาดา บุญมาก, วีรภัทร คงทน (ม.1/1) เกินกำหนด", when: "1 ชม.ที่แล้ว", unread: true },
  { id: 3, kind: "photo", title: "ยังไม่อัปโหลดรูปภายในบ้าน", body: "กนกวรรณ ศรีสุวรรณ (ม.2/2) ข้อมูลไม่ครบ", when: "3 ชม.ที่แล้ว", unread: true },
  { id: 4, kind: "poor", title: "พบครอบครัวยากจนพิเศษ", body: "ณัฐวุฒิ ทองสุข (ม.2/1) รายได้เฉลี่ย 1,350 บ./คน", when: "เมื่อวาน", unread: false },
  { id: 5, kind: "done", title: "การเยี่ยมบ้าน ม.3/1 เสร็จสมบูรณ์ 100%", body: "ครูมาลี ปานทอง บันทึกครบทุกคน", when: "2 วันก่อน", unread: false },
];

window.fullName = (s) => `${s.prefix}${s.first} ${s.last}`;
