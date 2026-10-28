
import { useEffect, useRef, useState } from "react";
import "./Header.css";
import logo from "../../assets/images/Emblema Black Dragons em Fundo Transparente.png";
import { useAuth } from "../../context/AuthContext";

export default function Header({ onNavegar, onSecao }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);

  const perfilRef = useRef(null);

  const { usuario, favoritos = [], sair } = useAuth();

  const primeiroNome =
    usuario?.nome?.trim().split(/\s+/)[0] || "Cliente";

  const fecharMenu = () => setMenuAberto(false);

  const fecharPerfil = () => setPerfilAberto(false);

  const secao = (id) => (e) => {
    e.preventDefault();
    fecharMenu();
    fecharPerfil();
    onSecao?.(id);
  };

  const ir = (tela) => () => {
    fecharMenu();
    fecharPerfil();
    onNavegar?.(tela);
  };

  useEffect(() => {
    function lidarComCliqueFora(evento) {
      if (
        perfilRef.current &&
        !perfilRef.current.contains(evento.target)
      ) {
        setPerfilAberto(false);
      }
    }

    function lidarComTecla(evento) {
      if (evento.key === "Escape") {
        setPerfilAberto(false);
        setMenuAberto(false);
      }
    }

    document.addEventListener("mousedown", lidarComCliqueFora);
    document.addEventListener("touchstart", lidarComCliqueFora);
    document.addEventListener("keydown", lidarComTecla);

    return () => {
      document.removeEventListener("mousedown", lidarComCliqueFora);
      document.removeEventListener("touchstart", lidarComCliqueFora);
      document.removeEventListener("keydown", lidarComTecla);
    };
  }, []);

  async function sairDaConta() {
    try {
      const resultado = await sair();

      if (resultado?.error) {
        console.error("Erro ao sair da conta:", resultado.error);
        return;
      }

      fecharPerfil();
      fecharMenu();
      onNavegar?.("home");
    } catch (erro) {
      console.error("Erro ao sair da conta:", erro);
    }
  }

  return (
    <header className="lux-header">
      <div className="lux-header-inner">
        <a
          className="lux-brand"
          href="#inicio"
          onClick={secao("inicio")}
          aria-label="Black Dragons Imobiliária - início"
        >
          <img
            className="lux-logo"
            src={logo}
            alt="Black Dragons"
          />

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
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`lux-navigation ${menuAberto ? "visible" : ""}`}
          id="lux-navigation"
          aria-label="Navegação principal"
        >
          <a href="#inicio" onClick={secao("inicio")}>
            Início
          </a>

          <a href="#catalogo" onClick={secao("catalogo")}>
            Imóveis
          </a>

          <a href="#sobre" onClick={secao("sobre")}>
            Sobre nós
          </a>

          <button
            type="button"
            className="lux-nav-btn"
            onClick={ir("favoritos")}
          >
            <span aria-hidden="true">♥</span>
            Favoritos

            {usuario && favoritos.length > 0 && (
              <em className="lux-nav-count">{favoritos.length}</em>
            )}
          </button>

          {/* ÍCONE DE PERFIL + MENU SUSPENSO */}
          <div className="lux-profile-wrapper" ref={perfilRef}>
            <button
              type="button"
              className={`lux-profile-trigger ${
                perfilAberto ? "active" : ""
              }`}
              onClick={() => setPerfilAberto((aberto) => !aberto)}
              aria-label="Abrir menu da conta"
              aria-expanded={perfilAberto}
              aria-haspopup="menu"
            >
              <svg
                className="lux-profile-svg"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M5 20c.6-3.5 3.2-5.5 7-5.5s6.4 2 7 5.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              {usuario && <span className="lux-profile-status" />}

              <span className="lux-profile-chevron" aria-hidden="true">
                ▾
              </span>
            </button>

            {perfilAberto && (
              <div className="lux-profile-dropdown" role="menu">
                {usuario ? (
                  <>
                    <div className="lux-profile-heading">
                      <span className="lux-profile-avatar">
                        {primeiroNome.charAt(0).toUpperCase()}
                      </span>

                      <div className="lux-profile-identity">
                        <strong>Olá, {primeiroNome}</strong>
                        <span>Bem-vindo à Black Dragons</span>
                      </div>
                    </div>

                    <div className="lux-profile-divider" />

                    <button
                      type="button"
                      role="menuitem"
                      className="lux-profile-option"
                      onClick={ir("perfil")}
                    >
                      <span aria-hidden="true">♙</span>
                      Meu perfil
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      className="lux-profile-option"
                      onClick={ir("favoritos")}
                    >
                      <span aria-hidden="true">♥</span>
                      Meus favoritos

                      {favoritos.length > 0 && (
                        <em className="lux-nav-count">
                          {favoritos.length}
                        </em>
                      )}
                    </button>

                    <div className="lux-profile-divider" />

                    <button
                      type="button"
                      role="menuitem"
                      className="lux-profile-option lux-profile-logout"
                      onClick={sairDaConta}
                    >
                      <span aria-hidden="true">↪</span>
                      Sair da conta
                    </button>
                  </>
                ) : (
                  <>
                    <div className="lux-profile-heading">
                      <span className="lux-profile-avatar">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            cx="12"
                            cy="8"
                            r="3.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M5 20c.6-3.5 3.2-5.5 7-5.5s6.4 2 7 5.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>

                      <div className="lux-profile-identity">
                        <strong>Sua conta</strong>
                        <span>Acesse sua área exclusiva</span>
                      </div>
                    </div>

                    <div className="lux-profile-divider" />

                    <button
                      type="button"
                      role="menuitem"
                      className="lux-profile-option"
                      onClick={ir("login")}
                    >
                      <span aria-hidden="true">↪</span>
                      Entrar na conta
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      className="lux-profile-register"
                      onClick={ir("login")}
                    >
                      Criar conta
                      <span aria-hidden="true">↗</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <a
            className="lux-cta"
            href="#contato"
            onClick={secao("contato")}
          >
            <span>Fale com um especialista</span>
            <span className="lux-cta-icon" aria-hidden="true">
              ↗
            </span>
          </a>
        </nav>
      </div>

      <div className="lux-bottom-border" />
    </header>
  );
}
