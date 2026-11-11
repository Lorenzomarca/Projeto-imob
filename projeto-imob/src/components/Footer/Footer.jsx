import "./Footer.css";

const MAPS_URL = "https://maps.app.goo.gl/ykMt1Fdk5JdvcVad7";

function Footer() {
  return (
    <footer className="lux-footer" id="contato">
      <div className="lux-footer-glow" />

      <div className="lux-footer-inner">
        {/* MARCA */}
        <div className="footer-brand">
          <a href="#inicio" className="footer-brand-name">
            BLACK DRAGONS <span>IMOB</span>
          </a>

          <div className="footer-brand-line" />

          <p className="footer-description">
            Mais do que encontrar um imóvel,
            <br />
            ajudamos você a encontrar seu lugar.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/tech_duo.ml?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
              aria-label="Instagram da Black Dragons IMOB"
              title="Instagram"
            >
              {/* Ícone Instagram em SVG */}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <circle cx="17.5" cy="6.8" r="1" fill="currentColor" />
              </svg>
            </a>

            <a
              href="https://github.com/Dual-Coderss"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
              aria-label="GitHub"
              title="GitHub"
            >
              {/* Ícone GitHub em SVG */}
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.12c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.18c0 .3.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>
          </div>

          <span className="footer-social-caption">
            Acompanhe nossas novidades da TECH DUO nas redes sociais. Para mais projetos, acesse nosso GitHub.
          </span>
        </div>

        {/* NAVEGAÇÃO */}
        <nav className="footer-column" aria-label="Navegação do rodapé">
          <h3>Navegação</h3>
          <a href="#inicio">Início</a>
          <a href="#lancamentos">Lançamentos</a>
          <a href="#destaques">Imóveis em destaque</a>
          <a href="#sobre">Sobre nós</a>
          <a href="#contato">Contato</a>
        </nav>

        {/* LOCALIZAÇÃO */}
        <div className="footer-location">
          <div className="footer-location-heading">
            <div>
              <span className="footer-eyebrow">ONDE ESTAMOS</span>
              <h3>Visite nossa região</h3>
            </div>

            <span className="footer-location-pin" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </span>
          </div>

          <p className="footer-address">
            Região do Floripa Shopping
            <br />
            Saco Grande, Florianópolis — SC
          </p>

          {/* Mapa incorporado */}
          <div className="footer-map">
            <iframe
              title="Mapa da região da Black Dragons IMOB"
              src="https://maps.google.com/maps?q=Floripa%20Shopping%2C%20Florian%C3%B3polis%2C%20SC&t=&z=14&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            <a
              className="footer-map-open"
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span>Como chegar</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* BASE DO FOOTER */}
      <div className="lux-footer-bottom">
        <p>
          © {new Date().getFullYear()} Tech Duo - Antonio Marcos Marques,
          Parceiro.
          <span> Todos os direitos reservados.</span>
        </p>

        <a href="#inicio" className="footer-back-top">
          VOLTAR AO TOPO <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
