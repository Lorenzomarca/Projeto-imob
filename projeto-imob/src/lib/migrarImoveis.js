
import { supabase } from "./supabase";

import aurora from "../assets/images/aurora.jpg";
import dvert from "../assets/images/dvert.jpg";
import sky from "../assets/images/skyline.jpg";
import ocn from "../assets/images/ocean.jpg";
import saco from "../assets/images/residencial_saco_grande.jpg";
import bosque from "../assets/images/casa-bosque.jpg";
import agro from "../assets/images/saco-grande.jpg";
import trindade from "../assets/images/casa_modelo_06.jpg";
import abraa from "../assets/images/abraao.jpg";
import ifn from "../assets/images/infinity.jpg";
import resed from "../assets/images/marina.jpg";
import atlantida from "../assets/images/jardim-atlantico.jpg";

const imoveisAntigos = [
  {
    nome: "Casa Saco Grande",
    cidade: "Florianópolis",
    tipo: "Casa",
    quartos: 3,
    area: 140,
    vagas: 2,
    preco: 1450000,
    imagem: saco,
    descricao: "Casa com ambientes amplos em Saco Grande.",
  },
  {
    nome: "Casa Bosque Premium",
    cidade: "Florianópolis",
    tipo: "Casa",
    quartos: 4,
    area: 280,
    vagas: 3,
    preco: 2490000,
    imagem: bosque,
    descricao: "Residência premium com amplo espaço.",
  },
  {
    nome: "Edifício Agronômica",
    cidade: "Florianópolis",
    tipo: "Cobertura",
    quartos: 3,
    area: 115,
    vagas: 2,
    preco: 1790000,
    imagem: agro,
    descricao: "Cobertura em uma região valorizada.",
  },
  {
    nome: "Villa Trindade",
    cidade: "Florianópolis",
    tipo: "Casa",
    quartos: 6,
    area: 410,
    vagas: 4,
    preco: 2499000,
    imagem: trindade,
    descricao: "Casa ampla na região da Trindade.",
  },
  {
    nome: "Apartamento Abraão",
    cidade: "Florianópolis",
    tipo: "Apartamento",
    quartos: 2,
    area: 67,
    vagas: 1,
    preco: 770000,
    imagem: abraa,
    descricao: "Apartamento funcional no bairro Abraão.",
  },
  {
    nome: "Cobertura Infinity",
    cidade: "Balneário Camboriú",
    tipo: "Cobertura",
    quartos: 4,
    area: 260,
    vagas: 3,
    preco: 3750000,
    imagem: ifn,
    descricao: "Cobertura de alto padrão em Balneário Camboriú.",
  },
  {
    nome: "Marina Residence",
    cidade: "Itajaí",
    tipo: "Apartamento",
    quartos: 2,
    area: 92,
    vagas: 2,
    preco: 980000,
    imagem: resed,
    descricao: "Apartamento moderno em Itajaí.",
  },
  {
    nome: "Residencial Jardim Atlântico",
    cidade: "Florianópolis",
    tipo: "Apartamento",
    quartos: 3,
    area: 180,
    vagas: 2,
    preco: 1190000,
    imagem: atlantida,
    descricao: "Apartamento residencial no Jardim Atlântico.",
  },
  {
    nome: "Aurora Residence",
    cidade: "Balneário Camboriú",
    tipo: "Apartamento",
    quartos: 3,
    area: 140,
    vagas: 2,
    preco: 1450000,
    imagem: aurora,
    descricao: "Empreendimento de alto padrão.",
  },
  {
    nome: "D'Vert Residence",
    cidade: "Itajaí",
    tipo: "Apartamento",
    quartos: 3,
    area: 125,
    vagas: 2,
    preco: 890000,
    imagem: dvert,
    descricao: "Apartamento moderno em empreendimento em construção.",
  },
  {
    nome: "Skyline Tower",
    cidade: "Itapema",
    tipo: "Apartamento",
    quartos: 3,
    area: 160,
    vagas: 2,
    preco: 1320000,
    imagem: sky,
    descricao: "Apartamento exclusivo em Itapema.",
  },
  {
    nome: "Ocean View",
    cidade: "Bombinhas",
    tipo: "Apartamento",
    quartos: 4,
    area: 190,
    vagas: 2,
    preco: 2190000,
    imagem: ocn,
    descricao: "Apartamento com vista para o mar.",
  },
];

