
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Perfil.css";

export default function Perfil({ onLogin, onVoltar, onGestao }) {
  const {
    usuario,
    perfil,
    atualizarPerfil,
    atualizarEmail,
    atualizarSenha,
    carregando,
  } = useAuth();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [novoEmail, setNovoEmail] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [mensagemEmail, setMensagemEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [mensagemSenha, setMensagemSenha] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [alterandoEmail, setAlterandoEmail] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  useEffect(() => {
    if (!usuario) return;

    const nomeSalvo =
      perfil?.nome?.trim() ||
      usuario.nome?.trim() ||
      usuario.user_metadata?.nome?.trim() ||
      usuario.user_metadata?.full_name?.trim() ||
      usuario.user_metadata?.name?.trim() ||
      "";

    setNome(nomeSalvo);
    setTelefone(perfil?.telefone || usuario.telefone || "");
    setFotoUrl(perfil?.foto_url || usuario.foto_url || "");
    setNovoEmail("");
  }, [usuario, perfil]);

  if (carregando) {
    return (
      <main className="perfil-page">
        <section className="perfil-card">
          <span className="perfil-eyebrow">BLACK DRAGONS IMOB</span>
          <h1>Carregando perfil...</h1>
          <p>Estamos buscando suas informações.</p>
        </section>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="perfil-page">
        <section className="perfil-card">
          <span className="perfil-eyebrow">BLACK DRAGONS IMOB</span>
          <h1>Acesse sua conta</h1>
          <p>
            Entre na sua conta para visualizar e editar seu perfil.
          </p>

          <button
            type="button"
            className="perfil-button"
            onClick={onLogin}
          >
            Fazer login <span aria-hidden="true">↗</span>
          </button>
        </section>
      </main>
    );
  }

  const iniciais = (
    nome ||
    usuario.nome ||
    usuario.user_metadata?.full_name ||
    usuario.email ||
    ""
  )
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");

  async function salvarPerfil(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (nome.trim().length < 2) {
      setErro("Informe um nome com pelo menos 2 caracteres.");
      return;
    }

    setSalvando(true);

    try {
      const resultado = await atualizarPerfil({
        nome,
        telefone,
        foto_url: fotoUrl,
      });

      if (resultado?.error) {
        setErro(resultado.error);
        return;
      }

      setNome(resultado.data?.nome || nome.trim());
      setTelefone(resultado.data?.telefone || "");
      setFotoUrl(resultado.data?.foto_url || "");

      setMensagem("Seu perfil foi atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setErro("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function solicitarAlteracaoEmail(e) {
    e.preventDefault();
    setErroEmail("");
    setMensagemEmail("");

    if (!novoEmail.trim()) {
      setErroEmail("Digite o novo endereço de e-mail.");
      return;
    }

    setAlterandoEmail(true);

    try {
      const resultado = await atualizarEmail(novoEmail);

      if (resultado?.error) {
        setErroEmail(resultado.error);
        return;
      }

      setMensagemEmail(
        resultado?.message ||
          "Solicitação enviada. Verifique seu e-mail para concluir a alteração."
      );

      setNovoEmail("");
    } catch (error) {
      console.error("Erro ao solicitar alteração de e-mail:", error);
      setErroEmail(
        "Não foi possível solicitar a alteração. Tente novamente."
      );
    } finally {
      setAlterandoEmail(false);
    }
  }

  async function solicitarAlteracaoSenha(e) {
    e.preventDefault();
    setErroSenha("");
    setMensagemSenha("");

    if (!senhaAtual) {
      setErroSenha("Digite sua senha atual.");
      return;
    }

    if (novaSenha.length < 8) {
      setErroSenha("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroSenha("A confirmação não corresponde à nova senha.");
      return;
    }

    if (senhaAtual === novaSenha) {
      setErroSenha("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setAlterandoSenha(true);

    try {
      const resultado = await atualizarSenha({
        senhaAtual,
        novaSenha,
      });

      if (resultado?.error) {
        setErroSenha(resultado.error);
        return;
      }

      setMensagemSenha(
        resultado?.message || "Sua senha foi alterada com sucesso!"
      );

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setErroSenha(
        "Não foi possível alterar a senha. Confira sua senha atual e tente novamente."
      );
    } finally {
      setAlterandoSenha(false);
    }
  }

  const formularioOcupado =
    salvando || alterandoEmail || alterandoSenha;

  const podeGerenciarImoveis = [
    "administrador",
    "corretor",
  ].includes(perfil?.tipo_conta);

  return (
    <main className="perfil-page">
      <section className="perfil-container">
        <header className="perfil-heading">
          <span className="perfil-eyebrow">BLACK DRAGONS IMOB</span>
          <h1>Meu perfil</h1>
          <p>
            Personalize suas informações e mantenha seus dados atualizados.
          </p>
        </header>

        <div className="perfil-card">
          <div className="perfil-avatar-area">
            {fotoUrl.trim() ? (
              <img
                key={fotoUrl}
                className="perfil-avatar"
                src={fotoUrl.trim()}
                alt="Foto de perfil"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "block";
                }}
              />
            ) : (
              <div className="perfil-avatar perfil-avatar-iniciais">
                {iniciais || "BD"}
              </div>
            )}

            <div>
              <h2>{nome.trim() || "Seu nome"}</h2>
              <p>{usuario.email || "Conta autenticada"}</p>
            </div>
          </div>

          {podeGerenciarImoveis && (
            <>
              <div className="perfil-divider" />

              <section className="perfil-form">
                <h2 className="perfil-subtitulo">
                  Área profissional
                </h2>

                <p className="perfil-descricao">
                  Acesse as ferramentas de gerenciamento da imobiliária.
                </p>

                <div className="perfil-actions">
                  <button
                    type="button"
                    className="perfil-button"
                    onClick={onGestao}
                  >
                    Gerenciar imóveis
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </section>
            </>
          )}

          <div className="perfil-divider" />

          <form className="perfil-form" onSubmit={salvarPerfil}>
            <h2 className="perfil-subtitulo">Dados pessoais</h2>

            <label>
              <span>Nome completo</span>
              <input
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setMensagem("");
                  setErro("");
                }}
                placeholder="Digite seu nome"
                autoComplete="name"
                minLength={2}
                required
              />
            </label>

            <label>
              <span>E-mail atual</span>
              <input
                type="email"
                value={usuario.email || ""}
                readOnly
                disabled
              />
              <small>
                Para mudar seu e-mail de acesso, use a seção abaixo.
              </small>
            </label>

            <label>
              <span>Telefone</span>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => {
                  setTelefone(e.target.value);
                  setMensagem("");
                  setErro("");
                }}
                placeholder="(48) 99999-9999"
                autoComplete="tel"
              />
            </label>

            <label>
              <span>URL da foto de perfil</span>
              <input
                type="url"
                value={fotoUrl}
                onChange={(e) => {
                  setFotoUrl(e.target.value);
                  setMensagem("");
                  setErro("");
                }}
                placeholder="https://exemplo.com/minha-foto.jpg"
              />
              <small>
                Cole o endereço público de uma imagem. O envio de arquivos
                ainda não está configurado.
              </small>
            </label>

            {erro && (
              <p className="perfil-alerta perfil-alerta-erro" role="alert">
                {erro}
              </p>
            )}

            {mensagem && (
              <p
                className="perfil-alerta perfil-alerta-sucesso"
                role="status"
              >
                {mensagem}
              </p>
            )}

            <div className="perfil-actions">
              <button
                type="button"
                className="perfil-button perfil-button-secundario"
                onClick={onVoltar}
                disabled={formularioOcupado}
              >
                Voltar
              </button>

              <button
                type="submit"
                className="perfil-button"
                disabled={formularioOcupado}
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
                {!salvando && <span aria-hidden="true">↗</span>}
              </button>
            </div>
          </form>

          <div className="perfil-divider" />

          <form
            className="perfil-form perfil-email-form"
            onSubmit={solicitarAlteracaoEmail}
          >
            <h2 className="perfil-subtitulo">Alterar e-mail</h2>

            <p className="perfil-descricao">
              Deseja usar outro e-mail para entrar na Black Dragons IMOB?
              Informe o novo endereço abaixo.
            </p>

            <label>
              <span>Novo e-mail</span>
              <input
                type="email"
                value={novoEmail}
                onChange={(e) => {
                  setNovoEmail(e.target.value);
                  setErroEmail("");
                  setMensagemEmail("");
                }}
                placeholder="novoemail@exemplo.com"
                autoComplete="email"
                required
              />
            </label>

            <small className="perfil-email-aviso">
              Por segurança, o Supabase pode solicitar que você confirme
              a alteração por e-mail. Até a confirmação, seu e-mail atual
              pode continuar sendo o endereço de acesso.
            </small>

            {erroEmail && (
              <p className="perfil-alerta perfil-alerta-erro" role="alert">
                {erroEmail}
              </p>
            )}

            {mensagemEmail && (
              <p
                className="perfil-alerta perfil-alerta-sucesso"
                role="status"
              >
                {mensagemEmail}
              </p>
            )}

            <div className="perfil-actions">
              <button
                type="submit"
                className="perfil-button"
                disabled={formularioOcupado}
              >
                {alterandoEmail
                  ? "Enviando solicitação..."
                  : "Alterar e-mail"}
                {!alterandoEmail && (
                  <span aria-hidden="true">↗</span>
                )}
              </button>
            </div>
          </form>

          <div className="perfil-divider" />

          <form
            className="perfil-form perfil-senha-form"
            onSubmit={solicitarAlteracaoSenha}
          >
            <h2 className="perfil-subtitulo">Alterar senha</h2>

            <p className="perfil-descricao">
              Atualize sua senha para manter sua conta protegida.
              Utilize pelo menos 8 caracteres.
            </p>

            <label>
              <span>Senha atual</span>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => {
                  setSenhaAtual(e.target.value);
                  setErroSenha("");
                  setMensagemSenha("");
                }}
                placeholder="Digite sua senha atual"
                autoComplete="current-password"
                required
              />
            </label>

            <label>
              <span>Nova senha</span>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => {
                  setNovaSenha(e.target.value);
                  setErroSenha("");
                  setMensagemSenha("");
                }}
                placeholder="Mínimo de 8 caracteres"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <label>
              <span>Confirmar nova senha</span>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => {
                  setConfirmarSenha(e.target.value);
                  setErroSenha("");
                  setMensagemSenha("");
                }}
                placeholder="Digite novamente a nova senha"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            {erroSenha && (
              <p className="perfil-alerta perfil-alerta-erro" role="alert">
                {erroSenha}
              </p>
            )}

            {mensagemSenha && (
              <p
                className="perfil-alerta perfil-alerta-sucesso"
                role="status"
              >
                {mensagemSenha}
              </p>
            )}

            <div className="perfil-actions">
              <button
                type="submit"
                className="perfil-button"
                disabled={formularioOcupado}
              >
                {alterandoSenha ? "Alterando senha..." : "Atualizar senha"}
                {!alterandoSenha && (
                  <span aria-hidden="true">↗</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
