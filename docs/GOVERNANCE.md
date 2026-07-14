# Governança

## Estados de maturidade

1. Experimental: API ainda pode mudar.
2. Beta: pronta para pilotos, com feedback ativo.
3. Estável: coberta por documentação e testes, seguindo versionamento semântico.
4. Descontinuada: possui alternativa e prazo de migração.

## Processo de mudança

Toda mudança deve registrar problema, evidência, impacto em design e código, acessibilidade, estratégia de migração e versão prevista. Alterações incompatíveis exigem major version.

## Critérios para novos componentes

Um novo componente só entra no sistema quando resolve um padrão recorrente em mais de um contexto. Variações específicas de produto devem permanecer no produto e compor os primitivos existentes.
