# Marca Eventesse

Os arquivos desta biblioteca são os assets oficiais da Eventesse. Produtos não devem redesenhar, recolorir, distorcer ou reconstruir a marca com texto e ícones separados.

## Escolha do asset

| Asset | Uso principal |
| --- | --- |
| `eventesse-logo-color.png` | Opção padrão em fundos claros e neutros |
| `eventesse-logo-white.png` | Fundos escuros, coloridos ou fotográficos com contraste suficiente |
| `eventesse-logo-black.png` | Impressão monocromática e contextos sem reprodução de cor |
| `eventesse-icon-color.png` | Avatar, favicon, launcher ou espaços em que a assinatura completa não cabe |
| `eventesse-icon-white.png` | Versão compacta sobre fundo escuro ou colorido |

Prefira sempre a logo completa. Use o ícone apenas quando o contexto já identifica a Eventesse ou quando o espaço inviabiliza a assinatura completa.

## Regras de aplicação

- Preserve a proporção original e use `object-fit: contain`.
- Reserve ao redor da marca uma área livre mínima equivalente a 25% da altura do asset.
- Não aplique sombras, contornos, gradientes, filtros ou transparência.
- Não use a versão branca em fundo claro nem a colorida sobre fundos que prejudiquem seu contraste.
- Para interfaces digitais, use a logo completa com pelo menos 120 px de largura e o ícone com pelo menos 24 px.
- Textos alternativos devem ser `Eventesse` quando a marca comunica identidade. Use `alt=""` quando ela for redundante e puramente decorativa.

## Uso em React

```tsx
import { Brand } from "@eventesse/design-system";

<Brand kind="logo" tone="color" width={180} />
<Brand kind="icon" tone="white" width={32} />
```

O componente usa `kind="logo"` e `tone="color"` como padrão. Não existe ícone preto oficial no pacote recebido.
## Headers de produto

Headers devem usar a logo oficial completa. Não use ícones genéricos, iniciais ou símbolos de bibliotecas como substitutos da identidade Eventesse. Quando o espaço for estritamente compacto, use o ícone oficial por meio de `kind="icon"`.