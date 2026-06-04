/* ================= PHOTO STORE (localStorage) ================= */
/* รูปนักเรียน + รูปบ้าน เก็บเป็น data URL ใน localStorage ให้คงอยู่หลังรีเฟรช */

window.PhotoStore = {
  _key: (id) => `pk_photos_${id}`,
  get(id) {
    try { return JSON.parse(localStorage.getItem(this._key(id)) || '{}'); }
    catch (e) { return {}; }
  },
  set(id, slot, dataUrl) {
    const cur = this.get(id);
    if (dataUrl === null) delete cur[slot]; else cur[slot] = dataUrl;
    try { localStorage.setItem(this._key(id), JSON.stringify(cur)); } catch (e) {}
    return cur;
  },
  avatar(id) { return this.get(id).avatar || null; },
};

/* ---- รับไฟล์รูป -> ย่อขนาด -> data URL (กัน localStorage เต็ม) ---- */
window.fileToDataUrl = function (file, maxDim = 900, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width: w, height: h } = img;
        if (w > maxDim || h > maxDim) {
          const r = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * r); h = Math.round(h * r);
        }
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(cv.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/* ================= UPLOAD COMPONENTS ================= */

/* ปุ่มอัปโหลดรูปนักเรียน (avatar) แบบกดที่รูปได้เลย */
function AvatarUpload({ s, size = 112, radius = 24, editable = true, onChange }) {
  const [src, setSrc] = React.useState(window.PhotoStore.avatar(s.id));
  const inputRef = React.useRef(null);
  const pick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await window.fileToDataUrl(file, 600, 0.82);
    window.PhotoStore.set(s.id, 'avatar', url);
    setSrc(url);
    onChange && onChange(url);
  };
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {src
        ? <img src={src} alt="" style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover' }} />
        : <Avatar s={s} size={size} radius={radius} />}
      {editable && (
        <>
          <button onClick={() => inputRef.current.click()}
            style={{ position: 'absolute', right: -4, bottom: -4, width: 36, height: 36, borderRadius: '50%',
              background: 'var(--brand-500)', color: '#fff', display: 'grid', placeItems: 'center',
              border: '3px solid var(--surface)', boxShadow: 'var(--shadow)' }} title="อัปโหลดรูปนักเรียน">
            <Icon name="camera" size={16} />
          </button>
          <input ref={inputRef} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
        </>
      )}
    </div>
  );
}

/* ช่องอัปโหลดรูป (gallery / รูปบ้าน) */
function UploadSlot({ studentId, slot, caption, editable = true, onChange }) {
  const [src, setSrc] = React.useState(window.PhotoStore.get(studentId)[slot] || null);
  const inputRef = React.useRef(null);
  const pick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await window.fileToDataUrl(file);
    window.PhotoStore.set(studentId, slot, url);
    setSrc(url);
    onChange && onChange(url);
  };
  const remove = (e) => {
    e.stopPropagation();
    window.PhotoStore.set(studentId, slot, null);
    setSrc(null);
    onChange && onChange(null);
  };
  return (
    <div className="photo-slot" style={{ cursor: editable ? 'pointer' : 'default' }}
      onClick={() => editable && inputRef.current.click()}>
      {src
        ? <img src={src} alt={caption} />
        : <><Icon name="camera" size={26} /><span style={{ fontSize: 12 }}>{editable ? 'แตะเพื่ออัปโหลด' : 'ยังไม่มีรูป'}</span></>}
      <span className="cap">{caption}</span>
      {src && editable && (
        <button onClick={remove} style={{ position: 'absolute', right: 8, top: 8, width: 26, height: 26, borderRadius: '50%',
          background: 'rgba(20,58,85,.72)', color: '#fff', display: 'grid', placeItems: 'center' }}><Icon name="x" size={14} /></button>
      )}
      {editable && <input ref={inputRef} type="file" accept="image/*" capture="environment" hidden onChange={pick} />}
    </div>
  );
}

Object.assign(window, { AvatarUpload, UploadSlot });
