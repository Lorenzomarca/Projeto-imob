import { useState } from "react";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import ImovelDetalhes from "./components/ImovelDetalhes/ImovelDetalhes";
import Login from "./components/Login/Login";
import Favoritos from "./components/Favoritos/Favoritos";

function App() {
  const [imovelSelecionado, setImovelSelecionado] = useState(null);
  // "home" | "login" | "favoritos"
  const [tela, setTela] = useState("home");

  const ir = (nova) => {
    setImovelSelecionado(null);
    setTela(nova);
    window.scrollTo({ top: 0 });
  };

  const abrirImovel = (imovel) => {
    setImovelSelecionado(imovel);
    window.scrollTo({ top: 0 });
  };

  // Links âncora do Header: volta pra home e rola até a seção
  const irParaSecao = (id) => {
    ir("home");
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

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
    conteudo = <Login onConcluir={() => ir("home")} />;
  } else if (tela === "favoritos") {
    conteudo = (
      <Favoritos
        onSelecionarImovel={abrirImovel}
        onLogin={() => ir("login")}
        onVoltar={() => ir("home")}
      />
    );
  } else {
    conteudo = (
      <Main onSelecionarImovel={abrirImovel} onLogin={() => ir("login")} />
    );
  }

  return (
    <AuthProvider>
      <Header onNavegar={ir} onSecao={irParaSecao} />
      {conteudo}
      <Footer />
    </AuthProvider>
  );
}

export default App;