export async function migrarImoveis() {
  console.log("========== INÍCIO DA MIGRAÇÃO ==========");

  // 1. Verificar usuário autenticado.
  const {
    data: { user },
    error: erroAuth,
  } = await supabase.auth.getUser();

  console.log("ID do usuário autenticado:", user?.id ?? null);
  console.log("Erro de autenticação:", erroAuth);

  if (erroAuth || !user) {
    throw new Error(
      "Não foi possível identificar o usuário autenticado."
    );
  }

  // 2. Verificar o perfil.
  const {
    data: perfil,
    error: erroPerfil,
  } = await supabase
    .from("perfis")
    .select("id, nome, tipo_conta")
    .eq("id", user.id)
    .maybeSingle();

  console.log("Perfil encontrado:", perfil);
  console.log("Erro ao consultar perfil:", erroPerfil);

  if (erroPerfil) {
    throw new Error(
      `Erro ao consultar perfil: ${erroPerfil.message}`
    );
  }

  if (!perfil) {
    throw new Error(
      "Não foi encontrado um perfil para o usuário autenticado."
    );
  }

  if (!["administrador", "corretor"].includes(perfil.tipo_conta)) {
    throw new Error(
      `O perfil "${perfil.tipo_conta}" não pode migrar imóveis.`
    );
  }

  const resultados = {
    cadastrados: 0,
    ignorados: 0,
  };

  // 3. Migrar os imóveis.
  for (const imovel of imoveisAntigos) {
    console.log(`Processando: ${imovel.nome}`);

    const {
      data: existente,
      error: erroBusca,
    } = await supabase
      .from("imoveis")
      .select("id")
      .eq("nome", imovel.nome)
      .eq("cidade", imovel.cidade)
      .maybeSingle();

    if (erroBusca) {
      throw new Error(
        `Erro ao consultar "${imovel.nome}": ${erroBusca.message}`
      );
    }

    if (existente) {
      console.log(`Imóvel já cadastrado: ${imovel.nome}`);
      resultados.ignorados++;
      continue;
    }

    // 4. Carregar a imagem local.
    const respostaImagem = await fetch(imovel.imagem);

    if (!respostaImagem.ok) {
      throw new Error(
        `Não foi possível carregar a imagem de "${imovel.nome}".`
      );
    }

    const arquivo = await respostaImagem.blob();

    const caminhoOriginal = new URL(
      imovel.imagem,
      window.location.origin
    ).pathname;

    const extensao =
      caminhoOriginal.match(/\.(jpg|jpeg|png|webp)$/i)?.[1]?.toLowerCase() ||
      "jpg";

    const tipoMime =
      extensao === "jpg" || extensao === "jpeg"
        ? "image/jpeg"
        : `image/${extensao}`;

    const slug = imovel.nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const caminho = `${slug}.${extensao}`;

    // 5. Enviar a imagem. Se já existir, reutilizar o caminho.
    const {
      error: erroUpload,
    } = await supabase.storage
      .from("imagens-imoveis")
      .upload(caminho, arquivo, {
        upsert: false,
        contentType: arquivo.type || tipoMime,
      });

    if (erroUpload) {
      const mensagemErro = erroUpload.message.toLowerCase();

      const arquivoJaExiste =
        erroUpload.statusCode === "409" ||
        mensagemErro.includes("already exists") ||
        mensagemErro.includes("resource already exists");

      if (arquivoJaExiste) {
        console.log(`Imagem existente: ${caminho}`);
      } else {
        console.error("Erro no upload:", erroUpload);

        throw new Error(
          `Erro ao enviar a imagem de "${imovel.nome}": ${erroUpload.message}`
        );
      }
    }

    // 6. Obter a URL pública.
    const { data: urlPublica } = supabase.storage
      .from("imagens-imoveis")
      .getPublicUrl(caminho);

    // 7. Cadastrar o imóvel.
    const agora = new Date().toISOString();

    const novoImovel = {
      nome: imovel.nome,
      descricao: imovel.descricao,
      tipo: imovel.tipo,
      finalidade: "venda",
      preco: imovel.preco,
      cidade: imovel.cidade,
      quartos: imovel.quartos,
      vagas: imovel.vagas,
      area: imovel.area,
      imagem_url: urlPublica.publicUrl,
      publicado: true,
      criado_por: user.id,
      criado_em: agora,
      atualizado_em: agora,
    };

    const {
      data: imovelInserido,
      error: erroCadastro,
    } = await supabase
      .from("imoveis")
      .insert(novoImovel)
      .select("id, nome")
      .single();

    if (erroCadastro) {
      console.error("Erro no cadastro:", erroCadastro);

      throw new Error(
        `A imagem de "${imovel.nome}" foi enviada, mas o cadastro falhou: ${erroCadastro.message}`
      );
    }

    console.log("Imóvel cadastrado:", imovelInserido);
    resultados.cadastrados++;
  }

  console.log("Migração finalizada:", resultados);

  return resultados;
}
