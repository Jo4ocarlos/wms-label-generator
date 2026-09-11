import styles from './PainelControles.module.css';
import logoSistema from "../../assets//logos-etiquetas/logoEmpresa.png"
import { type ChangeEvent } from "react";
import { companiesData } from '../../data/empresas';
// === IMPORTAÇÕES DE TIPOS DINAMICOS ===
import { type EmpresaValida } from '../../data/empresas';
import { type ModelosValidos } from "../../data/etiquetasModelos";
import { type RemetentesValidos } from "../../data/chancelas";

/**
 * CONTRATO DE DADOS (Props)
 * Define exatamente o que o App precisa fornecer para o Painel funcionar.
 */
interface PainelControlesProps {
  // === ESTADOS ATUAIS ===
  /** A marca selecionada no momento (Ex: Aura Calçados, Urbana Wear) */
  empresaAtiva: EmpresaValida;
  /** O modelo de impressão selecionado (Ex: Etiqueta Envio, Declaração) */
  etiquetaAtiva: ModelosValidos;
  /** O remetente fiscal selecionado (Ex: Aura Corporate) */
  remetenteAtivo: RemetentesValidos;
  /**O termo de busca para o input de busca*/
  termoBusca: string;
  /** Estado do FILTRO DE UF*/
  destinoAtivo: string;


  // === FUNÇÕES DE DISPARO (Callbacks) ===
  /** Função que avisa o App que o usuário trocou a empresa */
  onEmpresaChange: (novaEmpresa: EmpresaValida) => void;
  /** Função que avisa o App que o usuário trocou o modelo de etiqueta */
  onEtiquetaChange: (novoModelo: ModelosValidos) => void;
  /** Função que avisa o App que o usuário trocou o remetente fiscal */
  onRemetenteChange: (novoModelo: RemetentesValidos) => void;
  /** Função que avisa o app que o usuário digitou/ esta buscando uma loja */
  onTermoBuscaChange: (novoTermo: string) => void;
  /** Guarda o diltro selecionado pelo usuário e avisa que ele quer ver apenas o estado escolhido*/
  onDestinoChange: (novoDestino: string) => void;


  // === LISTAS PARA OS SELECTS (O Cardápio) ===
  /** Array com todos os nomes de empresas disponíveis no banco de dados */
  listaEmpresas: EmpresaValida[];
  /** Array imutável (readonly) com os modelos de impressão permitidos */
  listaModelos: readonly ModelosValidos[];
  /** Array com todos os nomes de remetentes disponíveis */
  listaRemetentes: RemetentesValidos[];
  /** Array com todos as ufs que vem da planilha(participantes da ação) */
  listaUfs: string[];

  // === AÇÕES ===
  /** URL dinâmica da planilha do Google Sheets da empresa ativa */
  linkPlanilha: string;
}

/**
 * COMPONENTE: PainelControles
 * @description Barra superior de navegação e filtros da aplicação.
 * É um "Componente Burro/Apresentacional", ou seja, ele não guarda estado próprio
 * e não importa dados diretamente. Ele apenas reflete o estado do componente Pai (App.tsx).
 */
