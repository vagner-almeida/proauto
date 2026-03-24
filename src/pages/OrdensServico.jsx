import { useState } from "react";
import { Modal, Input, Sel, Btn, Badge, Card, ACCENT } from "../components/UI";

function imprimirOS(os) {
  const janela = window.open("", "_blank", "width=800,height=600");
  janela.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8"/>
      <title>Ordem de Serviço ${os.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #1a1a1a; padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 24px; }
        .empresa h1 { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
        .empresa p { font-size: 11px; color: #666; margin-top: 2px; }
        .os-num { text-align: right; }
        .os-num .num { font-size: 28px; font-weight: 900; color: #1a1a1a; }
        .os-num .label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
        .row { display: flex; gap: 32px; margin-bottom: 4px; }
        .field label { font-size: 10px; color: #999; text-transform: uppercase; display: block; margin-bottom: 2px; }
        .field span { font-size: 13px; font-weight: 600; }
        .field { flex: 1; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;
          background: ${os.status === "Concluída" ? "#e8faf3" : os.status === "Em andamento" ? "#fefce8" : "#fef2f2"};
          color: ${os.status === "Concluída" ? "#15803d" : os.status === "Em andamento" ? "#92400e" : "#991b1b"};
          border: 1px solid ${os.status === "Concluída" ? "#bbf7d0" : os.status === "Em andamento" ? "#fde68a" : "#fecaca"};
        }
        .servico-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; font-size: 13px; line-height: 1.5; }
        .valor-box { display: flex; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 2px solid #1a1a1a; }
        .valor-box .total { text-align: right; }
        .valor-box .total label { font-size: 11px; color: #999; text-transform: uppercase; display: block; }
        .valor-box .total span { font-size: 28px; font-weight: 900; }
        .assinaturas { display: flex; justify-content: space-between; margin-top: 60px; gap: 32px; }
        .assinatura { flex: 1; border-top: 1px solid #ccc; padding-top: 8px; text-align: center; font-size: 11px; color: #999; }
        .rodape { margin-top: 40px; text-align: center; font-size: 10px; color: #ccc; }
        @media print { body { padding: 24px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="empresa">
          <h1>PRO AUTO</h1>
          <p>Manutenção Automotiva</p>
        </div>
        <div class="os-num">
          <div class="label">Ordem de Serviço</div>
          <div class="num">${os.id}</div>
          <div style="margin-top:6px"><span class="status-badge">${os.status}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Dados do Cliente</div>
        <div class="row">
          <div class="field"><label>Cliente</label><span>${os.cliente}</span></div>
          <div class="field"><label>Data de Abertura</label><span>${os.data}</span></div>
        </div>
        <div class="row" style="margin-top:10px">
          <div class="field"><label>Veículo</label><span>${os.veiculo}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Serviço Realizado</div>
        <div class="servico-box">${os.servico}</div>
      </div>

      <div class="valor-box">
        <div class="total">
          <label>Valor Total</label>
          <span>R$ ${Number(os.valor).toFixed(2)}</span>
        </div>
      </div>

      <div class="assinaturas">
        <div class="assinatura">Assinatura do Cliente</div>
        <div class="assinatura">Assinatura do Responsável</div>
      </div>

      <div class="rodape">Pro Auto — Manutenção Automotiva · Documento gerado em ${new Date().toLocaleDateString("pt-BR")}</div>

      <script>window.onload = () => { window.print(); }<\/script>
    </body>
    </html>
  `);
  janela.document.close();
}

export default function OrdensServico({ os, setOs, clientes }) {
  const [modal, setModal]   = useState(false);
  const [filtro, setFiltro] = useState("Todas");
  const [form, setForm]     = useState({ cliente: "", veiculo: "", servico: "", valor: "" });

  const filtradas   = filtro === "Todas" ? os : os.filter(o => o.status === filtro);
  const mudarStatus = (id, s) => setOs(os.map(o => o.id === id ? { ...o, status: s } : o));
  const excluir     = (id) => { if (window.confirm("Excluir esta OS?")) setOs(os.filter(o => o.id !== id)); };

  const salvar = () => {
    if (!form.cliente || !form.servico) return;
    setOs([{
      id: `OS-${String(os.length + 1).padStart(3, "0")}`,
      ...form,
      status: "Em andamento",
      valor: parseFloat(form.valor) || 0,
      data: new Date().toISOString().split("T")[0],
    }, ...os]);
    setForm({ cliente: "", veiculo: "", servico: "", valor: "" });
    setModal(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-800">Ordens de Serviço</h2>
          <p className="text-xs text-gray-400 mt-0.5">{os.length} ordens</p>
        </div>
        <Btn onClick={() => setModal(true)}>+ Nova OS</Btn>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["Todas","Em andamento","Aguardando peça","Concluída"].map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{ background: filtro===f ? ACCENT : "white", color: filtro===f ? "white" : "#6b7280", border: filtro===f ? `1px solid ${ACCENT}` : "1px solid #e5e7eb" }}>
            {f}
          </button>
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
              <span className="text-lg font-black text-gray-900">R$ {Number(o.valor).toFixed(2)}</span>
            </div>

            <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">🔧 {o.servico}</p>

            {/* Status buttons */}
            <div className="flex gap-2 mb-3">
              {["Em andamento","Aguardando peça","Concluída"].map(s => (
                <button key={s} onClick={() => mudarStatus(o.id, s)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{ background: o.status===s ? ACCENT : "white", color: o.status===s ? "white" : "#9ca3af", border: o.status===s ? `1px solid ${ACCENT}` : "1px solid #e5e7eb" }}>
                  {s==="Em andamento" ? "⚙️ And." : s==="Aguardando peça" ? "📦 Ag." : "✅ OK"}
                </button>
              ))}
            </div>

            {/* Ações */}
            <div className="flex gap-2 pt-2 border-t border-gray-50">
              <button onClick={() => imprimirOS(o)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                🖨️ Imprimir / PDF
              </button>
              <button onClick={() => excluir(o.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-red-100 text-red-400 hover:bg-red-50 transition-all">
                🗑️
              </button>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title="Nova OS" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-3">
            <Sel label="Cliente *" value={form.cliente} onChange={e => {
              const c = clientes.find(c => c.nome === e.target.value);
              setForm({ ...form, cliente: e.target.value, veiculo: c?.veiculo || "" });
            }}>
              <option value="">Selecione o cliente</option>
              {clientes.map(c => <option key={c.id}>{c.nome}</option>)}
            </Sel>
            <Input label="Veículo"    value={form.veiculo} onChange={e => setForm({...form,veiculo:e.target.value})} placeholder="Preenchido automaticamente" />
            <Input label="Serviço *"  value={form.servico} onChange={e => setForm({...form,servico:e.target.value})} placeholder="Ex: Troca de óleo" />
            <Input label="Valor (R$)" type="number" value={form.valor} onChange={e => setForm({...form,valor:e.target.value})} placeholder="0,00" />
            <div className="flex gap-2 pt-2">
              <Btn onClick={() => setModal(false)} variant="ghost">Cancelar</Btn>
              <Btn onClick={salvar} full>Abrir OS</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
