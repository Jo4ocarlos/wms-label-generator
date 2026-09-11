import { useEffect, useState } from "react";

// === IMPORTAÇÕES DE UTILITÁRIOS ===
// Importamos a ferramenta especializada em converter o texto bruto para o nosso formato de gavetas (Record)
import { csvToJson } from "../utils/csvParser";

/**
 * HOOK CUSTOMIZADO: useFetch
 * @description Gerencia o ciclo de vida completo de uma requisição HTTP.
 * Encapsula os estados de carregamento (loading), sucesso (data) e falha (error),
 * removendo toda essa complexidade de infraestrutura de dentro dos componentes visuais.
 * 
 * @param url O endereço (endpoint) público do Google Sheets de onde os dados serão baixados.
 * @returns Um objeto contendo os dados processados, a flag de carregamento e mensagens de erro (se houver).
 */
export const useFetch = (url: string) => {
  // ==========================================
  // ESTADOS DO HOOK
  // ==========================================
  
  // O 'data' agora exige estritamente um Array de Objetos (Record<string, string>[])
  const [data, setData] = useState<Record<string, string>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ==========================================
  // EFEITO DE BUSCA (Side Effect com AbortController)
  // ==========================================
  useEffect(() => {
    if (!url) return;

    // 1. Instancia o controlador de aborto nativo do navegador
    const abortController = new AbortController();
    
    const timestamp = Date.now();
    const separador = url.includes("?") ? "&" : "?"; 
    const urlSemCache = `${url}${separador}nocache=${timestamp}`;

    const fetchData = async () => {
      setLoading(true);
      setData(null);
      setError(null);

      try {
        // 2. Vincula o sinal de aborto à requisição Fetch
        const response = await fetch(urlSemCache, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const csv = await response.text();
        const jsonConvertido = csvToJson(csv);
        
        setData(jsonConvertido);
        setError(null);
      } catch (error: unknown) {
        // 3. Verifica se o erro foi causado por um aborto intencional
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('Requisição cancelada pelo usuário (Race Condition evitada).');
          return; // Sai da função silenciosamente, não altera estado
        }

        if (error instanceof Error) {
          setError(`Ops, deu um erro na busca: ${error.message}`);
        } else {
          setError('Ocorreu um erro bizarro que não segue o padrão do sistema.');
        }
      } finally {
        // Só desliga o loading se a requisição não foi abortada, para evitar
        // piscar a tela caso uma nova requisição já esteja em andamento.
        if (!abortController.signal.aborted) {
            setLoading(false);
        }
      }
    };

    fetchData();

    // 4. A Função de Limpeza (Cleanup Function)
    // O React roda isso SEMPRE que a URL mudar antes de disparar o próximo useEffect.
    // Isso "mata" a requisição anterior, garantindo que ela não polua o estado ao terminar.
    return () => {
      abortController.abort();
    };
    
  }, [url]);

  return { data, loading, error };
};