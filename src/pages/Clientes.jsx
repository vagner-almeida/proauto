import { useState } from "react";
import { Modal, Input, PrimaryBtn, GhostBtn } from "../components/UI";

export default function Clientes({ clientes, setClientes }) {
  const [modal, setModal] = useState(false);
  const [busca, setBusca] = useState("");
  const [form, setForm]   = useState({ nome: "", telefone: "", email: "", veiculo: "", placa: "" });

  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.placa.toLowerCase().includes(busca.toLowerCase())
  );

  const salvar = () => {
    if (!form.nome || !form.telefone) return;
    setClientes([...clientes, { id: clientes.length + 1, ...form }]);
    setForm({ nome: "", telefone: "", email: "", veiculo: "", placa: "" });
    setModal(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Clientes</h2>
          <p className="text-xs text-gray-500 mt-0.5">{clientes.length} cadastrados</p>
        </div>
        <PrimaryBtn onClick={() => setModal(true)}>+ Novo</PrimaryBtn>
      </div>

      <input value={busca} onChange={e => setBusca(e.target.value)}
        placeholder="🔍  Buscar por nome ou placa..."
        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />

      <div className="flex flex-col gap-3">
        {filtrados.map(c => (
          <div key={c.id} className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-black text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#c8102e,#7a0a1c)" }}>
              {c.nome[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">{c.nome}</div>
              <div className="text-xs text-gray-500">{c.telefone}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-300">{c.veiculo}</div>
              <div className="text-xs mt-0.5 px-2 py-0.5 rounded-md inline-block font-mono"
                style={{ background: "rgba(255,255,255,0.06)", color: "#aaa" }}>{c.placa}</div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title="Novo Cliente" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-3">
            <Input label="Nome *"     value={form.nome}     onChange={e => setForm({ ...form, nome: e.target.value })}     placeholder="Nome completo" />
            <Input label="Telefone *" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="(11) 99999-9999" />
            <Input label="E-mail"     value={form.email}    onChange={e => setForm({ ...form, email: e.target.value })}    placeholder="email@exemplo.com" />
            <Input label="Veículo"    value={form.veiculo}  onChange={e => setForm({ ...form, veiculo: e.target.value })}  placeholder="Marca Modelo Ano" />
            <Input label="Placa"      value={form.placa}    onChange={e => setForm({ ...form, placa: e.target.value })}    placeholder="ABC-1D23" />
            <div className="flex gap-2 mt-2">
              <GhostBtn onClick={() => setModal(false)}>Cancelar</GhostBtn>
              <PrimaryBtn onClick={salvar} full>Salvar Cliente</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
