import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import "./Main.css";

import imagemEdificio from "../../assets/images/foot-fundologo.jpg";

import aurora from "../../assets/images/aurora.jpg";
import dvert from "../../assets/images/dvert.jpg";
import sky from "../../assets/images/skyline.jpg";
import ocn from "../../assets/images/ocean.jpg";
import saco from "../../assets/images/residencial_saco_grande.jpg";
import bosque from "../../assets/images/casa-bosque.jpg";
import agro from "../../assets/images/saco-grande.jpg";
import trindade from "../../assets/images/casa_modelo_06.jpg";
import abraa from "../../assets/images/abraao.jpg";
import ifn from "../../assets/images/infinity.jpg";
import resed from "../../assets/images/marina.jpg";
import atlantida from "../../assets/images/jardim-atlantico.jpg";

// ======================================================
// LANÇAMENTOS DEMONSTRATIVOS
// Mantidos localmente nesta primeira integração.
// ======================================================

export const lancamentos = [
  {
    id: 1,
    nome: "Aurora Residence",
    cidade: "Balneário Camboriú",
    preco: 1450000,
    quartos: 3,
    area: 140,
    imagem: aurora,
    selo: "Lançamento",
  },
  {
    id: 2,
    nome: "D'Vert Residence",
    cidade: "Itajaí",
    preco: 890000,
    quartos: 3,
    area: 125,
    imagem: dvert,
    selo: "Em construção",
  },
  {
    id: 3,
    nome: "Skyline Tower",
    cidade: "Itapema",
    preco: 1320000,
    quartos: 3,
    area: 160,
    imagem: sky,
    selo: "Exclusivo",
  },
  {
    id: 4,
    nome: "Ocean View",
    cidade: "Bombinhas",
    preco: 2190000,
    quartos: 4,
    area: 190,
    imagem: ocn,
    selo: "Vista para o mar",
  },
];

// ======================================================
// IMÓVEIS DEMONSTRATIVOS
// Mantidos como referência para futuras imagens locais.
// O catálogo principal utiliza os dados do Supabase.
// ======================================================

export const imoveis = [
  {
    id: 5,
    nome: "Casa Saco Grande",
    cidade: "Florianópolis",
    tipo: "Casa",
    quartos: 3,
    area: 140,
    vagas: 2,
    preco: 1450000,
    imagem: saco,
  },
  {
    id: 6,
    nome: "Casa Bosque Premium",
    cidade: "Florianópolis",
    tipo: "Casa",
    quartos: 4,
    area: 280,
    vagas: 3,
    preco: 2490000,
    imagem: bosque,
  },
  {
    id: 7,
    nome: "Edifício Agronômica",
    cidade: "Florianópolis",
    tipo: "Cobertura",
    quartos: 3,
    area: 115,
    vagas: 2,
    preco: 1790000,
    imagem: agro,
  },
  {
    id: 8,
    nome: "Villa Trindade",
    cidade: "Florianópolis",
    tipo: "Casa",
    quartos: 6,
    area: 410,
    vagas: 4,
    preco: 2499000,
    imagem: trindade,
  },
  {
    id: 9,
    nome: "Apartamento Abraão",
    cidade: "Florianópolis",
    tipo: "Apartamento",
    quartos: 2,
    area: 67,
    vagas: 1,
    preco: 770000,
    imagem: abraa,
  },
  {
    id: 10,
    nome: "Cobertura Infinity",
    cidade: "Balneário Camboriú",
    tipo: "Cobertura",
    quartos: 4,
    area: 260,
    vagas: 3,
    preco: 3750000,
    imagem: ifn,
  },
  {
    id: 11,
    nome: "Marina Residence",
    cidade: "Itajaí",
    tipo: "Apartamento",
    quartos: 2,
    area: 92,
    vagas: 2,
    preco: 980000,
    imagem: resed,
  },
  {
    id: 12,
    nome: "Residencial Jardim Atlântico",
    cidade: "Florianópolis",
    tipo: "Apartamento",
    quartos: 3,
    area: 180,
    vagas: 2,
    preco: 1190000,
    imagem: atlantida,
  },
  {
    id: 13,
    nome: "Aurora Residence",
    cidade: "Balneário Camboriú",
    tipo: "Apartamento",
    quartos: 3,
    area: 140,
    vagas: 2,
    preco: 1450000,
    imagem: aurora,
    descricao:
      "Apartamento contemporâneo em empreendimento de alto padrão, com ambientes integrados e acabamento sofisticado.",
  },
  {
    id: 14,
    nome: "D'Vert Residence",
    cidade: "Itajaí",
    tipo: "Apartamento",
    quartos: 3,
    area: 125,
    vagas: 2,
    preco: 890000,
    imagem: dvert,
    descricao:
      "Projeto moderno com planta funcional, pensado para quem busca praticidade e conforto.",
  },
  {
    id: 15,
    nome: "Skyline Tower",
    cidade: "Itapema",
    tipo: "Apartamento",
    quartos: 3,
    area: 160,
    vagas: 2,
    preco: 1320000,
    imagem: sky,
    descricao:
      "Residência com linhas contemporâneas, ambientes generosos e localização valorizada.",
  },
  {
    id: 16,
    nome: "Ocean View",
    cidade: "Bombinhas",
    tipo: "Apartamento",
    quartos: 4,
    area: 190,
    vagas: 2,
    preco: 2190000,
    imagem: ocn,
    descricao:
      "Imóvel amplo para aproveitar o litoral, com espaços pensados para receber família e amigos.",
  },
];

