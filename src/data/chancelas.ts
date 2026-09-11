// === IMPORTAÇÕES DE ASSETS (Imagens de Chancela/Correios) ===
import SedexAura from "../assets/logos-etiquetas/logo_sedex_aura.png";
import SedexPrintMax from "../assets/logos-etiquetas/logo_sedex_printmax.png";
import SedexAlphaGraphics from "../assets/logos-etiquetas/logo_sedex_alphagraphics.png";

/**
 * CONTRATO DO REMETENTE
 * Define a estrutura obrigatória que todo remetente fiscal deve ter na aplicação.
 */
export interface ChancelasERemetentes {
  nome: string;
  endereco: string;
  cep: string;
  cnpj: string;
  cidade: string;
  uf: string;
  /** Imagem importada contendo o selo de frete (Ex: Sedex) pago por este remetente */
  chancela: string;
}

/**
 * TIPO: ListaRemetentes
 * @description Utiliza o utilitário Record do TypeScript para criar um dicionário rigoroso.
 * 
 * 1. O primeiro parâmetro (string): É a "etiqueta da gaveta". Define que as chaves 
 *    desse objeto serão textos soltos (Ex: "Aura", "PrintMax").
 * 2. O segundo parâmetro (ChancelasERemetentes): É o "conteúdo da gaveta". Obriga que 
 *    toda vez que essa gaveta for aberta, ela tenha os dados de endereço e cnpj completos.
 */
export type ListaRemetentes = Record<string, ChancelasERemetentes>;

/**
 * BANCO DE DADOS: Remetentes Fiscais
 * @description Dicionário contendo os dados reais das empresas expedidoras das caixas.
 */
export const remetentes: ListaRemetentes = {
  "Aura Corporate": {
    nome: "AURA CORPORATE E COMERCIO S.A",
    endereco: "AV. FICTÍCIA, 1000 - 10º ANDAR - TORRE 1",
    cep: "01000-000",
    cnpj: "11.111.111/0001-11",
    cidade: "São Paulo",
    uf: "SP",
    chancela: SedexAura
  },
  "PrintMax Logistics": {
    nome: "PRINTMAX LOGISTICS S.A",
    endereco: "RUA DAS IMPRESSÕES, 500 - GALPÃO",
    cep: "02000-000",
    cnpj: "22.222.222/0001-22",
    cidade: "São Paulo",
    uf: "SP",
    chancela: SedexPrintMax
  },
  "Alpha Graphics": {
    nome: "Alpha Graphics LTDA",
    endereco: "AV. DA TECNOLOGIA, 300 - ANDAR 2",
    cep: "03000-000",
    cnpj: "33.333.333/0001-33",
    cidade: "São Paulo",
    uf: "SP",
    chancela: SedexAlphaGraphics
  }
};

/**
 * TIPO DINÂMICO: RemetentesValidos
 * @description Extrai as chaves do dicionário (Ex: "Alpha Graphics" | "Aura Corporate ).
 * Usado nas Props para garantir que o sistema só aceite remetentes que realmente existem no banco.
 */
export type RemetentesValidos = keyof typeof remetentes;