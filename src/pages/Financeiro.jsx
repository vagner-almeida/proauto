import { useState } from "react";
import { Modal, Input, Sel, Btn, Card, ACCENT } from "../components/UI";

export default function Financeiro({ financeiro, setFinanceiro }) {
  const [modal, setModal]   = useState(false);
  const [filtro, setFiltro] = useState("Todos");
  const [form, setForm]     = useState({ descricao:"",tipo:"Receita",valor:"",data:"" });

  const receitas  = financeiro.filter(f=>f.tipo==="Receita").reduce((a,b)=>a+b.valor,0);
  const despesas  = financeiro.filter(f=>f.tipo==="Despesa").reduce((a,b)=>a+b.valor,0);
  const filtrados = filtro==="Todos" ? financeiro : financeiro.filter(f=>f.tipo===filtro);

  const salvar = () => {
    if (!form.descricao||!form.valor) return;
    setFinanceiro([{id:Date.now(),...form,valor:+form.valor,data:form.data||new Date().toISOString().split("T")[0]},...financeiro]);
    setForm({descricao:"",tipo:"Receita",valor:"",data:""}); setModal(false);
  };
  const excluir = (id) => { if(window.confirm("Excluir este lançamento?")) setFinanceiro(financeiro.filter(f=>f.id!==id)); };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-black text-gray-800">Financeiro</h2><p className="text-xs text-gray-400 mt-0.5">Controle de caixa</p></div>
        <Btn onClick={() => setModal(true)}>+ Lançamento</Btn>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Receitas", val:receitas,                   color:"#15803d", bg:"#f0fdf4", border:"#bbf7d0", sign:"+"  },
          { label:"Despesas", val:despesas,                   color:"#dc2626", bg:"#fef2f2", border:"#fecaca", sign:"−"  },
          { label:"Saldo",    val:Math.abs(receitas-despesas),color:ACCENT,    bg:"#f9fafb", border:"#e5e7eb", sign:receitas>=despesas?"":"−" },
        ].map(c=>(
          <div key={c.label} className="rounded-2xl p-4 text-center border" style={{background:c.bg,borderColor:c.border}}>
            <p className="text-xs text-gray-500 font-medium">{c.label}</p>
            <p className="text-sm font-black mt-1" style={{color:c.color}}>{c.sign}R${c.val.toFixed(0)}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {["Todos","Receita","Despesa"].map(f=>(
          <button key={f} onClick={()=>setFiltro(f)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{background:filtro===f?ACCENT:"white",color:filtro===f?"white":"#6b7280",border:filtro===f?`1px solid ${ACCENT}`:"1px solid #e5e7eb"}}>{f}</button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {filtrados.map(f=>(
          <Card key={f.id} className="p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{background:f.tipo==="Receita"?"#f0fdf4":"#fef2f2",color:f.tipo==="Receita"?"#15803d":"#dc2626"}}>
              {f.tipo==="Receita"?"↑":"↓"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{f.descricao}</p>
              <p className="text-xs text-gray-400">{f.data}</p>
            </div>
            <span className="text-sm font-black flex-shrink-0" style={{color:f.tipo==="Receita"?"#15803d":"#dc2626"}}>
              {f.tipo==="Receita"?"+":"−"}R$ {f.valor.toFixed(2)}
            </span>
            <button onClick={()=>excluir(f.id)} className="text-gray-300 hover:text-red-400 transition-all text-lg ml-1">×</button>
          </Card>
        ))}
      </div>
      {modal && (
        <Modal title="Novo Lançamento" onClose={()=>setModal(false)}>
          <div className="flex flex-col gap-3">
            <Input label="Descrição *" value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} placeholder="Ex: OS-004" />
            <Sel label="Tipo" value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}><option>Receita</option><option>Despesa</option></Sel>
            <Input label="Valor *" type="number" value={form.valor} onChange={e=>setForm({...form,valor:e.target.value})} placeholder="0,00" />
            <Input label="Data"    type="date"   value={form.data}  onChange={e=>setForm({...form,data:e.target.value})} />
            <div className="flex gap-2 pt-2"><Btn onClick={()=>setModal(false)} variant="ghost">Cancelar</Btn><Btn onClick={salvar} full>Salvar</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
