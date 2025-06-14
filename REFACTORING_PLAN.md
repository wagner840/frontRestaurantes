# Plano de Refatoração: Mobile-First e Clean Code

Este documento detalha a estratégia e o plano de ação para refatorar a aplicação "RestaurantePro" com foco em uma arquitetura mobile-first e na aplicação de princípios de clean code.

## 1. Análise da Estrutura Atual

- **Ponto de Entrada Principal:** O componente `src/screens/MainApp/MainApp.tsx` é responsável por orquestrar o layout principal, incluindo a renderização da `Sidebar`, `Header` e do conteúdo da aba ativa.
- **Layout e Navegação:** A estrutura de layout é dividida entre `src/components/layout/Sidebar.tsx` (navegação principal para desktop) e `src/components/layout/Header.tsx` (cabeçalho para mobile). A navegação entre as telas é controlada pelo estado `activeTab` em `MainApp`.
- **Abordagem de Responsividade:** O projeto já utiliza as classes de breakpoint do Tailwind CSS (ex: `md:hidden`, `lg:grid-cols-4`), mas a implementação atual segue uma abordagem "desktop-down", onde os estilos padrão são para telas grandes e são ajustados para telas menores. Nossa refatoração irá inverter essa lógica.

## 2. Componentes e Telas Chave

A refatoração impactará os seguintes arquivos principais:

- **Componentes de Layout:**
  - `src/screens/MainApp/MainApp.tsx`
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Sidebar.tsx`
- **Telas Principais:**
  - `src/screens/Dashboard/Dashboard.tsx`
  - `src/screens/Orders/Orders.tsx`
  - `src/screens/Menu/Menu.tsx`
  - `src/screens/Customers/Customers.tsx`
  - `src/screens/Birthdays/Birthdays.tsx`
- **Componentes de UI Reutilizáveis:**
  - `src/components/dashboard/StatsCard.tsx`
  - `src/components/dashboard/RecentOrders.tsx`
  - `src/components/orders/OrderCard.tsx`
  - `src/components/menu/MenuItemCard.tsx`
  - `src/components/customers/CustomerDetailModal.tsx`

## 3. Estratégia de Refatoração Mobile-First

A principal mudança será a adoção de uma abordagem estritamente mobile-first.

```mermaid
graph TD
    A[Estilos Base: Mobile (Padrão)] --> B(sm: Telas Pequenas);
    B --> C(md: Tablets);
    C --> D(lg: Desktops);
    D --> E(xl: Desktops Grandes);
```

- **Estilos Padrão para Mobile:** Todas as classes de estilo sem prefixos de breakpoint (`sm:`, `md:`, etc.) serão definidas para a experiência mobile.
- **Ajustes para Telas Maiores:** Usaremos os prefixos de breakpoint do Tailwind para adaptar e aprimorar o layout em telas maiores. Por exemplo, um layout de coluna única (`flex-col`) em mobile se tornará um layout de múltiplas colunas (`md:grid-cols-2`, `lg:flex-row`) em tablets e desktops.
- **Layout Principal:**
  - O `Header` será o componente de navegação padrão, sempre visível em mobile.
  - A `Sidebar` será oculta por padrão em telas pequenas (acessível através de um botão no `Header`) e se tornará um painel lateral fixo e visível a partir do breakpoint `md:`.

## 4. Diretrizes de Clean Code

Para garantir um código mais limpo, sustentável e legível, seguiremos as seguintes diretrizes:

- **Componentização:** Quebrar componentes grandes e complexos em componentes menores e com responsabilidade única. O `Dashboard.tsx` é o primeiro candidato, podendo ser dividido em `DashboardStats`, `SalesByCategoryChart`, `QuickStats`, etc.
- **Extração de Lógica (Custom Hooks):** Isolar a lógica de negócios, chamadas de API e gerenciamento de estado em custom hooks. Por exemplo, a lógica de busca de dados do dashboard será movida para um hook `useDashboardData`. Isso tornará os componentes de UI mais limpos e focados na renderização.
- **Tipagem Forte com TypeScript:** Garantir que todas as props, estados e retornos de função sejam devidamente tipados. Utilizar os tipos definidos em `src/types/index.ts` e criar novos quando necessário.
- **Organização de Arquivos:** Manter a estrutura de pastas existente, mas garantir que as importações sejam organizadas e que os componentes relacionados permaneçam agrupados.
- **Nomeação Consistente:** Seguir os padrões de nomeação já estabelecidos: `PascalCase` para componentes e tipos, e `camelCase` para funções, variáveis e hooks.

## 5. Plano de Ação Priorizado

A refatoração será executada na seguinte ordem para minimizar disrupções e garantir um progresso incremental:

1.  **Fase 1: Refatoração do Layout Principal (Mobile-First)**

    - **Objetivo:** Estabelecer a base da navegação mobile-first.
    - **Arquivos:**
      - `src/components/layout/Header.tsx`: Modificar para ser o cabeçalho principal em todas as telas.
      - `src/components/layout/Sidebar.tsx`: Modificar para ser um menu lateral oculto em mobile e fixo em desktop.
      - `src/screens/MainApp/MainApp.tsx`: Ajustar a lógica para orquestrar o novo comportamento do `Header` e `Sidebar`.

2.  **Fase 2: Refatoração das Telas e Componentes (um por um)**

    - **Objetivo:** Aplicar os princípios de mobile-first e clean code em cada tela.
    - **Ordem Priorizada:**
      1.  **Dashboard (`src/screens/Dashboard/Dashboard.tsx`):**
          - Criar o hook `useDashboardData` para encapsular a lógica de `useEffect`.
          - Dividir a UI em sub-componentes.
          - Aplicar estilos mobile-first aos grids e cards.
      2.  **Pedidos (`src/screens/Orders/Orders.tsx`):**
          - Aplicar estilos mobile-first ao `OrderCard` e à lista de pedidos.
          - Extrair lógica para um hook `useOrdersData`.
      3.  **Cardápio (`src/screens/Menu/Menu.tsx`):**
          - Refatorar `MenuItemCard` para ser responsivo.
          - Aplicar layout de grid mobile-first.
      4.  **Clientes (`src/screens/Customers/Customers.tsx`):**
          - Ajustar a lista de clientes e o modal de detalhes (`CustomerDetailModal`) para mobile.
      5.  **Aniversários (`src/screens/Birthdays/Birthdays.tsx`):**
          - Aplicar os mesmos princípios de refatoração.

3.  **Fase 3: Revisão Geral e Finalização**
    - **Objetivo:** Garantir consistência e qualidade em toda a aplicação.
    - **Ações:**
      - Navegar por toda a aplicação em diferentes tamanhos de tela para identificar e corrigir inconsistências de UI/UX.
      - Revisar o código em busca de `console.log`s, comentários desnecessários ou código morto.
      - Verificar se todas as novas abstrações (hooks, componentes) estão sendo utilizadas corretamente.
