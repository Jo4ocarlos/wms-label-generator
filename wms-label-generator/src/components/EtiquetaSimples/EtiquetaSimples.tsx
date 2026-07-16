import styles from './EtiquetaSimples.module.css';

// === IMPORTAÇÕES DE ASSETS ===
// A logo da empresa é fixa, pois é a marca padrão que assina a operação dessas etiquetas
import empresa from "../../assets/logos-etiquetas/logoEmpresa.png";

// === IMPORTAÇÕES DE TIPOS ===
import { type DadosEmpresa } from "../../data/empresas";
import { type ProdutoExtraido } from '../../utils/extractProducts';

/**
 * CONTRATO DE DADOS (Props)
 * Define as informações necessárias para renderizar o lote de etiquetas simples.
 */
interface EtiquetaSimplesProps {
  /** Objeto contendo as configurações da marca ativa (ex: Logo da Anacapri) */
  dadosDaEmpresa: DadosEmpresa;
  /** Lista de produtos já higienizada, contendo nome e quantidade de cada item */
  produtos: ProdutoExtraido[];
  /** Nome em texto da marca ativa para acessibilidade (Alt das imagens) */
  nomeDaEmpresa: string;
}

/**
 * COMPONENTE: EtiquetaSimples
 * @description Renderiza etiquetas menores e simplificadas para cada produto individual.
 * Diferente da Etiqueta de Envio (que gera UMA por loja), este componente mapeia o array 
 * de produtos e gera UMA etiqueta para CADA item contido na caixa daquela loja.
 */
const EtiquetaSimples = ({ dadosDaEmpresa, produtos, nomeDaEmpresa }: EtiquetaSimplesProps) => {

  // ==========================================
  // RENDERIZAÇÃO (Interface)
  // ==========================================
  return (
    <div>
      {/* 
        Gera uma etiqueta individual para cada produto extraído da planilha.
        A verificação 'produtos &&' é uma boa prática defensiva que garante 
        que o .map() não quebre a aplicação se a lista vier vazia ou indefinida.
      */}
      {produtos && produtos.map((produto, index) => (
        <div className={styles.etiqueta_simples} key={index}>
          
          {/* === TOPO: Logo da Marca e Quantidade === */}
          <div className={styles.topo}>
            <img 
              src={dadosDaEmpresa.logo} 
              alt={`Logo da empresa ${nomeDaEmpresa}`} 
              className={styles.logo_marca} 
            />
            <p className={styles.quantidade_box}>
              Quant: <span className={styles.quantidade_numero}>{produto.quantidade}</span>
            </p>
          </div>

          {/* === CENTRO: Nome do Produto === */}
          {/* A classe CSS deve garantir que este texto ocupe o espaço central automaticamente */}
          <div className={styles.centro}>
            <p className={styles.nome_produto}>
              {produto.nome}
            </p>
          </div>

          {/* === RODAPÉ: Logo da Operação/Expedição === */}
          <div className={styles.rodape}>
            <img 
              src={empresa} 
              alt="Logo da empresa" 
              className={styles.logo_empresa} 
            />
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default EtiquetaSimples;