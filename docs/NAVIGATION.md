# Navegação de produto

## Regra de marca em headers

Todo header de produto Eventesse deve exibir a logo oficial por meio do componente `Brand` ou `ProductHeader`. É proibido substituir a marca por ícones genéricos, iniciais, emojis ou símbolos de bibliotecas de ícones.

- Use a logo completa como padrão.
- Em espaços compactos, use somente o ícone oficial Eventesse.
- Um ícone funcional pode aparecer ao lado da marca, mas nunca assumir o papel de identidade.
- Preserve contraste, proporção e área de proteção definidos em `BRAND.md`.

## Estrutura da sidebar

Toda sidebar deve ser recolhível e organizada em grupos de navegação coerentes.

- O controle de recolhimento deve permanecer visível e ter nome acessível.
- O modo expandido mostra logo, títulos de grupos, ícones e rótulos.
- O modo recolhido mostra o ícone oficial da Eventesse e os ícones de navegação; cada item deve manter `aria-label` ou `title`.
- Use `aria-current="page"` para a rota ativa.
- Separe áreas como produto, ferramentas e conta quando houver mais de um contexto.
- Não misture ações destrutivas, configurações e navegação principal no mesmo grupo.
- Badges devem comunicar estado curto e útil; nunca compensar uma arquitetura confusa.
- Em telas pequenas, a sidebar deve funcionar como drawer e fechar após a navegação.

## Exemplo

```tsx
<ProductHeader productName="RSVP" />
<Sidebar sections={navigationSections} />
```