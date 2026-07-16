/**
 * UTILS: formatarTexto
 * @description O "Higienizador de Strings" do sistema.
 * Esta função é o coração do cruzamento de dados (Inner Join) no App.tsx.
 * Ela garante que falhas de digitação humana nas planilhas (como "SÃO PAULO", 
 * "sao paulo ", "São Paulo") sejam convertidas para uma versão imutável ("SAO PAULO") 
 * antes da comparação, evitando bugs de lojas não encontradas por causa de um acento ou espaço.
 * 
 * @param texto O texto bruto extraído da célula do Excel/CSV.
 * @returns A string tratada, sem acentos, toda em maiúsculo e sem espaços nas pontas.
 */
export function formatarTexto(texto: string): string {
  // Cláusula de guarda: Se a célula vier vazia, null ou undefined, devolve string vazia
  if (!texto) return "";
  
  return texto
    .toString()                      // Segurança: Garante que é texto (caso o Excel envie um número puro, como CEP)
    .normalize("NFD")                // Decompõe o caractere: Separa a letra base do seu acento (ex: "é" vira "e" + "´")
    .replace(/[\u0300-\u036f]/g, "") // Regex: Varre a string e destrói exclusivamente os códigos correspondentes aos acentos
    .toUpperCase()                   // Padronização: Transforma tudo em CAIXA ALTA
    .trim();                         // Acabamento: Corta os espaços em branco perdidos no começo ou no final da palavra
}