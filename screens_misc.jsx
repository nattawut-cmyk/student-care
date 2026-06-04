/* ================= SIGNATURE PAD (shared) ================= */

function SignaturePad({ onChange, height = 150 }) {
  const ref = React.useRef(null);
  const drawing = React.useRef(false);
  const [empty, setEmpty] = React.useState(true);

  React.useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = cv.getBoundingClientRect();
    cv.width = rect.width * dpr; cv.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#16202b';
    const pos = (e) => {
      const r = cv.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };
    const start = (e) => { drawing.current = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); };
    const move = (e) => { if (!drawing.current) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); if (empty) { setEmpty(false); onChange && onChange(true); } e.preventDefault(); };
    const end = () => { drawing.current = false; };
    cv.addEventListener('pointerdown', start); cv.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    return () => { cv.removeEventListener('pointerdown', start); cv.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); };
  }, [empty]);

  const clear = () => {
    const cv = ref.current; const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height); setEmpty(true); onChange && onChange(false);
  };
  return (
    <div>
      <div style={{ position: 'relative', border: '1.5px dashed var(--line)', borderRadius: 12, background: 'var(--surface-2)', overflow: 'hidden' }}>
        <canvas ref={ref} style={{ width: '100%', height, display: 'block', touchAction: 'none', cursor: 'crosshair' }}></canvas>
        {empty && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--ink-3)', pointerEvents: 'none', fontSize: 13 }}>
          <div style={{ textAlign: 'center' }}><Icon name="pen" size={22} /><div>เซ็นชื่อในกรอบนี้</div></div>
        </div>}
      </div>
      <button className="btn btn--ghost btn--sm mt8" onClick={clear}><Icon name="refresh" size={14} />ล้างลายเซ็น</button>
    </div>
  );
}

Object.assign(window, { SignaturePad });
