// === FUNÇÕES AUXILIARES (Uso Interno) ===

/**
 * FUNÇÃO: parseCSVLine
 * @description Lê uma linha de texto CSV e separa os valores por vírgula.
 * O grande diferencial desta função é a inteligência de ignorar vírgulas
 * que estejam dentro de textos entre aspas (ex: "Rua Berrini, 105").
 * Um simples .split(',') quebraria o endereço no meio; esta função impede isso.
 * 
 * @param text A string bruta representando uma única linha do arquivo CSV.
 * @returns Um array de strings com os valores já separados, limpos e sem aspas.
 */
function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let startValueIndex = 0;
  
  // Flag que avisa a máquina se ela está lendo um texto dentro ou fora de aspas
  let insideQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Liga/Desliga a flag ao encontrar aspas
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } 
    // Só corta a palavra se achar uma vírgula E não estiver dentro de um texto com aspas
    else if (char === ',' && !insideQuotes) {
      let val = text.substring(startValueIndex, i).trim();
      
      // Remove as aspas em volta do texto, se houver, para o React receber o dado limpo
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      
      result.push(val);
      startValueIndex = i + 1; // Pula a vírgula para começar a próxima palavra
    }
  }
  
  // Captura o último valor da linha (que não termina com vírgula)
  let val = text.substring(startValueIndex).trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  result.push(val);
  
  return result;
}

// ==========================================
// FUNÇÕES EXPORTADAS (Uso Público)
// ==========================================

/**
 * UTILS: csvToJson
 * @description Converte o textão bruto do arquivo CSV baixado do Google Sheets
 * em um Array de Objetos JavaScript limpo, padronizado e fácil de manipular.
 * 
 * @param csvText O texto completo retornado pela requisição da API/Google Sheets.
 * @returns Um array de dicionários (Record) onde as chaves são as colunas (ex: { NOME_LOJA: "Shopping" }).
 */
export function csvToJson(csvText: string): Record<string, string>[] {
  // Corta o textão em um array de linhas, usando Regex (\r?\n) para aceitar
  // quebras de linha tanto do Windows quanto do Mac/Linux. Ignora linhas vazias.
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
  
  if (lines.length === 0) return []; // Retorna vazio se a planilha estiver em branco

  // Extrai o cabeçalho (a primeira linha da planilha, que dita o nome das chaves)
  const headers = parseCSVLine(lines[0]); 

  // Pega todas as linhas de dados (ignorando o cabeçalho com o .slice(1)) e mapeia para objetos
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj: Record<string, string> = {};
    
    // Para cada coluna do cabeçalho, associamos o valor da linha atual
    headers.forEach((header, index) => {
      // Padroniza a chave: Tudo maiúsculo e sem espaços sobrando. 
      // Se a coluna vier sem nome, cria um nome genérico tipo "COL_5" para não bugar.
      const key = header ? header.trim().toUpperCase() : `COL_${index}`;
      
      // Guarda o valor no objeto final
      obj[key] = values[index] ? values[index].trim() : ""; 
    });
    
    return obj;
  });
}