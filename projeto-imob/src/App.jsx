
import { useState } from "react";
import "./App.css";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import ImovelDetalhes from "./components/ImovelDetalhes/ImovelDetalhes";
import Login from "./components/Login/Login";
import Favoritos from "./components/Favoritos/Favoritos";
import Perfil from "./components/Perfil/Perfil";
import GestaoImoveis from "./components/GestaoImoveis/GestaoImoveis";

function RedefinirSenha({ onConcluir }) {
  const { redefinirSenha } = useAuth();

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }

    setEnviando(true);

    try {
      const resultado = await redefinirSenha(senha);

      if (resultado?.error) {
        setErro(resultado.error);
        return;
      }

      setMensagem(
        resultado?.message || "Senha redefinida com sucesso!"
      );

      setSenha("");
      setConfirmacao("");

      window.setTimeout(() => {
        onConcluir?.();
      }, 1800);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      setErro(
        "Não foi possível redefinir a senha. Tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="bd-page">
      <div className="bd-card bd-login">
        <span className="bd-eyebrow">BLACK DRAGONS IMOB</span>

        <h1>Crie uma nova senha</h1>

        <p>
          Escolha uma senha segura para voltar a acessar sua conta.
        </p>

        <form onSubmit={enviar}>
          <label>
            <span>Nova senha</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo de 8 caracteres"
              minLength={8}
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </label>

          <label>
            <span>Confirmar nova senha</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Digite a senha novamente"
              minLength={8}
              required
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
            />
          </label>

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
              {enviando ? "Salvando..." : "Redefinir senha"}
            </span>

            {!enviando && (
              <span aria-hidden="true">↗</span>
            )}
          </button>
        </form>

        <small>
          Utilize uma senha com pelo menos 8 caracteres.
        </small>
      </div>
    </main>
  );
}

function Aplicacao() {
  const [imovelSelecionado, setImovelSelecionado] = useState(null);
  const [tela, setTela] = useState("home");

  const { recuperacaoSenha, carregando } = useAuth();

  function ir(novaTela) {
    setImovelSelecionado(null);
    setTela(novaTela);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function abrirImovel(imovel) {
    setImovelSelecionado(imovel);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function irParaSecao(id) {
    ir("home");

    window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  if (carregando) {
    return (
      <main className="bd-page">
        <div className="bd-card bd-login">
          <span className="bd-eyebrow">BLACK DRAGONS IMOB</span>
          <h1>Carregando...</h1>
          <p>Estamos verificando sua sessão.</p>
        </div>
      </main>
    );
  }

  if (recuperacaoSenha) {
    return (
      <RedefinirSenha
        onConcluir={() => {
          ir("login");
        }}
      />
    );
  }

  let conteudo;

  if (imovelSelecionado) {
    conteudo = (
      <ImovelDetalhes
        imovel={imovelSelecionado}
        onVoltar={() => setImovelSelecionado(null)}
        onLogin={() => ir("login")}
      />
    );
  } else if (tela === "login") {
    conteudo = (
      <Login onConcluir={() => ir("home")} />
    );
  } else if (tela === "favoritos") {
    conteudo = (
      <Favoritos
        onSelecionarImovel={abrirImovel}
        onLogin={() => ir("login")}
        onVoltar={() => ir("home")}
      />
    );
  } else if (tela === "perfil") {
    conteudo = (
      <Perfil
        onLogin={() => ir("login")}
        onVoltar={() => ir("home")}
        onGestao={() => ir("gestao-imoveis")}
      />
    );
  } else if (tela === "gestao-imoveis") {
    conteudo = (
      <GestaoImoveis
        onVoltar={(destino = "home") => ir(destino)}
      />
    );
  } else {
    conteudo = (
      <Main
        onSelecionarImovel={abrirImovel}
        onLogin={() => ir("login")}
      />
    );
  }

  return (
    <>
      <Header
        onNavegar={ir}
        onSecao={irParaSecao}
      />

      {conteudo}

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Aplicacao />
    </AuthProvider>
  );
}

export default App;
