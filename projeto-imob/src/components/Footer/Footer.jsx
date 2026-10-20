
import "./Footer.css";
import localizacao from "../../assets/images/imob-blackdragons.jpg";

const MAPS_URL = "https://maps.app.goo.gl/ykMt1Fdk5JdvcVad7";

function Footer() {
  return (
    <footer className="lux-footer" id="contato">
      <div className="lux-footer-glow" />

      <div className="lux-footer-inner">
        {/* IDENTIDADE DA MARCA */}
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

          {/* REDES SOCIAIS */}
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/blackdragons.imob/"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
              aria-label="Instagram da Black Dragons IMOB"
              title="Instagram"
            >
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
              href="https://wa.me/5548999999999"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
              aria-label="WhatsApp demonstrativo"
              title="WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 8.5c.4 2.5 2 4.1 4.5 4.8l1.2-1.2 2 1c-.2 1.4-1.2 2.1-2.4 2-3.8-.6-6.5-3.3-7-6.7-.1-1.2.7-2.1 2-2.3l1 2L9 8.5Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>

          <span className="footer-social-caption">
            Acompanhe nossas novidades
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

          {/* IMAGEM DA REGIÃO */}
          <div className="footer-map">
            <img
              src={localizacao}
              alt="Edifício na região litorânea, representando a localização da Black Dragons IMOB"
              className="footer-location-image"
              loading="lazy"
            />

            <div className="footer-image-overlay" />

            <a
              className="footer-map-open"
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span>Ver localização</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <span className="footer-map-caption">
            Florianópolis e região
          </span>
        </div>
      </div>

      {/* RODAPÉ INFERIOR */}
      <div className="lux-footer-bottom">
        <p>
          © {new Date().getFullYear()} Black Dragons IMOB.
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
