# Eventesse Design System

Fonte de verdade compartilhada para interfaces dos produtos Eventesse. O sistema foi derivado visualmente do ORB RH, mas é independente do projeto original.

## Objetivos

- preservar a identidade visual Eventesse;
- alinhar design e engenharia por meio dos mesmos tokens;
- garantir acessibilidade, responsividade e consistência;
- permitir adoção gradual em produtos existentes;
- oferecer componentes React sem acoplamento a regras de negócio.

## Estrutura

- `src/styles/tokens.css`: tokens primitivos e semânticos, incluindo temas light e dark;
- `src/styles/global.css`: fundações e catálogo visual inicial;
- `src/components`: componentes reutilizáveis do sistema;
- `docs`: decisões, acessibilidade, governança e guias de adoção;
- Figma: `Design System Eventesse`, espelhando nomes e modos do código.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint:tokens
```

## Princípio de adoção

Consuma tokens semânticos, nunca valores primitivos diretamente dentro de produtos. Um componente deve expressar intenção (`background-brand`, `content-secondary`, `status-error`) em vez de cor (`rose-500`, `gray-600`).

Para identidade institucional, consuma sempre o componente Brand ou os arquivos oficiais documentados em docs/BRAND.md. Não recrie a marca localmente em outros produtos.

Headers e sidebars seguem as regras de `docs/NAVIGATION.md`: marca oficial obrigatória, navegação agrupada e sidebar sempre recolhível.