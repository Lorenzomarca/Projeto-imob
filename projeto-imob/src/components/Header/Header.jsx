
import "./Header.css";
import logo from "../../assets/images/Emblema Black Dragons em Fundo Transparente.png";
import { useState } from "react";

function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  const fecharMenu = () => setMenuAberto(false);

  return (
    <header className="lux-header">
      <div className="lux-header-inner">

        <a
          href="#inicio"
          className="lux-brand"
          aria-label="Black Dragons Imobiliária - Início"
          onClick={fecharMenu}
        >
          <img
            src={logo}
            alt="Black Dragons"
            className="lux-logo"
          />

          <span className="lux-brand-divider" />

          <span className="lux-brand-caption">
            <strong>BLACK DRAGONS</strong>
            <small>IMOBILIÁRIA</small>
          </span>
        </a>

        <button
          type="button"
          className={`lux-menu-button ${
            menuAberto ? "open" : ""
          }`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          aria-controls="lux-navigation"
        >
          <span />
          <span />
        </button>

        <nav
          id="lux-navigation"
          className={`lux-navigation ${
            menuAberto ? "visible" : ""
          }`}
        >
          <a href="#inicio" onClick={fecharMenu}>
            Início
          </a>

          <a href="#catalogo" onClick={fecharMenu}>
            Imóveis
          </a>

          <a href="#sobre" onClick={fecharMenu}>
            Sobre nós
          </a>

          <a href="#contato" onClick={fecharMenu}>
            Contato
          </a>

          <a
            href="#catalogo"
            className="lux-cta"
            onClick={fecharMenu}
          >
            <span className="lux-cta-icon">↗</span>
            <span>Explorar imóveis</span>
          </a>
        </nav>

      </div>

      <div className="lux-bottom-border" />
    </header>
  );
}

export default Header;
