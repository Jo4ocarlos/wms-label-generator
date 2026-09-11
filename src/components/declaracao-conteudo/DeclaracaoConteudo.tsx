import styles from './DeclaracaoConteudo.module.css';
import { type ProdutoExtraido } from '../../utils/extractProducts';
import { type ChancelasERemetentes } from '../../data/chancelas';

import { parseMoedaBR, formatarMoedaBR, formatarCNPJ } from '../../utils/formatters';

interface DeclaracaoConteudoProp {
  loja: Record<string, string>;
  produtos: ProdutoExtraido[];
  remetente: ChancelasERemetentes;
}

const DeclaracaoConteudo = ({ loja, produtos, remetente }: DeclaracaoConteudoProp) => {

  // ==========================================
  // LÓGICA DE CÁLCULO SÊNIOR
  // ==========================================
  const totalQuantidades = produtos.reduce((acumulador, produto) => acumulador + Number(produto.quantidade || 0), 0);

  const valorTotal = produtos.reduce((acumulador, produto) => {
    const valorUnitario = parseMoedaBR(produto.valor);
    return acumulador + (valorUnitario * Number(produto.quantidade || 0));
  }, 0);

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================
  return (
    <div className={styles.declaracao_box}>
      
      <div className={styles.dec_header}>
        <div className={styles.dec_header_title}>DECLARAÇÃO DE CONTEÚDO</div>
        <div className={styles.dec_header_id}>{loja.ID_CONFERENCIA}</div>
      </div>

      <div className={styles.dec_rem_dest}>
        
        {/* REMETENTE */}
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
            <div className={styles.dec_field}><strong>CPF/CNPJ: </strong>{formatarCNPJ(remetente.cnpj)}</div>
          </div>
        </div>

        {/* DESTINATÁRIO */}
        <div className={styles.dec_col}>
          <div className={styles.dec_col_title}>DESTINATÁRIO</div>
          <div className={styles.dec_field}>
            <strong>NOME: </strong>{loja.NOME_LOJA || loja.LOJA || loja["NOME DA LOJA"] || "LOJA SEM NOME"}
          </div>
          <div className={styles.dec_field}>
            <strong>ENDEREÇO: </strong>{loja.LOGRADOURO || loja.RUA || loja.ENDERECO}
          </div>
          <div className={styles.linha_dupla}>
            <div className={styles.dec_field}><strong>CIDADE: </strong>{loja.CIDADE}</div>
            <div className={styles.dec_field}><strong>UF: </strong>{loja.UF}</div>
          </div>
          <div className={styles.linha_dupla}>
            <div className={styles.dec_field}><strong>CEP: </strong>{loja.CEP}</div>
            <div className={styles.dec_field}><strong>CPF/CNPJ: </strong>{formatarCNPJ(loja.CNPJ)}</div>
          </div>
        </div>
      </div>

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
          {produtos.map((produto, index) => {
            const valorLinha = parseMoedaBR(produto.valor) * Number(produto.quantidade || 0);
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className={styles.text_left}>{produto.nome}</td>
                <td>{produto.quantidade}</td>
                <td>{formatarMoedaBR(valorLinha)}</td>
              </tr>
            );
          })}
          
          <tr>
            <td colSpan={2} className={styles.table_footer_label}>TOTAL</td>
            <td className={styles.table_footer_value}>{totalQuantidades}</td>
            <td className={styles.table_footer_value}>{formatarMoedaBR(valorTotal)}</td>
          </tr>
          <tr>
            <td colSpan={2} className={styles.table_footer_label}>PESO TOTAL (kg)</td>
            <td colSpan={2} className={styles.table_footer_value}></td>
          </tr>
        </tbody>
      </table>

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