# UI operacional

A variante operacional traduz os padrões validados no protótipo Vibra para uma biblioteca genérica Eventesse. Ela não carrega conteúdo, marca ou regras de negócio do cliente.

## Quando usar

Use em backoffices, operações de eventos, cadastros extensos, inventários e fluxos em que comparação e velocidade importam mais que comunicação editorial. Não use a densidade compacta em landing pages ou experiências institucionais.

Ative no contêiner do produto:

```html
<div data-density="operational">...</div>
```

## Estrutura

- `AppShell`: combina sidebar e área principal sem impor roteamento.
- `Sidebar`: largura de 220px, recolhida em 64px, grupos hierárquicos e rodapé opcional.
- `PageHeader`: título, contexto, busca e ações da página.
- `MetricStrip`: resumo de até cinco indicadores comparáveis.
- `Toolbar`: visões, colunas, filtros, agrupamento e ordenação.
- `DataTable`: cabeçalho semântico, agrupamentos e células customizáveis.
- `Pagination`: contexto de registros e navegação por página.
- `SidePanel`: inspeção e edição sem perder o contexto da tabela.

## Regras de marca

A identidade do shell deve usar sempre `Brand`. Ícones genéricos podem representar ações e rotas, mas nunca substituir a marca nos headers ou na sidebar.

## Densidade e medidas

- sidebar: 220px expandida e 64px recolhida;
- header: 64px;
- controles: 36px;
- raio principal: 7px;
- texto base operacional: 12px;
- tabela: mínimo de 44px por linha;
- painel de inspeção: 290px.

## Acessibilidade

Todo controle precisa de nome acessível e foco visível. Cor nunca deve ser o único indicador de estado. Tabelas devem preservar `thead`, `tbody`, `th` e `td`; agrupamentos são informação complementar, não substituem rótulos nas células.

Em telas estreitas, a sidebar inicia visualmente recolhida, tabelas permitem rolagem horizontal e as ações do header quebram para uma segunda linha.
