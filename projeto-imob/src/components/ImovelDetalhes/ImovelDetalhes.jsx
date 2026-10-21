
import { useEffect, useState } from "react";
import "./ImovelDetalhes.css";

function formatarPreco(valor) {
  const preco = Number(valor);

  if (!Number.isFinite(preco)) {
    return "Consulte o valor";
  }

  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function ImovelDetalhes({ imovel, onVoltar }) {
  const imagens =
    imovel.imagens?.length > 0
      ? imovel.imagens
      : imovel.imagem
        ? [imovel.imagem]
        : [];

  const [fotoSelecionada, setFotoSelecionada] = useState(0);

  useEffect(() => {
    setFotoSelecionada(0);
  }, [imovel.id]);

  const indiceSeguro =
    imagens.length > 0
      ? Math.min(fotoSelecionada, imagens.length - 1)
      : 0;

  const descricao =
    imovel.descricao ||
    `${imovel.nome} é uma oportunidade para quem busca conforto, praticidade e uma excelente localização em ${imovel.cidade}, Santa Catarina. Entre em contato para saber mais e agendar uma visita.`;

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Tenho interesse no imóvel ${imovel.nome}, em ${imovel.cidade}. Gostaria de mais informações.`
  );

  // Substitua pelo número real da imobiliária, com código do país e DDD.
  const telefoneWhatsApp = "5500000000000";

  return (
    <main className="property-details-page">
      <div className="details-container">
        <button
          type="button"
          className="details-back"
          onClick={onVoltar}
        >
          <span aria-hidden="true">←</span>
          Voltar aos imóveis
        </button>

        <header className="details-heading">
          <div className="details-heading-info">
            <span className="details-eyebrow">
              BLACK DRAGONS IMOB · BD-{imovel.id}00
            </span>

            <h1>{imovel.nome}</h1>

            <p className="details-location">
              <span aria-hidden="true">⌖</span>
              {imovel.cidade}, Santa Catarina
            </p>
          </div>

          <div className="details-price">
            <span>Valor do imóvel</span>
            <strong>{formatarPreco(imovel.preco)}</strong>
          </div>
        </header>

        {/* GALERIA DO IMÓVEL */}
        <section
          className="details-gallery"
          aria-label="Galeria de fotos do imóvel"
        >
          <div className="details-main-photo">
            {imagens.length > 0 ? (
              <img
                key={imagens[indiceSeguro]}
                src={imagens[indiceSeguro]}
                alt={`${imovel.nome} — foto ${indiceSeguro + 1}`}
              />
            ) : (
              <div className="details-no-photo">
                <span aria-hidden="true">▧</span>
                <p>Foto não disponível</p>
              </div>
            )}

            {imagens.length > 1 && (
              <div className="details-photo-counter">
                {indiceSeguro + 1} / {imagens.length}
              </div>
            )}
          </div>

          {imagens.length > 1 && (
            <div
              className="details-thumbnails"
              aria-label="Escolher foto do imóvel"
            >
              {imagens.map((imagem, index) => (
                <button
                  type="button"
                  key={`${imovel.id}-foto-${index}`}
                  className={
                    indiceSeguro === index ? "selected" : ""
                  }
                  onClick={() => setFotoSelecionada(index)}
                  aria-label={`Ver foto ${index + 1} de ${imovel.nome}`}
                  aria-pressed={indiceSeguro === index}
                >
                  <img
                    src={imagem}
                    alt=""
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* INFORMAÇÕES */}
        <div className="details-content">
          <section className="details-information">
            <span className="details-eyebrow">
              SOBRE O IMÓVEL
            </span>

            <h2>Um lugar para chamar de seu.</h2>

            <p className="details-description">
              {descricao}
            </p>

            <h2 className="details-subtitle">
              Características
            </h2>

            <div className="details-features">
              <div>
                <span aria-hidden="true">⌂</span>
                <p>Quartos</p>
                <strong>
                  {imovel.quartos ?? "A consultar"}
                </strong>
              </div>

              <div>
                <span aria-hidden="true">↔</span>
                <p>Área privativa</p>
                <strong>
                  {imovel.area != null
                    ? `${imovel.area} m²`
                    : "A consultar"}
                </strong>
              </div>

              <div>
                <span aria-hidden="true">▤</span>
                <p>Vagas</p>
                <strong>
                  {imovel.vagas ?? "A consultar"}
                </strong>
              </div>

              <div>
                <span aria-hidden="true">⌂</span>
                <p>Tipo</p>
                <strong>
                  {imovel.tipo || "Empreendimento"}
                </strong>
              </div>
            </div>
          </section>

          <aside className="details-contact">
            <span className="details-eyebrow">
              FALE COM A GENTE
            </span>

            <h2>Gostou deste imóvel?</h2>

            <p>
              Entre em contato com nossa equipe para obter mais
              informações ou agendar uma visita.
            </p>

            <a
              className="details-whatsapp"
              href={`https://wa.me/${telefoneWhatsApp}?text=${mensagemWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar pelo WhatsApp
              <span aria-hidden="true">↗</span>
            </a>

            <p className="details-contact-note">
              BLACK DRAGONS IMOB · Excelência em cada detalhe.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default ImovelDetalhes;
