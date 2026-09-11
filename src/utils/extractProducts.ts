// src/utils/extractProducts.ts

// 1. O CONTRATO (Isso mata o erro de linha vermelha do seu VS Code)
export interface ProdutoExtraido {
  nome: string;
  quantidade: number;
  valor?: string | number; // O TypeScript agora sabe que 'valor' existe e é opcional
}

// 2. A MÁQUINA DE EXTRAÇÃO
export const extrairProdutosDaLoja = (linhaDaPlanilha: Record<string, any>): ProdutoExtraido[] => {
  const produtos: ProdutoExtraido[] = [];
  
  // Defesa contra planilhas bagunçadas.
  // Criamos uma cópia da linha onde TODAS as chaves não têm espaços e são MAIÚSCULAS.
  // Assim, "produto 4", "PRODUTO 4 " e "PRODUTO4" viram a mesma coisa: "PRODUTO4".
  const linhaNormalizada: Record<string, any> = {};
  
  Object.keys(linhaDaPlanilha).forEach(key => {
    const cleanKey = key.toUpperCase().replace(/\s+/g, '');
    linhaNormalizada[cleanKey] = linhaDaPlanilha[key];
  });

  // Assumimos que uma loja não vai receber mais de 40 produtos diferentes em uma única caixa.
  // Varremos os índices de 1 a 40 procurando combinações.
  for (let i = 1; i <= 40; i++) {
    
    // Busca o nome (Ex: PRODUTO1). Se for o índice 1, aceita apenas "PRODUTO" também.
    let nomeProduto = linhaNormalizada[`PRODUTO${i}`];
    if (i === 1 && !nomeProduto) {
      nomeProduto = linhaNormalizada[`PRODUTO`];
    }

    // Se achou um nome de produto válido nesta coluna...
    if (nomeProduto && String(nomeProduto).trim() !== "") {
      
      // Busca a Quantidade (Aceita QTD1, QUANTIDADE1. Fallback para QTD no índice 1)
      let qtdRaw = linhaNormalizada[`QTD${i}`] || linhaNormalizada[`QUANTIDADE${i}`];
      if (i === 1 && !qtdRaw) {
        qtdRaw = linhaNormalizada[`QTD`] || linhaNormalizada[`QUANTIDADE`];
      }
      
      // Busca o Valor (Aceita VALOR1, PRECO1. Fallback para VALOR no índice 1)
      let valorRaw = linhaNormalizada[`VALOR${i}`] || linhaNormalizada[`PRECO${i}`];
      if (i === 1 && !valorRaw) {
        valorRaw = linhaNormalizada[`VALOR`] || linhaNormalizada[`PRECO`];
      }

      // Adiciona ao array formatado
      produtos.push({
        nome: String(nomeProduto).trim(),
        quantidade: parseInt(qtdRaw) || 1, // Se a atendente esquecer a qtd, assume 1
        valor: valorRaw // Manda o valor bruto para o formatador do componente limpar depois
      });
    }
  }

  return produtos;
};