// ======================================================
// FORMATAÇÃO DE PREÇO
// ======================================================

export const formatarPreco = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

// ======================================================
// TÍTULO DAS SEÇÕES
// ======================================================

function TituloSecao({ titulo, subtitulo, onVerMais }) {
  return (
    <div className="main-section-heading">
      <div>
        <span className="main-eyebrow">BLACK DRAGONS IMOB</span>
        <h2>{titulo}</h2>
        <p>{subtitulo}</p>
      </div>

      {onVerMais && (
        <button
          type="button"
          className="main-view-more"
          onClick={onVerMais}
        >
          Ver mais <span>↗</span>
        </button>
      )}
    </div>
  );
}

// ======================================================
// CARD DE LANÇAMENTO
// ======================================================

function CardLancamento({ imovel, onVerImovel }) {
  return (
    <article className="launch-card">
      <button
        type="button"
        className="launch-image"
        onClick={() => onVerImovel(imovel)}
        aria-label={`Ver detalhes de ${imovel.nome}`}
      >
        <img
          src={imovel.imagem}
          alt={imovel.nome}
          loading="lazy"
        />

        <span className="launch-badge">{imovel.selo}</span>

        <div className="launch-image-overlay" />

        <div className="launch-image-text">
          <h3>{imovel.nome}</h3>
          <p>{imovel.cidade} · SC</p>
        </div>
      </button>

      <div className="launch-info">
        <span>{imovel.quartos} quartos</span>
        <span>{imovel.area} m²</span>
        <strong>{formatarPreco(imovel.preco)}</strong>
      </div>
    </article>
  );
}

// ======================================================
// CARD DE IMÓVEL
// ======================================================

