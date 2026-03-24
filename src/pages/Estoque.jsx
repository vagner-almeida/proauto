import { useState } from "react";
import { Modal, Input, PrimaryBtn, GhostBtn } from "../components/UI";

export default function Estoque({ estoque, setEstoque }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ nome: "", codigo: "", quantidade: "", minimo: "", preco: "" });

  const salvar = () => {
    if (!form.nome || !form.codigo) return;
    setEstoque([...estoque, {
      id: estoque.length + 1, ...form,
      quantidade: parseInt(form.quantidade) || 0,
      minimo:     parseInt(form.minimo)     || 0,
      preco:      parseFloat(form.preco)    || 0,
    }]);
    setForm({ nome: "", codigo: "", quantidade: "", minimo: "", preco: "" });
    setModal(false);
  };

  const ajustar = (id, delta) =>
    setEstoque(estoque.map(p => p.id === id ? { ...p, quantidade: Math.max(0, p.quantidade + delta) } : p));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Estoque</h2>
          <p className="text-xs text-gray-500 mt-0.5">{estoque.length} itens</p>
        </div>
        <PrimaryBtn onClick={() => setModal(true)}>+ Peça</PrimaryBtn>
      </div>

      <div className="flex flex-col gap-3">
        {estoque.map(p => {
          const critico = p.quantidade <= p.minimo;
          const pct     = Math.min((p.quantidade / Math.max(p.minimo * 3, 1)) * 100, 100);
          return (
            <div key={p.id} className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${critico ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}` }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-bold text-white">{p.nome}</div>
                  <div className="text-xs font-mono text-gray-500">{p.codigo}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ color: critico ? "#ef4444" : "white" }}>{p.quantidade}</div>
                  <div className="text-xs text-gray-500">un.</div>
                </div>
              </div>

              {/* barra */}
              <div className="rounded-full h-1.5 mb-3 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: critico ? "#ef4444" : "linear-gradient(90deg,#c8102e,#ff4d6d)" }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {critico && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>⚠️ Baixo</span>
                  )}
                  <span className="text-xs text-gray-500">Mín: {p.minimo} · R$ {p.preco.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => ajustar(p.id, -1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-gray-300 hover:text-white"
                    style={{ background: "rgba(255,255,255,0.07)" }}>−</button>
                  <button onClick={() => ajustar(p.id, +1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#c8102e,#a00d24)" }}>+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title="Nova Peça" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-3">
            <Input label="Nome *"   value={form.nome}   onChange={e => setForm({ ...form, nome: e.target.value })}   placeholder="Ex: Filtro de óleo" />
            <Input label="Código *" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="Ex: FO-001" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Quantidade" type="number" value={form.quantidade} onChange={e => setForm({ ...form, quantidade: e.target.value })} placeholder="0" />
              <Input label="Mínimo"     type="number" value={form.minimo}     onChange={e => setForm({ ...form, minimo: e.target.value })}     placeholder="0" />
            </div>
            <Input label="Preço (R$)" type="number" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} placeholder="0,00" />
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
