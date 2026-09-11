import { useState, useEffect, useMemo } from "react";
import './App.css';

// === IMPORTAÇÕES DE COMPONENTES ===
import PainelControles from "./components/painel-controles/PainelControles";
import EtiquetaEnvio from "./components/etiqueta/EtiquetaEnvio";
import EtiquetaSimples from "./components/EtiquetaSimples/EtiquetaSimples";
import FolhaDeConferencia from "./components/folha-conferencia/FolhaDeConferencia";
import DeclaracaoConteudo from "./components/declaracao-conteudo/DeclaracaoConteudo";

// === IMPORTAÇÕES DE DADOS E TIPOS ===
import { companiesData, type EmpresaValida } from "./data/empresas";
import { EtiquetasModelos, type ModelosValidos } from "./data/etiquetasModelos";
import { remetentes, type RemetentesValidos } from "./data/chancelas";

// === IMPORTAÇÕES DE HOOKS E UTILS ===
import { useFetch } from "./hooks/useFetch";
import { formatarTexto } from "./utils/normalizeText";
import { type ProdutoExtraido,extrairProdutosDaLoja } from "./utils/extractProducts";
import { classificarTransporte } from "./utils/regrasFrete";

/**
 * TIPAGEM DE LOJA UNIFICADA
 * Define o formato exato que a "Caixa Organizadora" terá após o cruzamento
 * da planilha de endereços com a planilha de produtos.
 */
interface LojaUnificada {
  endereco: Record<string, string>; // Dados brutos da linha do Google Sheets
  produtos: ProdutoExtraido[]; // O array de produtos extraído e limpo
}


/**
 * COMPONENTE PRINCIPAL: App
 * Atua como o "Gerente" do sistema. Ele é o único componente inteligente (Stateful).
 * Responsável por gerenciar os filtros ativos, buscar as informações nas planilhas,
 * cruzar os dados brutos e distribuí-los já mastigados para os componentes visuais.
 */
