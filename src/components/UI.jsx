export const ACCENT = "#1a1a1a";

export const STATUS = {
  "Concluída":       { bg: "#e8faf3", text: "#15803d", border: "#bbf7d0", dot: "#16a34a" },
  "Em andamento":    { bg: "#fefce8", text: "#92400e", border: "#fde68a", dot: "#d97706" },
  "Aguardando peça": { bg: "#fef2f2", text: "#991b1b", border: "#fecaca", dot: "#dc2626" },
};

export function Badge({ status }) {
  const s = STATUS[status] || { bg: "#f3f4f6", text: "#6b7280", border: "#e5e7eb", dot: "#9ca3af" };
  return (
    <span style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full" />
      {status}
    </span>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>{children}</div>;
}

export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <input {...props} className="w-full rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none border border-gray-200 focus:border-gray-800 focus:ring-2 focus:ring-gray-100 transition-all bg-white" />
    </div>
  );
}

export function Sel({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <select {...props} className="w-full rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none border border-gray-200 bg-white">{children}</select>
    </div>
  );
}

export function Btn({ onClick, children, variant = "primary", full, type = "button" }) {
  const base = `${full ? "w-full" : ""} flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95`;
  return variant === "ghost"
    ? <button type={type} onClick={onClick} className={`${base} text-gray-500 bg-gray-100 hover:bg-gray-200`}>{children}</button>
    : <button type={type} onClick={onClick} className={`${base} text-white hover:opacity-80 shadow-sm`} style={{ background: ACCENT }}>{children}</button>;
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all text-xl">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
