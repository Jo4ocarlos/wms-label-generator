// === IMPORTAÇÕES DE ASSETS (Logos das Marcas Fictícias) ===
import logoAuraCalcados from "../assets/logos-etiquetas/logo_aura_calcados.png";
import logoMercadoFresco from "../assets/logos-etiquetas/logo_mercado_fresco.png";
import logoUrbanaWear from '../assets/logos-etiquetas/logo_urbana_wear.png';
import logoEssenciaBrasil from '../assets/logos-etiquetas/logo_essencia_brasil.png';
import logoEssenciaParis from '../assets/logos-etiquetas/logo_essencia_paris.png';

/**
 * CONTRATO DE DADOS DA EMPRESA
 * Define a estrutura obrigatória de URLs e imagens necessária para cadastrar uma nova marca no sistema.
 */
export interface DadosEmpresa {
  /** Identificador único numérico da marca */
  id: number;
  /** Imagem importada da logo que aparecerá no cabeçalho das etiquetas e folhas de conferência */
  logo: string;
  /** Endpoint público do Google Sheets (formato CSV) contendo o cadastro de endereços das lojas */
  url_endereco: string;
  /** Endpoint público do Google Sheets (formato CSV) contendo a lista de produtos de cada loja */
  url_products: string;
  /** Link visual da planilha no Google Drive para o usuário acessar via botão "Editar Planilha" */
  url_edit: string;
  remetenteObrigatorio?: string;
}

/**
 * TIPO: ListaEmpresas
 * @description Utiliza o utilitário Record do TypeScript para padronizar o dicionário.
 * - Chave (string): O nome da marca em texto.
 * - Valor (DadosEmpresa): O objeto contendo todas as URLs e imagens exigidas.
 */
export type ListaEmpresas = Record<string, DadosEmpresa>;

/**
 * BANCO DE DADOS: Empresas Participantes (Configuração Global)
 * @description Central de mapeamento do sistema. É daqui que o App.tsx descobre quais 
 * planilhas precisa baixar (via Fetch) dependendo da empresa que o usuário selecionou no menu.
 * 
 * ATENÇÃO: As URLs abaixo são placeholders. Substitua pelos links dos seus Google Sheets fictícios.
 */
export const companiesData: ListaEmpresas = {
  "Aura Calçados": {
    id: 1,
    logo: logoAuraCalcados,
    url_endereco: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiA9lgxwRGm0XXUy8rCgVCIDtBJiMM4r4QkxKEO5rzrG1ZckjjplzJC4ZnFua0b_-lhLY68I6RrNYh/pub?gid=1368390669&single=true&output=csv",
    url_products: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiA9lgxwRGm0XXUy8rCgVCIDtBJiMM4r4QkxKEO5rzrG1ZckjjplzJC4ZnFua0b_-lhLY68I6RrNYh/pub?gid=1813591796&single=true&output=csv",
    url_edit: "https://docs.google.com/spreadsheets/d/1w_B42mbCnbCjQrR03OEOpC1OyNK6K0beNGnL63D6_cE/edit?usp=sharing",
    remetenteObrigatorio: "Aura Corporate"// Bloqueia esse remetente
  },

  "Mercado Fresco": {
    id: 2,
    logo: logoMercadoFresco,
    url_endereco: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSamHFHhXLcfr8RDxm4WnYUqkah8MWgIP_ff-1SCqdfTtcju28eE7-_3yoR5ez6oJEtmV5VVLAZUJXa/pub?gid=1237666261&single=true&output=csv",
    url_products: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSamHFHhXLcfr8RDxm4WnYUqkah8MWgIP_ff-1SCqdfTtcju28eE7-_3yoR5ez6oJEtmV5VVLAZUJXa/pub?gid=1443431923&single=true&output=csv",
    url_edit: "https://docs.google.com/spreadsheets/d/1c7pAhveS8_A4w8HDIcqf82Ur_iIlZ3PfJVdYH7nlvp4/edit?usp=sharing",
  },

  "Urbana Wear": {
    id: 3,
    logo: logoUrbanaWear,
    url_endereco: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0zfoJ6Sg3xCByzCcqwfJ8bMpChVXI_LOJs34niomAr5cvIIcnCiW4dmBl6ZMd9Lwt1a1dWdzRI2a7/pub?gid=836980894&single=true&output=csv",
    url_products: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0zfoJ6Sg3xCByzCcqwfJ8bMpChVXI_LOJs34niomAr5cvIIcnCiW4dmBl6ZMd9Lwt1a1dWdzRI2a7/pub?gid=377421369&single=true&output=csv",
    url_edit: "https://docs.google.com/spreadsheets/d/1xIyINRUhce8msjjUtxU7T_9vrBMFanQkIArxKqsCkAU/edit?usp=sharing",
  },

  "Essência Brasil": {
    id: 4,
    logo: logoEssenciaBrasil,
    url_endereco: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTN6Nw0jOEvHDc_hB-hcNDVDgSrOcwCKTUn2LxL7dQE59QADxGZvOdOO8Aad3kMvcZCn76yKkK5Fmwg/pub?gid=1912244474&single=true&output=csv",
    url_products: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTN6Nw0jOEvHDc_hB-hcNDVDgSrOcwCKTUn2LxL7dQE59QADxGZvOdOO8Aad3kMvcZCn76yKkK5Fmwg/pub?gid=1077971033&single=true&output=csv",
    url_edit: "https://docs.google.com/spreadsheets/d/1dkGVT3TgTsThuiG4XbTDAIkNmrEEpzFAP0WnXt3Qg_k/edit?usp=sharing",
  },

  "Essência Paris": {
    id: 5,
    logo: logoEssenciaParis,
    url_endereco: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9LTGbtuWjbn62KuB0RCXKqDtFBHzBM2xsyt3v90n3P-VxClapXS3byW3NpOYdvH1VgXNtz1YIjb5j/pub?gid=1303785896&single=true&output=csv",
    url_products: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9LTGbtuWjbn62KuB0RCXKqDtFBHzBM2xsyt3v90n3P-VxClapXS3byW3NpOYdvH1VgXNtz1YIjb5j/pub?gid=408046724&single=true&output=csv",
    url_edit: "https://docs.google.com/spreadsheets/d/LINK_FAKE_ESSENCIA_PR_EDIT/edit",
  },
};

/**
 * TIPO DINÂMICO: EmpresaValida
 * @description Extrai dinamicamente as chaves do dicionário.
 * Isso blinda o sistema, garantindo que os estados do React e as Props só aceitem
 * nomes de empresas que realmente estejam configuradas acima.
 */
export type EmpresaValida = keyof typeof companiesData;