import { useState } from "react";
import logoProAuto from "./assets/logo-proauto.png";

// ── DADOS INICIAIS ─────────────────────────────────────────
const initialClientes = [
  { id: 1, nome: "João Silva",     telefone: "(54) 99123-4567", email: "joao@email.com",   veiculo: "Fiat Uno 2019",    placa: "BRA-2E19" },
  { id: 2, nome: "Maria Santos",   telefone: "(54) 98765-4321", email: "maria@email.com",  veiculo: "Honda Civic 2021", placa: "ABC-1D21" },
  { id: 3, nome: "Carlos Pereira", telefone: "(54) 91234-5678", email: "carlos@email.com", veiculo: "VW Gol 2018",      placa: "XYZ-3F18" },
];
const initialOS = [
  { id: "OS-001", cliente: "João Silva",     veiculo: "Fiat Uno 2019",    servico: "Troca de óleo + filtros", status: "Concluída",       valor: 280, data: "2025-03-20" },
  { id: "OS-002", cliente: "Maria Santos",   veiculo: "Honda Civic 2021", servico: "Revisão completa",        status: "Em andamento",    valor: 850, data: "2025-03-23" },
  { id: "OS-003", cliente: "Carlos Pereira", veiculo: "VW Gol 2018",      servico: "Freios dianteiros",       status: "Aguardando peça", valor: 420, data: "2025-03-24" },
];
const initialEstoque = [
  { id: 1, nome: "Filtro de óleo",    codigo: "FO-001", quantidade: 12, minimo: 5, preco: 45  },
  { id: 2, nome: "Pastilha de freio", codigo: "PF-002", quantidade: 3,  minimo: 4, preco: 120 },
  { id: 3, nome: "Óleo motor 5W30",   codigo: "OM-003", quantidade: 20, minimo: 8, preco: 38  },
  { id: 4, nome: "Correia dentada",   codigo: "CD-004", quantidade: 7,  minimo: 3, preco: 95  },
];
const initialFinanceiro = [
  { id: 1, descricao: "OS-001 - João Silva", tipo: "Receita", valor: 280,  data: "2025-03-20" },
  { id: 2, descricao: "Compra de peças",     tipo: "Despesa", valor: 620,  data: "2025-03-21" },
  { id: 3, descricao: "Aluguel oficina",     tipo: "Despesa", valor: 1800, data: "2025-03-22" },
];

const STATUS = {
  "Concluída":       { bg: "#e8faf3", text: "#15803d", border: "#bbf7d0", dot: "#16a34a" },
  "Em andamento":    { bg: "#fefce8", text: "#92400e", border: "#fde68a", dot: "#d97706" },
  "Aguardando peça": { bg: "#fef2f2", text: "#991b1b", border: "#fecaca", dot: "#dc2626" },
};
const ACCENT = "#1a1a1a";

// ── COMPONENTES BASE ───────────────────────────────────────
function Badge({ status }) {
  const s = STATUS[status] || { bg: "#f3f4f6", text: "#6b7280", border: "#e5e7eb", dot: "#9ca3af" };
  return (
    <span style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full" />
      {status}
    </span>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>{children}</div>;
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <input {...props} className="w-full rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none border border-gray-200 focus:border-gray-800 focus:ring-2 focus:ring-gray-100 transition-all bg-white" />
    </div>
  );
}

function Sel({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <select {...props} className="w-full rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none border border-gray-200 bg-white">{children}</select>
    </div>
  );
}

function Btn({ onClick, children, variant = "primary", full }) {
  const base = `${full ? "w-full" : ""} flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95`;
  return variant === "ghost"
    ? <button onClick={onClick} className={`${base} text-gray-500 bg-gray-100 hover:bg-gray-200`}>{children}</button>
    : <button onClick={onClick} className={`${base} text-white hover:opacity-80 shadow-sm`} style={{ background: ACCENT }}>{children}</button>;
}

