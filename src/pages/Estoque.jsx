import { useState } from "react";
import { Modal, Input, Btn, Card, ACCENT } from "../components/UI";

export default function Estoque({ estoque, setEstoque }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ nome:"",codigo:"",quantidade:"",minimo:"",preco:"" });

  const salvar = () => {
    if (!form.nome) return;
    setEstoque([...estoque,{id:Date.now(),...form,quantidade:+form.quantidade||0,minimo:+form.minimo||0,preco:+form.preco||0}]);
    setForm({nome:"",codigo:"",quantidade:"",minimo:"",preco:""}); setModal(false);
  };
  const ajustar  = (id,d) => setEstoque(estoque.map(p=>p.id===id?{...p,quantidade:Math.max(0,p.quantidade+d)}:p));
  const excluir  = (id) => { if(window.confirm("Excluir esta peça?")) setEstoque(estoque.filter(p=>p.id!==id)); };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-black text-gray-800">Estoque</h2><p className="text-xs text-gray-400 mt-0.5">{estoque.length} itens</p></div>
        <Btn onClick={() => setModal(true)}>+ Nova peça</Btn>
      </div>
      <div className="flex flex-col gap-3">
        {estoque.map(p => {
          const critico = p.quantidade <= p.minimo;
          const pct = Math.min((p.quantidade/Math.max(p.minimo*3,1))*100,100);
          return (
            <Card key={p.id} className={`p-4 hover:shadow-md transition-shadow ${critico?"border-red-200":""}`}>
              <div className="flex items-start justify-between mb-3">
                <div><p className="text-sm font-bold text-gray-800">{p.nome}</p><p className="text-xs font-mono text-gray-400">{p.codigo}</p></div>
                <div className="flex items-start gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-black" style={{ color: critico?"#dc2626":ACCENT }}>{p.quantidade}</p>
                    <p className="text-xs text-gray-400">unidades</p>
                  </div>
                  <button onClick={() => excluir(p.id)} className="text-gray-300 hover:text-red-400 transition-all text-lg mt-1">×</button>
                </div>
              </div>
              <div className="h-2 rounded-full bg-gray-100 mb-3 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background: critico?"#ef4444":ACCENT }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {critico && <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-semibold">⚠️ Baixo</span>}
                  <span className="text-xs text-gray-400">Mín: {p.minimo} · R$ {p.preco.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>ajustar(p.id,-1)} className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 font-bold text-sm">−</button>
                  <button onClick={()=>ajustar(p.id,+1)} className="w-7 h-7 rounded-lg text-white font-bold text-sm hover:opacity-80" style={{ background:ACCENT }}>+</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {modal && (
        <Modal title="Nova Peça" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-3">
            <Input label="Nome *"   value={form.nome}   onChange={e=>setForm({...form,nome:e.target.value})}   placeholder="Ex: Filtro de óleo" />
            <Input label="Código *" value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value})} placeholder="Ex: FO-001" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Quantidade" type="number" value={form.quantidade} onChange={e=>setForm({...form,quantidade:e.target.value})} placeholder="0" />
              <Input label="Mínimo"     type="number" value={form.minimo}     onChange={e=>setForm({...form,minimo:e.target.value})}     placeholder="0" />
            </div>
            <Input label="Preço (R$)" type="number" value={form.preco} onChange={e=>setForm({...form,preco:e.target.value})} placeholder="0,00" />
            <div className="flex gap-2 pt-2"><Btn onClick={()=>setModal(false)} variant="ghost">Cancelar</Btn><Btn onClick={salvar} full>Salvar</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
