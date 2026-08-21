# Componentes operacionais

## Card

Use `Card` para agrupar uma informação ou ação relacionada. O componente possui três variantes:

- `default`: conteúdo informativo sem destaque;
- `featured`: indicador principal ou ação prioritária;
- `interactive`: conteúdo clicável com feedback de hover.

Evite transformar cada bloco da tela em um card. Quando a informação puder existir em uma lista, tabela ou faixa aberta, prefira esses formatos.

## StatCard

Use `StatCard` para KPIs de dashboards e páginas iniciais. Cada card deve ter um label curto, um valor principal e, opcionalmente, detalhe, tendência e ícone.

Regras:

- use no máximo quatro KPIs na primeira linha;
- o valor deve ser visualmente dominante;
- tendências devem explicar o período de comparação;
- rosa é reservado para destaque, não para todos os indicadores;
- ícones são auxiliares e não substituem o label.

Exemplo:

```tsx
<StatCard
  label="Participantes confirmados"
  value="582"
  detail="de 750 previstos"
  trend="+12,4%"
  trendTone="positive"
  variant="featured"
/>
```

## ActionButton

Use `ActionButton` para ações com intenção clara. As variantes são `primary`, `secondary` e `ghost`; use `sm` em toolbars compactas e `md` em cabeçalhos ou formulários.

Não use a variante primária em todos os controles da tela. Uma ação principal por região normalmente é suficiente.

## Breadcrumb

Use `Breadcrumb` para contextualizar a página dentro do evento e da área operacional. O último item deve ser o estado atual e não deve ser link.