function Modal({ title, onClose, children }) {
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

// ── DASHBOARD ──────────────────────────────────────────────
function Dashboard({ clientes, os, estoque, financeiro }) {
  const receitas     = financeiro.filter(f => f.tipo === "Receita").reduce((a, b) => a + b.valor, 0);
  const despesas     = financeiro.filter(f => f.tipo === "Despesa").reduce((a, b) => a + b.valor, 0);
  const baixoEstoque = estoque.filter(p => p.quantidade <= p.minimo).length;
  const osAndamento  = os.filter(o => o.status === "Em andamento").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div className="rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "#1a1a1a", minHeight: 140 }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg,white,white 1px,transparent 1px,transparent 14px)" }} />
        <img src={logoProAuto} alt="Pro Auto" className="relative z-10" style={{ width: 200, objectFit: "contain" }} />
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">Sistema operacional</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: "👥", label: "Clientes",     value: clientes.length, color: ACCENT,    bg: "#f9fafb" },
          { icon: "🔧", label: "Em andamento", value: osAndamento,     color: "#d97706", bg: "#fffbeb" },
          { icon: "💰", label: "Receita",       value: `R$${receitas}`, color: "#15803d", bg: "#f0fdf4" },
          { icon: "📦", label: "Estoque baixo", value: baixoEstoque,    color: baixoEstoque > 0 ? "#dc2626" : "#15803d", bg: baixoEstoque > 0 ? "#fef2f2" : "#f0fdf4" },
        ].map(m => (
          <Card key={m.label} className="p-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: m.bg }}>{m.icon}</div>
            <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">{m.label}</div>
          </Card>
        ))}
      </div>

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
          <span className="text-base font-black text-gray-900">R$ {(receitas - despesas).toFixed(2)}</span>
        </div>
      </Card>

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

