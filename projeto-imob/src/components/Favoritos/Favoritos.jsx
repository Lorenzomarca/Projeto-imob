
import { useEffect, useState } from "react";

import "../Login/Login.css";
import "./Favoritos.css";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

import { formatarPreco } from "../Main/Main";

export default function Favoritos({
  onSelecionarImovel,
  onLogin,
  onVoltar,
}) {
  const { usuario, favoritos, alternarFavorito } = useAuth();

  const [imoveisFavoritos, setImoveisFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const nomeUsuario =
    usuario?.nome?.trim()?.split(/\s+/)[0] || "Cliente";

  const idsFavoritos = Array.isArray(favoritos)
    ? favoritos.map((id) => String(id))
    : [];

  useEffect(() => {
    let ativo = true;

    async function carregarFavoritos() {
      if (!usuario || idsFavoritos.length === 0) {
        setImoveisFavoritos([]);
        setErro("");
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        // Busca os imóveis publicados diretamente no Supabase.
        const { data, error: erroSupabase } = await supabase
          .from("imoveis")
          .select(`
            id,
            nome,
            descricao,
            tipo,
            finalidade,
            preco,
            cidade,
            bairro,
            endereco,
            quartos,
            banheiros,
            vagas,
            area,
            imagem_url,
            publicado
          `)
          .eq("publicado", true);

        if (erroSupabase) {
          throw erroSupabase;
        }

        const todosImoveis = data || [];

        const encontrados = todosImoveis
          .filter((imovel) =>
            idsFavoritos.includes(String(imovel.id))
          )
          .map((imovel) => ({
            ...imovel,
            imagem: imovel.imagem_url,
          }));

        if (ativo) {
          setImoveisFavoritos(encontrados);
        }
      } catch (erroConsulta) {
        console.error(
          "Erro ao carregar imóveis favoritos:",
          erroConsulta
        );

        if (ativo) {
          setErro(
            "Não foi possível carregar seus favoritos. Verifique a consulta e as permissões do Supabase."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarFavoritos();

    return () => {
      ativo = false;
    };
  }, [usuario, favoritos]);

  if (!usuario) {
    return (
      <main className="bd-page">
        <div className="bd-card fav-empty">
          <span className="bd-eyebrow">SEUS FAVORITOS</span>

          <h1>Entre para ver seus favoritos</h1>

          <p>
            Faça login para salvar e acompanhar os imóveis
            que você mais gostou.
          </p>

          <button
            type="button"
            className="bd-btn"
            onClick={onLogin}
          >
            Entrar ou cadastrar <span>↗</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bd-page">
      <div className="fav-container">
        <span className="bd-eyebrow">SEUS FAVORITOS</span>

        <h1 className="fav-title">
          Olá, {nomeUsuario}. Seus imóveis salvos.
        </h1>

        {carregando && (
          <div className="bd-card fav-empty">
            <p>Carregando seus imóveis favoritos...</p>
          </div>
        )}

        {!carregando && erro && (
          <div className="bd-card fav-empty">
            <h2>Não foi possível carregar</h2>
            <p>{erro}</p>
          </div>
        )}

        {!carregando && !erro && imoveisFavoritos.length === 0 && (
          <div className="bd-card fav-empty">
            <h2>Nenhum favorito encontrado</h2>

            <p>
              Salve um imóvel pelo coração para encontrá-lo aqui.
            </p>

            <button
              type="button"
              className="bd-btn"
              onClick={onVoltar}
            >
              Ver imóveis <span>↗</span>
            </button>
          </div>
        )}

        {!carregando && !erro && imoveisFavoritos.length > 0 && (
          <div className="fav-grid">
            {imoveisFavoritos.map((imovel) => (
              <article
                className="bd-card fav-card"
                key={imovel.id}
              >
                <button
                  type="button"
                  className="fav-photo"
                  onClick={() => onSelecionarImovel?.(imovel)}
                  aria-label={`Ver ${imovel.nome}`}
                >
                  {imovel.imagem && (
                    <img
                      src={imovel.imagem}
                      alt={imovel.nome}
                      loading="lazy"
                    />
                  )}
                </button>

                <div className="fav-info">
                  <span className="fav-type">
                    {imovel.tipo} · BD-{String(imovel.id).slice(0, 8)}
                  </span>

                  <h3>{imovel.nome}</h3>

                  <p>
                    ⌖ {imovel.cidade || "Localização não informada"}
                    {imovel.bairro ? `, ${imovel.bairro}` : ""} 
                  </p>

                  <div className="fav-meta">
                    <span>⌂ {imovel.quartos ?? 0} quartos</span>
                    <span>↔ {imovel.area ?? 0} m²</span>
                    <span>▤ {imovel.vagas ?? 0} vagas</span>
                  </div>

                  <strong>{formatarPreco(imovel.preco)}</strong>

                  <div className="fav-actions">
                    <button
                      type="button"
                      className="bd-btn"
                      onClick={() => onSelecionarImovel?.(imovel)}
                    >
                      Ver detalhes <span>↗</span>
                    </button>

                    <button
                      type="button"
                      className="fav-remove"
                      onClick={() => alternarFavorito(imovel.id)}
                    >
                      ♥ Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
