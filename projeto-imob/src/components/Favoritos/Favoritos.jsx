import "../Login/Login.css"; // design compartilhado
import "./Favoritos.css";
import { useAuth } from "../../context/AuthContext";
import { imoveis, formatarPreco } from "../Main/Main";

export default function Favoritos({ onSelecionarImovel, onLogin, onVoltar }) {
  const { usuario, favoritos, alternarFavorito } = useAuth();

  if (!usuario) {
    return (
      <main className="bd-page">
        <div className="bd-card fav-empty">
          <span className="bd-eyebrow">SEUS FAVORITOS</span>
          <h1>Entre para ver seus favoritos</h1>
          <p>Faça login para salvar e acompanhar os imóveis que você mais gostou.</p>
          <button type="button" className="bd-btn" onClick={onLogin}>Entrar ou cadastrar <span>↗</span></button>
        </div>
      </main>
    );
  }

  const lista = imoveis.filter((i) => favoritos.includes(i.id));

  return (
    <main className="bd-page">
      <div className="fav-container">
        <span className="bd-eyebrow">SEUS FAVORITOS</span>
        <h1 className="fav-title">Olá, {usuario.nome.split(" ")[0]}. Seus imóveis salvos.</h1>

        {lista.length === 0 ? (
          <div className="bd-card fav-empty">
            <h1>Nenhum favorito ainda</h1>
            <p>Toque no ♡ de um imóvel para salvá-lo aqui.</p>
            <button type="button" className="bd-btn" onClick={onVoltar}>Ver imóveis <span>↗</span></button>
          </div>
        ) : (
          <div className="fav-grid">
            {lista.map((imovel) => (
              <article className="bd-card fav-card" key={imovel.id}>
                <button type="button" className="fav-photo" onClick={() => onSelecionarImovel(imovel)} aria-label={`Ver ${imovel.nome}`}>
                  <img src={imovel.imagem} alt={imovel.nome} loading="lazy" />
                </button>
                <div className="fav-info">
                  <span className="fav-type">{imovel.tipo} · BD-{imovel.id}00</span>
                  <h3>{imovel.nome}</h3>
                  <p>⌖ {imovel.cidade}, SC</p>
                  <div className="fav-meta">
                    <span>⌂ {imovel.quartos} quartos</span>
                    <span>↔ {imovel.area} m²</span>
                    <span>▤ {imovel.vagas} vagas</span>
                  </div>
                  <strong>{formatarPreco(imovel.preco)}</strong>
                  <div className="fav-actions">
                    <button type="button" className="bd-btn" onClick={() => onSelecionarImovel(imovel)}>Ver detalhes <span>↗</span></button>
                    <button type="button" className="fav-remove" onClick={() => alternarFavorito(imovel.id)}>♥ Remover</button>
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
