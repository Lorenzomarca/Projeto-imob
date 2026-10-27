import { createContext, useContext, useEffect, useState } from "react";

// Sistema de login 100% local (localStorage). Sem servidor.
// ATENÇÃO: serve só para demonstração — não é seguro para dados reais.

const USERS_KEY = "bd_users";
const SESSION_KEY = "bd_session";
const FAVS_KEY = "bd_favoritos"; // { [email]: [ids] }

const ler = (chave, padrao) => {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? padrao;
  } catch {
    return padrao;
  }
};
const salvar = (chave, valor) =>
  localStorage.setItem(chave, JSON.stringify(valor));

async function hash(texto) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(texto)
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => ler(SESSION_KEY, null));
  const [favoritos, setFavoritos] = useState(() =>
    usuario ? ler(FAVS_KEY, {})[usuario.email] ?? [] : []
  );

  useEffect(() => {
    if (!usuario) return setFavoritos([]);
    setFavoritos(ler(FAVS_KEY, {})[usuario.email] ?? []);
  }, [usuario]);

  async function cadastrar({ nome, email, senha }) {
    const mail = email.trim().toLowerCase();
    const users = ler(USERS_KEY, {});
    if (users[mail]) return "Este e-mail já está cadastrado.";
    users[mail] = { nome: nome.trim(), senha: await hash(senha) };
    salvar(USERS_KEY, users);
    const sessao = { nome: nome.trim(), email: mail };
    salvar(SESSION_KEY, sessao);
    setUsuario(sessao);
    return null;
  }

  async function entrar({ email, senha }) {
    const mail = email.trim().toLowerCase();
    const user = ler(USERS_KEY, {})[mail];
    if (!user || user.senha !== (await hash(senha)))
      return "E-mail ou senha incorretos.";
    const sessao = { nome: user.nome, email: mail };
    salvar(SESSION_KEY, sessao);
    setUsuario(sessao);
    return null;
  }

  function sair() {
    localStorage.removeItem(SESSION_KEY);
    setUsuario(null);
  }

  function alternarFavorito(id) {
    if (!usuario) return false; // precisa logar
    const todos = ler(FAVS_KEY, {});
    const atuais = todos[usuario.email] ?? [];
    const novos = atuais.includes(id)
      ? atuais.filter((i) => i !== id)
      : [...atuais, id];
    todos[usuario.email] = novos;
    salvar(FAVS_KEY, todos);
    setFavoritos(novos);
    return true;
  }

  return (
    <AuthContext.Provider
      value={{ usuario, favoritos, cadastrar, entrar, sair, alternarFavorito }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
