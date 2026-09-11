/**
 * UTILS: csvToJson (Enterprise Edition)
 * @description Converte o textão bruto de um CSV em um Array de Objetos.
 * Otimizado contra Out-of-Memory usando Regex de match direto, 
 * evitando a cópia excessiva de memória do '.substring()' caractere por caractere.
 * 
 * @param csvText O texto completo do arquivo CSV.
 * @returns Array de dicionários (Record<string, string>)
 */
export function csvToJson(csvText: string): Record<string, string>[] {
  if (!csvText || csvText.trim() === "") return [];

  // 1. Quebra de linha eficiente (O V8 lida bem com isso se não houver filter acoplado)
  const lines = csvText.split(/\r?\n/);
  if (lines.length === 0) return [];

  // Regex padrão de mercado (RFC 4180) para capturar CSV respeitando aspas
  // Ela cria 3 grupos: Texto com aspas duplas, Texto simples, ou Vazio
  const csvRegex = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g;

  /**
   * Helper ultra rápido que usa exec() para rodar no motor em C++ do navegador
   */
  const parseLineFast = (line: string): string[] => {
    const result: string[] = [];
    let match: RegExpExecArray | null;
    
    // Reseta o estado da Regex
    csvRegex.lastIndex = 0; 
    
    while ((match = csvRegex.exec(line))) {
      // Captura o grupo 1 (com aspas) ou grupo 2 (sem aspas)
      let value = match[1] !== undefined ? match[1] : (match[2] !== undefined ? match[2] : "");
      
      // Se veio com aspas duplicadas do Excel (""texto""), converte pra uma só
      if (value) value = value.replace(/""/g, '"');
      
      result.push(value.trim());

      // Prevenção de loop infinito da Regex no final da string
      if (match.index === csvRegex.lastIndex) csvRegex.lastIndex++;
      
      // Se a regex chegar ao final da string sem bater na vírgula final, quebra
      if (match.index + match[0].length >= line.length) break;
    }
    
    // Hack: Se a linha terminar com vírgula (campo vazio no final), a regex precisa adicionar um slot
    if (line.endsWith(",")) result.push("");

    return result;
  };

  // 2. Extrai e normaliza o cabeçalho em caixa alta, garantindo chaves sem espaço
  const rawHeaders = parseLineFast(lines[0]);
  const headers = rawHeaders.map((h, i) => h ? h.trim().toUpperCase() : `COL_${i}`);

  const output: Record<string, string>[] = [];

  // 3. Processamento iterativo (For clássico é mais rápido e gasta menos heap que o .map())
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;

    const values = parseLineFast(line);
    const obj: Record<string, string> = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] !== undefined ? values[j].trim() : "";
    }

    output.push(obj);
  }

  return output;
}