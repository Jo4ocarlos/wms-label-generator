import styles from './DeclaracaoConteudo.module.css';
import { type ProdutoExtraido } from '../../utils/extractProducts';
import { type ChancelasERemetentes } from '../../data/chancelas';

/**
 * CONTRATO DE DADOS (Props)
 * Define exatamente o que a Declaração precisa receber para ser impressa.
 */
interface DeclaracaoConteudoProp {
  /** Dados brutos do endereço de destino vindos da planilha */
  loja: Record<string, string>;
  /** Lista de produtos já higienizada e tratada */
  produtos: ProdutoExtraido[];
  /** Dados fiscais e de endereço de quem está enviando (Arezzo, Graph A, etc) */
  remetente: ChancelasERemetentes;
}

/**
 * COMPONENTE: DeclaracaoConteudo
 * @description Renderiza o formulário fiscal padrão exigido pelos Correios/Transportadoras.
 * Este componente é puramente visual (Apresentacional) e foi formatado para 
 * ser impresso em folha A4 via CSS (@media print).
 */
const DeclaracaoConteudo = ({ loja, produtos, remetente }: DeclaracaoConteudoProp) => {

  // ==========================================
  // LÓGICA DE CÁLCULO
  // ==========================================
  
  /**
   * Calcula o total de itens que irão na caixa.
   * Utiliza o .reduce() para varrer o array e acumular as quantidades.
   * O construtor Number() garante que o valor vindo da planilha seja somado matematicamente
   * e não concatenado como texto (ex: "2" + "2" virar "22").
   */
  const totalQuantidades = produtos.reduce((acumulador, produto) => {
    return acumulador + Number(produto.quantidade);
  }, 0);

  // ==========================================
  // RENDERIZAÇÃO (Interface)
  // ==========================================
  return (
    <div className={styles.declaracao_box}>
      
      {/* === CABEÇALHO === */}
      <div className={styles.dec_header}>
        <div className={styles.dec_header_title}>DECLARAÇÃO DE CONTEÚDO</div>
        <div className={styles.dec_header_id}>{loja.ID_CONFERENCIA}</div>
      </div>

      {/* === ÁREA DE ENDEREÇOS === */}
      <div className={styles.dec_rem_dest}>
        
        {/* COLUNA 1: Remetente (Empresa que envia) */}
        <div className={`${styles.dec_col} ${styles.left}`}>
          <div className={styles.dec_col_title}>REMETENTE</div>
          <div className={styles.dec_field}><strong>NOME: </strong>{remetente.nome}</div>
          <div className={styles.dec_field}><strong>ENDEREÇO: </strong>{remetente.endereco}</div>
          
          <div className={styles.linha_dupla}>
            <div className={styles.dec_field}><strong>CIDADE: </strong>{remetente.cidade}</div>
            <div className={styles.dec_field}><strong>UF: </strong>{remetente.uf}</div>
          </div>
          
          <div className={styles.linha_dupla}>
            <div className={styles.dec_field}><strong>CEP: </strong>{remetente.cep}</div>
            <div className={styles.dec_field}><strong>CPF/CNPJ: </strong>{remetente.cnpj}</div>
          </div>
        </div>

        {/* COLUNA 2: Destinatário (Loja que recebe) */}
        <div className={styles.dec_col}>
          <div className={styles.dec_col_title}>DESTINATÁRIO</div>
          
          {/* 
            Fallback/Cascata: Como as planilhas podem variar, tentamos pegar o nome 
            de várias chaves possíveis antes de desistir e exibir "LOJA SEM NOME".
          */}
          <div className={styles.dec_field}>
            <strong>NOME: </strong>
            {loja.NOME_LOJA || loja.LOJA || loja["NOME DA LOJA"] || "LOJA SEM NOME"}
          </div>
          
          <div className={styles.dec_field}>
            <strong>ENDEREÇO: </strong> 
            {loja.LOGRADOURO || loja.RUA || loja.ENDERECO}
          </div>
          
          <div className={styles.linha_dupla}>
            <div className={styles.dec_field}><strong>CIDADE: </strong>{loja.CIDADE}</div>
            <div className={styles.dec_field}><strong>UF: </strong>{loja.UF}</div>
          </div>
          
          <div className={styles.linha_dupla}>
            <div className={styles.dec_field}><strong>CEP: </strong>{loja.CEP}</div>
            <div className={styles.dec_field}><strong>CPF/CNPJ: </strong> xx.xxx.xxx/xxxx-xx</div>
          </div>
        </div>
      </div>

      {/* === TABELA DE ITENS === */}
      <table className={styles.dec_table}>
        <thead>
          <tr>
            <th colSpan={4} className={styles.table_title}>IDENTIFICAÇÃO DOS BENS</th>
          </tr>
          <tr>
            <th style={{ width: '10%' }}>ITEM</th>
            <th style={{ width: '50%' }}>CONTEÚDO</th>
            <th style={{ width: '20%' }}>QUANT.</th>
            <th style={{ width: '20%' }}>VALOR</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapeia a lista de produtos limpa gerando uma linha <tr> para cada um */}
          {produtos.map((produto, index) => (
            <tr key={index}>
              {/* O index + 1 transforma o índice do array (0, 1, 2) em contagem humana (1, 2, 3) */}
              <td>{index + 1}</td>
              <td className={styles.text_left}>{produto.nome}</td>
              <td>{produto.quantidade}</td>
              <td>R$ 0,00</td>
            </tr>
          ))}
          
          {/* Linha de Totalizadores */}
          <tr>
            <td colSpan={2} className={styles.table_footer_label}>TOTAL</td>
            <td className={styles.table_footer_value}>{totalQuantidades}</td>
            <td className={styles.table_footer_value}>R$ 0,00</td>
          </tr>
          <tr>
            <td colSpan={2} className={styles.table_footer_label}>PESO TOTAL (kg)</td>
            <td colSpan={2} className={styles.table_footer_value}></td>
          </tr>
        </tbody>
      </table>

      {/* === RODAPÉ E ASSINATURA === */}
      <div className={styles.dec_footer_text}>
        <div className={styles.dec_termo_titulo}>DECLARAÇÃO</div>
        Declaro que não me enquadro no conceito de contribuinte para fins de incidência do ICMS, que os bens acima descritos destinam-se a uso e consumo próprio, não constituindo objeto de comércio, e que as informações aqui prestadas são verdadeiras.
        
        <div className={styles.dec_signatures}>
          <div className={styles.data_local}>São Paulo, _____ de _____________________ de ________</div>
          <div className={styles.box_assinatura}>
            <div className={styles.linha_assinatura}></div>
            Assinatura do Declarante/Remetente
          </div>
        </div>
      </div>

    </div>
  );
};

export default DeclaracaoConteudo;