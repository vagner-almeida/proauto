import { useState } from "react";
import { Modal, Input, Select, PrimaryBtn, GhostBtn, Badge } from "../components/UI";

export default function OrdensServico({ os, setOs, clientes }) {
  const [modal, setModal] = useState(false);
  const [filtro, setFiltro] = useState("Todas");
  const [form, setForm] = useState({ cliente: "", veiculo: "", servico: "", status: "Em andamento", valor: "" });

  const filtradas = filtro === "Todas" ? os : os.filter(o => o.status === filtro);

  const salvar = () => {
    if (!form.cliente || !form.servico) return;
    const nova = {
      id: `OS-${String(os.length + 1).padStart(3, "0")}`,
      ...form,
      valor: parseFloat(form.valor) || 0,
      data: new Date().toISOString().split("T")[0],
    };
    setOs([nova, ...os]);
    setForm({ cliente: "", veiculo: "", servico: "", status: "Em andamento", valor: "" });
    setModal(false);
  };

  const mudarStatus = (id, s) => setOs(os.map(o => o.id === id ? { ...o, status: s } : o));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Ordens de Serviço</h2>
          <p className="text-xs text-gray-500 mt-0.5">{os.length} ordens</p>
        </div>
        <PrimaryBtn onClick={() => setModal(true)}>+ Nova OS</PrimaryBtn>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Todas", "Em andamento", "Aguardando peça", "Concluída"].map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: filtro === f ? "linear-gradient(135deg,#c8102e,#a00d24)" : "rgba(255,255,255,0.05)",
              color: filtro === f ? "white" : "#888",
              boxShadow: filtro === f ? "0 2px 10px rgba(200,16,46,0.3)" : "none",
            }}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtradas.map(o => (
          <div key={o.id} className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black tracking-widest" style={{ color: "#c8102e" }}>{o.id}</span>
                  <Badge status={o.status} />
                </div>
                <div className="text-sm font-bold text-white">{o.cliente}</div>
                <div className="text-xs text-gray-500">{o.veiculo} · {o.data}</div>
              </div>
              <span className="text-lg font-black text-white">R$ {o.valor}</span>
            </div>
            <div className="text-xs text-gray-400 p-2.5 rounded-xl mb-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              🔧 {o.servico}
            </div>
            <div className="flex gap-1.5">
              {["Em andamento", "Aguardando peça", "Concluída"].map(s => (
                <button key={s} onClick={() => mudarStatus(o.id, s)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: o.status === s ? "linear-gradient(135deg,#c8102e,#a00d24)" : "rgba(255,255,255,0.05)",
                    color: o.status === s ? "white" : "#666",
                  }}>
                  {s === "Em andamento" ? "⚙️ And." : s === "Aguardando peça" ? "📦 Ag." : "✅ OK"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title="Nova OS" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-3">
            <Select label="Cliente *" value={form.cliente} onChange={e => {
              const c = clientes.find(c => c.nome === e.target.value);
              setForm({ ...form, cliente: e.target.value, veiculo: c?.veiculo || "" });
            }}>
              <option value="">Selecione o cliente</option>
              {clientes.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
            </Select>
            <Input label="Veículo"    value={form.veiculo} onChange={e => setForm({ ...form, veiculo: e.target.value })} placeholder="Auto preenchido" />
            <Input label="Serviço *"  value={form.servico} onChange={e => setForm({ ...form, servico: e.target.value })} placeholder="Ex: Troca de óleo e filtros" />
            <Input label="Valor (R$)" type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="0,00" />
            <div className="flex gap-2 mt-2">
              <GhostBtn onClick={() => setModal(false)}>Cancelar</GhostBtn>
              <PrimaryBtn onClick={salvar} full>Abrir OS</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
