/**
 * BANCO DE DADOS: Modelos de Impressão
 * @description Lista com os nomes oficiais de todos os formatos de etiquetas do sistema.
 * 
 * O comando "as const" no final do array diz para o TypeScript: 
 * "Trate este item como um valor fixo e imutável (readonly), e não como uma variável comum."
 * Isso garante extrema segurança, pois impede o sistema de dar um .push() 
 * ou deletar itens dessa lista acidentalmente.
 */
export const EtiquetasModelos = [
  "Etiqueta Envio", 
  "Etiqueta Simples", 
  "Declaração de Conteúdo", 
  "Folha de Conferência"
] as const;

/**
 * TIPO DINÂMICO: ModelosValidos
 * @description Cria um Union Type estrito baseado nos valores do array de Modelos.
 * 
 * Temos que usar o "[number]" em arrays para que o TS mapeie os índices numéricos.
 * Ele converte as posições do array e transforma diretamente em: 
 * "Etiqueta Envio" | "Etiqueta Simples" | "Declaração de Conteúdo" | "Folha de Conferência"
 */
export type ModelosValidos = typeof EtiquetasModelos[number];