
import { useState } from "react";
import { migrarImoveis } from "../../lib/migrarImoveis";

export default function MigracaoImoveis() {
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  if (!import.meta.env.DEV) {
    return null;
  }

  async function executarMigracao() {
    const confirmar = window.confirm(
      "Deseja iniciar a migração dos imóveis para o Supabase?"
    );

    if (!confirmar) return;

    setCarregando(true);
    setMensagem("");

    try {
      const resultado = await migrarImoveis();

      setMensagem(
        `Migração concluída! Cadastrados: ${resultado.cadastrados}. ` +
          `Ignorados por já existirem: ${resultado.ignorados}.`
      );
    } catch (erro) {
      console.error("Erro na migração:", erro);
      setMensagem(`Não foi possível concluir: ${erro.message}`);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section
      style={{
        margin: "24px auto",
        padding: "20px",
        maxWidth: "600px",
        background: "#111113",
        color: "#f5f5f5",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "12px",
      }}
    >
      <h2>Migração de imóveis</h2>

      <p>
        Ferramenta temporária para transferir os imóveis demonstrativos
        para o Supabase.
      </p>

      <button
        type="button"
        onClick={executarMigracao}
        disabled={carregando}
        style={{
          padding: "12px 18px",
          borderRadius: "8px",
          border: "none",
          cursor: carregando ? "wait" : "pointer",
        }}
      >
        {carregando ? "Migrando imóveis..." : "Migrar imóveis"}
      </button>

      {mensagem && (
        <p role="status" style={{ marginTop: "16px" }}>
          {mensagem}
        </p>
      )}
    </section>
  );
}
