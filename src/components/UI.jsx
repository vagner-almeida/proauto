// ── Botão principal vermelho
export function PrimaryBtn({ onClick, children, full }) {
  return (
    <button onClick={onClick}
      className={`${full ? "w-full" : ""} flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95`}
      style={{ background: "linear-gradient(135deg,#c8102e,#a00d24)", boxShadow: "0 4px 20px rgba(200,16,46,0.3)" }}>
      {children}
    </button>
  );
}

// ── Botão secundário
export function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all"
      style={{ background: "rgba(255,255,255,0.05)" }}>
      {children}
    </button>
  );
}

// ── Input
export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>}
      <input {...props}
        className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }} />
    </div>
  );
}

// ── Select
export function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>}
      <select {...props}
        className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
        style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.09)" }}>
        {children}
      </select>
    </div>
  );
}

// ── Modal
export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-2xl p-6 w-full max-w-lg mx-4"
        style={{ background: "#161a22", border: "1px solid rgba(255,255,255,0.09)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.07)" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Badge de status
const statusColors = {
  "Concluída":       { bg: "rgba(16,185,129,0.12)",  text: "#10b981", dot: "#10b981", border: "rgba(16,185,129,0.25)" },
  "Em andamento":    { bg: "rgba(234,179,8,0.12)",   text: "#eab308", dot: "#eab308", border: "rgba(234,179,8,0.25)"  },
  "Aguardando peça": { bg: "rgba(239,68,68,0.12)",   text: "#ef4444", dot: "#ef4444", border: "rgba(239,68,68,0.25)"  },
};

export function Badge({ status }) {
  const c = statusColors[status] || { bg: "rgba(100,100,100,0.15)", text: "#aaa", dot: "#aaa", border: "rgba(100,100,100,0.2)" };
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold">
      <span style={{ background: c.dot }} className="w-1.5 h-1.5 rounded-full inline-block"></span>
      {status}
    </span>
  );
}