// ── CLIENTES ───────────────────────────────────────────────
function Clientes({ clientes, setClientes }) {
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
          </Card>
        ))}
      </div>
      {modal && (
        <Modal title="Novo Cliente" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-3">
            <Input label="Nome *"     value={form.nome}     onChange={e => setForm({ ...form, nome: e.target.value })}     placeholder="Nome completo" />
            <Input label="Telefone *" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 99999-9999" />
            <Input label="E-mail"     value={form.email}    onChange={e => setForm({ ...form, email: e.target.value })}    placeholder="email@exemplo.com" />
            <Input label="Veículo"    value={form.veiculo}  onChange={e => setForm({ ...form, veiculo: e.target.value })}  placeholder="Marca Modelo Ano" />
            <Input label="Placa"      value={form.placa}    onChange={e => setForm({ ...form, placa: e.target.value })}    placeholder="ABC-1D23" />
            <div className="flex gap-2 pt-2"><Btn onClick={() => setModal(false)} variant="ghost">Cancelar</Btn><Btn onClick={salvar} full>Salvar</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ORDENS DE SERVIÇO ──────────────────────────────────────
function OrdensServico({ os, setOs, clientes }) {
  const [modal, setModal]   = useState(false);
  const [filtro, setFiltro] = useState("Todas");
  const [form, setForm]     = useState({ cliente: "", veiculo: "", servico: "", valor: "" });

  const filtradas   = filtro === "Todas" ? os : os.filter(o => o.status === filtro);
  const mudarStatus = (id, s) => setOs(os.map(o => o.id === id ? { ...o, status: s } : o));
  const salvar = () => {
    if (!form.cliente || !form.servico) return;
    setOs([{ id: `OS-${String(os.length + 1).padStart(3,"0")}`, ...form, status: "Em andamento", valor: parseFloat(form.valor)||0, data: new Date().toISOString().split("T")[0] }, ...os]);
    setForm({ cliente: "", veiculo: "", servico: "", valor: "" }); setModal(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-black text-gray-800">Ordens de Serviço</h2><p className="text-xs text-gray-400 mt-0.5">{os.length} ordens</p></div>
        <Btn onClick={() => setModal(true)}>+ Nova OS</Btn>
      </div>
      <div className="flex gap-2 flex-wrap">
        {["Todas","Em andamento","Aguardando peça","Concluída"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{ background: filtro===f ? ACCENT : "white", color: filtro===f ? "white" : "#6b7280", border: filtro===f ? `1px solid ${ACCENT}` : "1px solid #e5e7eb" }}>{f}</button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {filtradas.map(o => (
          <Card key={o.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black tracking-wider text-gray-800">{o.id}</span>
                  <Badge status={o.status} />
                </div>
                <p className="text-sm font-bold text-gray-800">{o.cliente}</p>
                <p className="text-xs text-gray-400">{o.veiculo} · {o.data}</p>
              </div>
              <span className="text-lg font-black text-gray-900">R$ {o.valor}</span>
            </div>
            <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">🔧 {o.servico}</p>
            <div className="flex gap-2">
              {["Em andamento","Aguardando peça","Concluída"].map(s => (
                <button key={s} onClick={() => mudarStatus(o.id,s)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{ background: o.status===s ? ACCENT : "white", color: o.status===s ? "white" : "#9ca3af", border: o.status===s ? `1px solid ${ACCENT}` : "1px solid #e5e7eb" }}>
                  {s==="Em andamento" ? "⚙️ And." : s==="Aguardando peça" ? "📦 Ag." : "✅ OK"}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      {modal && (
        <Modal title="Nova OS" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-3">
            <Sel label="Cliente *" value={form.cliente} onChange={e => { const c=clientes.find(c=>c.nome===e.target.value); setForm({...form,cliente:e.target.value,veiculo:c?.veiculo||""}); }}>
              <option value="">Selecione o cliente</option>
              {clientes.map(c => <option key={c.id}>{c.nome}</option>)}
            </Sel>
            <Input label="Veículo"    value={form.veiculo} onChange={e => setForm({...form,veiculo:e.target.value})} placeholder="Preenchido automaticamente" />
            <Input label="Serviço *"  value={form.servico} onChange={e => setForm({...form,servico:e.target.value})} placeholder="Ex: Troca de óleo" />
            <Input label="Valor (R$)" type="number" value={form.valor} onChange={e => setForm({...form,valor:e.target.value})} placeholder="0,00" />
            <div className="flex gap-2 pt-2"><Btn onClick={() => setModal(false)} variant="ghost">Cancelar</Btn><Btn onClick={salvar} full>Abrir OS</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ESTOQUE ────────────────────────────────────────────────
function Estoque({ estoque, setEstoque }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ nome:"",codigo:"",quantidade:"",minimo:"",preco:"" });

  const salvar = () => {
    if (!form.nome) return;
    setEstoque([...estoque,{id:Date.now(),...form,quantidade:+form.quantidade||0,minimo:+form.minimo||0,preco:+form.preco||0}]);
    setForm({nome:"",codigo:"",quantidade:"",minimo:"",preco:""}); setModal(false);
  };
  const ajustar = (id,d) => setEstoque(estoque.map(p=>p.id===id?{...p,quantidade:Math.max(0,p.quantidade+d)}:p));

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
                <div className="text-right">
                  <p className="text-2xl font-black" style={{ color: critico?"#dc2626":ACCENT }}>{p.quantidade}</p>
                  <p className="text-xs text-gray-400">unidades</p>
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

// ── FINANCEIRO ─────────────────────────────────────────────
function Financeiro({ financeiro, setFinanceiro }) {
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

// ── APP PRINCIPAL ──────────────────────────────────────────
const nav = [
  { id:"dashboard",  icon:"⚡", label:"Dashboard"         },
  { id:"clientes",   icon:"👥", label:"Clientes"          },
  { id:"os",         icon:"🔧", label:"Ordens de Serviço" },
  { id:"estoque",    icon:"📦", label:"Estoque"           },
  { id:"financeiro", icon:"💰", label:"Financeiro"        },
];

export default function App() {
  const [aba, setAba]               = useState("dashboard");
  const [clientes, setClientes]     = useState(initialClientes);
  const [os, setOs]                 = useState(initialOS);
  const [estoque, setEstoque]       = useState(initialEstoque);
  const [financeiro, setFinanceiro] = useState(initialFinanceiro);
  const current = nav.find(n=>n.id===aba);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily:"'DM Sans',system-ui,sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-gray-100 shadow-sm">

        {/* Logo real */}
        <div className="flex items-center justify-center px-6 py-5 border-b border-gray-100" style={{ background: "#1a1a1a" }}>
          <img src={logoProAuto} alt="Pro Auto" style={{ width: 160, objectFit: "contain" }} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest px-3 mb-3">Menu</p>
          {nav.map(item => {
            const active = aba === item.id;
            return (
              <button key={item.id} onClick={() => setAba(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                style={{ background:active?"#f3f4f6":"transparent", color:active?ACCENT:"#6b7280", borderLeft:active?`3px solid ${ACCENT}`:"3px solid transparent", fontWeight:active?"800":"600" }}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Status */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-500">Sistema online</span>
          </div>
        </div>
      </aside>

      {/* ── CONTEÚDO ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-lg font-black text-gray-900">{current?.label}</h1>
            <p className="text-xs text-gray-400">Pro Auto — Manutenção Automotiva</p>
          </div>
          <span className="text-xs text-gray-400">🗓️ {new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</span>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-3xl">
            {aba==="dashboard"  && <Dashboard  clientes={clientes} os={os} estoque={estoque} financeiro={financeiro} />}
            {aba==="clientes"   && <Clientes   clientes={clientes} setClientes={setClientes} />}
            {aba==="os"         && <OrdensServico os={os} setOs={setOs} clientes={clientes} />}
            {aba==="estoque"    && <Estoque    estoque={estoque} setEstoque={setEstoque} />}
            {aba==="financeiro" && <Financeiro financeiro={financeiro} setFinanceiro={setFinanceiro} />}
          </div>
        </div>
      </main>
    </div>
  );
}
