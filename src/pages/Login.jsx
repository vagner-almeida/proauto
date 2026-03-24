import { useState } from "react";
import logoProAuto from "../assets/logo-proauto.png";

// Credenciais — altere aqui se quiser mudar
const USUARIO = "proauto";
const SENHA    = "proauto123";

export default function Login({ onLogin }) {
  const [form, setForm]   = useState({ usuario: "", senha: "" });
  const [erro, setErro]   = useState("");
  const [show, setShow]   = useState(false);

  const entrar = (e) => {
    e.preventDefault();
    if (form.usuario === USUARIO && form.senha === SENHA) {
      onLogin();
    } else {
      setErro("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="rounded-2xl p-8 flex items-center justify-center mb-6" style={{ background: "#1a1a1a" }}>
          <img src={logoProAuto} alt="Pro Auto" style={{ width: 180, objectFit: "contain" }} />
        </div>

        {/* Card de login */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-1">Acesso ao sistema</h2>
          <p className="text-xs text-gray-400 mb-6">Digite suas credenciais para continuar</p>

          <form onSubmit={entrar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Usuário</label>
              <input
                type="text"
                value={form.usuario}
                onChange={e => { setForm({ ...form, usuario: e.target.value }); setErro(""); }}
                placeholder="proauto"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none border border-gray-200 focus:border-gray-800 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Senha</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={form.senha}
                  onChange={e => { setForm({ ...form, senha: e.target.value }); setErro(""); }}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-3 py-2.5 pr-10 text-sm text-gray-800 outline-none border border-gray-200 focus:border-gray-800 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs text-red-600 font-medium">
                ⚠️ {erro}
              </div>
            )}

            <button type="submit"
              className="w-full py-3 rounded-xl text-sm font-black text-white transition-all hover:opacity-80 active:scale-95 shadow-sm mt-1"
              style={{ background: "#1a1a1a" }}>
              Entrar →
            </button>
          </form>

          <p className="text-xs text-center text-gray-300 mt-4">
            usuário: <b className="text-gray-400">proauto</b> · senha: <b className="text-gray-400">proauto123</b>
          </p>
        </div>
      </div>
    </div>
  );
}
