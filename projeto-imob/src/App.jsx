
import { useState } from "react";
import "./App.css";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import ImovelDetalhes from "./components/ImovelDetalhes/ImovelDetalhes";

function App() {
  const [imovelSelecionado, setImovelSelecionado] = useState(null);

  return (
    <>
      <Header />

      {imovelSelecionado ? (
        <ImovelDetalhes
          imovel={imovelSelecionado}
          onVoltar={() => setImovelSelecionado(null)}
        />
      ) : (
        <Main onSelecionarImovel={setImovelSelecionado} />
      )}

      <Footer />
    </>
  );
}

export default App;
