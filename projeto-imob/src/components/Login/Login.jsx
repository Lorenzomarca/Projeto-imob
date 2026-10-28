
import { useState } from "react";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";

export default function Login({ onConcluir }) {
  const {
    entrar,
    cadastrar,
    entrarComGoogle,
    solicitarRecuperacaoSenha,
  } = useAuth();

  const [modo, setModo] = useState("entrar");

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [recuperarSenha, setRecuperarSenha] = useState(false);

  const mudar = (campo) => (e) => {
    setForm((atual) => ({
      ...atual,
      [campo]: e.target.value,
    }));
  };

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (recuperarSenha) {
      if (!form.email.trim()) {
        setErro("Informe seu e-mail.");
        return;
      }

      setEnviando(true);

      try {
        const resultado = await solicitarRecuperacaoSenha(form.email);

        if (resultado?.error) {
          setErro(resultado.error);
          return;
        }

        setMensagem(
          resultado?.message ||
            "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
        );
      } catch (error) {
        console.error("Erro ao solicitar recuperação:", error);
        setErro("Não foi possível enviar o pedido. Tente novamente.");
      } finally {
        setEnviando(false);
      }

      return;
    }

    if (modo === "cadastrar" && form.nome.trim().length < 2) {
      setErro("Informe seu nome completo.");
      return;
    }

    if (form.senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setEnviando(true);

    try {
      const resultado =
        modo === "entrar"
          ? await entrar({
              email: form.email,
              senha: form.senha,
            })
          : await cadastrar({
              nome: form.nome,
              email: form.email,
              senha: form.senha,
            });

      if (!resultado) {
        setErro("Não foi possível concluir a operação. Tente novamente.");
        return;
      }

      if (resultado.error) {
        setErro(resultado.error);
        return;
      }

      if (resultado.message) {
        setMensagem(resultado.message);
      }

      // No login, entrar() retorna data quando autentica.
      if (modo === "entrar" && resultado.data?.session) {
        onConcluir?.();
      }
    } catch (error) {
      console.error("Erro de autenticação:", error);
      setErro("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  async function loginGoogle() {
    setErro("");
    setMensagem("");
    setEnviando(true);

    try {
      const resultado = await entrarComGoogle();

      if (resultado?.error) {
        setErro(resultado.error);
      }
    } catch (error) {
      console.error("Erro ao entrar com Google:", error);
      setErro("Não foi possível iniciar o login com Google.");
    } finally {
      setEnviando(false);
    }
  }

  function alternarModo() {
    setErro("");
    setMensagem("");
    setRecuperarSenha(false);

    setModo((atual) =>
      atual === "entrar" ? "cadastrar" : "entrar"
    );
  }

  function abrirRecuperacao() {
    setErro("");
    setMensagem("");
    setRecuperarSenha(true);
  }

  function voltarLogin() {
    setErro("");
    setMensagem("");
    setRecuperarSenha(false);
    setModo("entrar");
  }

  return (
    <main className="bd-page">
      <div className="bd-card bd-login">
        <span className="bd-eyebrow">BLACK DRAGONS IMOB</span>

        <h1>
          {recuperarSenha
            ? "Recuperar senha"
            : modo === "entrar"
              ? "Entre na sua conta"
              : "Crie sua conta"}
        </h1>

        <p>
          {recuperarSenha
            ? "Informe seu e-mail para receber as instruções de recuperação."
            : "Salve seus imóveis favoritos e acesse quando quiser."}
        </p>

        <form onSubmit={enviar}>
          {!recuperarSenha && modo === "cadastrar" && (
            <label>
              <span>Nome</span>
              <input
                required
                type="text"
                autoComplete="name"
                value={form.nome}
                onChange={mudar("nome")}
                placeholder="Seu nome"
                minLength={2}
              />
            </label>
          )}

          <label>
            <span>E-mail</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={mudar("email")}
              placeholder="voce@email.com"
            />
          </label>

          {!recuperarSenha && (
            <label>
              <span>Senha</span>
              <input
                required
                type="password"
                autoComplete={
                  modo === "entrar"
                    ? "current-password"
                    : "new-password"
                }
                value={form.senha}
                onChange={mudar("senha")}
                placeholder="Mínimo de 8 caracteres"
                minLength={8}
              />
            </label>
          )}

          {erro && (
            <div className="bd-error" role="alert">
              {erro}
            </div>
          )}

          {mensagem && (
            <div className="bd-success" role="status">
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            className="bd-btn"
            disabled={enviando}
          >
            <span>
              {enviando
                ? "Aguarde..."
                : recuperarSenha
                  ? "Enviar link de recuperação"
                  : modo === "entrar"
                    ? "Entrar"
                    : "Cadastrar"}
            </span>

            {!enviando && <span aria-hidden="true">↗</span>}
          </button>
        </form>

        {recuperarSenha ? (
          <button
            type="button"
            className="bd-link"
            onClick={voltarLogin}
            disabled={enviando}
          >
            Voltar para o login
          </button>
        ) : (
          <>
            {modo === "entrar" && (
              <button
                type="button"
                className="bd-link"
                onClick={abrirRecuperacao}
                disabled={enviando}
              >
                Esqueci minha senha
              </button>
            )}

            <button
              type="button"
              className="bd-link"
              onClick={alternarModo}
              disabled={enviando}
            >
              {modo === "entrar"
                ? "Ainda não tem conta? Cadastre-se"
                : "Já tem conta? Entrar"}
            </button>

         
          </>
        )}

        <small>
          Seus dados de autenticação são gerenciados pelo Supabase.
        </small>
      </div>
    </main>
  );
}
