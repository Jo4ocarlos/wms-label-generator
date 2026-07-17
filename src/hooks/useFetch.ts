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
  // EFEITO DE BUSCA (Side Effect)
  // ==========================================
  
  useEffect(() => {
    // Cláusula de Guarda (Guard Clause): Se não passar URL, o hook cruza os braços e não faz nada.
    if (!url) return;
    // ==========================================
    // CACHE BUSTING (Anti-Cache)
    // ==========================================
    const timestamp = Date.now();
    // Se a URL já tiver parâmetros (?), usamos '&'. Se não, usamos '?'.
    const separador = url.includes("?") ? "&" : "?"; 
    const urlSemCache = `${url}${separador}nocache=${timestamp}`;
    // Função assíncrona interna (boa prática no React para usar async/await dentro de useEffect)
    const fetchData = async () => {
      // 1. Prepara o terreno (Reseta os estados para a nova busca)
      setLoading(true);
      setData(null);
      setError(null);

      try {
        // 2. Faz a ligação para o servidor
        const response = await fetch(urlSemCache);

        // 3. Valida se o servidor respondeu com sucesso (Status 200-299)
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        // 4. Recebe o pacote de texto bruto (O CSV inteiro)
        const csv = await response.text();
        
        // 5. Passa o texto pela nossa máquina de conversão para transformá-lo em Array de Objetos
        const jsonConvertido = csvToJson(csv);

        // 6. Entrega o dado pronto para o componente Pai
        setData(jsonConvertido);
        
      } catch (error: unknown) {
        // ==========================================
        // TRATAMENTO DE ERROS (Catch)
        // ==========================================
        // O TypeScript trata o erro como 'unknown' (desconhecido) porque no JavaScript
        // é possível dar throw em qualquer coisa (números, strings soltas, arrays, null).
        
        if (error instanceof Error) {
          //MÁGICA DO TYPEGUARD (O "Segurança da Balada")
          // Aqui nós mostramos o RG pro TypeScript e provamos que a variável 'error' 
          // foi realmente construída pela classe oficial 'Error' do JavaScript.
          // Com isso provado, o TypeScript libera o acesso seguro à propriedade '.message'.
          setError(`Ops, deu um erro na busca: ${error.message}`);
          
        } else {
          // O VELHO OESTE DO JAVASCRIPT
          // Caiu aqui porque o sistema (ou uma biblioteca de terceiros) deu um 'throw' 
          // jogando algo que não é um Erro oficial (ex: throw 404, throw "Deu ruim").
          setError('Ocorreu um erro bizarro que não segue o padrão do sistema.');
        }
      } finally {
        // ==========================================
        // FINALIZAÇÃO (Executa sempre, dando certo ou errado)
        // ==========================================
        // Desliga o ícone de carregamento, liberando a tela para o usuário
        setLoading(false);
      }
    };

    // Dispara a função que acabamos de criar
    fetchData();
    
  }, [url]); // A array de dependência garante que o useEffect rode de novo se a URL da empresa mudar

  return { data, loading, error };
};