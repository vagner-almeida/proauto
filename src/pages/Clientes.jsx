import { useState } from "react";
import { Modal, Input, Btn, Card, ACCENT } from "../components/UI";

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
    setClientes([...clientes, { id: Date.now(), ...form }]);
    setForm({ nome: "", telefone: "", email: "", veiculo: "", placa: "" });
    setModal(false);
  };

  const excluir = (id) => { if (window.confirm("Excluir este cliente?")) setClientes(clientes.filter(c => c.id !== id)); };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-black text-gray-800">Clientes</h2><p className="text-xs text-gray-400 mt-0.5">{clientes.length} cadastrados</p></div>
        <Btn onClick={() => setModal(true)}>+ Novo cliente</Btn>
      </div>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome ou placa..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-gray-700 border border-gray-200 bg-white outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-100" />
      </div>
      <div className="flex flex-col gap-3">
        {filtrados.map(c => (
          <Card key={c.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{ background: ACCENT }}>{c.nome[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800">{c.nome}</p>
              <p className="text-xs text-gray-400">{c.telefone} · {c.email}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-semibold text-gray-600">{c.veiculo}</p>
              <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md mt-0.5 inline-block">{c.placa}</span>
            </div>
            <button onClick={() => excluir(c.id)} className="text-gray-300 hover:text-red-400 transition-all ml-2 text-lg">×</button>
          </Card>
        ))}
      </div>
      {modal && (
        <Modal title="Novo Cliente" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-3">
            <Input label="Nome *"     value={form.nome}     onChange={e => setForm({...form,nome:e.target.value})}     placeholder="Nome completo" />
            <Input label="Telefone *" value={form.telefone} onChange={e => setForm({...form,telefone:e.target.value})} placeholder="(00) 99999-9999" />
            <Input label="E-mail"     value={form.email}    onChange={e => setForm({...form,email:e.target.value})}    placeholder="email@exemplo.com" />
            <Input label="Veículo"    value={form.veiculo}  onChange={e => setForm({...form,veiculo:e.target.value})}  placeholder="Marca Modelo Ano" />
            <Input label="Placa"      value={form.placa}    onChange={e => setForm({...form,placa:e.target.value})}    placeholder="ABC-1D23" />
            <div className="flex gap-2 pt-2"><Btn onClick={() => setModal(false)} variant="ghost">Cancelar</Btn><Btn onClick={salvar} full>Salvar</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
