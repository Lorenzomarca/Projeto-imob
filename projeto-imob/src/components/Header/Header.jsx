
import { useState } from "react";
import "./Header.css";
import logo from "../../assets/images/Emblema Black Dragons em Fundo Transparente.png";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <header className="lux-header">
      <div className="lux-header-inner">
        <a
          className="lux-brand"
          href="#inicio"
          onClick={fecharMenu}
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
          <a href="#inicio" onClick={fecharMenu}>Início</a>
          <a href="#catalogo" onClick={fecharMenu}>Imóveis</a>
          <a href="#sobre" onClick={fecharMenu}>Sobre nós</a>

          <a
            className="lux-cta"
            href="#contato"
            onClick={fecharMenu}
          >
            <span>Fale com um especialista</span>
            <span className="lux-cta-icon" aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>

      <div className="lux-bottom-border" />
    </header>
  );
}
