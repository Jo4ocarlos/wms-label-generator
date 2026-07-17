/**
 * UTILS: classificarTransporte
 * @description Analisa um CEP e decide automaticamente se a entrega deve ser
 * feita por Motoboy (Grande São Paulo) ou Correios (Interior e outros Estados).
 * 
 * Regra oficial dos Correios para SP:
 * - 01000 a 05999: São Paulo (Capital)
 * - 06000 a 09999: Região Metropolitana de SP (Osasco, Guarulhos, ABC, etc)
 * - 11000 em diante: Interior, Litoral ou outros Estados.
 * 
 * @param cepBruto O CEP exatamente como veio da planilha (ex: "04571-010", " 04571010 ")
 * @returns A string "MOTOBOY" ou "CORREIOS"
 */
export function classificarTransporte(cepBruto: string): "MOTOBOY" | "CORREIOS" {
  // 1. Limpeza brutal: Remove tudo que não for número (tira o traço, letras, espaços)
  // O \D na Regex significa "Qualquer coisa que Não seja Dígito"
  const cepLimpo = cepBruto.replace(/\D/g, "");

  // Se o CEP vier bugado ou incompleto da planilha, mandamos por Correios por segurança
  if (cepLimpo.length !== 8) return "CORREIOS";

  // 2. Extração: Pega apenas os 2 primeiros números do CEP
  // Ex: "04571010" -> "04" -> transforma no número 4
  const prefixo = parseInt(cepLimpo.substring(0, 2), 10);

  // 3. A Regra de Negócio: Se o prefixo for entre 1 e 9, é Grande São Paulo!
  if (prefixo >= 1 && prefixo <= 9) {
    return "MOTOBOY";
  }

  // Se passou de 9 (ex: 11, 20, 80), é Correios!
  return "CORREIOS";
}