export function CardImovel({
  imovel,
  favorito,
  alternarFavorito,
  onVerImovel,
}) {
  return (
    <article className="property-card">
      <div className="property-image">
        <button
          type="button"
          className="property-photo-button"
          onClick={() => onVerImovel(imovel)}
          aria-label={`Ver detalhes de ${imovel.nome}`}
        >
          <img
            src={imovel.imagem || imagemEdificio}
            alt={imovel.nome}
            loading="lazy"
          />
        </button>

        <span className="property-status">
          {imovel.finalidade || "Disponível"}
        </span>

        <button
          type="button"
          className={`property-favorite ${
            favorito ? "is-favorite" : ""
          }`}
          onClick={() => alternarFavorito(imovel.id)}
          aria-label={
            favorito
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
          aria-pressed={favorito}
        >
          {favorito ? "♥" : "♡"}
        </button>
      </div>

      <div className="property-info">
        <div className="property-type-row">
          <span>{imovel.tipo || "Imóvel"}</span>
          <span className="property-code">
            BD-{String(imovel.id).slice(0, 8).toUpperCase()}
          </span>
        </div>

        <h3>{imovel.nome}</h3>

        <p className="property-location">
          ⌖ {imovel.cidade || "Localização não informada"}
          {imovel.bairro ? `, ${imovel.bairro}` : ""}
          {imovel.cidade ? ", SC" : ""}
        </p>

        <div className="property-features">
          <span>⌂ {imovel.quartos ?? 0} quartos</span>
          <span>↔ {imovel.area ?? 0} m²</span>
          <span>▤ {imovel.vagas ?? 0} vagas</span>
        </div>

        <div className="property-price">
          <span>Valor do imóvel</span>
          <strong>{formatarPreco(imovel.preco)}</strong>
        </div>

        <button
          type="button"
          className="property-details-button"
          onClick={() => onVerImovel(imovel)}
        >
          Ver detalhes <span>↗</span>
        </button>
      </div>
    </article>
  );
}

// ======================================================
// COMPONENTE PRINCIPAL
// ======================================================

function Main({ onSelecionarImovel, onLogin }) {
  const { favoritos, alternarFavorito: alternar } = useAuth();

  const [cidade, setCidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [busca, setBusca] = useState("");
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // Dados reais do Supabase
  const [imoveisBanco, setImoveisBanco] = useState([]);
  const [carregandoImoveis, setCarregandoImoveis] = useState(true);
  const [erroImoveis, setErroImoveis] = useState("");

  // ====================================================
  // BUSCAR IMÓVEIS PUBLICADOS NO SUPABASE
  // ====================================================

  useEffect(() => {
    let ativo = true;

    async function buscarImoveis() {
      setCarregandoImoveis(true);
      setErroImoveis("");

      try {
        const { data, error } = await supabase
          .from("imoveis")
          .select(
            "id, nome, descricao, tipo, finalidade, preco, cidade, bairro, endereco, quartos, banheiros, vagas, area, imagem_url, publicado, criado_por, criado_em, atualizado_em"
          )
          .eq("publicado", true)
          .order("criado_em", { ascending: false });

        if (!ativo) return;

        if (error) {
          console.error("Erro ao buscar imóveis:", error);
          setErroImoveis(
            "Não foi possível carregar os imóveis. Verifique sua conexão e as permissões do Supabase."
          );
          setImoveisBanco([]);
          return;
        }

        const dadosFormatados = (data || []).map((item) => ({
          ...item,
          imagem: item.imagem_url || imagemEdificio,
          cidade: item.cidade || "",
          tipo: item.tipo || "Imóvel",
          quartos: item.quartos ?? 0,
          banheiros: item.banheiros ?? 0,
          vagas: item.vagas ?? 0,
          area: Number(item.area ?? 0),
          preco: Number(item.preco ?? 0),
        }));

        setImoveisBanco(dadosFormatados);
      } catch (error) {
        console.error("Erro inesperado ao buscar imóveis:", error);

        if (ativo) {
          setErroImoveis(
            "Ocorreu um erro inesperado ao carregar os imóveis."
          );
          setImoveisBanco([]);
        }
      } finally {
        if (ativo) {
          setCarregandoImoveis(false);
        }
      }
    }

    buscarImoveis();

    return () => {
      ativo = false;
    };
  }, []);

  // ====================================================
  // NAVEGAÇÃO ENTRE SEÇÕES
  // ====================================================

  const irPara = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ====================================================
  // FAVORITOS
  // ====================================================

  const alternarFavorito = (id) => {
    if (!alternar(id)) {
      onLogin?.();
    }
  };

  // ====================================================
  // ABRIR DETALHES DO IMÓVEL
  // ====================================================

  const verImovel = (imovel) => {
    if (onSelecionarImovel) {
      onSelecionarImovel(imovel);
    } else {
      irPara("contato");
    }
  };

  // ====================================================
  // FILTROS DO CATÁLOGO
  // ====================================================

  const imoveisFiltrados = imoveisBanco.filter((imovel) => {
    const combinaCidade =
      !cidade || imovel.cidade === cidade;

    const combinaTipo =
      !tipo || imovel.tipo === tipo;

    const texto = [
      imovel.nome,
      imovel.cidade,
      imovel.bairro,
      imovel.tipo,
      imovel.finalidade,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const combinaBusca =
      !busca || texto.includes(busca.trim().toLowerCase());

    return combinaCidade && combinaTipo && combinaBusca;
  });

  const temFiltro = Boolean(cidade || tipo || busca);

  const imoveisVisiveis =
    mostrarTodos || temFiltro
      ? imoveisFiltrados
      : imoveisFiltrados.slice(0, 4);

  const limparFiltros = () => {
    setCidade("");
    setTipo("");
    setBusca("");
    setMostrarTodos(false);
  };

  // ====================================================
  // RENDERIZAÇÃO
  // ====================================================

  return (
    <main className="bd-main">
      {/* HERO */}
      <section className="main-hero" id="inicio">
        <div className="main-hero-layout">
          <div className="main-hero-content">
            <span className="main-hero-eyebrow">
              <span />
              IMÓVEIS SELECIONADOS EM SANTA CATARINA
            </span>

            <h1>
              O lugar certo.
              <br />
              <em>A sua próxima história.</em>
            </h1>

            <p>
              Imóveis escolhidos para quem valoriza conforto,
              localização e novas possibilidades.
            </p>

            <button
              type="button"
              className="main-hero-button"
              onClick={() => irPara("catalogo")}
            >
              Encontrar meu imóvel <span>↗</span>
            </button>
          </div>

          <div className="main-hero-image">
            <img
              src={imagemEdificio}
              alt="Edifício em destaque"
            />

            <div className="main-hero-image-shade" />

            <span className="main-hero-image-label">
              BLACK DRAGONS · IMÓVEIS SELECIONADOS
            </span>
          </div>
        </div>
      </section>

      {/* BUSCA */}
      <section
        className="main-search-wrap"
        aria-label="Buscar imóveis"
      >
        <form
          className="main-search"
          onSubmit={(event) => {
            event.preventDefault();
            setMostrarTodos(true);
            irPara("catalogo");
          }}
        >
          <label className="main-search-field">
            <span>Localização</span>

            <select
              value={cidade}
              onChange={(event) => setCidade(event.target.value)}
            >
              <option value="">Todas as cidades</option>
              <option value="Florianópolis">Florianópolis</option>
              <option value="Itajaí">Itajaí</option>
              <option value="Balneário Camboriú">
                Balneário Camboriú
              </option>
              <option value="Itapema">Itapema</option>
              <option value="Bombinhas">Bombinhas</option>
            </select>
          </label>

          <label className="main-search-field">
            <span>Tipo de imóvel</span>

            <select
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Cobertura">Cobertura</option>
            </select>
          </label>

          <label className="main-search-field">
            <span>Nome ou região</span>

            <input
              type="search"
              placeholder="Ex.: cobertura, Itajaí..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </label>

          <button
            className="main-search-button"
            type="submit"
          >
            <span>⌕</span> Buscar
          </button>
        </form>
      </section>

      {/* LANÇAMENTOS DEMONSTRATIVOS */}
      <section
        className="main-section main-launches"
        id="lancamentos"
      >
        <TituloSecao
          titulo="Lançamentos"
          subtitulo="Novos empreendimentos para viver ou investir."
          onVerMais={() => irPara("catalogo")}
        />

        <div className="launch-grid">
          {lancamentos.map((imovel) => (
            <CardLancamento
              key={imovel.id}
              imovel={imovel}
              onVerImovel={verImovel}
            />
          ))}
        </div>
      </section>

      {/* DESTAQUES DO BANCO */}
      <section
        className="main-section main-highlights"
        id="destaques"
      >
        <TituloSecao
          titulo="Destaques da semana"
          subtitulo="Imóveis selecionados que merecem a sua atenção."
          onVerMais={() => irPara("catalogo")}
        />

        {carregandoImoveis ? (
          <p role="status">Carregando destaques...</p>
        ) : erroImoveis ? (
          <p role="status">
            Os destaques estão temporariamente indisponíveis.
          </p>
        ) : imoveisBanco.length > 0 ? (
          <div className="property-grid">
            {imoveisBanco.slice(0, 4).map((imovel) => (
              <CardImovel
                key={imovel.id}
                imovel={imovel}
                favorito={favoritos.includes(imovel.id)}
                alternarFavorito={alternarFavorito}
                onVerImovel={verImovel}
              />
            ))}
          </div>
        ) : (
          <p>
            Ainda não há imóveis publicados para exibir nos destaques.
          </p>
        )}
      </section>

      {/* CATÁLOGO DO SUPABASE */}
      <section
        className="main-section main-more-properties"
        id="catalogo"
      >
        <TituloSecao
          titulo="Mais imóveis para você"
          subtitulo="Explore outras opções e encontre o imóvel ideal."
        />

        <div className="more-properties-toolbar">
          <div className="more-properties-count">
            <strong>
              {carregandoImoveis ? "…" : imoveisFiltrados.length}
            </strong>

            <span>
              {imoveisFiltrados.length === 1
                ? " imóvel encontrado"
                : " imóveis encontrados"}
            </span>
          </div>

          <button
            type="button"
            className="clear-filters"
            onClick={limparFiltros}
          >
            Limpar filtros ↺
          </button>
        </div>

        {carregandoImoveis ? (
          <div className="properties-empty" role="status">
            <h3>Carregando imóveis...</h3>
            <p>
              Estamos buscando os imóveis publicados pela nossa equipe.
            </p>
          </div>
        ) : erroImoveis ? (
          <div className="properties-empty" role="alert">
            <h3>Não foi possível carregar os imóveis</h3>
            <p>{erroImoveis}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : imoveisVisiveis.length > 0 ? (
          <>
            <div className="property-grid">
              {imoveisVisiveis.map((imovel) => (
                <CardImovel
                  key={imovel.id}
                  imovel={imovel}
                  favorito={favoritos.includes(imovel.id)}
                  alternarFavorito={alternarFavorito}
                  onVerImovel={verImovel}
                />
              ))}
            </div>

            {!mostrarTodos &&
              !temFiltro &&
              imoveisFiltrados.length > 4 && (
                <div className="more-properties-action">
                  <button
                    type="button"
                    onClick={() => setMostrarTodos(true)}
                  >
                    Ver mais imóveis <span>↓</span>
                  </button>
                </div>
              )}
          </>
        ) : (
          <div className="properties-empty">
            <h3>Nenhum imóvel encontrado</h3>
            <p>
              Tente outra cidade, categoria ou termo de busca.
            </p>

            <button
              type="button"
              onClick={limparFiltros}
            >
              Mostrar todos os imóveis
            </button>
          </div>
        )}
      </section>

      {/* SOBRE A EMPRESA */}
      <section className="main-contact-banner" id="sobre">
        <div>
          <span className="main-eyebrow">QUEM SOMOS</span>

          <h2>
            Seu próximo capítulo.
            <br />
            <em>Começa com o imóvel certo.</em>
          </h2>

          <p>
            Na Black Dragons IMOB, ajudamos você a encontrar imóveis
            alinhados aos seus planos e ao seu estilo de vida.
          </p>

          <a href="#contato">
            Fale com nossa equipe <span>↗</span>
          </a>
        </div>

        <span className="contact-monogram" aria-hidden="true">
          BD
        </span>
      </section>

      {/* CONTATO */}
      <section className="main-contact-section" id="contato">
        <span className="main-eyebrow">ESTAMOS À DISPOSIÇÃO</span>

        <h2>Vamos encontrar seu próximo imóvel?</h2>

        <p>
          Entre em contato com a Black Dragons IMOB e converse com
          nossa equipe.
        </p>

        <a
          className="main-contact-button"
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noreferrer"
        >
          Falar pelo WhatsApp <span>↗</span>
        </a>
      </section>

      {/* RODAPÉ */}
      <footer className="main-bottom-line">
        <span>BLACK DRAGONS IMOBILIÁRIA</span>
        <a href="#inicio">Voltar ao início ↑</a>
      </footer>
    </main>
  );
}

export default Main;