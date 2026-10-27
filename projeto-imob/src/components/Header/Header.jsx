import { useState } from "react";
import "./Header.css";
import logo from "../../assets/images/Emblema Black Dragons em Fundo Transparente.png";
import { useAuth } from "../../context/AuthContext";

export default function Header({ onNavegar, onSecao }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const { usuario, favoritos, sair } = useAuth();

  const fecharMenu = () => setMenuAberto(false);

  const secao = (id) => (e) => {
    e.preventDefault();
    fecharMenu();
    onSecao?.(id);
  };

  const ir = (tela) => () => {
    fecharMenu();
    onNavegar?.(tela);
  };

  return (
    <header className="lux-header">
      <div className="lux-header-inner">
        <a
          className="lux-brand"
          href="#inicio"
          onClick={secao("inicio")}
          aria-label="Black Dragons Imobiliária - início"
        >
          <img className="lux-logo" src={logo} alt="Black Dragons" />
          <span className="lux-brand-divider" />
          <span className="lux-brand-caption">
            <strong>BLACK DRAGONS</strong>
            <small>IMOBILIÁRIA</small>
          </span>
        </a>

        <button
          className={`lux-menu-button ${menuAberto ? "open" : ""}`}
          type="button"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          aria-controls="lux-navigation"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`lux-navigation ${menuAberto ? "visible" : ""}`}
          id="lux-navigation"
          aria-label="Navegação principal"
        >
          <a href="#inicio" onClick={secao("inicio")}>Início</a>
          <a href="#catalogo" onClick={secao("catalogo")}>Imóveis</a>
          <a href="#sobre" onClick={secao("sobre")}>Sobre nós</a>

          <button type="button" className="lux-nav-btn" onClick={ir("favoritos")}>
            ♥ Favoritos
            {usuario && favoritos.length > 0 && (
              <em className="lux-nav-count">{favoritos.length}</em>
            )}
          </button>

          {usuario ? (
            <span className="lux-user">
              <span className="lux-user-name">Olá, {usuario.nome.split(" ")[0]}</span>
              <button
                type="button"
                className="lux-nav-btn"
                onClick={() => {
                  sair();
                  ir("home")();
                }}
              >
                Sair
              </button>
            </span>
          ) : (
            <button type="button" className="lux-nav-btn" onClick={ir("login")}>
              Entrar
            </button>
          )}

          <a className="lux-cta" href="#contato" onClick={secao("contato")}>
            <span>Fale com um especialista</span>
            <span className="lux-cta-icon" aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>

      <div className="lux-bottom-border" />
    </header>
  );
}
