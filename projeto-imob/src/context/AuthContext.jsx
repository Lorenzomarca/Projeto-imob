
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [recuperacaoSenha, setRecuperacaoSenha] = useState(false);

  // =====================================================
  // NOME E DADOS DO USUÁRIO
  // =====================================================

  const obterNome = useCallback((user, dadosPerfil = null) => {
    return (
      dadosPerfil?.nome?.trim() ||
      user?.user_metadata?.nome?.trim() ||
      user?.user_metadata?.full_name?.trim() ||
      user?.user_metadata?.name?.trim() ||
      ""
    );
  }, []);

  const montarUsuario = useCallback(
    (user, dadosPerfil = null) => {
      if (!user) return null;

      return {
        ...user,
        nome: obterNome(user, dadosPerfil),
        telefone:
          dadosPerfil?.telefone ||
          user.user_metadata?.telefone ||
          "",
        foto_url:
          dadosPerfil?.foto_url ||
          user.user_metadata?.foto_url ||
          user.user_metadata?.avatar_url ||
          "",
      };
    },
    [obterNome]
  );

  // =====================================================
  // FAVORITOS
  // =====================================================

  const carregarFavoritos = useCallback((email) => {
    if (!email) {
      setFavoritos([]);
      return;
    }

    try {
      const chave = `black-dragons-favoritos-${email.toLowerCase()}`;
      const salvos = localStorage.getItem(chave);
      const lista = salvos ? JSON.parse(salvos) : [];

      setFavoritos(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      setFavoritos([]);
    }
  }, []);

  const salvarFavoritos = useCallback((email, lista) => {
    if (!email) return;

    try {
      const chave = `black-dragons-favoritos-${email.toLowerCase()}`;
      localStorage.setItem(chave, JSON.stringify(lista));
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
    }
  }, []);

  const alternarFavorito = useCallback(
    (imovelId) => {
      if (!usuario?.email) {
        return {
          error: "Faça login para favoritar um imóvel.",
        };
      }

      const jaFavoritado = favoritos.some(
        (id) => String(id) === String(imovelId)
      );

      const novaLista = jaFavoritado
        ? favoritos.filter((id) => String(id) !== String(imovelId))
        : [...favoritos, imovelId];

      setFavoritos(novaLista);
      salvarFavoritos(usuario.email, novaLista);

      return { data: novaLista };
    },
    [usuario, favoritos, salvarFavoritos]
  );

  // =====================================================
  // PERFIL NO SUPABASE
  // =====================================================

  const carregarPerfil = useCallback(async (user) => {
    if (!user) {
      setPerfil(null);
      return null;
    }

    const { data, error } = await supabase
      .from("perfis")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Erro ao carregar perfil:", error);
      setPerfil(null);
      return null;
    }

    setPerfil(data ?? null);
    return data ?? null;
  }, []);

  // =====================================================
  // SINCRONIZAÇÃO DO USUÁRIO
  // =====================================================

  const sincronizarUsuario = useCallback(
    async (user) => {
      if (!user) {
        setUsuario(null);
        setPerfil(null);
        setFavoritos([]);
        return;
      }

      setUsuario(montarUsuario(user));
      carregarFavoritos(user.email);

      const dadosPerfil = await carregarPerfil(user);

      setUsuario(montarUsuario(user, dadosPerfil));
    },
    [carregarFavoritos, carregarPerfil, montarUsuario]
  );

  // =====================================================
  // SESSÃO E EVENTOS DE AUTENTICAÇÃO
  // =====================================================

  useEffect(() => {
    let ativo = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, session) => {
      if (!ativo) return;

      if (evento === "PASSWORD_RECOVERY") {
        setRecuperacaoSenha(true);
      }

      if (evento === "SIGNED_OUT") {
        setRecuperacaoSenha(false);
      }

      const user = session?.user ?? null;

      Promise.resolve().then(async () => {
        if (!ativo) return;

        try {
          await sincronizarUsuario(user);
        } catch (error) {
          console.error("Erro ao sincronizar usuário:", error);
        } finally {
          if (ativo) setCarregando(false);
        }
      });
    });

    async function iniciarSessao() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!ativo) return;

        if (error) {
          console.error("Erro ao verificar sessão:", error);
        }

        await sincronizarUsuario(data?.session?.user ?? null);
      } catch (error) {
        console.error("Erro ao iniciar autenticação:", error);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    iniciarSessao();

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, [sincronizarUsuario]);

  // =====================================================
  // CADASTRO
  // =====================================================

  const cadastrar = async ({
    nome,
    email,
    senha,
    telefone = "",
  }) => {
    const nomeLimpo = nome?.trim();
    const emailLimpo = email?.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo || !senha) {
      return {
        error: "Preencha nome, e-mail e senha.",
      };
    }

    if (senha.length < 8) {
      return {
        error: "A senha deve ter pelo menos 8 caracteres.",
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: emailLimpo,
      password: senha,
      options: {
        data: {
          nome: nomeLimpo,
          telefone: telefone.trim(),
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user && data.session) {
      await sincronizarUsuario(data.user);
    }

    return {
      data,
      message: data.session
        ? "Cadastro realizado com sucesso!"
        : "Cadastro realizado! Confira seu e-mail para confirmar a conta.",
    };
  };

  // =====================================================
  // LOGIN COM E-MAIL E SENHA
  // =====================================================

  const entrar = async ({ email, senha }) => {
    const emailLimpo = email?.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      return {
        error: "Informe seu e-mail e sua senha.",
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailLimpo,
      password: senha,
    });

    if (error) {
      return { error: error.message };
    }

    await sincronizarUsuario(data.user);

    return { data };
  };

  // =====================================================
  // SAIR
  // =====================================================

  const sair = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    setUsuario(null);
    setPerfil(null);
    setFavoritos([]);
    setRecuperacaoSenha(false);

    return { data: true };
  };

  // =====================================================
  // ATUALIZAR PERFIL
  // =====================================================

  const atualizarPerfil = async ({ nome, telefone, foto_url }) => {
    if (!usuario) {
      return { error: "Você precisa estar logado." };
    }

    const nomeLimpo = nome?.trim() ?? "";
    const telefoneLimpo = telefone?.trim() ?? "";
    const fotoLimpa = foto_url?.trim() || null;

    if (nomeLimpo.length < 2) {
      return {
        error: "Informe um nome com pelo menos 2 caracteres.",
      };
    }

    const atualizacoes = {
      nome: nomeLimpo,
      telefone: telefoneLimpo,
      foto_url: fotoLimpa,
      atualizado_em: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("perfis")
      .update(atualizacoes)
      .eq("id", usuario.id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar perfil:", error);
      return { error: error.message };
    }

    setPerfil(data);

    setUsuario((atual) =>
      atual
        ? {
            ...atual,
            nome: data.nome || atual.nome || "",
            telefone: data.telefone || "",
            foto_url: data.foto_url || "",
          }
        : atual
    );

    return {
      data,
      message: "Perfil atualizado com sucesso!",
    };
  };

  // =====================================================
  // ATUALIZAR E-MAIL
  // =====================================================

  const atualizarEmail = async (novoEmail) => {
    if (!usuario) {
      return { error: "Você precisa estar logado." };
    }

    const emailLimpo = novoEmail?.trim().toLowerCase();

    if (!emailLimpo) {
      return { error: "Informe o novo e-mail." };
    }

    if (emailLimpo === usuario.email?.toLowerCase()) {
      return { error: "O novo e-mail é igual ao atual." };
    }

    const { data, error } = await supabase.auth.updateUser({
      email: emailLimpo,
    });

    if (error) {
      return { error: error.message };
    }

    return {
      data,
      message:
        "Enviamos uma confirmação para o novo e-mail. Siga as instruções recebidas.",
    };
  };

  // =====================================================
  // ALTERAR SENHA COM USUÁRIO LOGADO
  // =====================================================

  const atualizarSenha = async ({ senhaAtual, novaSenha }) => {
    if (!usuario?.email) {
      return { error: "Você precisa estar logado." };
    }

    if (!senhaAtual || !novaSenha) {
      return {
        error: "Preencha a senha atual e a nova senha.",
      };
    }

    if (novaSenha.length < 8) {
      return {
        error: "A nova senha deve ter pelo menos 8 caracteres.",
      };
    }

    if (senhaAtual === novaSenha) {
      return {
        error: "A nova senha precisa ser diferente da atual.",
      };
    }

    const { error: erroValidacao } =
      await supabase.auth.signInWithPassword({
        email: usuario.email,
        password: senhaAtual,
      });

    if (erroValidacao) {
      return {
        error: "A senha atual está incorreta.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) {
      return { error: error.message };
    }

    return {
      message: "Senha alterada com sucesso!",
    };
  };

  // =====================================================
  // RECUPERAÇÃO DE SENHA POR E-MAIL
  // =====================================================

  const solicitarRecuperacaoSenha = async (email) => {
    const emailLimpo = email?.trim().toLowerCase();

    if (!emailLimpo) {
      return { error: "Informe seu e-mail." };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      emailLimpo,
      {
        redirectTo: window.location.origin,
      }
    );

    if (error) {
      return { error: error.message };
    }

    return {
      message:
        "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
    };
  };

  // =====================================================
  // REDEFINIR SENHA
  // =====================================================

  const redefinirSenha = async (novaSenha) => {
    if (!novaSenha || novaSenha.length < 8) {
      return {
        error: "A senha deve ter pelo menos 8 caracteres.",
      };
    }

    const {
      data: { session },
      error: erroSessao,
    } = await supabase.auth.getSession();

    if (erroSessao || !session) {
      return {
        error:
          "Sua sessão de recuperação expirou. Solicite um novo link.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) {
      return { error: error.message };
    }

    setRecuperacaoSenha(false);

    return {
      message: "Senha redefinida com sucesso!",
    };
  };

  // =====================================================
  // PERMISSÕES DOS USUÁRIOS
  // =====================================================

  const tipoConta = perfil?.tipo_conta;

  const ehCliente = tipoConta === "cliente";
  const ehCorretor = tipoConta === "corretor";
  const ehAdmin = tipoConta === "administrador";

  const podeGerenciarImoveis = ehCorretor || ehAdmin;

  // =====================================================
  // VALOR DO CONTEXTO
  // =====================================================

  const valor = {
    usuario,
    perfil,
    favoritos,
    carregando,
    recuperacaoSenha,

    tipoConta,
    ehCliente,
    ehCorretor,
    ehAdmin,
    podeGerenciarImoveis,

    cadastrar,
    entrar,
    sair,
    alternarFavorito,
    atualizarPerfil,
    atualizarEmail,
    atualizarSenha,
    solicitarRecuperacaoSenha,
    redefinirSenha,
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return contexto;
}