function App() {
  // ==========================================
  // 1. ESTADOS GLOBAIS (A Memória do Gerente)
  // ==========================================
  const [empresaAtiva, setEmpresaAtiva] = useState<EmpresaValida>('Aura Calçados');
  const [etiquetaAtiva, setEtiquetaAtiva] = useState<ModelosValidos>("Declaração de Conteúdo");
  const [remetenteAtivo, setRemementeAtivo] = useState<RemetentesValidos>("Aura Corporate");
  // Estado que guarda o que o usuário digitou na barra de busca
  const [termoBusca, setTermoBusca] = useState<string>("")
  // Qual Estado o usuário quer ver agora? ("" significa "Todos"), estado para filtrar por "UF"
  const [destinoAtivo, setDestinoAtivo] = useState<string>("");
    // Forçar geração de etiquetas de lojas mesmo sem produtos cadastrados
  const [forcarEtiquetasVazias, setForcarEtiquetasVazias] = useState<boolean>(false);
  

 // ==========================================
  // REGRAS DE NEGÓCIO E EFEITOS
  // ==========================================
  useEffect(() => {
    const dadosDaNovaEmpresa = companiesData[empresaAtiva];
    
    if (dadosDaNovaEmpresa?.remetenteObrigatorio) {
      // Regra 1: A nova empresa exige um remetente fiscal travado
      setRemementeAtivo(dadosDaNovaEmpresa.remetenteObrigatorio as RemetentesValidos);
    } else {
      // Regra 2: A nova empresa é livre.
      // Descobre quem são os remetentes "Vips" (Exclusivos de outras marcas)
      const remetentesTravados = Object.values(companiesData)
        .map(emp => emp.remetenteObrigatorio)
        .filter(Boolean);
        
      // Usa a forma funcional do setState para garantir que estamos lendo o valor ATUAL e exato
      setRemementeAtivo((remetenteAtual) => {
        // Se o remetente atual na tela for exclusivo de outra empresa, reseta para o genérico.
        // Se não for, mantém o que o usuário já tinha escolhido.
        if (remetentesTravados.includes(remetenteAtual)) {
          return 'Aura Corporate' as RemetentesValidos; // <-- Substitua pelo seu Remetente Padrão (Fallback)
        }
        return remetenteAtual;
      });
    }
  }, [empresaAtiva]); // A única dependência é a empresa.

  // ==========================================
  // 3. DICIONÁRIOS E BUSCA DE DADOS (Fetch)
  // ==========================================
  // Aponta para o objeto exato contendo URL, ID e Logos da empresa e transportadora escolhidas
  const dadosDaEmpresaAtual = companiesData[empresaAtiva];
  const dadosRemetenteAtual = remetentes[remetenteAtivo];

  // Dispara a requisição para o Google Sheets (Custom Hook)
  const { data: lojas } = useFetch(dadosDaEmpresaAtual.url_endereco);
  const { data: lojasEprodutos } = useFetch(dadosDaEmpresaAtual.url_products);

  // ==========================================
  // Indexação de Produtos O(M)
  // Criamos dicionários (Hash Maps) para busca instantânea O(1)
  // ==========================================
  const { mapProdutosPorId, mapProdutosPorNome } = useMemo(() => {
    const mapId = new Map<string, any>();
    const mapNome = new Map<string, any>();

    if (!lojasEprodutos) return { mapProdutosPorId: mapId, mapProdutosPorNome: mapNome };

    lojasEprodutos.forEach(lojaProd => {
      const idProd = formatarTexto(lojaProd.ID_CONFERENCIA || "");
      const nomeProd = formatarTexto(lojaProd.NOME_LOJA || lojaProd["NOME DA LOJA"] || lojaProd.LOJA || "");

      if (idProd) mapId.set(idProd, lojaProd);
      if (nomeProd) mapNome.set(nomeProd, lojaProd);
    });

    return { mapProdutosPorId: mapId, mapProdutosPorNome: mapNome };
  }, [lojasEprodutos]);

// 1. Identifica lojas que não possuem produtos (Inconsistências)
  const lojasSemProdutos = useMemo(() => {
    if (!lojas) return [];

    return lojas.filter((lojaEndereco) => {
      const idEnd = formatarTexto(lojaEndereco.ID_CONFERENCIA || "");
      const nomeEnd = formatarTexto(lojaEndereco.NOME_LOJA || lojaEndereco["NOME DA LOJA"] || lojaEndereco.LOJA || "");

      // Busca instantânea O(1) no Map
      const linhaProd = mapProdutosPorId.get(idEnd) || mapProdutosPorNome.get(nomeEnd);

      if (linhaProd) {
        const produtosDestaLinha = extrairProdutosDaLoja(linhaProd);
        return produtosDestaLinha.length === 0;
      }
      return true;
    });
  }, [lojas, mapProdutosPorId, mapProdutosPorNome]);

  // 2. Realiza a junção baseada na regra de negócio (Join O(N))
  const lojasComProdutosEEndereco = useMemo(() => {
    if (!lojas) return [];

    return lojas.reduce((acc: LojaUnificada[], lojaEndereco) => {
      const idEnd = formatarTexto(lojaEndereco.ID_CONFERENCIA || "");
      const nomeEnd = formatarTexto(lojaEndereco.NOME_LOJA || lojaEndereco["NOME DA LOJA"] || lojaEndereco.LOJA || "");

      // Busca instantânea O(1) no Map
      const linhaDeProdutosDestaLoja = mapProdutosPorId.get(idEnd) || mapProdutosPorNome.get(nomeEnd);

      const produtosDaLoja = linhaDeProdutosDestaLoja 
        ? extrairProdutosDaLoja(linhaDeProdutosDestaLoja) 
        : [];

      if (produtosDaLoja.length > 0 || forcarEtiquetasVazias) {
        acc.push({
          endereco: lojaEndereco,
          produtos: produtosDaLoja
        });
      }

      return acc;
    }, []);
  }, [lojas, mapProdutosPorId, mapProdutosPorNome, forcarEtiquetasVazias]);

  /**
   * EXTRAÇÃO DE UFs ÚNICAS
   * Vasculha todas as lojas da ação, pega a coluna UF, e usa o Set() para 
   * remover as repetições (ex: se tiver 30 lojas em SP, "SP" só aparece uma vez na lista). (isso é usado para criarmos o select no PainelControles.tsx)
   */
  const listaDeUfsUnicas = useMemo(() => {
    return Array.from(
      new Set(
        lojasComProdutosEEndereco
          ?.map((loja) => loja.endereco.UF?.trim()) // Pega só a coluna UF e limpa os espaços
          .filter((uf) => uf) // Joga fora os que vierem vazios ou indefinidos
      )
    ).sort(); // Coloca em ordem alfabética pra ficar bonito no Painel!
  }, [lojasComProdutosEEndereco]);

  /**
   * FILTRAGEM COMBINADA (Busca Livre + Destino/Logística)
   * Pega a lista já cruzada de endereços e produtos e filtra com base no que 
   * o usuário digitou ou selecionou no Painel de Controles.
   */
  const lojasFiltradasPorBusca = useMemo(() => {
    return lojasComProdutosEEndereco?.filter((loja) => {
      // --- FILTRO 1: DESTINO OU LOGÍSTICA ---
      let passouFiltroDestino = false;
      
      if (destinoAtivo === "") {
        passouFiltroDestino = true; 
      } else if (destinoAtivo === "MOTOBOY" || destinoAtivo === "CORREIOS") {
        const tipoLogistica = classificarTransporte(loja.endereco.CEP || "");
        passouFiltroDestino = tipoLogistica === destinoAtivo;
      } else {
        passouFiltroDestino = loja.endereco.UF?.trim() === destinoAtivo;
      }

      // --- FILTRO 2: BUSCA LIVRE ---
      let passouFiltroBusca = true; // Por padrão, deixa passar

      if (termoBusca) {
        const termoLimpo = formatarTexto(termoBusca);
        const nomeDaLoja = formatarTexto(loja.endereco.NOME_LOJA || loja.endereco.LOJA || loja.endereco["NOME DA LOJA"] || "");
        const cep = formatarTexto(loja.endereco.CEP || "");
        const cidade = formatarTexto(loja.endereco.CIDADE || "");
        const rua = formatarTexto(loja.endereco.ENDERECO || loja.endereco.RUA || loja.endereco["NOME DA RUA"] || loja.endereco.LOGRADOURO || "");

        passouFiltroBusca = (
          nomeDaLoja.includes(termoLimpo) ||
          cep.includes(termoLimpo) ||
          cidade.includes(termoLimpo) ||
          rua.includes(termoLimpo)
        );
      }

      // Retorna true apenas se a loja satisfizer ambas as condições
      return passouFiltroDestino && passouFiltroBusca;
    }); 
  }, [lojasComProdutosEEndereco, destinoAtivo, termoBusca]);

  // ==========================================
  // CONFIGURAÇÃO DINÂMICA DE IMPRESSORA
  // ==========================================
  // O React lê qual menu está ativo e devolve a medida exata da bobina
  const getConfigPagina = () => {
    switch (etiquetaAtiva) {
      case "Etiqueta Envio":
        return { size: "100mm 80mm", margin: "0" };
      case "Etiqueta Simples":
        return { size: "100mm 40mm", margin: "0" };
      case "Declaração de Conteúdo":
      case "Folha de Conferência":
        return { size: "A4", margin: "10mm" }; // Margem de segurança para impressora comum
      default:
        return { size: "auto", margin: "auto" };
    }
  };

  const printConfig = getConfigPagina();
  // ==========================================
  // 5. RENDERIZAÇÃO (Interface)
  // ==========================================
  return (
    <div className="app-layout">
      {/* 🖨️ CSS DINÂMICO DE IMPRESSÃO */}
    {/* Essa tag <style> muda as regras da impressora em tempo real */}
    <style>
      {`
        @media print {
          @page {
            size: ${printConfig.size};
            margin: ${printConfig.margin};
          }
        }
      `}
    </style>
      {/* 
        PAINEL DE CONTROLES (Componente Apresentacional) 
        Nenhum dado é importado dentro dele, tudo é passado via Props seguindo a arquitetura limpa.
      */}
    
      <PainelControles
          empresaAtiva={empresaAtiva}
          onEmpresaChange={setEmpresaAtiva}
          etiquetaAtiva={etiquetaAtiva}
          onEtiquetaChange={setEtiquetaAtiva}
          remetenteAtivo={remetenteAtivo}
          onRemetenteChange={setRemementeAtivo}
          termoBusca={termoBusca}
          onTermoBuscaChange={setTermoBusca}
          destinoAtivo={destinoAtivo}
          onDestinoChange={setDestinoAtivo}
          // ========================================================
          // Listas completas para montar as opções dos <select>
          listaEmpresas={Object.keys(companiesData) as EmpresaValida[]}
          listaModelos={EtiquetasModelos}
          listaRemetentes={Object.keys(remetentes) as RemetentesValidos[]}
          listaUfs={listaDeUfsUnicas}// Entregando a lista que geramos usando o Set()
          linkPlanilha={dadosDaEmpresaAtual.url_edit}
        />
      {/* Container Pai que vai jogar um para cada lado */}
      <main className="main-content">
        
        {/* FILHO 1: ÁREA DE IMPRESSÃO DINÂMICA (ESQUERDA) */}
        <div className="print-area">
          {etiquetaAtiva === "Etiqueta Envio" && lojasFiltradasPorBusca &&
            lojasFiltradasPorBusca.map((loja, index) => (
              <EtiquetaEnvio
                key={loja.endereco.ID_CONFERENCIA || index}
                dadosDaEmpresa={dadosDaEmpresaAtual}
                loja={loja.endereco}
                remetente={dadosRemetenteAtual}
                nomeDaEmpresa={empresaAtiva}
              />
            ))
          }
          {etiquetaAtiva === "Etiqueta Simples" && lojasFiltradasPorBusca &&
            lojasFiltradasPorBusca.map((loja, index) => (
              <EtiquetaSimples
                key={loja.endereco.ID_CONFERENCIA || index}
                dadosDaEmpresa={dadosDaEmpresaAtual}
                produtos={loja.produtos}
                nomeDaEmpresa={empresaAtiva}
              />
            ))
          }
          {etiquetaAtiva === "Folha de Conferência" && lojasFiltradasPorBusca &&
            lojasFiltradasPorBusca.map((loja, index) => (
              <FolhaDeConferencia
                key={loja.endereco.ID_CONFERENCIA || index}
                loja={loja.endereco}
                produtos={loja.produtos}
                dadosDaEmpresa={dadosDaEmpresaAtual}
              />
            ))
          }
          {etiquetaAtiva === "Declaração de Conteúdo" && lojasFiltradasPorBusca &&
            lojasFiltradasPorBusca.map((loja, index) => (
              <DeclaracaoConteudo
                key={loja.endereco.ID_CONFERENCIA || index}
                loja={loja.endereco}
                produtos={loja.produtos}
                remetente={dadosRemetenteAtual}
              />
            ))
          }
        </div>

        {/* FILHO 2: BARRA DE STATUS (DIREITA) */}
        <aside className="status-bar no-print">
          <div className="status-cards">
            <div className="card-sucesso">
              <span className="card-label">📦 Lojas Prontas</span>
              <strong className="card-value">{lojasComProdutosEEndereco.length}</strong>
            </div>
            
            <div className={`card-alerta ${lojasSemProdutos.length > 0 ? 'ativo' : ''}`}>
              <span className="card-label">⚠️ Sem Produtos</span>
              <strong className="card-value">{lojasSemProdutos.length}</strong>
              
              {lojasSemProdutos.length > 0 && (
                <div className="tooltip-inconsistencias">
                  <h4>Pendentes:</h4>
                  <ul>
                    {lojasSemProdutos.map((loja) => (
                      <li key={loja.ID_CONFERENCIA}>
                        {loja.ID_CONFERENCIA} - {loja.NOME_LOJA || loja.LOJA}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="checkbox-forcar">
            <label>
              <input 
                type="checkbox" 
                checked={forcarEtiquetasVazias} 
                onChange={(e) => setForcarEtiquetasVazias(e.target.checked)} 
              />
              Gerar etiquetas sem produtos
            </label>
          </div>
        </aside>

      </main>
       
    </div>
  );
}

export default App;