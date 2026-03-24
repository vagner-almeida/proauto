import { useState } from "react";
import { Modal, Input, Select, PrimaryBtn, GhostBtn } from "../components/UI";

export default function Financeiro({ financeiro, setFinanceiro }) {
  const [modal, setModal]   = useState(false);
  const [filtro, setFiltro] = useState("Todos");
  const [form, setForm]     = useState({ descricao: "", tipo: "Receita", valor: "", data: "" });

  const receitas  = financeiro.filter(f => f.tipo === "Receita").reduce((a, b) => a + b.valor, 0);
  const despesas  = financeiro.filter(f => f.tipo === "Despesa").reduce((a, b) => a + b.valor, 0);
  const saldo     = receitas - despesas;
  const filtrados = filtro === "Todos" ? financeiro : financeiro.filter(f => f.tipo === filtro);

  const salvar = () => {
    if (!form.descricao || !form.valor) return;
    setFinanceiro([{
      id: financeiro.length + 1, ...form,
      valor: parseFloat(form.valor),
      data:  form.data || new Date().toISOString().split("T")[0],
    }, ...financeiro]);
    setForm({ descricao: "", tipo: "Receita", valor: "", data: "" });
    setModal(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Financeiro</h2>
          <p className="text-xs text-gray-500 mt-0.5">Controle de caixa</p>
        </div>
        <PrimaryBtn onClick={() => setModal(true)}>+ Lançamento</PrimaryBtn>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Receitas", val: receitas, color: "#10b981", sign: "+"  },
          { label: "Despesas", val: despesas, color: "#ef4444", sign: "-"  },
          { label: "Saldo",    val: Math.abs(saldo), color: saldo >= 0 ? "#c8102e" : "#ef4444", sign: saldo < 0 ? "-" : "" },
        ].map(c => (
          <div key={c.label} className="rounded-2xl p-3 text-center"
            style={{ background: `${c.color}12`, border: `1px solid ${c.color}30` }}>
            <div className="text-xs text-gray-400">{c.label}</div>
            <div className="text-sm font-black mt-1" style={{ color: c.color }}>
              {c.sign}R${c.val.toFixed(0)}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {["Todos", "Receita", "Despesa"].map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: filtro === f ? "linear-gradient(135deg,#c8102e,#a00d24)" : "rgba(255,255,255,0.05)",
              color: filtro === f ? "white" : "#666",
            }}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtrados.map(f => (
          <div key={f.id} className="flex items-center gap-3 rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: f.tipo === "Receita" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: f.tipo === "Receita" ? "#10b981" : "#ef4444" }}>
              {f.tipo === "Receita" ? "↑" : "↓"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{f.descricao}</div>
              <div className="text-xs text-gray-500">{f.data}</div>
            </div>
            <span className="text-sm font-black flex-shrink-0"
              style={{ color: f.tipo === "Receita" ? "#10b981" : "#ef4444" }}>
              {f.tipo === "Receita" ? "+" : "-"}R$ {f.valor.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title="Novo Lançamento" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-3">
            <Input label="Descrição *" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Ex: Pagamento OS-004" />
            <Select label="Tipo" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
              <option>Receita</option>
              <option>Despesa</option>
            </Select>
            <Input label="Valor (R$) *" type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="0,00" />
            <Input label="Data" type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
            <div className="flex gap-2 mt-2">
              <GhostBtn onClick={() => setModal(false)}>Cancelar</GhostBtn>
              <PrimaryBtn onClick={salvar} full>Salvar</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
