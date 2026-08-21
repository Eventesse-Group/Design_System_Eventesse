# Fundações

## Identidade

A identidade principal preserva o rosa Eventesse (`349 78% 58%`) para ações e marca, com teal (`179 88% 36%`) como acento funcional. A tipografia segue a pilha sans do shadcn, priorizando Inter quando disponível e usando a fonte nativa da plataforma como fallback.

## Arquitetura dos tokens

Tokens primitivos registram valores brutos. Tokens semânticos descrevem intenção e apontam para primitivos. Produtos devem consumir somente a camada semântica.

Exemplo:

```css
--eds-color-rose-500: 349 78% 58%;
--eds-background-brand: var(--eds-color-rose-500);
```

## Escalas

- Espaçamento baseado em grade de 4 px.
- Controles com alturas de 32, 40 e 44 px.
- Raios de 8, 12, 16 e 20 px, além de circular.
- Motion entre 120 e 320 ms, com suporte a `prefers-reduced-motion`.
- Tipografia responsiva com Inter, `ui-sans-serif` e fallback de sistema.

## Temas

Light é o modo padrão. Dark redefine apenas tokens semânticos; componentes não devem conter cores específicas de tema.
