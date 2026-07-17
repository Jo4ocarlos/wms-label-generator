export interface ProdutoExtraido {
  nome: string;
  quantidade: number;
}

/**
 * Analisa a linha da planilha e descobre automaticamente qual é o formato 
 * dos dados (Horizontal Padrão ou Horizontal Mapeado) para extrair os itens.
 */
export const extrairProdutosDaLoja = (linhaDeProdutos: Record<string, string>): ProdutoExtraido[] => {
  const produtosEncontrados: ProdutoExtraido[] = [];

  // 1. TENTA O NOVO FORMATO (Urbana Wear: Colunas "PRODUTO 1", "QTD 1")
  // Vasculha as colunas buscando qualquer uma que comece com a palavra "PRODUTO"
  const colunasDeProduto = Object.keys(linhaDeProdutos).filter((coluna) =>
    coluna.toUpperCase().trim().startsWith("PRODUTO")
  );
// Se ele achou pelo menos uma coluna chamada "PRODUTO...", aciona a lógica nova!
  if (colunasDeProduto.length > 0) {
    colunasDeProduto.forEach((colunaProduto) => {
      // Pega o número do produto. Ex: Tira "PRODUTO " e sobra só "1" ou "2"
      const indice = colunaProduto.toUpperCase().replace("PRODUTO", "").trim();

      const nomeDoProduto = linhaDeProdutos[colunaProduto];
      
      // BUSCA ESTRITA: O Produto X só procura na QTD X. Isso mata o bug do "roubo" de quantidade!
      let quantidadeDoProduto = linhaDeProdutos[`QTD ${indice}`] || linhaDeProdutos[`QTD${indice}`];

      // EXCEÇÃO INTELIGENTE: Se for o Produto 1, e o usuário tiver chamado a coluna só de "QTD" ou "QUANTIDADE", a gente aceita.
      if (!quantidadeDoProduto && indice === "1") {
        quantidadeDoProduto = linhaDeProdutos["QTD"] || linhaDeProdutos["QUANTIDADE"];
      }

      // Se a célula do produto não estiver vazia e tiver uma quantidade, guarda na caixa!
      if (nomeDoProduto && nomeDoProduto.trim() !== "" && quantidadeDoProduto) {
        const qtdConvertida = Number(quantidadeDoProduto);
        
        // Garante que é um número matemático válido e maior que zero
        if (!isNaN(qtdConvertida) && qtdConvertida > 0) {
          produtosEncontrados.push({
            nome: nomeDoProduto.trim(),
            quantidade: qtdConvertida,
          });
        }
      }
    });
  }

  return produtosEncontrados;
};