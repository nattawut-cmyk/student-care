/* ================= CASE MANAGEMENT ================= */

function Cases({ go }) {
  const [open, setOpen] = React.useState(null);
  const cols = [
    { k: 'new', label: 'เปิดใหม่', icon: 'sparkle', tint: 'var(--r-urgent)' },
    { k: 'progress', label: 'กำลังติดตาม', icon: 'refresh', tint: 'var(--r-watch)' },
    { k: 'done', label: 'เสร็จสิ้น', icon: 'check-circle', tint: 'var(--r-ok)' },
  ];
  const sevBadge = { urgent: 'urgent', risk: 'risk', watch: 'watch' };
  return (
    <div className="view stack">
      <div className="card card--pad row wrap" style={{ justifyContent: 'space-between', gap: 12 }}>
        <div className="row" style={{ gap: 14 }}>
          {cols.map(c => {
            const n = window.CASES.filter(x => x.status === c.k).length;
            return <div key={c.k} className="row" style={{ gap: 7, fontSize: 13.5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 99, background: c.tint }}></span>
              <span className="muted">{c.label}</span><b>{n}</b>
            </div>;
          })}
        </div>
        <button className="btn btn--primary btn--sm right"><Icon name="plus" size={16} />สร้างเคสใหม่</button>
      </div>

      <div className="case-cols">
        {cols.map(c => {
          const items = window.CASES.filter(x => x.status === c.k);
          return (
            <div className="case-col" key={c.k}>
              <h4><Icon name={c.icon} size={16} style={{ color: c.tint }} />{c.label}<span className="count">{items.length}</span></h4>
              {items.map(cs => {
                const s = window.STUDENTS.find(x => x.id === cs.studentId);
                return (
                  <div className="case-card" key={cs.id} onClick={() => setOpen(cs)}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <span className="cid">Case #{cs.id}</span>
                      <span className={`badge badge--${sevBadge[cs.severity]}`} style={{ padding: '2px 9px' }}>{cs.type}</span>
                    </div>
                    <div className="fw5 mt8" style={{ fontSize: 14.5 }}>{cs.title}</div>
                    <div className="row mt12" style={{ gap: 9 }}>
                      <Avatar s={s} size={32} radius={9} />
                      <div style={{ fontSize: 12.5 }}>
                        <div className="fw5">{window.fullName(s)}</div>
                        <div className="muted">{s.classroom}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && <div style={{ textAlign: 'center', color: 'var(--ink-3)', fontSize: 13, padding: 16 }}>—</div>}
            </div>
          );
        })}
      </div>

      {open && <CaseModal cs={open} onClose={() => setOpen(null)} go={go} />}
    </div>
  );
}

function CaseModal({ cs, onClose, go }) {
  const s = window.STUDENTS.find(x => x.id === cs.studentId);
  const sevBadge = { urgent: 'urgent', risk: 'risk', watch: 'watch' };
  const statusLabel = { new: 'เปิดใหม่', progress: 'กำลังติดตาม', done: 'เสร็จสิ้น' };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,58,85,.45)', zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(2px)' }}>
      <div className="card view" onClick={e => e.stopPropagation()}
        style={{ width: 'min(560px,100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
        <div className="card__head" style={{ position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
          <div>
            <div className="cid" style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'ui-monospace,monospace' }}>Case #{cs.id}</div>
            <h3>{cs.title}</h3>
          </div>
          <button className="right" onClick={onClose} style={{ color: 'var(--ink-3)' }}><Icon name="x" size={20} /></button>
        </div>
        <div className="card--pad stack">
          <div className="row wrap" style={{ gap: 8 }}>
            <span className={`badge badge--${sevBadge[cs.severity]}`}>{cs.type}</span>
            <span className="badge badge--gray">สถานะ: {statusLabel[cs.status]}</span>
            <span className="badge badge--gray"><Icon name="clock" size={13} />เปิด {cs.opened}</span>
          </div>

          <div className="row" style={{ gap: 12, padding: 12, background: 'var(--surface-2)', borderRadius: 12, cursor: 'pointer' }}
            onClick={() => { onClose(); go('profile', s.id); }}>
            <Avatar s={s} size={48} radius={13} />
            <div style={{ flex: 1 }}>
              <div className="fw5">{window.fullName(s)}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{s.classroom} · รหัส {s.code}</div>
            </div>
            <RiskBadge level={s.level} withScore score={s.score} />
          </div>

          <div>
            <div className="section-title">สภาพปัญหา</div>
            <div className="stack" style={{ gap: 7 }}>
              {cs.problems.map((p, i) => (
                <div key={i} className="row" style={{ gap: 9, fontSize: 14 }}>
                  <Icon name="warn" size={16} style={{ color: 'var(--r-risk)', flexShrink: 0 }} />{p}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-title">แผนการช่วยเหลือ</div>
            <div className="stack" style={{ gap: 7 }}>
              {cs.plan.map((p, i) => {
                const done = p.includes('✓');
                return (
                  <div key={i} className="row" style={{ gap: 9, fontSize: 14 }}>
                    <Icon name={done ? 'check-circle' : 'clock'} size={16}
                      style={{ color: done ? 'var(--r-ok)' : 'var(--ink-3)', flexShrink: 0 }} />
                    <span style={{ color: done ? 'var(--ink)' : 'var(--ink-2)' }}>{p.replace(' ✓', '')}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="row" style={{ gap: 9, fontSize: 13, color: 'var(--ink-3)' }}>
            <Icon name="user" size={15} />ผู้รับผิดชอบ: {cs.owner}
          </div>

          <div className="row" style={{ gap: 9, marginTop: 4 }}>
            <button className="btn btn--primary btn--sm" style={{ flex: 1 }}><Icon name="refresh" size={15} />อัปเดตสถานะ</button>
            <button className="btn btn--ghost btn--sm"><Icon name="bell" size={15} />แจ้งผู้บริหาร</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= NOTIFICATIONS ================= */
function Notifications() {
  const tints = {
    urgent: ['var(--r-urgent-bg)', 'var(--r-urgent)', 'warn'],
    visit: ['var(--r-watch-bg)', 'var(--r-watch)', 'home'],
    photo: ['var(--brand-50)', 'var(--brand-600)', 'camera'],
    poor: ['var(--gold-soft)', '#a87b06', 'coins'],
    done: ['var(--r-ok-bg)', 'var(--r-ok)', 'check-circle'],
  };
  return (
    <div className="view">
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card__head">
          <h3>การแจ้งเตือน</h3>
          <span className="sub">3 รายการใหม่</span>
          <button className="btn btn--soft btn--sm right">ทำเครื่องหมายว่าอ่านแล้ว</button>
        </div>
        {window.NOTIFS.map(n => {
          const t = tints[n.kind];
          return (
            <div key={n.id} className={`notif ${n.unread ? 'unread' : ''}`}>
              <div className="ni" style={{ background: t[0], color: t[1] }}><Icon name={t[2]} size={18} /></div>
              <div style={{ flex: 1 }}>
                <b>{n.title}</b>
                <p>{n.body}</p>
                <div className="when">{n.when}</div>
              </div>
              {n.unread && <span style={{ width: 9, height: 9, borderRadius: 99, background: 'var(--brand-500)', flexShrink: 0, marginTop: 6 }}></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { Cases, Notifications });
