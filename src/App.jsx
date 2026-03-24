import { useState } from "react";
import logoProAuto from "./assets/logo-proauto.png";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import OrdensServico from "./pages/OrdensServico";
import Estoque from "./pages/Estoque";
import Financeiro from "./pages/Financeiro";

// ── DADOS INICIAIS (usados apenas na primeira vez) ──────────
const CLIENTES_INICIAL = [
  { id: 1, nome: "João Silva",     telefone: "(54) 99123-4567", email: "joao@email.com",   veiculo: "Fiat Uno 2019",    placa: "BRA-2E19" },
  { id: 2, nome: "Maria Santos",   telefone: "(54) 98765-4321", email: "maria@email.com",  veiculo: "Honda Civic 2021", placa: "ABC-1D21" },
  { id: 3, nome: "Carlos Pereira", telefone: "(54) 91234-5678", email: "carlos@email.com", veiculo: "VW Gol 2018",      placa: "XYZ-3F18" },
];
const OS_INICIAL = [
  { id: "OS-001", cliente: "João Silva",     veiculo: "Fiat Uno 2019",    servico: "Troca de óleo + filtros", status: "Concluída",       valor: 280, data: "2025-03-20" },
  { id: "OS-002", cliente: "Maria Santos",   veiculo: "Honda Civic 2021", servico: "Revisão completa",        status: "Em andamento",    valor: 850, data: "2025-03-23" },
  { id: "OS-003", cliente: "Carlos Pereira", veiculo: "VW Gol 2018",      servico: "Freios dianteiros",       status: "Aguardando peça", valor: 420, data: "2025-03-24" },
];
const ESTOQUE_INICIAL = [
  { id: 1, nome: "Filtro de óleo",    codigo: "FO-001", quantidade: 12, minimo: 5, preco: 45  },
  { id: 2, nome: "Pastilha de freio", codigo: "PF-002", quantidade: 3,  minimo: 4, preco: 120 },
  { id: 3, nome: "Óleo motor 5W30",   codigo: "OM-003", quantidade: 20, minimo: 8, preco: 38  },
  { id: 4, nome: "Correia dentada",   codigo: "CD-004", quantidade: 7,  minimo: 3, preco: 95  },
];
const FINANCEIRO_INICIAL = [
  { id: 1, descricao: "OS-001 - João Silva", tipo: "Receita", valor: 280,  data: "2025-03-20" },
  { id: 2, descricao: "Compra de peças",     tipo: "Despesa", valor: 620,  data: "2025-03-21" },
  { id: 3, descricao: "Aluguel oficina",     tipo: "Despesa", valor: 1800, data: "2025-03-22" },
];

const nav = [
  { id: "dashboard",  icon: "⚡", label: "Dashboard"         },
  { id: "clientes",   icon: "👥", label: "Clientes"          },
  { id: "os",         icon: "🔧", label: "Ordens de Serviço" },
  { id: "estoque",    icon: "📦", label: "Estoque"           },
  { id: "financeiro", icon: "💰", label: "Financeiro"        },
];

export default function App() {
  // ── Auth ────────────────────────────────────────────────
  const [logado, setLogado] = useLocalStorage("proauto_logado", false);

  // ── Dados persistidos no localStorage ───────────────────
  const [clientes,   setClientes]   = useLocalStorage("proauto_clientes",   CLIENTES_INICIAL);
  const [os,         setOs]         = useLocalStorage("proauto_os",         OS_INICIAL);
  const [estoque,    setEstoque]    = useLocalStorage("proauto_estoque",    ESTOQUE_INICIAL);
  const [financeiro, setFinanceiro] = useLocalStorage("proauto_financeiro", FINANCEIRO_INICIAL);

  const [aba, setAba] = useState("dashboard");

  if (!logado) return <Login onLogin={() => setLogado(true)} />;

  const current = nav.find(n => n.id === aba);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-gray-100 shadow-sm">

        {/* Logo */}
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
                style={{ background: active?"#f3f4f6":"transparent", color: active?"#1a1a1a":"#6b7280", borderLeft: active?"3px solid #1a1a1a":"3px solid transparent", fontWeight: active?"800":"600" }}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Rodapé */}
        <div className="px-4 py-4 border-t border-gray-100 flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-500">Sistema online</span>
          </div>
          <button onClick={() => { if(window.confirm("Sair do sistema?")) setLogado(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
            🚪 Sair
          </button>
        </div>
      </aside>

      {/* ── CONTEÚDO ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-lg font-black text-gray-900">{current?.label}</h1>
            <p className="text-xs text-gray-400">Pro Auto — Manutenção Automotiva</p>
          </div>
          <span className="text-xs text-gray-400">
            🗓️ {new Date().toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long" })}
          </span>
        </div>

        {/* Conteúdo */}
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
