
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import "./GestaoImoveis.css";

export default function GestaoImoveis({ onVoltar }) {
  const { usuario, perfil, carregando } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [processandoId, setProcessandoId] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const tipoConta = perfil?.tipo_conta;
  const ehAdmin = tipoConta === "administrador";
  const podeGerenciar = ["administrador", "corretor"].includes(tipoConta);

  const carregarUsuarios = useCallback(async () => {
    if (!ehAdmin) return;

    setCarregandoUsuarios(true);
    setErro("");

    const { data, error } = await supabase
      .from("perfis")
      .select("id, nome, tipo_conta, criado_em")
      .order("nome", { ascending: true });

    if (error) {
      setErro(`Não foi possível carregar os usuários: ${error.message}`);
      setUsuarios([]);
    } else {
      setUsuarios(data ?? []);
    }

    setCarregandoUsuarios(false);
  }, [ehAdmin]);

  useEffect(() => {
    if (ehAdmin) {
      carregarUsuarios();
    }
  }, [ehAdmin, carregarUsuarios]);

  async function promoverUsuario(id) {
    const confirmado = window.confirm(
      "Deseja promover este cliente a corretor?"
    );

    if (!confirmado) return;

    setProcessandoId(id);
    setErro("");
    setSucesso("");

    const { error } = await supabase.rpc(
      "promover_cliente_a_corretor",
      { p_usuario_id: id }
    );

    if (error) {
      setErro(`Não foi possível promover o usuário: ${error.message}`);
    } else {
      setSucesso("Cliente promovido a corretor com sucesso!");
      await carregarUsuarios();
    }

    setProcessandoId(null);
  }

  if (carregando) {
    return (
      <main className="gestao-page">
        <section className="gestao-card">
          <p>Verificando permissões...</p>
        </section>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="gestao-page">
        <section className="gestao-card">
          <h1>Faça login</h1>
          <p>Entre na sua conta para acessar esta área.</p>
          <button onClick={() => onVoltar?.("login")}>
            Ir para o login
          </button>
        </section>
      </main>
    );
  }

  if (!podeGerenciar) {
    return (
      <main className="gestao-page">
        <section className="gestao-card">
          <span className="gestao-eyebrow">BLACK DRAGONS IMOB</span>
          <h1>Acesso restrito</h1>
          <p>
            Esta área está disponível somente para corretores
            e administradores autorizados.
          </p>
          <button onClick={() => onVoltar?.("home")}>
            Voltar ao início
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="gestao-page">
      <section className="gestao-container">
        <span className="gestao-eyebrow">BLACK DRAGONS IMOB</span>
        <h1>Gestão de imóveis</h1>
        <p className="gestao-intro">
          Gerencie os imóveis e organize as operações da imobiliária.
        </p>

        {ehAdmin && (
          <section className="gestao-card">
            <div className="gestao-section-heading">
              <div>
                <span className="gestao-eyebrow">ADMINISTRAÇÃO</span>
                <h2>Gerenciar usuários</h2>
                <p>
                  Promova clientes a corretores autorizados.
                  A patente de administrador não pode ser concedida por aqui.
                </p>
              </div>

              <button
                type="button"
                className="gestao-button-secondary"
                onClick={carregarUsuarios}
                disabled={carregandoUsuarios}
              >
                {carregandoUsuarios ? "Atualizando..." : "Atualizar lista"}
              </button>
            </div>

            {erro && (
              <p className="gestao-message gestao-error" role="alert">
                {erro}
              </p>
            )}

            {sucesso && (
              <p className="gestao-message gestao-success" role="status">
                {sucesso}
              </p>
            )}

            {carregandoUsuarios ? (
              <p>Carregando usuários...</p>
            ) : usuarios.length === 0 && !erro ? (
              <p>Nenhum perfil encontrado.</p>
            ) : (
              <div className="gestao-users">
                {usuarios.map((item) => (
                  <article className="gestao-user" key={item.id}>
                    <div className="gestao-user-info">
                      <h3>{item.nome || "Usuário sem nome"}</h3>
                      <span className="gestao-user-date">
                        Cadastro:{" "}
                        {item.criado_em
                          ? new Date(item.criado_em).toLocaleDateString(
                              "pt-BR"
                            )
                          : "Data indisponível"}
                      </span>
                    </div>

                    <div className="gestao-user-actions">
                      <span
                        className={`gestao-role gestao-role-${item.tipo_conta}`}
                      >
                        {item.tipo_conta}
                      </span>

                      {item.tipo_conta === "cliente" && (
                        <button
                          type="button"
                          disabled={processandoId !== null}
                          onClick={() => promoverUsuario(item.id)}
                        >
                          {processandoId === item.id
                            ? "Promovendo..."
                            : "Promover a corretor"}
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
          <span className="gestao-eyebrow">IMÓVEIS</span>
          <h2>Cadastro de imóveis</h2>
          <p>
            Nesta seção ficará o formulário para cadastrar imóveis,
            adicionar fotos e definir preços e características.
          </p>
          <span className="gestao-status">
            Formulário de cadastro — próxima etapa
          </span>
        </section>

        <button
          type="button"
          onClick={() => onVoltar?.("home")}
        >
          Voltar ao início
        </button>
      </section>
    </main>
  );
}
