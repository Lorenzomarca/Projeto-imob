
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import "./GestaoImoveis.css";

const FORM_INICIAL = {
  nome: "",
  descricao: "",
  tipo: "Apartamento",
  finalidade: "venda",
  preco: "",
  cidade: "",
  bairro: "",
  endereco: "",
  quartos: "0",
  banheiros: "0",
  vagas: "0",
  area: "",
};

const CAMPOS_IMOVEL =
  "id, nome, descricao, tipo, finalidade, preco, cidade, bairro, endereco, quartos, banheiros, vagas, area, imagem_url, publicado, criado_em";

export default function GestaoImoveis() {
  const { usuario, perfil, carregando } = useAuth();

  const ehAdmin = perfil?.tipo_conta === "administrador";
  const ehCorretor = perfil?.tipo_conta === "corretor";
  const podeGerenciarImoveis = ehAdmin || ehCorretor;

  const [usuarios, setUsuarios] = useState([]);
  const [imoveis, setImoveis] = useState([]);

  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [carregandoImoveis, setCarregandoImoveis] = useState(false);
  const [processandoId, setProcessandoId] = useState(null);

  const [form, setForm] = useState(FORM_INICIAL);
  const [imagem, setImagem] = useState(null);
  const [imovelEditando, setImovelEditando] = useState(null);
  const [salvandoImovel, setSalvandoImovel] = useState(false);

  const [imovelParaExcluir, setImovelParaExcluir] = useState(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  const [usuarioParaRebaixar, setUsuarioParaRebaixar] = useState(null);
  const [confirmandoRebaixamento, setConfirmandoRebaixamento] =
    useState(false);

  const [erroUsuarios, setErroUsuarios] = useState("");
  const [sucessoUsuarios, setSucessoUsuarios] = useState("");
  const [erroImoveis, setErroImoveis] = useState("");
  const [sucessoImoveis, setSucessoImoveis] = useState("");

  const carregarImoveis = useCallback(async () => {
    if (!podeGerenciarImoveis) return;

    setCarregandoImoveis(true);
    setErroImoveis("");

    try {
      const { data, error } = await supabase
        .from("imoveis")
        .select(CAMPOS_IMOVEL)
        .order("criado_em", { ascending: false });

      if (error) throw error;

      setImoveis(data || []);
    } catch (error) {
      setErroImoveis(
        `Não foi possível carregar os imóveis: ${error.message}`
      );
    } finally {
      setCarregandoImoveis(false);
    }
  }, [podeGerenciarImoveis]);

  const carregarUsuarios = useCallback(async () => {
    if (!ehAdmin) return;

    setCarregandoUsuarios(true);
    setErroUsuarios("");

    try {
      const { data, error } = await supabase
        .from("perfis")
        .select("id, nome, tipo_conta, criado_em")
        .order("nome", { ascending: true });

      if (error) throw error;

      setUsuarios(data || []);
    } catch (error) {
      setErroUsuarios(
        `Não foi possível carregar os usuários: ${error.message}`
      );
    } finally {
      setCarregandoUsuarios(false);
    }
  }, [ehAdmin]);

  useEffect(() => {
    if (!carregando && podeGerenciarImoveis) {
      carregarImoveis();
    }
  }, [carregando, podeGerenciarImoveis, carregarImoveis]);

  useEffect(() => {
    if (!carregando && ehAdmin) {
      carregarUsuarios();
    }
  }, [carregando, ehAdmin, carregarUsuarios]);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setForm((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  function limparFormulario() {
    setForm(FORM_INICIAL);
    setImagem(null);
    setImovelEditando(null);

    const campoArquivo = document.getElementById("imagem-imovel");
    if (campoArquivo) campoArquivo.value = "";
  }

  function iniciarEdicao(imovel) {
    setImovelEditando(imovel);

    setForm({
      nome: imovel.nome || "",
      descricao: imovel.descricao || "",
      tipo: imovel.tipo || "Apartamento",
      finalidade: imovel.finalidade || "venda",
      preco: imovel.preco != null ? String(imovel.preco) : "",
      cidade: imovel.cidade || "",
      bairro: imovel.bairro || "",
      endereco: imovel.endereco || "",
      quartos: String(imovel.quartos ?? 0),
      banheiros: String(imovel.banheiros ?? 0),
      vagas: String(imovel.vagas ?? 0),
      area: imovel.area != null ? String(imovel.area) : "",
    });

    setImagem(null);
    setErroImoveis("");
    setSucessoImoveis("");

    const campoArquivo = document.getElementById("imagem-imovel");
    if (campoArquivo) campoArquivo.value = "";

    document
      .getElementById("formulario-imovel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function enviarImagem() {
    if (!imagem) {
      return imovelEditando?.imagem_url || null;
    }

    if (!imagem.type.startsWith("image/")) {
      throw new Error("Selecione um arquivo de imagem válido.");
    }

    if (imagem.size > 5 * 1024 * 1024) {
      throw new Error("A imagem deve ter no máximo 5 MB.");
    }

    const extensao = imagem.name.split(".").pop()?.toLowerCase() || "jpg";
    const nomeArquivo = `${usuario.id}/${crypto.randomUUID()}.${extensao}`;

    const { error } = await supabase.storage
      .from("imagens-imoveis")
      .upload(nomeArquivo, imagem, {
        cacheControl: "3600",
        upsert: false,
        contentType: imagem.type,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("imagens-imoveis")
      .getPublicUrl(nomeArquivo);

    return data.publicUrl;
  }

  async function cadastrarImovel(event) {
    event.preventDefault();

    if (!podeGerenciarImoveis) {
      setErroImoveis("Você não tem permissão para gerenciar imóveis.");
      return;
    }

    setSalvandoImovel(true);
    setErroImoveis("");
    setSucessoImoveis("");

    try {
      const imagemUrl = await enviarImagem();

      const dadosImovel = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        tipo: form.tipo,
        finalidade: form.finalidade,
        preco: Number(form.preco),
        cidade: form.cidade.trim(),
        bairro: form.bairro.trim(),
        endereco: form.endereco.trim(),
        quartos: Number(form.quartos),
        banheiros: Number(form.banheiros),
        vagas: Number(form.vagas),
        area: form.area === "" ? null : Number(form.area),
        imagem_url: imagemUrl,
        publicado: true,
      };

      if (
        !dadosImovel.nome ||
        !dadosImovel.cidade ||
        !dadosImovel.bairro ||
        !Number.isFinite(dadosImovel.preco) ||
        dadosImovel.preco <= 0
      ) {
        throw new Error(
          "Preencha o nome, a cidade, o bairro e um preço válido."
        );
      }

      if (imovelEditando) {
        const { data, error } = await supabase
          .from("imoveis")
          .update(dadosImovel)
          .eq("id", imovelEditando.id)
          .select(CAMPOS_IMOVEL)
          .single();

        if (error) throw error;

        setImoveis((atuais) =>
          atuais.map((item) => (item.id === data.id ? data : item))
        );

        setSucessoImoveis("Imóvel atualizado com sucesso!");
      } else {
        const { data, error } = await supabase
          .from("imoveis")
          .insert({
            ...dadosImovel,
            criado_por: usuario.id,
          })
          .select(CAMPOS_IMOVEL)
          .single();

        if (error) throw error;

        setImoveis((atuais) => [data, ...atuais]);

        setSucessoImoveis("Imóvel cadastrado com sucesso!");
      }

      limparFormulario();
    } catch (error) {
      setErroImoveis(
        `Não foi possível salvar o imóvel: ${error.message}`
      );
    } finally {
      setSalvandoImovel(false);
    }
  }

  async function promoverUsuario(id) {
    if (!ehAdmin) {
      setErroUsuarios("Somente administradores podem alterar cargos.");
      return;
    }

    setProcessandoId(id);
    setErroUsuarios("");
    setSucessoUsuarios("");

    try {
      const { error } = await supabase.rpc(
        "promover_cliente_a_corretor",
        { p_usuario_id: id }
      );

      if (error) throw error;

      setSucessoUsuarios("Usuário promovido a corretor com sucesso!");
      await carregarUsuarios();
    } catch (error) {
      setErroUsuarios(
        `Não foi possível promover o usuário: ${error.message}`
      );
    } finally {
      setProcessandoId(null);
    }
  }

  function iniciarRemocaoCargo(usuarioAlvo) {
    if (!ehAdmin) {
      setErroUsuarios("Somente administradores podem alterar cargos.");
      return;
    }

    if (usuarioAlvo.id === usuario?.id) {
      setErroUsuarios("Você não pode remover o próprio cargo.");
      return;
    }

    setErroUsuarios("");
    setSucessoUsuarios("");
    setUsuarioParaRebaixar(usuarioAlvo);
  }

  async function confirmarRemocaoCargo() {
    if (
      !ehAdmin ||
      !usuarioParaRebaixar ||
      confirmandoRebaixamento
    ) {
      return;
    }

    setConfirmandoRebaixamento(true);
    setErroUsuarios("");
    setSucessoUsuarios("");

    try {
      const { error } = await supabase.rpc(
        "rebaixar_corretor_a_cliente",
        {
          p_usuario_id: usuarioParaRebaixar.id,
        }
      );

      if (error) throw error;

      setSucessoUsuarios(
        `${usuarioParaRebaixar.nome || "Usuário"} agora é cliente.`
      );

      setUsuarioParaRebaixar(null);
      await carregarUsuarios();
    } catch (error) {
      setErroUsuarios(
        `Não foi possível remover o cargo: ${error.message}`
      );
    } finally {
      setConfirmandoRebaixamento(false);
    }
  }

  function excluirImovel(imovel) {
    if (!ehAdmin) {
      setErroImoveis("Somente administradores podem excluir imóveis.");
      return;
    }

    setErroImoveis("");
    setSucessoImoveis("");
    setImovelParaExcluir(imovel);
  }

  async function confirmarExclusao() {
    if (!imovelParaExcluir || !ehAdmin || confirmandoExclusao) {
      return;
    }

    setConfirmandoExclusao(true);
    setErroImoveis("");

    try {
      const imovel = imovelParaExcluir;

      const { data, error } = await supabase
        .from("imoveis")
        .delete()
        .eq("id", imovel.id)
        .select("id");

      if (error) throw error;

      if (!data?.length) {
        throw new Error(
          "Nenhum imóvel foi excluído. Verifique suas permissões."
        );
      }

      setImoveis((atuais) =>
        atuais.filter((item) => item.id !== imovel.id)
      );

      if (imovelEditando?.id === imovel.id) {
        limparFormulario();
      }

      setSucessoImoveis("Imóvel excluído com sucesso!");
      setImovelParaExcluir(null);
    } catch (error) {
      setErroImoveis(
        `Não foi possível excluir o imóvel: ${error.message}`
      );
    } finally {
      setConfirmandoExclusao(false);
    }
  }

  function formatarPreco(preco) {
    return Number(preco || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (carregando) {
    return (
      <main className="gestao-page">
        <div className="gestao-container">
          <p>Verificando acesso...</p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="gestao-page">
        <div className="gestao-container">
          <section className="gestao-card">
            <h1>Acesso necessário</h1>
            <p>Entre na sua conta para acessar esta página.</p>
          </section>
        </div>
      </main>
    );
  }

  if (!podeGerenciarImoveis) {
    return (
      <main className="gestao-page">
        <div className="gestao-container">
          <section className="gestao-card">
            <p className="gestao-eyebrow">BLACK DRAGONS IMOB</p>
            <h1>Acesso restrito</h1>
            <p>
              Esta área é exclusiva para corretores e administradores
              autorizados.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="gestao-page">
      <div className="gestao-container">
        <header className="gestao-heading">
          <p className="gestao-eyebrow">BLACK DRAGONS IMOB</p>
          <h1>Gestão de imóveis</h1>
          <p>
            Gerencie os imóveis e controle os acessos da equipe.
          </p>
        </header>

        {sucessoImoveis && (
          <p className="gestao-message gestao-success" role="status">
            {sucessoImoveis}
          </p>
        )}

        {erroImoveis && !imovelParaExcluir && (
          <p className="gestao-message gestao-error" role="alert">
            {erroImoveis}
          </p>
        )}

        {ehAdmin && (
          <section className="gestao-card">
            <div className="gestao-section-heading">
              <div>
                <p className="gestao-eyebrow">CONTROLE DE ACESSO</p>
                <h2>Gestão de usuários</h2>
              </div>

              <button
                type="button"
                className="gestao-button-secondary"
                onClick={carregarUsuarios}
                disabled={carregandoUsuarios}
              >
                {carregandoUsuarios ? "Atualizando..." : "Atualizar"}
              </button>
            </div>

            {erroUsuarios && !usuarioParaRebaixar && (
              <p className="gestao-message gestao-error" role="alert">
                {erroUsuarios}
              </p>
            )}

            {sucessoUsuarios && (
              <p className="gestao-message gestao-success" role="status">
                {sucessoUsuarios}
              </p>
            )}

            {carregandoUsuarios ? (
              <p>Carregando usuários...</p>
            ) : usuarios.length === 0 ? (
              <p>Nenhum usuário encontrado.</p>
            ) : (
              <div className="gestao-users">
                {usuarios.map((item) => (
                  <article className="gestao-user" key={item.id}>
                    <div className="gestao-user-info">
                      <strong>{item.nome || "Usuário sem nome"}</strong>

                      <span className="gestao-role">
                        {item.tipo_conta || "cliente"}
                      </span>
                    </div>

                    <div className="gestao-user-actions">
                      {item.tipo_conta === "cliente" && (
                        <button
                          type="button"
                          disabled={processandoId === item.id}
                          onClick={() => promoverUsuario(item.id)}
                        >
                          {processandoId === item.id
                            ? "Promovendo..."
                            : "Tornar corretor"}
                        </button>
                      )}

                      {item.tipo_conta === "corretor" &&
                        item.id !== usuario?.id && (
                          <button
                            type="button"
                            className="gestao-button-danger"
                            disabled={processandoId === item.id}
                            onClick={() => iniciarRemocaoCargo(item)}
                          >
                            Remover cargo
                          </button>
                        )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="gestao-card">
          <div className="gestao-section-heading">
            <div>
              <p className="gestao-eyebrow">CATÁLOGO</p>
              <h2>Imóveis cadastrados</h2>
            </div>

            <button
              type="button"
              className="gestao-button-secondary"
              onClick={carregarImoveis}
              disabled={carregandoImoveis}
            >
              {carregandoImoveis ? "Atualizando..." : "Atualizar lista"}
            </button>
          </div>

          {carregandoImoveis ? (
            <p>Carregando imóveis...</p>
          ) : imoveis.length === 0 ? (
            <p>Nenhum imóvel encontrado.</p>
          ) : (
            <div className="gestao-imoveis-lista">
              {imoveis.map((imovel) => (
                <article className="gestao-imovel-item" key={imovel.id}>
                  {imovel.imagem_url ? (
                    <img
                      className="gestao-imovel-foto"
                      src={imovel.imagem_url}
                      alt={imovel.nome}
                      loading="lazy"
                    />
                  ) : (
                    <div className="gestao-imovel-foto gestao-sem-foto">
                      Sem imagem
                    </div>
                  )}

                  <div className="gestao-imovel-dados">
                    <h3>{imovel.nome}</h3>

                    <p>
                      {[imovel.bairro, imovel.cidade]
                        .filter(Boolean)
                        .join(" — ")}
                    </p>

                    <strong>{formatarPreco(imovel.preco)}</strong>

                    <p>
                      {imovel.tipo} ·{" "}
                      {imovel.finalidade === "aluguel"
                        ? "Aluguel"
                        : "Venda"}
                    </p>
                  </div>

                  <div className="gestao-imovel-acoes">
                    <button
                      type="button"
                      className="gestao-button-secondary"
                      onClick={() => iniciarEdicao(imovel)}
                    >
                      Editar
                    </button>

                    {ehAdmin && (
                      <button
                        type="button"
                        className="gestao-button-danger"
                        onClick={() => excluirImovel(imovel)}
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="gestao-card" id="formulario-imovel">
          <div className="gestao-section-heading">
            <div>
              <p className="gestao-eyebrow">
                {imovelEditando ? "EDIÇÃO" : "NOVO CADASTRO"}
              </p>

              <h2>
                {imovelEditando ? "Editar imóvel" : "Cadastrar imóvel"}
              </h2>
            </div>
          </div>

          <form className="gestao-form" onSubmit={cadastrarImovel}>
            <div className="gestao-form-grid">
              <label>
                Nome do imóvel *
                <input
                  name="nome"
                  value={form.nome}
                  onChange={atualizarCampo}
                  placeholder="Ex.: Apartamento com vista para o mar"
                  required
                />
              </label>

              <label>
                Tipo de imóvel *
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={atualizarCampo}
                  required
                >
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Sala comercial">Sala comercial</option>
                  <option value="Sítio">Sítio</option>
                </select>
              </label>

              <label>
                Finalidade *
                <select
                  name="finalidade"
                  value={form.finalidade}
                  onChange={atualizarCampo}
                  required
                >
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </label>

              <label>
                Preço (R$) *
                <input
                  name="preco"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.preco}
                  onChange={atualizarCampo}
                  required
                />
              </label>

              <label>
                Cidade *
                <input
                  name="cidade"
                  value={form.cidade}
                  onChange={atualizarCampo}
                  required
                />
              </label>

              <label>
                Bairro *
                <input
                  name="bairro"
                  value={form.bairro}
                  onChange={atualizarCampo}
                  required
                />
              </label>

              <label className="gestao-campo-completo">
                Endereço
                <input
                  name="endereco"
                  value={form.endereco}
                  onChange={atualizarCampo}
                  placeholder="Rua, número e complemento"
                />
              </label>

              <label>
                Quartos
                <input
                  name="quartos"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quartos}
                  onChange={atualizarCampo}
                />
              </label>

              <label>
                Banheiros
                <input
                  name="banheiros"
                  type="number"
                  min="0"
                  step="1"
                  value={form.banheiros}
                  onChange={atualizarCampo}
                />
              </label>

              <label>
                Vagas
                <input
                  name="vagas"
                  type="number"
                  min="0"
                  step="1"
                  value={form.vagas}
                  onChange={atualizarCampo}
                />
              </label>

              <label>
                Área (m²)
                <input
                  name="area"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.area}
                  onChange={atualizarCampo}
                />
              </label>

              <label className="gestao-campo-completo">
                Descrição
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={atualizarCampo}
                  rows="4"
                  placeholder="Descreva os diferenciais do imóvel..."
                />
              </label>

              <label className="gestao-campo-completo">
                Imagem do imóvel
                <input
                  id="imagem-imovel"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setImagem(event.target.files?.[0] || null)
                  }
                />

                <span className="gestao-file-name">
                  {imagem
                    ? imagem.name
                    : imovelEditando?.imagem_url
                      ? "A imagem atual será mantida se você não escolher outra."
                      : "Selecione uma imagem de até 5 MB."}
                </span>
              </label>
            </div>

            {imovelEditando?.imagem_url && !imagem && (
              <div className="gestao-foto-atual">
                <span>Imagem atual</span>
                <img
                  src={imovelEditando.imagem_url}
                  alt={`Imagem atual de ${imovelEditando.nome}`}
                />
              </div>
            )}

            <div className="gestao-form-actions">
              <button type="submit" disabled={salvandoImovel}>
                {salvandoImovel
                  ? "Salvando..."
                  : imovelEditando
                    ? "Salvar alterações"
                    : "Cadastrar imóvel"}
              </button>

              {imovelEditando && (
                <button
                  type="button"
                  className="gestao-button-secondary"
                  onClick={limparFormulario}
                  disabled={salvandoImovel}
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Confirmação para excluir imóvel */}
        {imovelParaExcluir && (
          <div
            className="gestao-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget &&
                !confirmandoExclusao
              ) {
                setImovelParaExcluir(null);
                setErroImoveis("");
              }
            }}
          >
            <section
              className="gestao-modal"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="gestao-modal-titulo"
              aria-describedby="gestao-modal-descricao"
            >
              <div className="gestao-modal-icon" aria-hidden="true">
                !
              </div>

              <p className="gestao-eyebrow">AÇÃO PERMANENTE</p>
              <h2 id="gestao-modal-titulo">Excluir imóvel?</h2>

              <p id="gestao-modal-descricao">
                Tem certeza de que deseja excluir este imóvel?
                Essa ação não poderá ser desfeita.
              </p>

              <div className="gestao-modal-imovel">
                <strong>{imovelParaExcluir.nome}</strong>
                <span>
                  {[imovelParaExcluir.bairro, imovelParaExcluir.cidade]
                    .filter(Boolean)
                    .join(" — ")}
                </span>
              </div>

              {erroImoveis && (
                <p className="gestao-message gestao-error" role="alert">
                  {erroImoveis}
                </p>
              )}

              <div className="gestao-modal-actions">
                <button
                  type="button"
                  className="gestao-button-secondary"
                  disabled={confirmandoExclusao}
                  onClick={() => {
                    setImovelParaExcluir(null);
                    setErroImoveis("");
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="gestao-button-danger"
                  disabled={confirmandoExclusao}
                  onClick={confirmarExclusao}
                >
                  {confirmandoExclusao
                    ? "Excluindo..."
                    : "Sim, excluir"}
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Confirmação para retirar o cargo de corretor */}
        {usuarioParaRebaixar && (
          <div
            className="gestao-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget &&
                !confirmandoRebaixamento
              ) {
                setUsuarioParaRebaixar(null);
                setErroUsuarios("");
              }
            }}
          >
            <section
              className="gestao-modal"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="rebaixar-modal-titulo"
              aria-describedby="rebaixar-modal-descricao"
            >
              <div className="gestao-modal-icon" aria-hidden="true">
                !
              </div>

              <p className="gestao-eyebrow">GESTÃO DA EQUIPE</p>

              <h2 id="rebaixar-modal-titulo">
                Remover cargo de corretor?
              </h2>

              <p id="rebaixar-modal-descricao">
                Tem certeza de que deseja retirar o cargo de corretor
                deste usuário? A conta continuará existindo, mas o
                perfil voltará a ser de cliente.
              </p>

              <div className="gestao-modal-imovel">
                <strong>
                  {usuarioParaRebaixar.nome || "Usuário sem nome"}
                </strong>
                <span>Corretor → Cliente</span>
              </div>

              {erroUsuarios && (
                <p className="gestao-message gestao-error" role="alert">
                  {erroUsuarios}
                </p>
              )}

              <div className="gestao-modal-actions">
                <button
                  type="button"
                  className="gestao-button-secondary"
                  disabled={confirmandoRebaixamento}
                  onClick={() => {
                    setUsuarioParaRebaixar(null);
                    setErroUsuarios("");
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="gestao-button-danger"
                  disabled={confirmandoRebaixamento}
                  onClick={confirmarRemocaoCargo}
                >
                  {confirmandoRebaixamento
                    ? "Removendo..."
                    : "Sim, remover cargo"}
                </button>
              </div>
            </section>
          </div>
        )}

        <button
          type="button"
          className="gestao-button-secondary gestao-voltar"
          onClick={() => window.history.back()}
        >
          Voltar
        </button>
      </div>
    </main>
  );
}
