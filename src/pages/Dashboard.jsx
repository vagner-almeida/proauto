import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Badge, Card, ACCENT } from "../components/UI";

export default function Dashboard({ clientes, os, estoque, financeiro }) {
  const receitas     = financeiro.filter(f => f.tipo === "Receita").reduce((a, b) => a + b.valor, 0);
  const despesas     = financeiro.filter(f => f.tipo === "Despesa").reduce((a, b) => a + b.valor, 0);
  const baixoEstoque = estoque.filter(p => p.quantidade <= p.minimo).length;
  const osAndamento  = os.filter(o => o.status === "Em andamento").length;
  const osConcluidas = os.filter(o => o.status === "Concluída").length;

  // Agrupa financeiro por mês para o gráfico
  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const dadosGrafico = meses.map((mes, i) => {
    const rec = financeiro
      .filter(f => f.tipo === "Receita" && new Date(f.data).getMonth() === i)
      .reduce((a, b) => a + b.valor, 0);
    const desp = financeiro
      .filter(f => f.tipo === "Despesa" && new Date(f.data).getMonth() === i)
      .reduce((a, b) => a + b.valor, 0);
    return { mes, Receitas: rec, Despesas: desp };
  }).filter(d => d.Receitas > 0 || d.Despesas > 0);

  // Se não há dados mensais suficientes, usa dados simulados para demo
  const chartData = dadosGrafico.length > 0 ? dadosGrafico : [
    { mes: "Jan", Receitas: 1200, Despesas: 800 },
    { mes: "Fev", Receitas: 1800, Despesas: 1200 },
    { mes: "Mar", Receitas: receitas || 1130, Despesas: despesas || 2420 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: "👥", label: "Clientes",      value: clientes.length, color: ACCENT,    bg: "#f9fafb" },
          { icon: "🔧", label: "Em andamento",  value: osAndamento,     color: "#d97706", bg: "#fffbeb" },
          { icon: "✅", label: "OS concluídas", value: osConcluidas,    color: "#15803d", bg: "#f0fdf4" },
          { icon: "📦", label: "Estoque baixo", value: baixoEstoque,    color: baixoEstoque > 0 ? "#dc2626" : "#15803d", bg: baixoEstoque > 0 ? "#fef2f2" : "#f0fdf4" },
        ].map(m => (
          <Card key={m.label} className="p-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: m.bg }}>{m.icon}</div>
            <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">{m.label}</div>
          </Card>
        ))}
      </div>

      {/* Gráfico de faturamento */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-1">Faturamento Mensal</h3>
        <p className="text-xs text-gray-400 mb-4">Receitas × Despesas por mês</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={18} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v}`} />
            <Tooltip
              formatter={(value) => [`R$ ${value.toFixed(2)}`, undefined]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Receitas" fill="#16a34a" radius={[6,6,0,0]} />
            <Bar dataKey="Despesas" fill="#1a1a1a" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Resumo financeiro */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Resumo Financeiro</h3>
        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">Receitas</span>
          <span className="text-sm font-bold text-green-600">+ R$ {receitas.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">Despesas</span>
          <span className="text-sm font-bold text-red-500">− R$ {despesas.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-3">
          <span className="text-sm font-bold text-gray-700">Saldo</span>
          <span className="text-base font-black" style={{ color: receitas - despesas >= 0 ? "#15803d" : "#dc2626" }}>
            R$ {(receitas - despesas).toFixed(2)}
          </span>
        </div>
      </Card>

      {/* Últimas OS */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Últimas OS</h3>
        <div className="flex flex-col gap-3">
          {os.slice(0, 3).map(o => (
            <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-800">{o.cliente}</p>
                <p className="text-xs text-gray-400">{o.servico}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={o.status} />
                <span className="text-sm font-bold text-gray-700">R$ {o.valor}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {baixoEstoque > 0 && (
        <div className="rounded-2xl p-4 flex gap-3 items-start bg-red-50 border border-red-100">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-sm font-bold text-red-700">Atenção: estoque crítico</p>
            <p className="text-xs text-red-500 mt-0.5">{baixoEstoque} {baixoEstoque === 1 ? "item abaixo" : "itens abaixo"} do mínimo.</p>
          </div>
        </div>
      )}
    </div>
  );
}
