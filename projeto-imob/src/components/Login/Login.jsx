import { useState } from "react";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";

export default function Login({ onConcluir }) {
  const { entrar, cadastrar } = useAuth();
  const [modo, setModo] = useState("entrar");
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erro, setErro] = useState("");

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    if (modo === "cadastrar" && form.senha.length < 4)
      return setErro("A senha precisa ter pelo menos 4 caracteres.");
    const resultado =
      modo === "entrar" ? await entrar(form) : await cadastrar(form);
    if (resultado) setErro(resultado);
    else onConcluir?.();
  }

  return (
    <main className="bd-page">
      <div className="bd-card bd-login">
        <span className="bd-eyebrow">BLACK DRAGONS IMOB</span>
        <h1>{modo === "entrar" ? "Entre na sua conta" : "Crie sua conta"}</h1>
        <p>Salve seus imóveis favoritos e acesse quando quiser.</p>

        <form onSubmit={enviar}>
          {modo === "cadastrar" && (
            <label>
              <span>Nome</span>
              <input required value={form.nome} onChange={mudar("nome")} placeholder="Seu nome" />
            </label>
          )}
          <label>
            <span>E-mail</span>
            <input required type="email" value={form.email} onChange={mudar("email")} placeholder="voce@email.com" />
          </label>
          <label>
            <span>Senha</span>
            <input required type="password" value={form.senha} onChange={mudar("senha")} placeholder="••••••" />
          </label>

          {erro && <div className="bd-error" role="alert">{erro}</div>}

          <button type="submit" className="bd-btn">
            {modo === "entrar" ? "Entrar" : "Cadastrar"} <span>↗</span>
          </button>
        </form>

        <button
          type="button"
          className="bd-link"
          onClick={() => {
            setErro("");
            setModo(modo === "entrar" ? "cadastrar" : "entrar");
          }}
        >
          {modo === "entrar" ? "Ainda não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>

        <small>Os dados ficam salvos apenas neste navegador.</small>
      </div>
    </main>
  );
}
