import { Badge } from "../components/UI";

export default function Dashboard({ clientes, os, estoque, financeiro }) {
  const receitas     = financeiro.filter(f => f.tipo === "Receita").reduce((a, b) => a + b.valor, 0);
  const despesas     = financeiro.filter(f => f.tipo === "Despesa").reduce((a, b) => a + b.valor, 0);
  const baixoEstoque = estoque.filter(p => p.quantidade <= p.minimo).length;
  const osAndamento  = os.filter(o => o.status === "Em andamento").length;
  const osConcluidas = os.filter(o => o.status === "Concluída").length;

  const stats = [
    { icon: "👥", label: "Clientes",       value: clientes.length, accent: "#3b82f6" },
    { icon: "🔧", label: "Em andamento",   value: osAndamento,     accent: "#eab308" },
    { icon: "✅", label: "OS concluídas",  value: osConcluidas,    accent: "#10b981" },
    { icon: "📦", label: "Alerta estoque", value: baixoEstoque,    accent: baixoEstoque > 0 ? "#ef4444" : "#10b981" },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Hero */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#c8102e,#7a0a1c)", boxShadow: "0 8px 32px rgba(200,16,46,0.3)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.3) 10px,rgba(255,255,255,0.3) 11px)" }} />
        <div className="relative">
          <div className="text-xs font-bold text-red-200 uppercase tracking-widest mb-1">Painel de Controle</div>
          <div className="text-2xl font-black text-white">Bem-vindo! 👋</div>
          <div className="text-sm text-red-200 mt-1">Pro Auto — Manutenção Automotiva</div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-red-100">Sistema operacional</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-2xl font-black" style={{ color: s.accent }}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Financeiro resumo */}
      <div className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Resumo Financeiro</div>
        {[
          { label: "Receitas", val: `+ R$ ${receitas.toFixed(2)}`, color: "#10b981" },
          { label: "Despesas", val: `- R$ ${despesas.toFixed(2)}`, color: "#ef4444" },
        ].map(r => (
          <div key={r.label} className="flex justify-between mb-3">
            <span className="text-sm text-gray-400">{r.label}</span>
            <span className="text-sm font-bold" style={{ color: r.color }}>{r.val}</span>
          </div>
        ))}
        <div className="h-px my-3" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-white">Saldo</span>
          <span className="text-base font-black" style={{ color: receitas - despesas >= 0 ? "#c8102e" : "#ef4444" }}>
            R$ {(receitas - despesas).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Últimas OS */}
      <div className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Últimas OS</div>
        <div className="flex flex-col gap-3">
          {os.slice(0, 3).map(o => (
            <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div>
                <div className="text-sm font-semibold text-white">{o.cliente}</div>
                <div className="text-xs text-gray-500">{o.servico}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={o.status} />
                <span className="text-sm font-bold text-white">R$ {o.valor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerta estoque */}
      {baixoEstoque > 0 && (
        <div className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <span className="text-xl">⚠️</span>
          <div>
            <div className="text-sm font-bold text-rose-400">Estoque crítico</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {baixoEstoque} {baixoEstoque === 1 ? "item abaixo" : "itens abaixo"} do mínimo. Verifique o módulo Estoque.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
