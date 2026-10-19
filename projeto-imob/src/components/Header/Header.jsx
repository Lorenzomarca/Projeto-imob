
import "./Header.css";
import logo from "../../assets/images/Emblema Black Dragons em Fundo Transparente.png";
import { useState } from "react";

function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  const fecharMenu = () => setMenuAberto(false);

  const links = [
    { texto: "Início", href: "#inicio" },
    { texto: "Imóveis", href: "#catalogo" },
    { texto: "A marca", href: "#sobre" },
    { texto: "Contato", href: "#contato" },
  ];

  return (
    <header className="bd-header">
      <div className="bd-header-glow" />

      <div className="bd-header-container">
        <a
          className="bd-brand"
          href="#inicio"
          onClick={fecharMenu}
          aria-label="Black Dragons Imobiliária - Início"
        >
          <div className="bd-logo-frame">
            <img
              className="bd-logo"
              src={logo}
              alt="Black Dragons"
            />
          </div>

          <div className="bd-brand-info">
            <span className="bd-brand-name">
              BLACK DRAGONS
            </span>

            <span className="bd-brand-subtitle">
              <i />
              REAL ESTATE
              <i />
            </span>
          </div>
        </a>

        <button
          type="button"
          className={`bd-menu-toggle ${
            menuAberto ? "is-active" : ""
          }`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          aria-controls="bd-navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="bd-navigation"
          className={`bd-navigation ${
            menuAberto ? "is-open" : ""
          }`}
        >
          <div className="bd-nav-links">
            {links.map((link, index) => (
              <a
                key={link.href}
                className={`bd-nav-link ${
                  index === 0 ? "bd-nav-home" : ""
                }`}
                href={link.href}
                onClick={fecharMenu}
              >
                <span className="bd-nav-index">
                  0{index + 1}
                </span>
                {link.texto}
              </a>
            ))}
          </div>

          <a
            href="#catalogo"
            className="bd-cta"
            onClick={fecharMenu}
          >
            <span className="bd-cta-icon">↗</span>
            <span>Explorar imóveis</span>
          </a>
        </nav>
      </div>

      <div className="bd-header-bottom-line" />
    </header>
  );
}

export default Header;
