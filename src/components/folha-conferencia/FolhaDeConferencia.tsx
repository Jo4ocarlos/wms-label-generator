import styles from './FolhaDeConferencia.module.css';

// === IMPORTAÇÕES DE ASSETS ===
// A logo da empresa é fixa no rodapé como validadora da operação
import empresa from "../../assets/logos-etiquetas/logoEmpresa.png";

// === IMPORTAÇÕES DE TIPOS ===
import { type ProdutoExtraido } from '../../utils/extractProducts';
import { type DadosEmpresa } from "../../data/empresas";

/**
 * CONTRATO DE DADOS (Props)
 * Define as informações exigidas para gerar o romaneio/recibo de entrega.
 */
interface FolhaDeConferenciaProps {
  /** Dados brutos do endereço e identificação da loja de destino */
  loja: Record<string, string>;
  /** Lista de produtos formatada, contendo a quantidade e descrição de cada item */
  produtos: ProdutoExtraido[];
  /** Objeto contendo os dados visuais da marca ativa (ex: Logo da Shoulder, Anacapri) */
  dadosDaEmpresa: DadosEmpresa;
}

/**
 * COMPONENTE: FolhaDeConferencia
 * @description Renderiza o documento interno de romaneio (Checklist).
 * Este papel vai dentro da caixa (ou entregue em mãos) para que o recebedor 
 * na loja física possa dar o "check" em cada item e assinar o comprovante de recebimento.
 */
const FolhaDeConferencia = ({ loja, produtos, dadosDaEmpresa }: FolhaDeConferenciaProps) => {

  // ==========================================
  // RENDERIZAÇÃO (Interface)
  // ==========================================
  return (
    // O container principal define suas próprias regras de impressão no CSS (não usa a classe .etiqueta genérica)
    <div className={styles.container_conferencia}>
      
      {/* === CABEÇALHO === */}
      <div className={styles.header}>
        {/* Logo dinâmica da marca da ação atual */}
        <img 
          src={dadosDaEmpresa.logo} 
          alt="Logo da Marca Ativa" 
          className={styles.logo_marca} 
        />
        <div>
          {/* O ID_CONFERENCIA é o código de barras/rastreio principal deste documento */}
          <h1>{loja.ID_CONFERENCIA}</h1>
        </div>
      </div>

      {/* === CONTEÚDO E CHECKLIST === */}
      <div className={styles.conteudo}>
        
        {/* Fallback de Nome: Tenta encontrar o nome da loja de diversas formas */}
        <h2>{loja.NOME_LOJA || loja.LOJA || loja["NOME DA LOJA"] || ""}</h2>
        
        <div className={styles.box_materiais}>
          <h3>FICHA DE CONFERÊNCIA</h3>
          
          {/* 
            Itera sobre os produtos para montar as linhas de conferência.
            Cada item ganha um "quadradinho" (check_box) vazio para ser assinalado à caneta.
          */}
          {produtos && produtos.map((produto, index) => (
            <div className={styles.item_conferencia} key={index}>
              <span className={styles.check_box}></span>
              <strong>{produto.quantidade}</strong> 
              <strong>{produto.nome}</strong>
            </div>
          ))}
          
        </div>
      </div>

      {/* === RODAPÉ: ASSINATURA E PROTOCOLO === */}
      <div className={styles.footer}>
        
        {/* Área para preenchimento manual do recebedor na loja */}
        <div className={styles.assinatura_box}>
          <p>
            RECEBIDO POR: <span>_____________________________________________</span>
          </p>
          <p className={styles.texto_menor}>
            (Nome e Sobrenome legível)
          </p>
          <p>
            DATA: <span>____/____/______</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
            HORA: <span>____:____</span>
          </p>
        </div>
  
        {/* Assinatura institucional da operação */}
        <div className={styles.logo_box}>
          <img 
            src={empresa} 
            alt="Logo empresa" 
            className={styles.logo_empresa} 
          />
        </div>

      </div>
    </div>
  );
};

export default FolhaDeConferencia;