const PainelControles = ({
  empresaAtiva, onEmpresaChange,
  etiquetaAtiva, onEtiquetaChange,
  remetenteAtivo, onRemetenteChange,
  termoBusca, onTermoBuscaChange,
  listaEmpresas, listaModelos, listaRemetentes,
  destinoAtivo, onDestinoChange, listaUfs,
  linkPlanilha
}: PainelControlesProps) => {

  // ==========================================
  // HANDLERS (Manipuladores de Eventos)
  // ==========================================

  const handleEmpresaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // A asserção 'as' garante ao TypeScript que o valor vindo do HTML faz parte do tipo restrito
    onEmpresaChange(e.target.value as EmpresaValida);
  };

  const handleModelosChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onEtiquetaChange(e.target.value as ModelosValidos);
  };

  const handleRemetenteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onRemetenteChange(e.target.value as RemetentesValidos);
  };

  const handleDestinoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onDestinoChange(e.target.value)
    //Quando mudar a uf limpa o input de busca
    onTermoBuscaChange("")
  }

  // ==========================================
  // RENDERIZAÇÃO (Interface)
  // ==========================================
  return (
    <aside className={styles.sidebarControles}>
      <div className={styles.sidebarHeader}>
        <img src={logoSistema} alt="Logo" className={styles.logoApp} />
        <h2>Gerenciador de Etiquetas</h2>
      </div>

      {/* === FORMULÁRIO DE SELEÇÃO === */}
      <form className={styles.sidebarForm}>
        {/* Passamos o value para garantir que é um "Componente Controlado" pelo React */}

        <div className={styles.inputGroup}>
          <label>Buscar Loja</label>
          {/* === CAMPO DE BUSCA LIVRE === */}
          <input
            type="text"
            className={styles.modernInput}
            placeholder="Buscar por loja, CEP ou cidade..."
            value={termoBusca}
            onChange={(e) => onTermoBuscaChange(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Empresa</label>
          {/* 1. SELETOR DE EMPRESA */}
          <select className={styles.modernSelect} value={empresaAtiva} onChange={handleEmpresaChange}>
            {listaEmpresas.map((nomeDaEmpresa) => (
              <option key={nomeDaEmpresa} value={nomeDaEmpresa}>
                {nomeDaEmpresa}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Modelo de Impressão</label>
          {/* 2. SELETOR DE MODELO DE IMPRESSÃO */}
          <select className={styles.modernSelect} value={etiquetaAtiva} onChange={handleModelosChange}>
            {listaModelos.map((modelo) => (
              <option key={modelo} value={modelo}>{modelo}</option>
            ))}
          </select>
        </div>

        {/* 3. SELETOR DE REMETENTE (Renderização Condicional) */}
        {(etiquetaAtiva === "Declaração de Conteúdo" || etiquetaAtiva === "Etiqueta Envio") && (
          <div className={styles.inputGroup}>
            <label>Remetente Fiscal</label>
            
            <select 
              className={styles.modernSelect} 
              value={remetenteAtivo} 
              onChange={handleRemetenteChange} 
              disabled={!!companiesData[empresaAtiva]?.remetenteObrigatorio}
            >
              {listaRemetentes
                .filter((nomeRemetente) => {
                  const remetenteTravado = companiesData[empresaAtiva]?.remetenteObrigatorio;
                  
                  // Regra 1: Se a empresa atual tem trava, mostra SÓ o remetente dela.
                  if (remetenteTravado) {
                    return nomeRemetente === remetenteTravado;
                  }

                  // Regra 2: A empresa é livre.
                  // Lê o banco de dados dinamicamente para achar todos os remetentes "VIPs"
                  const remetentesExclusivos = Object.values(companiesData)
                    .map((emp) => emp.remetenteObrigatorio)
                    .filter(Boolean); // Tira os nulos e indefinidos
                  
                  // Retorna apenas os remetentes que NÃO estão na lista de exclusivos
                  return !remetentesExclusivos.includes(nomeRemetente); 
                })
                .map((nomeRemetente) => (
                  <option key={nomeRemetente} value={nomeRemetente}>
                    {nomeRemetente}
                  </option>
                ))
              }
            </select>
          </div>
        )}

        <div className={styles.inputGroup}>
          <label>Destino / Logística</label>
          {/* === FILTRO DE ESTADO (UF) === */}
          <select className={styles.modernSelect} value={destinoAtivo} onChange={handleDestinoChange}>
            <option value="">Todos os Estados</option>

            <optgroup label="Método de Entrega">
              <option value="MOTOBOY">MOTOBOY (Grande SP)</option>
              <option value="CORREIOS">CORREIOS (Demais Regiões)</option>
            </optgroup>

            <optgroup label="Filtrar por UF">
              {listaUfs.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </form>

      {/* === AÇÕES (Botões) === */}
      <div className={styles.sidebarActions}>
        <a href={linkPlanilha} className={styles.btnSecondary} target="_blank" rel="noreferrer">
          Editar Planilha
        </a>
        <button className={styles.btnPrimary} onClick={window.print}>
          Imprimir Etiquetas
        </button>
      </div>
    </aside>
  );
};

export default PainelControles;