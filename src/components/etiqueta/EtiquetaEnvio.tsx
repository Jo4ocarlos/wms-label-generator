import styles from "./EtiquetaEnvio.module.css";

// === IMPORTAÇÕES DE TIPOS ===
import { type DadosEmpresa } from "../../data/empresas";
import { type ChancelasERemetentes } from "../../data/chancelas";
// utils
import { classificarTransporte } from "../../utils/regrasFrete";
/**
 * CONTRATO DE DADOS (Props)
 * Define as informações exatas que a Etiqueta precisa para ser desenhada.
 */
interface EtiquetaEnvioProps {
  /** Objeto contendo as configurações da marca ativa (ex: Logo da Anacapri, Shoulder) */
  dadosDaEmpresa: DadosEmpresa;
  /** Dados brutos do endereço da loja de destino, extraídos diretamente da planilha */
  loja: Record<string, string>;
  /** Objeto contendo os dados fiscais e a imagem da chancela (selo de frete) do remetente */
  remetente: ChancelasERemetentes;
  /** Nome em texto da marca ativa (usado principalmente para acessibilidade/Alt das imagens) */
  nomeDaEmpresa: string;
}

/**
 * COMPONENTE: EtiquetaEnvio
 * @description Renderiza a etiqueta principal que será colada na parte externa da caixa.
 * É um componente puramente visual (Apresentacional) e dinâmico, adaptando suas
 * imagens de cabeçalho de acordo com a marca e a transportadora selecionadas.
 */
const EtiquetaEnvio = ({ dadosDaEmpresa, loja, remetente, nomeDaEmpresa }: EtiquetaEnvioProps) => {

  // ==========================================
  // RENDERIZAÇÃO (Interface)
  // ==========================================
  return (
    <div className={styles.etiqueta}>
      
      {/* === CABEÇALHO (LOGOS DINÂMICAS) === */}
      <div className={styles.header_etiqueta}>
        {/* Logo da Marca (Ex: Anacapri, Shoulder) puxada do dicionário de empresas */}
        <img 
          src={dadosDaEmpresa.logo} 
          alt={`Logo da empresa ${nomeDaEmpresa}`} 
          className={styles.logo_empresa} 
        />
        {/* Chancela da Transportadora (Ex: Selo dos Correios) puxada do dicionário de remetentes */}
        {/* Chancela da Transportadora (Ex: Selo dos Correios) */}
        {classificarTransporte(loja.CEP || "") === "CORREIOS" && (
          <img 
            src={remetente.chancela} 
            alt={`Chancela de transporte da ${remetente.nome}`} 
            className={styles.logo_transport} 
          />
        )}
      </div>

      {/* === DADOS DO DESTINATÁRIO === */}
      <div className={styles.conteudo}>
        
        {/* 
          Fallback de Nomenclatura: 
          Tenta buscar o nome da loja em várias colunas possíveis. 
          Se a planilha vier fora do padrão, exibe "LOJA SEM NOME" em vez de quebrar a tela.
        */}
        <h2>{loja.NOME_LOJA || loja.LOJA || loja["NOME DA LOJA"] || "LOJA SEM NOME"}</h2>
        
        {/* Linha de Endereço: Só exibe o "Nº" se a coluna NUMERO existir na planilha */}
        <p>
          <strong>
            {loja.LOGRADOURO || loja.ENDERECO || loja.RUA} 
            {loja.NUMERO && <span>{` - Nº${loja.NUMERO}`}</span>}
          </strong>
        </p>
        
        {/* Linha de Bairro e Complemento (Opcional) */}
        <p>
          <span>{loja.BAIRRO}</span>
          {loja.COMPLEMENTO && <span>{` - ${loja.COMPLEMENTO}`}</span>}
        </p>
        
        {/* Renderização Condicional: A tag <p> de observação só existe se houver texto nela */}
        {loja.OBSERVACAO && <p className={styles.obs}>{loja.OBSERVACAO}</p>}
        
        <div className={styles.cep_box}>
          <p>
            <span className={styles.cep}>CEP: {loja.CEP}</span> 
            <span> - {loja.CIDADE} - {loja.UF} </span> 
          </p>
        </div>
      </div>

      {/* === RODAPÉ (REMETENTE E CONTROLE) === */}
      <div className={styles.footer_etiqueta}>
        
        {/* Dados fiscais de quem está enviando a caixa */}
        <div className={styles.remetente_box}>
          <p>Remetente: <strong>{remetente.nome}</strong><br/> CNPJ: {remetente.cnpj}</p>
          <p>{remetente.endereco} - CEP: {remetente.cep}</p>
        </div>
        
        {/* ID de Conferência usado internamente pela logística para bipar a caixa */}
        <div>
          <p className={styles.id_numero}>{loja.ID_CONFERENCIA}</p>
        </div>

      </div>
    </div>
  );
};

export default EtiquetaEnvio;