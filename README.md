# Sistema Dinâmico de Etiquetas Logísticas (WMS Frontend)

*[Link do projeto](https://jo4ocarlos.github.io/wms-label-generator/)*

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Google Sheets API](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)

## O Problema
No ambiente logístico de e-commerces e varejo, operações de *picking e packing* (separação e embalagem) frequentemente dependem de planilhas complexas, descentralizadas e sujeitas a erros humanos na digitação. Operadores perdem tempo cruzando dados de lojas com listas horizontais gigantescas de produtos para gerar etiquetas de envio e folhas de conferência.

## A Solução
Desenvolvi uma aplicação Web (Frontend) que atua como um motor de processamento logístico. O sistema consome dados brutos diretamente do **Google Sheets (CSV)**, realiza o cruzamento (Join) das bases de Endereços e Produtos no cliente, e gera layouts de impressão dinâmicos, automatizando o roteamento e a renderização de logotipos customizados para marcas de varejo e clientes corporativos.

## Principais Desafios de Engenharia Resolvidos

* **Extração Resiliente de Dados (UX Data Parsing):**
  Para facilitar a digitação manual dos operadores, o sistema aceita planilhas em formato horizontal (`PRODUTO 1`, `QTD 1`, `PRODUTO 2`...). Desenvolvi um algoritmo de extração com tipagem estrita que vasculha as colunas dinamicamente, sendo tolerante a falhas de nomenclatura (ex: suporta `QTD 1`, `QTD1`, ou apenas `QUANTIDADE`).
* **Cache Busting Dinâmico no Frontend:**
  Implementação de um Custom Hook (`useFetch`) com injeção de *timestamps* dinâmicos (`Date.now()`) na URL do Google Sheets. Isso impede que o navegador cacheie dados antigos, garantindo que o operador sempre imprima a versão mais atualizada da planilha em tempo real.
* **Join e Validação em Memória:**
  Uso de `useMemo` para otimizar o cruzamento das tabelas (Endereços x Produtos). O sistema identifica automaticamente "Inconsistências" (lojas sem produtos atrelados) e bloqueia a impressão fantasma, retendo os erros em um painel de pendências.
* **CSS Print Dinâmico (@media print):**
  Controle total das dimensões da bobina de impressoras térmicas e margens A4 manipulando a tag `<style>` programaticamente com React, permitindo que a mesma aplicação imprima Declarações de Conteúdo e Etiquetas Zebra de 100x80mm sem quebrar o layout.

## Tecnologias e Padrões Utilizados
* **Frontend:** React, TypeScript, HTML5, CSS3.
* **Gerenciamento de Estado:** Hooks nativos (`useState`, `useEffect`, `useMemo`).
* **Integração:** Fetch API (consumindo endpoints públicos do Google Sheets).
* **Arquitetura:** Componentização baseada em domínio (Painel, Etiquetas, Utilitários de Extração).

## Como Testar a Aplicação (Guia de Funcionalidades)

Para que você possa explorar a arquitetura de validação de dados em tempo real, a interface conta com um painel de controle interativo e uma barra de status inteligente no rodapé. Durante os testes, experimente observar os seguintes comportamentos:

* **Barra de Status (Malha Fina Logística):**
  * **📦 Lojas Prontas:** Contador em tempo real que exibe quantas lojas tiveram um "Match" perfeito entre a planilha de Endereços e a de Produtos. Estas estão prontas para impressão.
  * **⚠️ Sem Produtos (Inconsistências):** O sistema barra automaticamente filiais que foram cadastradas nos endereços, mas esquecidas (ou preenchidas incorretamente) na aba de produtos.
  
* **Tooltip de Investigação:** 
  Passe o mouse (ou clique) sobre o card amarelo de **"Sem Produtos"** quando ele estiver ativo. O sistema exibe um menu detalhado informando exatamente quais códigos e nomes de lojas estão com pendências na planilha, facilitando a vida do operador.

* **Checkbox "Gerar etiquetas sem produtos":**
  Uma funcionalidade de *Bypass*. Ao marcar esta opção, o sistema relaxa a regra de validação e força a geração da etiqueta mesmo para as lojas vazias. Isso simula um cenário real onde a logística precisa enviar uma caixa vazia, materiais de suprimento ou brindes corporativos para uma filial específica.

* **Filtros Combinados:**
  No painel superior, tente buscar por uma cidade específica ou selecione o filtro de logística (ex: Motoboy vs Correios). O React processa a tabela filtrando os destinos e renderizando as etiquetas na tela instantaneamente, sem recarregar a página.

## Como rodar o projeto localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/Jo4ocarlos/wms-label-generator.git](https://github.com/Jo4ocarlos/wms-label-generator.git)
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

*Desenvolvido por João Carlos de Almeida Silva - Conecte-se comigo no [LinkedIn](https://www.linkedin.com/in/jo%C3%A3o-carlos-de-almeida-silva-724579171/)*
